import connectDB from "@/lib/mongodb";
import PlatformConfig from "@/models/PlatformConfig";

const SINGLETON_ID = "platform-config-singleton";

// Platform Configuration is a single settings document. get() fetches it,
// auto-creating the default document the first time it's ever requested,
// so every consumer (escalation engine, concern scoring, pricing page,
// checker signup) can rely on it always existing instead of null-checking
// everywhere it's used.
async function getPlatformConfig() {
  await connectDB();
  let config = await PlatformConfig.findById(SINGLETON_ID);
  if (!config) {
    config = await PlatformConfig.create({ _id: SINGLETON_ID });
  }
  return config;
}

export { getPlatformConfig, SINGLETON_ID };
