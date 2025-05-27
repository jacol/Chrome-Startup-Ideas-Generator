# Startup Idea Generator - Chrome Extension 🚀

A professional Chrome extension that transforms any webpage content into innovative technology startup ideas using advanced AI models from HuggingFace.

![Extension Demo](screenshot-generator.html)

## 🌟 Key Features

- **🤖 Multiple AI Models**: Choose from 6 powerful AI models including Llama 3.1, Mistral, and Zephyr
- **⚡ Instant Generation**: Generate 3 unique startup ideas in seconds  
- **🎯 Smart Analysis**: Works with selected text or full webpage content
- **🔒 Privacy-First**: All data stored locally, no external servers
- **🎨 Beautiful Interface**: Modern gradient UI with smooth animations
- **💾 Persistent Settings**: Remembers your API key and model preferences
- **📋 Easy Sharing**: One-click copy functionality for generated ideas

## 🚀 Quick Start

### Installation
1. **Get API Key**: Visit [HuggingFace Settings](https://huggingface.co/settings/tokens) and create a free API token
2. **Install Extension**: Download from Chrome Web Store or load unpacked for development
3. **Setup**: Enter your API key and select preferred AI model
4. **Generate**: Visit any webpage and click the extension icon to generate ideas

### Usage
1. Navigate to any interesting webpage
2. Optionally select specific text to focus on
3. Click the 🚀 extension icon in your toolbar
4. Choose your preferred AI model
5. Click "Generate Ideas" and wait for results
6. Copy and save ideas for future reference

## 🤖 Available AI Models

| Model | Best For | Speed | Creativity |
|-------|----------|-------|------------|
| **Llama 3.1 8B Instruct** | General use, balanced output | Medium | High |
| **Llama 3.2 3B Instruct** | Quick responses, efficiency | Fast | Medium |
| **Mistral 7B Instruct v0.3** | Alternative reasoning style | Medium | High |
| **Zephyr 7B Beta** | Well-rounded performance | Medium | Medium-High |
| **Phi-3 Mini 4K** | Fast, concise responses | Very Fast | Medium |
| **Qwen3 235B** | High-performance analysis | Medium | Very High |

## 📁 Project Structure

```
ChromePlugin/
├── manifest.json           # Extension configuration (Manifest V3)
├── popup.html              # Extension popup interface
├── popup.js                # Popup functionality and UI logic
├── content.js              # Webpage text extraction
├── background.js           # API communication service worker
├── icons/                  # Extension icons (16px, 48px, 128px)
├── PRIVACY_POLICY.md       # Privacy policy for store listing
├── STORE_LISTING.md        # Chrome Web Store listing details
├── screenshot-generator.html # Tool for creating store screenshots
└── README.md               # This file
```

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing for API calls
- **Content Scripts**: Secure webpage text extraction
- **Chrome Storage API**: Local storage for settings
- **Multiple API Endpoints**: Support for different model formats

### API Integration
- Uses HuggingFace Inference API and Router API
- Supports both chat completion and text generation formats
- Automatic model format detection and routing
- Comprehensive error handling and user feedback

### Security & Privacy
- All sensitive data stored locally using Chrome's secure storage
- No data collection or external tracking
- API keys encrypted in Chrome storage
- Text processing happens only through HuggingFace's secure APIs

## 🛡️ Privacy & Data Usage

- **Local Storage**: API keys and preferences stored securely in browser
- **No Data Collection**: We don't collect, store, or analyze user data
- **HuggingFace Processing**: Text sent to HuggingFace for AI processing only
- **User Control**: Users control what content is analyzed

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for complete details.

## 🐛 Troubleshooting

### Common Issues

**"API request failed: 404"**
- Model may be loading on HuggingFace servers
- Try a different model or wait a few moments

**"Invalid API key"** 
- Verify your HuggingFace API key at [settings/tokens](https://huggingface.co/settings/tokens)
- Ensure the key has "Read" permissions

**"No text found on page"**
- Try selecting text manually before clicking generate
- Check if the page has fully loaded

**"Rate limit exceeded"**
- Free tier includes 1,000 calls/month
- Wait for limit reset or upgrade HuggingFace plan

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd ChromePlugin

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select this folder
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Feature Requests**: Submit via GitHub issues
- **Documentation**: Check our [installation guide](INSTALL.md)

---

**Ready to discover your next billion-dollar idea?** Install the extension and start generating innovative startup concepts from any webpage! 💡
