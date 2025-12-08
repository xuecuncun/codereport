import OpenAI from "openai";
import { type Config, getConfig } from "../utils/config";

export class OpenAIModel {
  private client: OpenAI;
  private config: Config;

  constructor() {
    this.config = getConfig();
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL
    });
  }

  async chat(prompt: string) {
    const temperature = this.config.temperature;
    const maxTokens = this.config.maxTokens;
    const model = this.config.model;

    const resp = await this.client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens
    });

    return resp?.choices?.[0]?.message?.content ?? "";
  }
}
