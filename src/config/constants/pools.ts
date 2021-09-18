import { PoolConfig, FarmConfig, QuoteToken } from './types'
import contracts from './contracts'


const pools: PoolConfig[] = [
/*   {
    pid: 0,
    isOldPsc: true,
    isTokenOnly: true,
    lpSymbol: 'SPIRIT',
    lpAddresses: {
      4002: '',
      250: '0x30748322B6E34545DBe0788C421886AEB5297789', // SPIRIT-FTM LP
    },
    tokenSymbol: 'SPIRIT',
    tokenAddresses: {
      4002: '',
      250: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 47,
    isPsc: true,
    isTokenOnly: true,
    lpSymbol: 'ginSPIRIT-SPIRIT LP',
    lpAddresses: {
      4002: '',
      250: '0xc6ED96EdC14a199bde017A273A2CBd4a129bdC65',
    },
    tokenSymbol: 'ginSPIRIT',
    // tokenAddresses: contracts.ginspirit, 
    tokenAddresses: {
      4002: '',
      250: '0xc6ED96EdC14a199bde017A273A2CBd4a129bdC65',
    },
    quoteTokenSymbol: QuoteToken.SPIRIT,
    quoteTokenAdresses: contracts.spirit,
  }, */
]

export default pools
