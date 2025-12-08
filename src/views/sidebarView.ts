import * as vscode from "vscode";

export class SidebarViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
  ) { }

  public postMessage(message: any) {
    if (!this._view) {
      console.warn("Webview 尚未初始化，消息丢弃：", message);
      return;
    }
    this._view.webview.postMessage(message);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this.extensionUri
      ]
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // 前端 → 后端
    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.command === "generate") {
        await vscode.commands.executeCommand(
          "codereport.generateReport",
        );
      } else if (msg.command === "openSettings") {
        await vscode.commands.executeCommand(
          "workbench.action.openSettings",
          "codereport"
        );
      }
    });
  }

  private getMediaUri(webview: vscode.Webview, ...path: string[]) {
    return webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", ...path)
    );
  }

  private getHtmlForWebview(webview: vscode.Webview) {
    const nonce = getNonce();
    const copySvg = this.getMediaUri(webview, "copy.svg");
    const successSvg = this.getMediaUri(webview, "success.svg");
    const settingSvg = this.getMediaUri(webview, "setting.svg");

    return /*html*/`
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Security-Policy"
content="default-src 'none';
 img-src ${webview.cspSource} blob:;
 script-src 'nonce-${nonce}';
 style-src ${webview.cspSource} 'unsafe-inline';"
 />

<style>
  body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
  }

  /* 顶部栏 */
  .header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--vscode-sideBar-background);
    border-bottom: 1px solid var(--vscode-panel-border);
  }

  .settings-btn {
    cursor: pointer;
    opacity: 0.8;
  }
  .settings-btn:hover {
    opacity: 1;
  }

  /* 内容主体 */
  .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 14px;
    gap: 14px;
    overflow: hidden; /* 重要！ */
  }

  #gen {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    flex: 0 0 auto;
  }
  #gen.loading {
    opacity: 0.7;
    cursor: wait;
  }

  /* 结果区 */
  .result-area {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0; /* 防止 overflow 被挤压 */
  }

  .pre-wrapper {
    flex: 1 1 auto;
    position: relative;
    background: var(--vscode-editorWidget-background);
    color: var(--vscode-editor-foreground);
    padding: 12px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--vscode-editorWidget-border);
  }

  /* 折叠时限制高度 */
  .collapsed {
    max-height: 80px;
    mask-image: linear-gradient(to bottom, #cccc 70%, transparent 100%);
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-y: auto;
    height: 100%;
  }

  /* 复制按钮 */
  #copy {
    position: absolute;
    top: 6px;
    right: 8px;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.7;
  }
  #copy:hover {
    opacity: 1;
  }

  /* 展开按钮 */
  #expand {
    flex: 0 0 auto;
    margin-top: 6px;
    cursor: pointer;
    color: var(--vscode-textLink-foreground);
    font-size: 13px;
    background: none;
    border: none;
    padding: 0;
    text-align: left;
  }
</style>

</head>

<body>

  <!-- 顶部 -->
  <div class="header">
    <h3 style="margin:0;font-size:16px;">AI 周报助手</h3>
    <img id="settings" class="settings-btn" src="${settingSvg}" width="16" height="16"/>
  </div>

  <!-- 主体 -->
  <div class="container">
    <button id="gen">生成周报</button>

    <!-- 结果展示 Flex 区 -->
    <div class="result-area">
      <div class="pre-wrapper collapsed" id="preWrap">
        <pre id="output">点击按钮生成...</pre>
        <img id="copy" src="${copySvg}" width="16" height="16"/>
      </div>

      <button id="expand">展开全文 ▼</button>
    </div>
  </div>

<script nonce="${nonce}">
const vscode = acquireVsCodeApi();

const genBtn = document.getElementById("gen");
const preWrap = document.getElementById("preWrap");
const output = document.getElementById("output");
const expandBtn = document.getElementById("expand");
const copyBtn = document.getElementById("copy");
let expanded = false;

/* 生成按钮 */
genBtn.addEventListener("click", () => {
  genBtn.classList.add("loading");
  genBtn.textContent = "生成中...";

  vscode.postMessage({ command: "generate" });
});

/* 设置按钮 */
document.getElementById("settings").addEventListener("click", () => {
  vscode.postMessage({ command: "openSettings" });
});

/* 复制 */
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.textContent || "");
  copyBtn.src = "${successSvg}";
  setTimeout(() => { copyBtn.src = "${copySvg}" }, 1000);
});

/* 展开与折叠 */
expandBtn.addEventListener("click", () => {
  expanded = !expanded;
  preWrap.classList.toggle("collapsed", !expanded);
  expandBtn.textContent = expanded ? "收起 ▲" : "展开全文 ▼";
});

/* 接收结果 */
window.addEventListener("message", (event) => {
  const { command, text } = event.data;

  if (command === "result") {
    genBtn.classList.remove("loading");
    genBtn.textContent = "生成周报";

    output.textContent = text;
  }
});
</script>

</body>
</html>
`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
