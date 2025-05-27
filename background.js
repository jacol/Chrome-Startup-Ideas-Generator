// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Startup Idea Generator extension installed');
  
  // Set default model if not set
  chrome.storage.sync.get(['selectedModel'], function(result) {
    if (!result.selectedModel) {
      chrome.storage.sync.set({ selectedModel: 'meta-llama/Llama-3.1-8B-Instruct' });
    }
  });
});

// Handle API requests to HuggingFace
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateIdeas') {
    generateStartupIdeas(request.text, request.apiKey, request.model)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

async function generateStartupIdeas(inputText, apiKey, model = 'meta-llama/Llama-3.1-8B-Instruct') {
  try {
    console.log(`Generating ideas with ${model}`);
    const result = await callHuggingFaceAPI(inputText, apiKey, model);
    console.log('Successfully generated startup ideas');
    return result;
  } catch (error) {
    console.error('Error generating startup ideas:', error);
    throw error;
  }
}

async function callHuggingFaceAPI(inputText, apiKey, model) {
  // Check if model supports chat completions format
  const chatModels = [
    'meta-llama/Llama-3.1-8B-Instruct',
    'meta-llama/Llama-3.2-3B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.3',
    'HuggingFaceH4/zephyr-7b-beta',
    'microsoft/Phi-3-mini-4k-instruct',
    'Qwen/Qwen3-235B-A22B'
  ];
  
  const useChatFormat = chatModels.includes(model);
  
  if (useChatFormat) {
    return await callChatCompletionAPI(inputText, apiKey, model);
  } else {
    return await callTextGenerationAPI(inputText, apiKey, model);
  }
}

async function callChatCompletionAPI(inputText, apiKey, model) {
  const API_URL = `https://router.huggingface.co/hf-inference/models/${model}/v1/chat/completions`;
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `Based on this text, generate 3 innovative technology startup ideas that solve real problems:

Context: ${inputText.substring(0, 600)}

Please provide 3 concrete startup ideas with brief descriptions:`
        }
      ],
      model: model,
      stream: false,
      temperature: 0.8,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${model}:`, errorText);
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your HuggingFace token.');
    } else if (response.status === 404) {
      throw new Error(`${model} model not found or unavailable.`);
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (response.status === 503) {
      throw new Error(`${model} model is currently loading. Please try again in a moment.`);
    } else {
      throw new Error(`API request failed: ${response.status} - ${errorText || response.statusText}`);
    }
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  // Extract the generated text from chat completion format
  let generatedText = '';
  if (result.choices && result.choices[0] && result.choices[0].message) {
    generatedText = result.choices[0].message.content || result.choices[0].message.text || '';
  } else {
    throw new Error('Unexpected response format from API - no choices or message found');
  }

  return processGeneratedText(generatedText);
}

async function callTextGenerationAPI(inputText, apiKey, model) {
  const API_URL = `https://api-inference.huggingface.co/models/${model}`;
  
  const prompt = `Based on this text, generate 3 innovative technology startup ideas that solve real problems:

Context: ${inputText.substring(0, 600)}

Startup Ideas:
1.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: 400,
        temperature: 0.8,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${model}:`, errorText);
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your HuggingFace token.');
    } else if (response.status === 404) {
      throw new Error(`${model} model not found or unavailable.`);
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (response.status === 503) {
      throw new Error(`${model} model is currently loading. Please try again in a moment.`);
    } else {
      throw new Error(`API request failed: ${response.status} - ${errorText || response.statusText}`);
    }
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  // Extract generated text from text generation format
  let generatedText = '';
  if (Array.isArray(result) && result[0] && result[0].generated_text) {
    generatedText = result[0].generated_text;
  } else {
    throw new Error('Unexpected response format from API');
  }

  return processGeneratedText('1.' + generatedText);
}

function processGeneratedText(generatedText) {
  // Clean up the response
  let cleanedText = generatedText.trim();
  
  // If the text is too short or doesn't look like ideas, enhance it
  if (cleanedText.length < 50) {
    cleanedText = `1. ${cleanedText}\n\n2. Create a platform to solve similar problems in this domain\n\n3. Develop an AI tool to automate processes mentioned in the context`;
  }
  
  return cleanedText || 'Unable to generate specific ideas from the provided text. Consider trying with different content or check your API connection.';
}

