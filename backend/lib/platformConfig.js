import PlatformConfig from "@/models/PlatformConfig";

const SINGLETON_ID = "platform-config-singleton";

async function getPlatformConfig() {
  let config = await PlatformConfig.findById(SINGLETON_ID);
  if (!config) {
    config = await PlatformConfig.create({ _id: SINGLETON_ID });
  }
  return config;
}

export { getPlatformConfig, SINGLETON_ID };