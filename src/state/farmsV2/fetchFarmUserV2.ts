import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import gaugeABI from 'config/abi/gauges.json'
import gaugeProxy from 'config/abi/gaugesProxy.json'
import multicall from 'utils/multicall'
import farmsV2Config from 'config/constants/farmsV2'
import { getGaugesProxyAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import lpABI from 'config/abi/lp-gauge.json'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchFarmV2UserAllowances = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, farm.gaugeAddress] }
  })

  const rawLpAllowances = await multicall.invoke()(lpABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return getBalanceNumber(lpBalance)
  })
  return parsedLpAllowances
}

export const fetchFarmV2UserTokenBalances = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall.invoke()(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    // getBalanceNumber is rounding the last 2 digits to higher number causing insufficient balance and reverts 
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmV2UserStakedBalances = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    return {
      address: farm.gaugeAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall.invoke()(gaugeABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmV2UserEarnings = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    return {
      address: farm.gaugeAddress,
      name: 'earned',
      params: [account],
    }
  })

  const rawEarnings = await multicall.invoke()(gaugeABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmV2UserWeight = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    return {
      address: getGaugesProxyAddress(),
      name: 'votes',
      params: [account, farm.tokenAddresses[250]],
    }
  })

  const rawUserVotes = await multicall.invoke()(gaugeProxy, calls)
  const parsedUserVotes = rawUserVotes.map((votes) => {
    return getBalanceNumber(votes)
  })

  return parsedUserVotes
}

export const fetchFarmV2UserCurrentWeights = async (account: string) => {
  const calls = farmsV2Config.map((farm) => {
    return {
      address: getGaugesProxyAddress(),
      name: 'usedWeights',
      params: [account],
    }
  })

  const rawUsedWeights = await multicall.invoke()(gaugeProxy, calls)
  const parsedUsedWeights = rawUsedWeights.map((votes) => {
    return getBalanceNumber(votes)
  })

  return parsedUsedWeights
}
