import { ExpoConfig, ConfigContext } from "expo/config";
import * as fs from "fs";
import * as path from "path";

export default ({ config }: ConfigContext): ExpoConfig => {
  let commitHash = "N/A";

  try {
    const gitHeadPath = path.join(".git", "HEAD");
    if (fs.existsSync(gitHeadPath)) {
      const ref = fs.readFileSync(gitHeadPath, "utf8").trim();
      let hash = ref;

      if (ref.startsWith("ref:")) {
        const refPath = ref.replace("ref: ", "").trim();
        const fullRefPath = path.join(".git", refPath);
        if (fs.existsSync(fullRefPath)) {
          hash = fs.readFileSync(fullRefPath, "utf8").trim();
        }
      }

      commitHash = hash.slice(0, 7);
    }
  } catch {}

  const existingExtra = (config.extra || {}) as any;

  return {
    ...config,
    extra: {
      ...existingExtra,
      eas: {
        ...(existingExtra.eas || {}),
        projectId: "427d134f-3de1-41c5-9126-c58c2a1685b8",
      },
      commitHash,
    },
  } as ExpoConfig;
};
