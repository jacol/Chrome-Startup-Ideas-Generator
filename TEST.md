# Testing the Chrome Extension

## Test Steps:

1. **Load Extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this folder
   - The extension icon should appear in the toolbar

2. **Basic Functionality Test:**
   - Navigate to any webpage (e.g., a news article or blog post)
   - Click the extension icon in the toolbar
   - Enter your HuggingFace API key
   - Select a model from the dropdown (try different ones)
   - Click "Generate Ideas"
   - Should show status updates and generate startup ideas

3. **Model Selection Test:**
   - Test different models to see variation in outputs:
     - Llama 3.1 8B Instruct (Default) - Well-balanced
     - Llama 3.2 3B Instruct (Faster) - Quicker responses
     - Mistral 7B Instruct v0.3 - Alternative reasoning style
     - Qwen/Qwen3-235B-A22B (High Performance) - Massive model with state-of-the-art reasoning
     - Zephyr 7B Beta (Balanced) - Good all-around performance
     - Phi-3 Mini 4K Instruct (Efficient) - Fast and concise
   - Verify model selection persists across sessions

3. **Selection Test:**
   - Select some text on a webpage
   - Click the extension icon and generate ideas
   - Should generate ideas based on selected text

4. **Error Handling Test:**
   - Try on a Chrome internal page (chrome://extensions/)
   - Should show appropriate error message
   - Try with invalid API key
   - Should show authentication error

## Expected Behavior:
- Professional UI with gradient background and model dropdown
- Smooth animations and status updates
- Clear separation between result header and content
- Model selection dropdown with 6 quality AI models
- Proper error messages for various scenarios
- API key and model selection persistence across sessions

## Common Issues to Check:
- Icon display in Chrome toolbar
- Content script injection on different websites
- API response parsing with Llama 3.1 model
- Responsive UI on different screen sizes
