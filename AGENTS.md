# Agents.md - Pot-App OpenAI Recognition Plugin

## Project Overview

This is a recognition plugin for Pot-App that uses OpenAI's vision models (GPT-4o, GPT-4o-Mini, GPT-4 Vision Preview) to perform OCR (Optical Character Recognition) on images. The plugin converts base64-encoded images into text using OpenAI's API.

### Purpose
Enable AI-powered text recognition from images within the Pot-App ecosystem, supporting multiple languages and customizable prompts.

### Key Technologies
- JavaScript (ES6+)
- OpenAI Vision API
- Tauri Framework (for HTTP requests)
- Pot-App Plugin System

## Project Structure

```
pot-app-recognize-plugin-openai/
├── main.js           # Core plugin logic with recognize() function
├── info.json         # Plugin metadata and configuration schema
├── openai.svg        # Plugin icon
├── README.md         # Basic project documentation
└── LICENSE           # Project license
```

### File Descriptions

- **main.js**: Contains the `recognize()` async function that handles the OCR process
- **info.json**: Defines plugin metadata, configuration options, and supported languages
- **openai.svg**: Visual icon for the plugin in Pot-App interface

## Architecture

### Plugin Entry Point
The main entry point is the `recognize()` function exported from `main.js`:

```javascript
async function recognize(base64, lang, options)
```

**Parameters:**
- `base64`: Base64-encoded image data (without data URI prefix)
- `lang`: Target language code (e.g., "en", "zh_cn", "ja")
- `options`: Object containing `config` and `utils`
  - `config`: User configuration (model, apiKey, requestPath, customPrompt)
  - `utils`: Utility functions including `tauriFetch`

**Returns:** Promise<string> - Recognized text from the image

### API Integration
The plugin communicates with OpenAI's Chat Completions API endpoint:
- Default endpoint: `https://api.openai.com/v1/chat/completions`
- Supports custom endpoints for API proxies or alternative providers
- Uses bearer token authentication

## Coding Conventions

### Code Style
1. **Async/Await**: Always use async/await for asynchronous operations
2. **Destructuring**: Use object destructuring for cleaner code
3. **Template Literals**: Use backticks for string interpolation
4. **Error Handling**: Throw descriptive error messages with HTTP status information

### Naming Conventions
- **Variables**: camelCase (e.g., `requestPath`, `customPrompt`, `apiKey`)
- **Functions**: camelCase (e.g., `recognize`)
- **Constants**: Use const for immutable values

### Configuration Keys
Configuration parameters follow these conventions:
- `model`: OpenAI model selection
- `requestPath`: API endpoint URL
- `apiKey`: OpenAI API authentication key
- `customPrompt`: User-defined system prompt (can include `$lang` placeholder)

## Development Guidelines

### Adding New Features

When adding new functionality:
1. Maintain backward compatibility with existing configuration
2. Update `info.json` if adding new configuration options
3. Use the existing `tauriFetch` utility for HTTP requests
4. Follow the existing error handling pattern

### Request Path Processing
The plugin normalizes API endpoints with these rules:
1. Add `https://` protocol if missing
2. Remove trailing slashes
3. Append `/v1/chat/completions` if not present

### Language Support
Languages are defined in `info.json` under the `language` key. When adding support:
1. Use ISO language codes (e.g., "zh_cn", "en", "ja")
2. Provide English display names
3. The `$lang` variable in custom prompts will be replaced with the language value

## Testing

### Manual Testing
1. Install the plugin in Pot-App
2. Configure with a valid OpenAI API key
3. Test with various image types:
   - Screenshots with text
   - Photos of documents
   - Images with multiple languages
   - Low-quality/high-quality images

### Test Cases
- Valid API key with default settings
- Custom API endpoint (proxy)
- Custom prompt with `$lang` placeholder
- Different model selections (gpt-4o, gpt-4o-mini, gpt-4-vision-preview)
- Error scenarios (invalid API key, network errors, malformed images)

### Expected Behavior
- **Success**: Returns plain text content from image
- **Failure**: Throws error with HTTP status and response details

## API Documentation

### OpenAI Vision API Requirements
- **Model**: Must support vision capabilities (gpt-4o, gpt-4o-mini, gpt-4-vision-preview)
- **Image Format**: Base64-encoded, prefixed with `data:image/png;base64,`
- **Detail Level**: Set to "high" for better OCR accuracy
- **Authentication**: Bearer token in Authorization header

### Request Body Structure
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": [{"type": "text", "text": "prompt"}]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/png;base64,...",
            "detail": "high"
          }
        }
      ]
    }
  ]
}
```

## Configuration

### Required Configuration
- **apiKey**: OpenAI API key (required)

### Optional Configuration
- **model**: Default is "gpt-4o"
- **requestPath**: Default is "https://api.openai.com"
- **customPrompt**: Default is "Just recognize the text in the image. Do not offer unnecessary explanations."

### Custom Prompt Variables
- `$lang`: Replaced with the target language at runtime

## Dependencies

### External APIs
- OpenAI Chat Completions API (v1)

### Runtime Dependencies
- Pot-App framework
- Tauri (for `tauriFetch` utility)

### No Package Manager
This project has no npm/yarn dependencies as it's a pure JavaScript plugin for Pot-App.

## Common Issues & Solutions

### Issue: API Request Fails
**Solution**: Check that:
1. API key is valid and has sufficient credits
2. Request path is correctly formatted
3. Network connectivity is available
4. Model name is correct

### Issue: Empty or Incorrect Recognition
**Solution**:
1. Try a different model (gpt-4o recommended)
2. Ensure image quality is sufficient
3. Customize the prompt for better context
4. Check if the image contains recognizable text

## Contributing Guidelines

### Code Modifications
1. Keep the `recognize()` function signature unchanged
2. Maintain compatibility with Pot-App plugin system
3. Test with multiple image types and languages
4. Document any new configuration options in `info.json`

### Pull Request Guidelines
When submitting PRs:
- **Title**: Brief description of the change
- **Description**: Explain what changed and why
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Clearly mark any breaking changes

## AI Assistant Notes

### When Modifying This Plugin
1. The `recognize()` function is the only public interface - don't change its signature
2. Use `tauriFetch` from `utils` for HTTP requests (not standard fetch)
3. Always include proper error messages with HTTP status codes
4. Base64 image data should be prefixed with the data URI scheme when sent to OpenAI
5. The `$lang` placeholder in custom prompts must be replaced before sending to API

### Code Generation Best Practices
- Maintain the existing code style (async/await, destructuring)
- Add validation for new configuration options
- Include descriptive error messages
- Consider backward compatibility with existing configurations
