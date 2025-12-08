import * as vscode from 'vscode';

export type Prompt = {
  label: string;
  content: string;
}

export interface Config {
  mode: string;
  model: string;
  apiKey: string | undefined;
  baseURL: string;
  promptTemplateList: Prompt[];

  maxTokens: number;
  temperature: number;
  gitDays: number;
  customApiUrl: string;
  customApiHeaders: Record<string, string> | undefined;
  customApiBodyTemplate: Record<string, string> | undefined;
  customResultField: string;
}

export function getConfig() {
  const cfg = vscode.workspace.getConfiguration('codereport');

  const config: Config = {
    mode: cfg.get<string>('AIMode', 'openai'),
    model: cfg.get<string>('AIModel', 'qwen3-max'),
    apiKey: cfg.get<string | undefined>('apiKey'),
    baseURL: cfg.get<string>('apiBaseUrl', 'https://dashscope.aliyuncs.com/compatible-mode/v1'),
    promptTemplateList: cfg.get<Prompt[]>('BasePromptTemplateList', []),
    gitDays: cfg.get<number>('BaseGitDays', 5),

    maxTokens: cfg.get<number>('BaseMaxTokens', 4096),
    temperature: cfg.get<number>('BaseTemperature', 0.7),
    

    customApiUrl: cfg.get<string>('customApiUrl', ''),
    customApiHeaders: cfg.get<Record<string, string>>('customApiHeaders'),
    customApiBodyTemplate: cfg.get<Record<string, string> | undefined>('customApiBodyTemplate'),
    customResultField: cfg.get<string>('customResultField', ''),
  };
  return config;
}
