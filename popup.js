// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyButtonContainer = document.getElementById('copyButtonContainer');
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  const resultHeaderDiv = document.querySelector('.result-header');
  const resultContentDiv = document.querySelector('.result-content');
  
  let currentGeneratedText = '';  // Generate button click handler
  generateBtn.addEventListener('click', async function() {
    try {
      // Disable button and show loading
      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating...';
      showStatus('Getting content from webpage...', 'loading');
      hideResult();// Get active tab
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
                target: { tabId: tab.id },                func: () => {
                  const selection = window.getSelection().toString().trim();
                  if (selection) {
                    return { text: `<html><body><div>${selection}</div></body></html>`, source: 'selected' };
                  }
                  const htmlContent = document.documentElement.outerHTML;
                  return { 
                    text: htmlContent || '<html><body><div>No content found</div></body></html>', 
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
      }      if (!textContent || !textContent.text) {
        throw new Error('No content found on the page');
      }

      console.log('Extracted content:', { 
        source: textContent.source, 
        length: textContent.text?.length || 0,
        preview: textContent.text?.substring(0, 100) || 'no preview'
      });

      showStatus('Generating startup ideas from ' + textContent.source + ' content...', 'loading');// Generate startup ideas using Azure API
      const response = await chrome.runtime.sendMessage({
        action: 'generateIdeas',
        content: textContent.text
      });

      console.log('Response from background:', response);

      if (response && response.success) {
        showResult(response.data, textContent.source);
        showStatus('Ideas generated successfully!', 'success');
      } else {
        throw new Error(response?.error || 'Failed to generate ideas - no response received');
      }} catch (error) {
      console.error('Error:', error);
        // Provide more specific error messages
      let errorMessage = error.message;
      if (errorMessage.includes('API server endpoint not found')) {
        errorMessage = 'API server endpoint not found. Please check if the service is available at extbackend.azurewebsites.net';
      } else if (errorMessage.includes('server error')) {
        errorMessage = 'API server error. Please check the server status and try again.';
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
  }  function showResult(text, source) {
    const sourceText = source === 'selected' ? 'selected content' : 'webpage content';
    resultHeaderDiv.innerHTML = `💡 Startup ideas based on ${sourceText}:`;
    resultContentDiv.textContent = text;
    resultDiv.classList.remove('hidden');
    
    // Store the generated text and show copy button
    currentGeneratedText = text;
    copyButtonContainer.classList.remove('hidden');
    
    // Show the Clear button after generating ideas
    clearBtn.classList.remove('hidden');
  }function hideResult() {
    resultDiv.classList.add('hidden');
    copyButtonContainer.classList.add('hidden');
    resultHeaderDiv.innerHTML = '';
    resultContentDiv.textContent = '';
    currentGeneratedText = '';
    
    // Hide the Clear button when clearing results
    clearBtn.classList.add('hidden');
  }
  
  // Copy button click handler
  copyBtn.addEventListener('click', async function() {
    if (!currentGeneratedText) return;
    
    const copyIcon = copyBtn.querySelector('.copy-icon');
    const originalText = copyBtn.innerHTML;
    
    try {
      await navigator.clipboard.writeText(currentGeneratedText);
      
      // Show success feedback
      copyIcon.textContent = '✅';
      copyBtn.classList.add('copied');
      
      // Reset after 2 seconds
      setTimeout(() => {
        copyIcon.textContent = '📋';
        copyBtn.classList.remove('copied');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy text:', error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = currentGeneratedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success feedback
        copyIcon.textContent = '✅';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyIcon.textContent = '📋';
          copyBtn.classList.remove('copied');
        }, 2000);
        
      } catch (fallbackError) {
        // Show error feedback
        copyIcon.textContent = '❌';
        copyBtn.innerHTML = '<span class="copy-icon">❌</span> Failed';
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }
    }
  });
});
