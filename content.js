// Content script to extract text from the webpage
(() => {
  'use strict';
  
  console.log('Startup Ideas content script loaded');
    // Function to get selected text or full page HTML content
  function getTextContent() {
    try {
      const selection = window.getSelection().toString().trim();
      
      if (selection) {
        // Return selected text wrapped in basic HTML structure
        return {
          text: `<html><body><div>${selection}</div></body></html>`,
          source: 'selected'
        };
      }
      
      // If no selection, get the full HTML content
      const htmlContent = document.documentElement.outerHTML;
      
      return {
        text: htmlContent,
        source: 'page'
      };
    } catch (error) {      console.error('Error extracting content:', error);
      return {
        text: '<html><body><div>Error extracting content from this page.</div></body></html>',
        source: 'error'
      };
    }
  }
    // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'getTextContent') {
      try {
        const content = getTextContent();
        console.log('Sending content:', content);
        sendResponse(content);
      } catch (error) {        console.error('Error in getTextContent:', error);
        sendResponse({
          text: '<html><body><div>Error extracting content from this page.</div></body></html>',
          source: 'error'
        });
      }
    }
    
    // Return true to keep the message channel open for async responses
    return true;
  });
  
  // Signal that the content script is ready
  console.log('Content script ready and listening for messages');
})();
