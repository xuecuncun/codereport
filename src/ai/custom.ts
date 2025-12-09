import axios from "axios";

import { type Config, getConfig } from "../utils/config.js";
import { findFirstPath } from "../utils/index.js";
import * as dot from 'dot-object';

export class CustomModel {
  private config: Config;

  constructor() {
    this.config = getConfig();
  }

  async chat(prompt: string) {
    const url = this.config.customApiUrl;
    const headers = this.config.customApiHeaders;
    const template = this.config.customApiBodyTemplate;
    
    // 把模板里的占位替换
    const path_str = findFirstPath(template, '{{prompt}}');
    dot.set(path_str, prompt, template);

    const resp = await axios.post(url, template, { headers });
    const resultField = this.config.customResultField;
    const text = dot.pick(resultField, resp);
    return typeof text === "string" ? text : JSON.stringify(text);
  }
}
