import { OpenAIModel } from "./openai";
import { CustomModel } from "./custom";
import { getConfig } from "../utils/config";

export function createModelClient() {
  const config = getConfig();
  const mode = config.mode;

  switch (mode) {
    case 'openai':
      return new OpenAIModel();
    case 'custom':
      return new CustomModel();
    default:
      return new OpenAIModel();
  }
}
