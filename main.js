async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { model = "mistral-ocr-latest", apiKey, requestPath } = config;

    if (!requestPath) {
        requestPath = "https://api.mistral.ai/v1/ocr";
    }
    if (!/https?:\/\/.+/.test(requestPath)) {
        requestPath = `https://${requestPath}`;
    }
    if (requestPath.endsWith('/')) {
        requestPath = requestPath.slice(0, -1);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model: model,
        document: {
            type: "image_url",
            image_url: `data:image/png;base64,${base64}`
        }
    }
    
    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;
        // Mistral OCR API returns pages array with markdown content
        if (result.pages && result.pages.length > 0) {
            // Combine all pages' markdown content
            return result.pages.map(page => page.markdown).join('\n\n');
        } else {
            throw `OCR response error: No pages found in response`;
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
