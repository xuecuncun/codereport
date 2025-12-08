import * as vscode from "vscode";

import { createModelClient } from "../ai";
import { getGitCommits } from "../services/gitService";
import { SidebarViewProvider } from "../views/sidebarView";
import { getConfig } from "../utils/config";
import { forcePickPromot } from "../utils/selectPrompt";

export async function generateReport(
  provider: SidebarViewProvider,
) {
  const config = getConfig();

  try {
    const days = config.gitDays;
    const apiKey = config.apiKey;
    if(!apiKey) {
      throw new Error("请先配置apiKey");
    }

    const selected = await forcePickPromot(config.promptTemplateList);
    if(!selected) {
      throw new Error("必须选择提示词模板");
    }

    const gitlog = await getGitCommits(days);
    const finalPrompt = selected.content.replace(/\{\{gitlog\}\}/g, gitlog);
    const model = createModelClient();
    const text = await model.chat(finalPrompt);

    if (provider) {
      provider.postMessage({
        command: "result",
        status: "success",
        text
      });
    }

    return text;
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message || String(err);

    if (provider) {
      provider.postMessage({
        command: "result",
        status: "error",
        text: `❌ 生成失败：${msg}`
      });
    }

    vscode.window.showErrorMessage(`生成周报失败：${msg}`);
    return null;
  }
}
