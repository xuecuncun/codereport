import * as vscode from "vscode";

export function getWorkspaceFolder(): string {
  const folders = vscode.workspace.workspaceFolders;

  if (!folders || folders.length === 0) {
    throw new Error("请先打开一个项目（Workspace）再运行命令。");
  }

  return folders[0].uri.fsPath;
}
