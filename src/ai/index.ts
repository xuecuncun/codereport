import { OpenAIModel } from "./openai.js";
import { CustomModel } from "./custom.js";
import { getConfig } from "../utils/config.js";

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
