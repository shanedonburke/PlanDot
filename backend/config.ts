import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import YAML from "yaml";

export const plandotDir = join(homedir(), ".plandot");

export const config = YAML.parse(
  readFileSync(join(plandotDir, "config.yaml"), "utf8")
);
