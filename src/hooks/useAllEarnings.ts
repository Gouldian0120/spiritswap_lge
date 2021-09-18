import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'
import { fetchFarmV2UserEarnings } from '../state/farmsV2/fetchFarmUserV2'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    const fetchAllBalances = async () => {
     const balancesV2 = await fetchFarmV2UserEarnings(account)
     const bigBalances = balancesV2.map(bal=> [new BigNumber(bal)])
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingSpirit',
        params: [farm.pid, account],
      }))
      const res = await multicall.invoke()(masterChefABI, calls)
      setBalance(res.concat(bigBalances))
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useAllEarnings
