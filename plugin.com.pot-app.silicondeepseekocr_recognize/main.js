async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { model = "deepseek-ai/DeepSeek-OCR", apiKey, requestPath, customPrompt } = config;

    if (!requestPath) {
        requestPath = "https://api.siliconflow.cn/v1";
    }
    if (!/https?:\/\/.+/.test(requestPath)) {
        requestPath = `https://${requestPath}`;
    }
    if (requestPath.endsWith('/')) {
        requestPath = requestPath.slice(0, -1);
    }
    if (!customPrompt) {
        customPrompt = "Free OCR.";
    } else {
        customPrompt = customPrompt.replaceAll("$lang", lang);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model: model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `<image>\n${customPrompt}`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${base64}`
                        }
                    }
                ]
            }
        ]
    }

    let res = await fetch(requestPath + "/chat/completions", {
        method: 'POST',
        url: requestPath + "/chat/completions",
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;
        // DeepSeek OCR API returns choices array with message content
        if (result.choices && result.choices.length > 0) {
            return result.choices[0].message.content;
        } else {
            throw `OCR response error: No choices found in response`;
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
