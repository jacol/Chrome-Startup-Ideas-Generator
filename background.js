// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Startup Idea Generator extension installed');
});

// Handle API requests to Azure server
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateIdeas') {
    console.log('Received generateIdeas request with content length:', request.content?.length || 0);
    
    if (!request.content) {
      sendResponse({ success: false, error: 'No content provided' });
      return true;
    }
    
    generateStartupIdeas(request.content)
      .then(result => {
        console.log('Successfully generated ideas:', result);
        sendResponse({ success: true, data: result });
      })
      .catch(error => {
        console.error('Error in generateStartupIdeas:', error);
        sendResponse({ success: false, error: error.message || 'Unknown error occurred' });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

async function generateStartupIdeas(content) {
  try {
    console.log('Generating ideas with Azure API');
    const result = await callLocalAPI(content);
    console.log('Successfully generated startup ideas');
    return result;
  } catch (error) {
    console.error('Error generating startup ideas:', error);
    throw error;
  }
}

async function callLocalAPI(content) {
  const API_URL = 'https://extbackend.azurewebsites.net/generate-startup-ideas';
  
  console.log('Calling Azure API with content length:', content?.length || 0);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content
      })
    });

    console.log('Azure API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API Error:', errorText);
      
      if (response.status === 404) {
        throw new Error('API server endpoint not found. Please check if the service is available at extbackend.azurewebsites.net');
      } else if (response.status === 500) {
        throw new Error('API server error. Please check the server logs.');
      } else {
        throw new Error(`API request failed: ${response.status} - ${errorText || response.statusText}`);
      }
    }

    const result = await response.json();
    console.log('Azure API response:', result);
    console.log('Result keys:', Object.keys(result));
    console.log('Result type:', typeof result);
    console.log('Full result object:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Return the generated ideas directly from the Azure API
    let ideas = result.startup_ideas || result.ideas || result.response || result.data || result.content || result;
    console.log('Extracted ideas:', ideas);
    console.log('Ideas type:', typeof ideas);
    
    // If ideas is an object, try to convert it to a readable format
    if (typeof ideas === 'object' && ideas !== null) {
      // If it's an array, join with newlines
      if (Array.isArray(ideas)) {
        ideas = ideas.join('\n\n');
      } else {
        // If it's an object, convert to JSON string or extract text content
        ideas = JSON.stringify(ideas, null, 2);
      }
    }
    
    console.log('Final ideas to return:', ideas);
    return ideas;
  } catch (error) {
    console.error('Error in callLocalAPI:', error);
    throw error;
  }
}



