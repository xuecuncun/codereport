🚀 CodeReport AI — 自动生成专业技术周报
一个 VSCode 插件，用于 分析 Git 提交记录并自动生成结构化技术周报。
无需手动整理 commit，插件会自动读取你的提交日志，通过大模型生成 严谨、可交付、符合国内研发团队习惯的周报格式。

支持两种模式：
codereport.AIMode	默认调用外部模型
模式 A：OpenAI 兼容模型（外网模型需支持科学上网）
模式 B：自定义 API 模型（企业内网、自建模型、代理接口）

🛠 配置说明（非常重要）
点击插件设置图标 / 打开 VSCode 设置面板 > 搜索 codereport 即可。
插件支持 两种调用 AI 的方式：OpenAI 兼容模式、自定义 API 模式。
模式 A：OpenAI 兼容模型（global）

适用于：
通义千问
DeepSeek
ChatGPT
...

其他任何 OpenAI-compatible 的模型
codereport.AIModel	要使用的模型名（如 gpt-4o-mini、gpt-4.1、deepseek-chat 等）
codereport.apiKey	你的 API Key
codereport.apiBaseUrl	baseUrl 模型的api文档中会提供
codereport.BaseGitDays	git提交的前多少天
codereport.BaseTemperature	模型温度参数
codereport.BaseMaxTokens	模型最大输出长度


模式 B：自定义 API（custom）

适用于：
企业内网私有大模型
公司内部通用大模型网关
任意 HTTP 接口
任意 LLM，只要能返回文本即可

配置项（custom 模式）
配置项	说明
codereport.customApiUrl	请求地址
codereport.customApiMethod	目前仅支持 POST
codereport.customApiHeaders	自定义请求头（如 token）
codereport.customApiBodyTemplate 请求体模板（支持 {{prompt}} 占位符）这里的提示词也使用上述配置项中的 BasePromptTemplateList
codereport.customResultField	 返回 JSON 中的文本字段路径（如 data.output.choices[0].text）

插件将自动使用 Axios 进行 JSON Body POST：
示例：自定义 API 配置
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
插件会自动将 prompt 填入 {{prompt}}。

🧩 公共配置项（所有模式共享）
BaseTemperature	控制模型发散性
BaseMaxTokens	限制输出长度
BaseGitDays	默认回溯 Git 天数
codereport.BasePromptTemplateList	自定义提示词模板json 列表，默认提供一个版本。content中支持{{gitlog}}占位符用来替换git提交的daysRange天前的message和diff内容。
示例：
"codereport.BasePromptTemplateList": [
  {
    "label": "简洁版周报",
    "content": "请基于 gitlog 简要生成..."
  }
]

🧭 使用方法
1️⃣ 打开侧边栏
VSCode 左侧会出现 AI 周报助手 图标，点击打开。

2️⃣ 配置模型
点击右上角的齿轮图标，进入设置面板。

3️⃣ 点击“生成周报”

4️⃣ 从弹出的下拉框选择提示词
自动读取 git 提交与 diff
自动调用大模型

5️⃣ 点击右上角按钮复制到剪贴板
展示可折叠的预览内容


📂 文件结构（关键）
codereport-ai/
├── media/
│   └── icons/              # svg 图标
├── src/
│   ├── ai/                 # AI 模型封装
│   ├── commands/           # generateReport 命令
│   ├── services/           # 提供了获取git消息等方法
│   ├── models/             # 插件模型
│   ├── views/              # webview UI
│   └── utils/
└── package.json

❤️ 反馈与建议
如果你在使用过程中遇到问题，欢迎提交 Issue 或反馈给作者。