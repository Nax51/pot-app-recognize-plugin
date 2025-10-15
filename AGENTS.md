# AGENTS.md

This file provides guidance for AI agents working with the Pot App Recognize Plugin repository.

## Project Overview

This repository contains OCR (Optical Character Recognition) plugins for [Pot App](https://pot-app.com/), a cross-platform translation and OCR application. The plugins enable text recognition from images using AI vision models from OpenAI and Mistral AI.

**Repository Purpose**: Develop and maintain recognize plugins that integrate AI vision APIs for OCR functionality in Pot App.

## Project Structure

```
pot-app-recognize-plugin/
├── plugin.com.pot-app.openai_recognize/     # OpenAI vision plugin
│   ├── info.json                            # Plugin metadata & configuration schema
│   ├── main.js                              # Plugin implementation
│   └── openai.svg                           # Plugin icon
├── plugin.com.pot-app.mistralai_recognize/  # Mistral AI OCR plugin
│   ├── info.json                            # Plugin metadata & configuration schema
│   ├── main.js                              # Plugin implementation
│   └── mistral.svg                          # Plugin icon
├── script/
│   ├── pack-plugins.py                      # Python script to package plugins
│   └── pack-plugins.sh                      # Shell script to package plugins
├── *.potext                                 # Compiled plugin packages (zip files)
└── AGENTS.md                                # This file
```

### Key Components

- **Plugin Directories**: Each `plugin.com.pot-app.*_recognize/` directory contains a complete plugin
- **info.json**: Defines plugin metadata, configuration UI, and supported languages
- **main.js**: Contains the `recognize(base64, lang, options)` async function that performs OCR
- **.potext files**: ZIP archives containing plugin files for distribution

## Plugin Architecture

### Plugin Interface

Each plugin must implement the following structure:

**Required Files**:
1. `info.json` - Plugin metadata and configuration
2. `main.js` - Plugin implementation with `recognize()` function
3. `*.svg` - Plugin icon file

**Main Function Signature**:
```javascript
async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    // Implementation
    return recognizedText;
}
```

**Parameters**:
- `base64`: Base64-encoded image data (without data URI prefix)
- `lang`: Language code for recognition hint (e.g., "zh_cn", "en", "ja")
- `options.config`: User configuration from `info.json` needs
- `options.utils.tauriFetch`: HTTP fetch wrapper for making API requests

**Return Value**: String containing recognized text

### Configuration Schema (info.json)

```json
{
  "id": "plugin.com.pot-app.{name}_recognize",
  "plugin_type": "recognize",
  "icon": "{name}.svg",
  "display": "Display Name",
  "homepage": "https://github.com/...",
  "needs": [
    {
      "key": "model",
      "display": "模型",
      "type": "input",
      "default": "default-model-name"
    }
  ],
  "language": { /* ISO language codes */ }
}
```

## Coding Conventions

### JavaScript Style

- **ES6+ async/await**: Use modern async patterns, no callbacks
- **Destructuring**: Extract config and utils from options parameter
- **Template literals**: Use backticks for string interpolation
- **Error handling**: Throw descriptive error messages with HTTP status
- **No semicolons**: Follow the existing no-semicolon style (optional)

### Naming Conventions

- **Plugin directories**: `plugin.com.pot-app.{service}_recognize`
- **Plugin IDs**: Same as directory name in info.json
- **Configuration keys**: camelCase (e.g., `apiKey`, `requestPath`, `customPrompt`)
- **Functions**: camelCase (e.g., `recognize`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### API Request Pattern

Follow this standard pattern for API calls:

```javascript
// 1. Extract and set defaults for config values
let { model = "default-model", apiKey, requestPath } = config;

// 2. Normalize requestPath (add protocol, remove trailing slash)
if (!requestPath) {
    requestPath = "https://default.api.url";
}
if (!/https?:\/\/.+/.test(requestPath)) {
    requestPath = `https://${requestPath}`;
}
if (requestPath.endsWith('/')) {
    requestPath = requestPath.slice(0, -1);
}

// 3. Build request headers
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
}

// 4. Build request body
const body = { /* API-specific structure */ }

// 5. Make request using tauriFetch
let res = await fetch(requestPath, {
    method: 'POST',
    url: requestPath,
    headers: headers,
    body: {
        type: "Json",
        payload: body
    }
});

