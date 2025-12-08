# 🚀 CodeReport AI — 自动生成专业技术周报

**CodeReport AI** 是一个 VSCode 插件，用于分析 Git 提交记录并自动生成结构化、可交付、符合国内研发团队习惯的技术周报。  
插件会自动读取你的提交日志，通过大模型生成专业的周报内容。

---

## ✨ 功能亮点

- 自动读取 Git 提交 message + diff  
- 自动生成结构化技术周报  
- 支持 OpenAI 兼容模型（Qwen / DeepSeek / ChatGPT 等）  
- 支持自定义 API、企业内网模型、自建模型  
- 支持多套提示词模板  
- 周报预览支持折叠展示与一键复制

---

## 🔧 AI 模型调用模式

插件提供两种调用方式：  
- **模式 A：OpenAI Compatible（默认）**  
- **模式 B：Custom 自定义 API**

---

## 模式 A：OpenAI Compatible

适用于：

- 通义千问（Qwen）
- DeepSeek
- ChatGPT / OpenAI 系模型
- 任意 OpenAI-compatible API

配置项：

| 配置 | 说明 |
|------|------|
| `codereport.AIModel` | 模型名（如 gpt-4o-mini、deepseek-chat） |
| `codereport.apiKey` | API Key |
| `codereport.apiBaseUrl` | Base URL（模型文档提供） |
| `codereport.BaseGitDays` | Git 回溯天数 |
| `codereport.BaseTemperature` | 模型温度 |
| `codereport.BaseMaxTokens` | 模型最大输出长度 |

---

## 模式 B：Custom 自定义 API

适用于：

- 企业内网私有大模型  
- 公司内部通用大模型网关  
- 任意 HTTP API  
- 任意返回文本的 LLM  

配置项：

| 配置 | 说明 |
|------|------|
| `codereport.customApiUrl` | 请求地址 |
| `codereport.customApiMethod` | 请求方法（仅支持 POST） |
| `codereport.customApiHeaders` | 自定义请求头 |
| `codereport.customApiBodyTemplate` | 请求体模板（支持 {{prompt}}） |
| `codereport.customResultField` | 返回 JSON 中的文本路径，如 data.output |

示例：

```json
{
  "codereport.modelMode": "custom",
  "codereport.customApiUrl": "https://internal.company/api/llm",
  "codereport.customApiMethod": "POST",
  "codereport.customApiHeaders": {
    "Authorization": "Bearer 1234"
  },
  "codereport.customApiBodyTemplate": {
    "prompt": "{{prompt}}",
    "max_tokens": 2048
  },
  "codereport.customResultField": "data.output"
}
