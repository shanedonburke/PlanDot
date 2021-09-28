import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import * as YAML from "yaml";

/**
 * The format of the configuration file at `~/.plandot/config.yaml`.
 */
interface Config {
  jwtSecret: string;
  angularDevUrl?: string;
  port: number;
  oauth2Credentials: {
    projectId: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    scope: string[];
  };
}

/**
 * Reads and returns the application configuration. A cached version is
 * returned if the function has been called before.
 * @returns The configuration as a {@link Config} object.
 */
export const getConfig = (() => {
  let config: Config;
  return (): Config => {
    return config || (config = YAML.parse(readLocalFileSync("config.yaml")));
  };
})();

/**
 * @returns True if the development profile (`NODE_ENV=dev`) is active.
 */
export function isDevProfile(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Reads a file in the `.plandot` directory.
 * @param path The path to the file relative to the `.plandot` directory.
 * @returns The file's contents as a string.
 */
export function readLocalFileSync(...path: string[]): string {
  return readFileSync(getLocalFilePath(...path), "utf8");
}

/**
 * @returns The path to the `.plandot` directory.
 */
const getPlanDotDir = (() => {
  let planDotDir: string;
  return (): string => {
    return planDotDir || (planDotDir = join(homedir(), ".plandot"));
  };
})();

/**
 * Gets the absolute path to a file in the `.plandot` directory.
 * @param path The path to the file relative to the `.plandot` directory.
 * @returns The absolute path to the file.
 */
function getLocalFilePath(...path: string[]): string {
  return join(getPlanDotDir(), ...path);
}
