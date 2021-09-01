import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import YAML from "yaml";

export const config = YAML.parse(
  readFileSync(join(homedir(), ".plandot", "config.yaml"), "utf8")
);
