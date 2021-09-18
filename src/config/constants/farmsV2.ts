import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'


// {
//   "inSpirit":"0x2FBFf41a9efAEAE77538bd63f1ea489494acdc08",
//   "feeDistributor":"0xD5A2a2d1d35724396bBB547554AD73b52C0f4993",         DEPLOYMENT IN Testnet
//   "gaugeProxy":"0x420b17f69618610DE18caCd1499460EFb29e1d8f",
//   "mInSpirit":"0x3554f3369a3530ABC031D938d2f717006Fe01fA1",
//   "mInSpiritPid":41,
//   "gagues":[
//       {
//           "name":"FTM-SPIRIT",
//           "token":"0x30748322B6E34545DBe0788C421886AEB5297789",
//           "address":"0xEFe02cB895b6E061FA227de683C04F3Ce19f3A62"
//       },
//       {
//           "name":"FTM-WETH",
//           "token":"0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e",
//           "address":"0xE86CeE843a5CE2F40575544B1fFc43CB1701D9ae"
//       },
//       {
//           "name":"FTM-WBTC",
//           "token":"0x279b2c897737a50405ED2091694F225D83F2D3bA",
//           "address":"0xDccAFCE93E6e57f0464b4639d4aFD7B9Ad006F61"
//       }
//   ]
// }

const farmsV2: FarmConfig[] = [
 {
    pid: 1,
    isPsc: true,
    lpSymbol: 'SPIRIT-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0x30748322B6E34545DBe0788C421886AEB5297789',
    },
    gaugeAddress: '0xEFe02cB895b6E061FA227de683C04F3Ce19f3A62',
    tokenSymbol: 'SPIRIT',
    tokenAddresses: {
      4002: '',
      250: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 2,
    isPsc: true,
    lpSymbol: 'WETH-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e',
    },
    gaugeAddress: '0xE86CeE843a5CE2F40575544B1fFc43CB1701D9ae',
    tokenSymbol: 'WETH',
    tokenAddresses: {
      4002: '',
      250: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },  
  {
    pid: 3,
    isPsc: true,
    lpSymbol: 'WBTC-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0x279b2c897737a50405ED2091694F225D83F2D3bA',
    },
    gaugeAddress: '0xDccAFCE93E6e57f0464b4639d4aFD7B9Ad006F61',
    tokenSymbol: 'WBTC',
    tokenAddresses: {
      4002: '',
      250: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
]

export default farmsV2
