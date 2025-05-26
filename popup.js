// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  const resultHeaderDiv = document.querySelector('.result-header');
  const resultContentDiv = document.querySelector('.result-content');
  // Load saved API key and model
  chrome.storage.sync.get(['huggingfaceApiKey', 'selectedModel'], function(result) {
    if (result.huggingfaceApiKey) {
      apiKeyInput.value = result.huggingfaceApiKey;
    }
    if (result.selectedModel) {
      modelSelect.value = result.selectedModel;
    }
  });
  // Save API key when it changes
  apiKeyInput.addEventListener('input', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ huggingfaceApiKey: apiKey });
    }
  });

  // Save model selection when it changes
  modelSelect.addEventListener('change', function() {
    const selectedModel = modelSelect.value;
    chrome.storage.sync.set({ selectedModel: selectedModel });
  });
  // Generate button click handler
  generateBtn.addEventListener('click', async function() {
    const apiKey = apiKeyInput.value.trim();
    const selectedModel = modelSelect.value;
    
    if (!apiKey) {
      showStatus('Please enter your HuggingFace API key', 'error');
      return;
    }

    try {
      // Disable button and show loading
      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating...';
      showStatus('Getting text from webpage...', 'loading');
      hideResult();      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if the tab is a valid webpage (not chrome:// or extension pages)
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
        throw new Error('Cannot access this page. Please navigate to a regular webpage.');
      }
        // Try to get text content from the page with error handling
      let textContent;
      try {
        textContent = await chrome.tabs.sendMessage(tab.id, { action: 'getTextContent' });
      } catch (error) {
        if (error.message.includes('Could not establish connection') || error.message.includes('Receiving end does not exist')) {
          // Try to inject the content script manually
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
            // Wait a moment for the script to initialize
            await new Promise(resolve => setTimeout(resolve, 200));
            textContent = await chrome.tabs.sendMessage(tab.id, { action: 'getTextContent' });
          } catch (injectionError) {
            // Last resort: try to execute a simple script to get page content
            try {
              const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                  const selection = window.getSelection().toString().trim();
                  if (selection) {
                    return { text: selection, source: 'selected' };
                  }
                  const bodyText = document.body.innerText || document.body.textContent || '';
                  const cleanText = bodyText.replace(/\s+/g, ' ').trim().substring(0, 2000);
                  return { 
                    text: cleanText || 'No text content found', 
                    source: 'page' 
                  };
                }
              });
              textContent = results[0].result;
            } catch (lastResortError) {
              throw new Error('Unable to access page content. Please refresh the page and try again.');
            }
          }
        } else {
          throw error;
        }
      }
      
      if (!textContent || !textContent.text) {
        throw new Error('No text found on the page');
      }

      showStatus(`Generating startup ideas from ${textContent.source} text...`, 'loading');      // Generate startup ideas
      const response = await chrome.runtime.sendMessage({
        action: 'generateIdeas',
        text: textContent.text,
        apiKey: apiKey,
        model: selectedModel
      });

      if (response.success) {
        showResult(response.data, textContent.source);
        showStatus('Ideas generated successfully!', 'success');
      } else {
        throw new Error(response.error || 'Failed to generate ideas');
      }    } catch (error) {
      console.error('Error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (errorMessage.includes('404')) {
        errorMessage = 'AI model temporarily unavailable. Please try again in a few moments.';
      } else if (errorMessage.includes('401')) {
        errorMessage = 'Invalid API key. Please check your HuggingFace token at huggingface.co/settings/tokens';
      } else if (errorMessage.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (errorMessage.includes('503')) {
        errorMessage = 'AI model is loading. Please wait a moment and try again.';
      }
      
      showStatus(`Error: ${errorMessage}`, 'error');
    } finally {
      // Re-enable button
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Ideas';
    }
  });

  // Clear button click handler
  clearBtn.addEventListener('click', function() {
    hideStatus();
    hideResult();
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.classList.remove('hidden');
  }

  function hideStatus() {
    statusDiv.classList.add('hidden');
  }
  function showResult(text, source) {
    const sourceText = source === 'selected' ? 'selected text' : 'page content';
    resultHeaderDiv.innerHTML = `💡 Ideas based on ${sourceText}:`;
    resultContentDiv.textContent = text;
    resultDiv.classList.remove('hidden');
  }
  function hideResult() {
    resultDiv.classList.add('hidden');
    resultHeaderDiv.innerHTML = '';
    resultContentDiv.textContent = '';
  }
});
