# Startup Idea Generator - Chrome Extension

A Chrome extension that generates technology startup ideas based on highlighted text or webpage content using HuggingFace's AI models.

## Features

- 🚀 Generate startup ideas from selected text or full webpage content
- 🤖 Choose from 6 powerful AI models via HuggingFace Inference API
- 💾 Saves your API key and model preferences securely in Chrome storage
- 🎨 Beautiful modern UI with gradient design and smooth animations
- ⚡ Fast and lightweight with intelligent error handling
- 🔄 Smart content script injection with fallback mechanisms

## Available AI Models

Choose the best model for your needs:

- **Llama 3.1 8B Instruct** (Default) - Well-balanced performance
- **Llama 3.2 3B Instruct** (Faster) - Quick responses, good efficiency  
- **Mistral 7B Instruct v0.3** - Alternative reasoning style
- **Qwen/Qwen3-235B-A22B** (High Performance) - Massive model with state-of-the-art reasoning
- **Zephyr 7B Beta** (Balanced) - Good all-around performance
- **Phi-3 Mini 4K Instruct** (Efficient) - Fast and concise responses

## Installation

1. **Get a HuggingFace API Key**
   - Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
   - Create a new token (free tier available)
   - Copy the token

2. **Install the Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this folder
   - The extension icon will appear in your toolbar

## Usage

1. **Navigate to any webpage** with interesting content
2. **Optional**: Highlight specific text you want to base ideas on
3. **Click the extension icon** in the toolbar
4. **Enter your HuggingFace API key** (only needed once)
5. **Select your preferred AI model** from the dropdown
6. **Click "Generate Ideas"** and wait for AI-generated startup concepts

## How it Works

- If you have text selected, it uses that selection
- If no text is selected, it extracts the main content from the webpage
- You can choose from 6 different AI models based on your preferences
- The text is sent to HuggingFace's AI model with a specialized prompt
- The AI generates 3 innovative technology startup ideas based on the content
- Smart API routing automatically handles different model formats (chat completions vs text generation)

## Files Structure

```
ChromePlugin/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface  
├── popup.js           # Popup functionality
├── content.js         # Webpage text extraction
├── background.js      # API communication
├── icons/             # Extension icons
└── README.md          # This file
```

## API Usage

This extension uses the HuggingFace Inference API with multiple models including `Qwen/Qwen3-235B-A22B`. The free tier includes:
- 1,000 requests per month
- Rate limits apply
- No credit card required

## Privacy

- Your API key is stored locally in Chrome storage
- Text content is sent to HuggingFace for processing
- No data is stored on external servers by this extension

## Troubleshooting

**"Error: API request failed: 404"**
- The AI model may be temporarily unavailable or loading
- The extension will automatically try multiple backup models
- Wait a few moments and try again
- Some models need time to "warm up" on HuggingFace's servers

**"No text found on the page"**
- Try selecting some text manually
- Check if the page has loaded completely

**"Invalid API key"**
- Verify your HuggingFace API key is correct
- Get a new key from https://huggingface.co/settings/tokens
- Make sure the key has "Read" permissions

**"Rate limit exceeded"**
- You've reached the API limit (1,000 calls/month on free tier)
- Wait for the limit to reset or upgrade your HuggingFace plan

**Extension not working**
- Reload the extension in chrome://extensions/
- Check the browser console for errors
- Try refreshing the webpage

## Development

To modify or enhance the extension:

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## License

This project is open source and available under the MIT License.
