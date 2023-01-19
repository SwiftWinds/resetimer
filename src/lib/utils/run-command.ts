import { Command } from "@tauri-apps/api/shell";

interface CommandResult {
  data: {
    code: number;
    signal: string;
  };
  stdout: string;
  stderr: string;
}

export async function runCommand(program: string, args: string[]) {
  return new Promise<CommandResult>(async (resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const command = new Command(program, args);
    command.on("close", (data) => {
      resolve({ data, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    command.on("error", (error) => {
      reject({ error, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    command.stdout.on("data", (line) => {
      stdout += `${line}\n`;
    });
    command.stderr.on("data", (line) => {
      stderr += `${line}\n`;
    });

    const child = await command.spawn();
  });
}