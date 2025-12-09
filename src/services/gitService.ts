import { execSync } from "child_process";
import { getWorkspaceFolder } from "../utils/workspace.js";

export async function getGitCommits(days = 5): Promise<string> {
  const folder = getWorkspaceFolder();
  if (!folder) throw new Error('未找到工作区');

  const since = `--since="${days} days ago"`;

  const logs = execSync(`git log ${since} --pretty=format:"%H||%s||%cd"`, {
    cwd: folder,
    encoding: 'utf-8'
  })
    .trim()
    .split('\n');

  const result: string[] = [];

  for (const line of logs) {
    const [hash, message, date] = line.split('||');

    const diff = execSync(`git show ${hash}`, {
      cwd: folder,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10
    });

    result.push(`
【提交】${message}
【日期】${date}
【代码变更】
${diff}
    `);
  }

  return result.join(' ');
}
