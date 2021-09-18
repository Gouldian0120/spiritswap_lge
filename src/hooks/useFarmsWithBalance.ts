import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig, farmsV2Config } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from './useRefresh'
import { fetchFarmV2UserEarnings } from '../state/farmsV2/fetchFarmUserV2'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingSpirit',
        params: [farm.pid, account],
      }))
      const rawResults = await multicall.invoke(true)(masterChefABI, calls)
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
      setFarmsWithBalances(results)
    }
    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export const useFarmsWithBalanceV2 = () => {
  const [farmsWithBalancesV2, setFarmsWithBalancesV2] = useState<FarmWithBalance[]>([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const balancesV2 = await fetchFarmV2UserEarnings(account)
      const bigBalances = balancesV2.map(bal => [new BigNumber(bal)])
      const results = farmsV2Config.map((farm, index) => {
        return ({ ...farm, balance: new BigNumber(bigBalances[index])})
      })
      setFarmsWithBalancesV2(results)
    }
    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])


  return farmsWithBalancesV2
}

export default useFarmsWithBalance
