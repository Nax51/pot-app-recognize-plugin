# Pot App Recognize Plugins

OCR (Optical Character Recognition) plugins for [Pot App](https://pot-app.com/) using AI vision models.

## 📦 Available Plugins

### OpenAI Vision Plugin

OCR plugin using OpenAI's vision-capable models (GPT-4o, GPT-4o-mini, etc.).

**Features:**
- Support for all GPT-4 vision models
- Customizable prompts with language variable support
- Flexible API endpoint configuration
- High accuracy text recognition
- Multi-language support

**Default Configuration:**
- Model: `gpt-4o-mini`
- Endpoint: `https://api.openai.com/v1/chat/completions`

### Mistral AI OCR Plugin

OCR plugin using Mistral AI's dedicated OCR API with Pixtral models.

**Features:**
- Specialized OCR endpoint
- Markdown-formatted output
- Multi-page document support
- Fast processing
- Multi-language support

**Default Configuration:**
- Model: `mistral-ocr-latest`
- Endpoint: `https://api.mistral.ai/v1/ocr`

## 🚀 Installation

### Option 1: Download Pre-built Plugins

1. Download the `.potext` files from [Releases](../../releases)
   - `plugin.com.pot-app.openai_recognize.potext`
   - `plugin.com.pot-app.mistralai_recognize.potext`

2. Install in Pot App:
   - Open Pot App
   - Go to Settings → Plugins → Recognize
   - Click "Install Plugin"
   - Select the downloaded `.potext` file

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/pot-app/pot-app-recognize-plugin.git
cd pot-app-recognize-plugin

# Build all plugins
python3 script/pack-plugins.py

# The .potext files will be created in the project root
```

## ⚙️ Configuration

### OpenAI Plugin

Required settings in Pot App:

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| API Key | Your OpenAI API key | - | ✅ |
| Model | Model name | `gpt-4o-mini` | ❌ |
| Request Path | API endpoint | `https://api.openai.com` | ❌ |
| Custom Prompt | OCR instruction prompt | See below | ❌ |

**Default Prompt:**
```
Just recognize the text in the image. Do not offer unnecessary explanations.
```

**Custom Prompt with Language Variable:**
```
Recognize text in $lang language from the image. Return only the text.
```
The `$lang` variable will be replaced with the selected language.

**Recommended Models:**
- `gpt-4o` - Latest and most capable
- `gpt-4o-mini` - Faster and more cost-effective (recommended)
- `gpt-4-turbo` - Previous generation

### Mistral AI Plugin

Required settings in Pot App:

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| API Key | Your Mistral AI API key | - | ✅ |
| Model | Model name | `mistral-ocr-latest` | ❌ |
| Request Path | API endpoint | `https://api.mistral.ai/v1/ocr` | ❌ |

**Available Models:**
- `mistral-ocr-latest` - Latest OCR model (recommended)
- `pixtral-12b-2409` - Pixtral vision model

## 🌍 Supported Languages

Both plugins support recognition in multiple languages:

- **Chinese**: Simplified, Traditional, Cantonese
- **East Asian**: Japanese, Korean
- **European**: English, French, Spanish, German, Italian, Portuguese, Dutch, Swedish, Polish, Ukrainian, Norwegian
- **Other**: Russian, Turkish, Vietnamese, Indonesian, Thai, Malay, Arabic, Hindi, Mongolian, Khmer, Persian

The language selection in Pot App helps optimize recognition accuracy for the target language.

## 🔧 API Configuration

### Using Custom Endpoints

Both plugins support custom API endpoints (useful for proxy servers or compatible APIs):

**OpenAI Plugin:**
```
https://your-proxy.com/v1/chat/completions
```

**Mistral Plugin:**
```
https://your-proxy.com/v1/ocr
```

The plugins automatically:
- Add `https://` if protocol is missing
- Remove trailing slashes
- Append correct API paths for OpenAI

## 🛠️ Development

### Project Structure

```
pot-app-recognize-plugin/
├── plugin.com.pot-app.openai_recognize/     # OpenAI plugin source
│   ├── info.json                            # Plugin metadata
│   ├── main.js                              # Implementation
│   └── openai.svg                           # Icon
├── plugin.com.pot-app.mistralai_recognize/  # Mistral plugin source
│   ├── info.json                            # Plugin metadata
│   ├── main.js                              # Implementation
│   └── mistral.svg                          # Icon
├── script/
│   ├── pack-plugins.py                      # Build script (Python)
│   └── pack-plugins.sh                      # Build script (Bash)
└── *.potext                                 # Compiled plugins
```

### Building Plugins

**Build all plugins:**
```bash
python3 script/pack-plugins.py
```

**Build specific plugin:**
```bash
python3 script/pack-plugins.py plugin.com.pot-app.openai_recognize
```

The build script:
- Validates required files (info.json, main.js, icon.svg)
- Creates ZIP archives with `.potext` extension
- Includes only essential files for distribution

### Plugin API

Each plugin implements the `recognize()` function:

```javascript
async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    
    // Extract configuration
    let { model, apiKey, requestPath } = config;
    
    // Make API request
    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: { /* ... */ },
        body: { type: "Json", payload: { /* ... */ } }
    });
    
    // Return recognized text
    return extractedText;
}
```

**Parameters:**
- `base64` - Base64-encoded image data
- `lang` - Language code (e.g., "zh_cn", "en", "ja")
- `options.config` - User configuration from Pot App
- `options.utils.tauriFetch` - HTTP fetch wrapper

**Returns:** String containing recognized text

### Adding New Plugins

1. Create plugin directory: `plugin.com.pot-app.{service}_recognize/`
2. Add required files:
   - `info.json` - Plugin metadata and configuration schema
   - `main.js` - Implementation with `recognize()` function
   - `{service}.svg` - Plugin icon
3. Test thoroughly
4. Build with `pack-plugins.py`
5. Submit PR

See [AGENTS.md](./AGENTS.md) for detailed development guidelines.

## 📝 API Keys

### Getting API Keys

**OpenAI:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Create new secret key

**Mistral AI:**
1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in
3. Go to API Keys section
4. Generate new API key

### Security Notes

- Never commit API keys to version control
- Keep your API keys secure
- Use environment variables or secure storage
- Monitor API usage and costs

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style and patterns
4. Test your changes thoroughly
5. Submit a pull request

See [AGENTS.md](./AGENTS.md) for detailed coding conventions and guidelines.

## 📄 License

Each plugin directory contains its own LICENSE file. Please refer to individual plugin directories for license information.

## 🔗 Links

- [Pot App Official Site](https://pot-app.com/)
- [Pot App GitHub](https://github.com/pot-app/pot-desktop)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Mistral AI Documentation](https://docs.mistral.ai/)

## ❓ Troubleshooting

### Common Issues

**"API Key not configured"**
- Make sure you've entered a valid API key in Pot App settings

**"Http Request Error"**
- Check your internet connection
- Verify API endpoint is correct
- Ensure API key has sufficient credits

**"No text recognized"**
- Try a clearer image
- Ensure the image contains readable text
- Check if the selected language matches the text

**"Model not found"**
- Verify the model name is correct
- Check if your API key has access to the specified model
- Try using the default model

### Getting Help

If you encounter issues:
1. Check the [Issues](../../issues) page
2. Search for similar problems
3. Create a new issue with:
   - Plugin version
   - Error message
   - Steps to reproduce

## 🙏 Acknowledgments

- [Pot App](https://pot-app.com/) - Cross-platform translation and OCR tool
- [OpenAI](https://openai.com/) - Vision-capable language models
- [Mistral AI](https://mistral.ai/) - OCR and vision models
