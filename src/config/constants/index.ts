import farmsConfig from './farms'
import farmsV2Config from './farmsV2'

const communityFarms = farmsConfig.filter((farm) => farm.isCommunity).map((farm) => farm.tokenSymbol)
const communityFarmsV2 = farmsV2Config.filter((farm) => farm.isCommunity).map((farm) => farm.tokenSymbol)

export { farmsConfig, farmsV2Config, communityFarms, communityFarmsV2 }
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
