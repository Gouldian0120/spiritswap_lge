import BigNumber from 'bignumber.js'
import { getSpiritAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's SPIRIT balance is at least the amount passed in
 */
const useHasCakeBalance = (minimumBalance: BigNumber) => {
  const cakeBalance = useTokenBalance(getSpiritAddress())
  return cakeBalance.gte(minimumBalance)
}

export default useHasCakeBalance
