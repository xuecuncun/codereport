import * as vscode from 'vscode';
import { Prompt } from './config.js';

export async function forcePickPromot(items: Prompt[]) {
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "选择一个提示词模版",
    ignoreFocusOut: true // 防止窗口失焦就关闭
  });

  return selected;
}