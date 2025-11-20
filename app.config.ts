import { ExpoConfig } from "expo/config";
import { execSync } from "child_process";
import appJson from "./app.json";

function getCommitHash(): string {
try {
    return execSync("git rev-parse --short HEAD").toString().trim();
} catch {
    return "N/A";
}
}

const base = appJson.expo as ExpoConfig;

const config: ExpoConfig = {
    ...base,
extra: {
    ...(base.extra ?? {}),
    commitHash: getCommitHash(),
},
};

export default config;
