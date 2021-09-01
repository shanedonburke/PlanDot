import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import YAML from "yaml";

export const getConfig = (() => {
  let config: any;
  return () => {
    return config || (config = YAML.parse(readLocalFileSync("config.yaml")));
  }
})();

export function isDevProfile(): boolean {
  return process.env.NODE_ENV === "development";
}

export function readLocalFileSync(...path: string[]): string {
  return readFileSync(getLocalFilePath(...path), "utf8");
}

const getPlanDotDir = (() => {
  let planDotDir: string;
  return (): string => {
    return planDotDir || (planDotDir = join(homedir(), ".plandot"));
  }
})();

function getLocalFilePath(...path: string[]): string {
  return join(getPlanDotDir(), ...path);
}
