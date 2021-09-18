import inSpiritABI from 'config/abi/inspirit.json'
import multicall from 'utils/multicall'
import { getInSpiritAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

const fetchInspirit = async (account: string) => {
  const inSpiritAddress = getInSpiritAddress()
  const [tokenName, Symbol, inSpiritSupply, InSpiritBalance, spiritLocked] = await multicall.invoke()(inSpiritABI, [
    // Gettting inSpirit balance in proxyGauge
    {
      address: inSpiritAddress,
      name: 'name',
    },
    {
      address: inSpiritAddress,
      name: 'symbol',
    },
    {
      address: inSpiritAddress,
      name: 'totalSupply',
    },
    {
      address: inSpiritAddress,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: inSpiritAddress,
      name: 'locked',
      params: [account],
    },
  ])

  return {
    tokenName,
    Symbol: Symbol[0],
    inSpiritAddress,
    inSpiritSupply: getBalanceNumber(inSpiritSupply),
    userBalance: getBalanceNumber(InSpiritBalance),
    spiritLocked: getBalanceNumber(spiritLocked[0]._hex)
  }
}

export default fetchInspirit
