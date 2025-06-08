# Extension Debugging Guide

## How to Test the Fixed Extension

### 1. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `ChromePlugin` folder
5. The extension should appear in your extensions list

### 2. Test the Azure API Connection

1. Open the test file: `test-local-api.html` in your browser
2. Click "Test Azure API" button
3. Check the result:
   - ✅ **Success**: Shows generated ideas
   - ❌ **Error**: Shows specific error message

### 3. Test the Extension

1. Navigate to any webpage (e.g., a news article, blog post)
2. Click the extension icon in the toolbar
3. Click "Generate Ideas" button
4. Monitor the status messages and results

### 4. Debug with Developer Tools

#### For the Extension Popup:
1. Right-click the extension icon → "Inspect popup"
2. Check the **Console** tab for logs like:
   ```
   Extracted content: {source: "page", length: 1234, preview: "..."}
   Response from background: {success: true, data: "..."}
   ```

#### For the Background Script:
1. Go to `chrome://extensions/`
2. Find your extension and click "Inspect views: background page"
3. Check the **Console** tab for logs like:
   ```
   Received generateIdeas request with content length: 1234
   Calling Azure API with content length: 1234
   Azure API response status: 200
   Azure API response: {...}
   ```

#### For the Content Script:
1. Open Developer Tools on the webpage (F12)
2. Check the **Console** tab for logs like:
   ```
   Startup Ideas content script loaded
   Content script received message: {action: "getTextContent"}
   Sending content: {text: "...", source: "page"}
   ```

### 5. Common Issues and Solutions

#### Issue: "Cannot access this page"
- **Cause**: Trying to use on chrome:// or extension pages
- **Solution**: Navigate to a regular webpage (http/https)

#### Issue: "No content found on the page"
- **Cause**: Page has no extractable content
- **Solution**: Try on a page with text content (news articles work well)

#### Issue: "Cannot connect to Azure API server"
- **Cause**: Azure service is down or unreachable
- **Solution**: Check if `https://extbackend.azurewebsites.net/generate-startup-ideas` is accessible

#### Issue: "Extension icon not showing"
- **Cause**: Extension not loaded properly
- **Solution**: Reload the extension in chrome://extensions/

### 6. Expected Behavior

#### Successful Flow:
1. User clicks extension icon
2. Popup shows "Azure AI-powered idea generation"
3. User clicks "Generate Ideas"
4. Status shows "Getting content from webpage..."
5. Status shows "Generating startup ideas from webpage content..."
6. Results appear with generated startup ideas
7. Copy button becomes available

#### Error Flow:
1. If something fails, status shows specific error message
2. Button re-enables so user can try again
3. Console logs show detailed error information

### 7. Testing Different Content Types

Try the extension on different types of pages:
- **News articles**: Should work well
- **Blog posts**: Good for testing
- **Product pages**: Test commercial content
- **Technical documentation**: Test structured content
- **Selected text**: Highlight text before clicking Generate Ideas

### 8. Verifying the Fix

The original error "Cannot read properties of undefined (reading 'substring')" should no longer occur because:

1. ✅ All property access uses optional chaining (`?.`)
2. ✅ Response objects are validated before use
3. ✅ Content is validated before processing
4. ✅ Comprehensive error handling catches edge cases
5. ✅ Detailed logging helps identify issues quickly

If you encounter any errors, check the console logs first - they will provide detailed information about where the issue is occurring.
