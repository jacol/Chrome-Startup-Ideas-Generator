// Content script to extract text from the webpage
(() => {
  'use strict';
  
  console.log('Startup Ideas content script loaded');
  
  // Function to get selected text or full page text
  function getTextContent() {
    try {
      const selection = window.getSelection().toString().trim();
      
      if (selection) {
        return {
          text: selection,
          source: 'selected'
        };
      }
      
      // If no selection, get meaningful text from the page
      // Clone the body to avoid modifying the actual page
      const bodyClone = document.body.cloneNode(true);
      
      // Remove script and style elements from the clone
      const unwantedElements = bodyClone.querySelectorAll('script, style, nav, header, footer, aside, .nav, .header, .footer, .sidebar, .menu');
      unwantedElements.forEach(element => element.remove());
      
      // Get main content areas
      const mainContent = bodyClone.querySelector('main, article, .content, #content, .post, .article, [role="main"]') || bodyClone;
      
      let text = '';
      if (mainContent) {
        // Get text content and clean it up
        text = mainContent.innerText || mainContent.textContent || '';
        
        // Clean up the text
        text = text
          .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .trim();
        
        // Limit text length to avoid API limits (keep first 2000 characters)
        if (text.length > 2000) {
          text = text.substring(0, 2000) + '...';
        }
      }
      
      return {
        text: text || 'No meaningful text found on this page.',
        source: 'page'
      };
    } catch (error) {
      console.error('Error extracting text content:', error);
      return {
        text: 'Error extracting text from this page.',
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
      } catch (error) {
        console.error('Error in getTextContent:', error);
        sendResponse({
          text: 'Error extracting content from this page.',
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
