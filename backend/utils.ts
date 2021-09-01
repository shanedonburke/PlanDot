import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import YAML from "yaml";

const plandotDir = join(homedir(), ".plandot");

function getLocalFilePath(...path: string[]): string {
  return join(plandotDir, ...path);
}

export function readLocalFileSync(...path: string[]): string {
  return readFileSync(getLocalFilePath(...path), "utf8");
}

export const config = YAML.parse(readLocalFileSync("config.yaml"));
