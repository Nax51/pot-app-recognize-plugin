# Pot App 識別插件

為 [Pot App](https://pot-app.com/) 划词翻譯提供的 AI 光學字元識別 (OCR) 插件。

## 📦 可用插件

### OpenAI Vision 插件

使用 OpenAI 視覺模型的 OCR 插件。

**預設設定：**
- 模型：`gpt-5-mini`
- 端點：`https://api.openai.com/v1/chat/completions`

### Mistral AI OCR 插件

使用 Mistral AI 專業 OCR API 的插件。

**預設設定：**
- 模型：`mistral-ocr-latest`
- 端點：`https://api.mistral.ai/v1/ocr`

### Silicon DeepSeek OCR 插件

使用 SiliconFlow 平台的 DeepSeek OCR 模型插件。

**預設設定：**
- 模型：`deepseek-ai/DeepSeek-OCR`
- 端點：`https://api.siliconflow.cn/v1/chat/completions`

## 🚀 安裝方式

### 方法一：下載現成插件

1. 從 [Releases](../../releases) 下載 `.potext` 檔案
2. 在 Pot App 中安裝：
   - 開啟 Pot App
   - 前往 設定 → 插件 → 識別
   - 點擊「安裝插件」
   - 選擇下載的 `.potext` 檔案

### 方法二：從原始碼建置

```bash
# 複製儲存庫
git clone https://github.com/pot-app/pot-app-recognize-plugin.git
cd pot-app-recognize-plugin

# 建置所有插件
python3 script/pack-plugins.py

# .potext 檔案會在專案根目錄中生成
```

## ⚙️ 設定說明

每個插件都需要設定 API Key：

| 插件 | 必要設定 | API Key 取得 |
|------|----------|-------------|
| OpenAI | API Key (必填) | [OpenAI Platform](https://platform.openai.com/) |
| Mistral | API Key (必填) | [Mistral AI Console](https://console.mistral.ai/) |
| DeepSeek | API Key (必填) | [SiliconFlow](https://siliconflow.cn/) |

## 🌍 支援語言

所有插件都支援多語言識別：

- **中文**：簡體、繁體、粵語
- **東亞語言**：日語、韓語
- **歐洲語言**：英語、法語、西班牙語、德語、義大利語、葡萄牙語、荷蘭語、瑞典語、波蘭語、烏克蘭語、挪威語
- **其他語言**：俄語、土耳其語、越南語、印尼語、泰語、馬來語、阿拉伯語、印地語、蒙古語、高棉語、波斯語

## 🔧 建置插件

**建置所有插件：**
```bash
python3 script/pack-plugins.py
```

**建置特定插件：**
```bash
python3 script/pack-plugins.py plugin.com.pot-app.silicondeepseekocr_recognize
```

## 📝 API Keys

### 取得 API Keys

**OpenAI：**
1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊或登入
3. 前往 [API Keys](https://platform.openai.com/api-keys)
4. 建立新的 API Key

**Mistral AI：**
1. 前往 [Mistral AI Console](https://console.mistral.ai/)
2. 註冊或登入
3. 前往 API Keys 區域
4. 生成新的 API Key

**SiliconFlow：**
1. 前往 [SiliconFlow](https://siliconflow.cn/)
2. 註冊或登入
3. 前往控制台
4. 取得 API Key

## 💡 提示詞建議

### DeepSeek OCR 官方提示詞

DeepSeek OCR 支援特定的提示詞格式，根據官方文檔建議：

| 用途 | 提示詞 | 說明 |
|------|--------|------|
| **純文字識別（推薦）** | `<|grounding|>OCR this image.` | 只提取文字內容，最乾淨的輸出 |
| **純文字，無版面** | `Free OCR.` | 基礎文字識別，不保留版面結構 |
| **文件轉 Markdown** | `<|grounding|>Convert the document to markdown.` | 保留文件格式，轉為 Markdown |
| **指定語言識別** | `<|grounding|>OCR this image in Traditional Chinese.` | 指定輸出語言 |
| **分析圖表** | `Parse the figure.` | 適合圖表、表格分析 |
| **詳細描述** | `Describe this image in detail.` | 包含圖片內容描述 |

### 使用技巧

1. **只要文字**：使用 `<|grounding|>OCR this image.`
2. **多語言支援**：在 Pot App 中自定義提示詞，如：`<|grounding|>OCR this image in $lang.`
3. **文件處理**：使用 `<|grounding|>Convert the document to markdown.` 保留格式
4. **避免多餘內容**：避免使用 "Describe" 或 "Analyze" 等詞語

### OpenAI 提示詞範例

| 用途 | 提示詞 |
|------|--------|
| **基礎文字識別** | `Just recognize the text in the image. Do not offer unnecessary explanations.` |
| **多語言支援** | `Recognize text in $lang language from the image. Return only the text.` |

## ❓ 常見問題

**「API Key 未設定」**
- 確認在 Pot App 設定中輸入了有效的 API Key

**「HTTP 請求錯誤」**
- 檢查網路連線
- 確認 API 端點正確
- 確保 API Key 有足夠額度

**「無法識別文字」**
- 嘗試更清晰的圖片
- 確保圖片包含可讀文字
- 檢查選擇語言是否符合文字

**「DeepSeek OCR 輸出奇怪內容」**
- 使用 `<|grounding|>OCR this image.` 提示詞
- 或嘗試 `Free OCR.` 獲取最簡潔的輸出

## 🔗 相關連結

- [Pot App 官方網站](https://pot-app.com/)
- [Pot App GitHub](https://github.com/pot-app/pot-desktop)
- [OpenAI API 文件](https://platform.openai.com/docs/)
- [Mistral AI 文件](https://docs.mistral.ai/)
- [SiliconFlow 平台](https://siliconflow.cn/)