// 6. Handle response
if (res.ok) {
    let result = res.data;
    return extractText(result);
} else {
    throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
}
```

### Default Values

Always provide sensible defaults for configuration:
- **Model**: Specify the latest/recommended model as default
- **Request Path**: Use official API endpoint as default
- **Custom Prompt**: Provide a default prompt that works for most cases

Example:
```javascript
let { 
    model = "gpt-5-mini",  // Default model
    apiKey,                 // Required, no default
    requestPath = "https://api.openai.com",  // Default endpoint
    customPrompt = "Just recognize the text in the image."  // Default prompt
} = config;
```

## Testing

### Manual Testing

Since these are Pot App plugins, testing requires:

1. **Build the plugin**: Run `python3 script/pack-plugins.py` to create .potext files
2. **Install in Pot App**: Copy .potext files to Pot App's plugin directory
3. **Configure**: Set API key and other required settings in Pot App
4. **Test Recognition**: Use Pot App to capture and recognize text from images

### Testing Checklist

When adding or modifying a plugin:

- [ ] Plugin compiles to .potext successfully
- [ ] info.json schema is valid
- [ ] All required files (info.json, main.js, icon.svg) are present
- [ ] API requests work with default configuration
- [ ] Error messages are descriptive
- [ ] Custom requestPath is properly normalized
- [ ] Default values are sensible and documented
- [ ] Supports multiple languages from language map

## Building & Packaging

### Build Process

To package plugins into .potext files:

```bash
# Package all plugins
python3 script/pack-plugins.py

# Package specific plugin
python3 script/pack-plugins.py plugin.com.pot-app.openai_recognize
```

The script will:
1. Validate required files exist (info.json, main.js, *.svg)
2. Create a ZIP archive with .potext extension
3. Include only the three required files (no LICENSE, README, etc.)

### Adding New Plugins

To add a new recognize plugin:

1. **Create plugin directory**: `plugin.com.pot-app.{service}_recognize/`
2. **Add required files**:
   - `info.json` with unique ID and configuration schema
   - `main.js` implementing the `recognize()` function
   - `{service}.svg` icon file
3. **Follow API request pattern** from existing plugins
4. **Test thoroughly** before packaging
5. **Build with pack-plugins.py** to create .potext file

## API Integration Guidelines

### OpenAI Vision API

- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo` (vision capable)
- **Image Format**: `data:image/png;base64,{base64}`
- **Response**: `result.choices[0].message.content`
- **Prompt**: System message with OCR instructions

### Mistral AI OCR API

- **Endpoint**: `https://api.mistral.ai/v1/ocr`
- **Model**: `mistral-ocr-latest`, `pixtral-12b-2409`
- **Image Format**: `data:image/png;base64,{base64}`
- **Response**: `result.pages[].markdown` (combine multiple pages)
- **Note**: Dedicated OCR endpoint, no prompt needed

### Adding New API Providers

When integrating a new vision/OCR API:

1. Study the API documentation for vision/OCR capabilities
2. Identify the correct endpoint, request format, and response structure
3. Create info.json with appropriate configuration fields
4. Implement main.js following the standard pattern
5. Handle API-specific response formats
6. Provide helpful default values and error messages

## Pull Request Guidelines

When submitting PRs:

### PR Title Format
- Use descriptive titles: "Add {Service} OCR plugin" or "Fix {issue} in {plugin}"
- Start with a verb: Add, Fix, Update, Improve

### PR Description Should Include
- **What**: Brief description of changes
- **Why**: Reason for the change
- **How**: Implementation approach if non-obvious
- **Testing**: How you tested the changes

### Before Submitting
- [ ] Code follows existing style and conventions
- [ ] Plugin builds successfully with pack-plugins.py
- [ ] Tested in actual Pot App (if possible)
- [ ] info.json schema is valid
- [ ] Default values are sensible
- [ ] Error messages are clear and helpful

## Common Patterns

### Language Code Handling

The `lang` parameter contains ISO language codes from the language map in info.json. Some plugins support language hints:

```javascript
// Example: Using language in custom prompt
if (!customPrompt) {
    customPrompt = "Just recognize the text in the image. Do not offer unnecessary explanations.";
} else {
    customPrompt = customPrompt.replaceAll("$lang", lang);
}
```

### Error Handling

Always provide detailed error messages:

```javascript
if (res.ok) {
    // Success handling
    if (result.pages && result.pages.length > 0) {
        return result.pages.map(page => page.markdown).join('\n\n');
    } else {
        throw `OCR response error: No pages found in response`;
    }
} else {
    throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
}
```

## Additional Resources

- [Pot App Official Site](https://pot-app.com/)
- [Pot App GitHub](https://github.com/pot-app/pot-desktop)
- [OpenAI Vision API Documentation](https://platform.openai.com/docs/guides/vision)
- [Mistral AI Documentation](https://docs.mistral.ai/)

## Notes for AI Agents

- Always maintain backward compatibility with existing plugins
- Preserve the existing code style and patterns
- Test changes with the pack-plugins.py script before committing
- Keep error messages user-friendly and actionable
- Document any new configuration options in info.json
- Follow the established patterns for API requests and response handling
