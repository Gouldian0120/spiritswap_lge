import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { Toast, toastTypes } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import { useSpiritLockedSupply } from 'hooks/useTokenBalance'
import { gql} from '@apollo/client'
import client from '../apollo/client'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  fetchFarmsV2DataAsync,
  fetchInSpiritDataAsync
} from './actions'

import { State, Farm, Gauge, Pool, ProfileState, TeamsState, AchievementState, PriceState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'
import { QuoteToken } from '../config/constants/types'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
    dispatch(fetchFarmsV2DataAsync()) // Farms V2

  }, [dispatch, slowRefresh])
}

// Farms
export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Farms V2
export const useFarmsV2 = () => {
  const farms = useSelector((state: State) => state.farmsV2.data)
  return farms
}

export const useFarmV2FromPid = (pid): Gauge => {
  const farm = useSelector((state: State) => state.farmsV2.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmV2FromV1lpSymbol = (lpSymbol): Gauge => {
  const farm = useSelector((state: State) => state.farmsV2.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmV2FromSymbol = (lpSymbol: string): Gauge => {
  const farm = useSelector((state: State) => state.farmsV2.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmV2User = (pid) => {
  const farm = useFarmV2FromPid(pid)
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}
// InSpirit
export const useInSpirit = () => {
  const inSpirit = useSelector((state: State) => state.inSpirit)
  return inSpirit
}

// Prices Farm V1
export const usePriceFtmUsdc = (): BigNumber => {
  const pid = 4 // FTM-USDC LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSpiritFtm = (): BigNumber => {
  const ftmPriceUSD = usePriceFtmUsdc()
  const pid = 1 // SPIRIT-FTM LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? ftmPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceYfiUsdc = (): BigNumber => {
  const pid = 13
  const farm = useFarmFromPid(pid)
  const ftmPrice = usePriceFtmUsdc()
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(ftmPrice) : ZERO
}

export const usePriceEthUsdc = (): BigNumber => {
  const ftmPriceUSD = usePriceFtmUsdc()
  const ethPriceFtm = usePriceEthFtm()
  return ftmPriceUSD.times(ethPriceFtm)
}

export const usePriceEthFtm = (): BigNumber => {
  // const priceFtmFusd = usePriceFtmUsdc()
  // const priceEthBusd = usePriceEthUsdc()
  // return priceEthBusd.div(priceFtmFusd)
  const pid = 3 // ETH-FTM LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ?? ZERO
}

// Prices Farm V2

export const usePriceFtmUsdcV2 = (): BigNumber => {
  return usePriceFtmUsdc() // Using V1 for now
  // const pid = 4 // FTM-USDC LP // tonny (v2) 
  // const farm = useFarmV2FromPid(pid)
  // return farm?.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceSpiritFtmV2 = (): BigNumber => {
  const ftmPriceUSD = usePriceFtmUsdcV2()
  const pid = 1 // SPIRIT-FTM LP // DUMMY(v2)
  const farm = useFarmV2FromPid(pid)
  return farm?.tokenPriceVsQuote ? ftmPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceYfiUsdcV2 = (): BigNumber => {
  const pid = 13
  const farm = useFarmV2FromPid(pid)
  const ftmPrice = usePriceFtmUsdcV2();
  return farm?.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(ftmPrice) : ZERO
}

export const usePriceEthUsdcV2 = (): BigNumber => {
  const ftmPriceUSD = usePriceFtmUsdcV2()
  const ethPriceFtm = usePriceEthFtmV2();
  return ftmPriceUSD?.times(ethPriceFtm);
}

export const usePriceEthFtmV2 = (): BigNumber => {
  const pid = 3 // ETH-FTM LP // Fake(v2)
  const farm = useFarmV2FromPid(pid)
  return farm?.tokenPriceVsQuote ?? ZERO
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Bush

export const useBushs = (): Pool[] => {
  const bushs = useSelector((state: State) => state.pools.data)
  return bushs
}


// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (token: string) => {
  const prices = useGetApiPrices()
  if (!prices) {
    return null
  }
  return prices[token.toLowerCase()]
}
export const useTotalValue = (): number => {
  const [TVLGRAPH, setTVLGRAPH] = useState('')
  const FACTORY_ADDRESS = '0xEF45d134b73241eDa7703fa787148D9C9F4950b0'
  const GLOBAL_DATA = `query spiritswapFactories {
    spiritswapFactories(
     where: { id: "${FACTORY_ADDRESS}" }) {
      id
      totalLiquidityUSD
    }}`
  useEffect(() => {
    client.query({
      query: gql(GLOBAL_DATA),
      fetchPolicy: 'cache-first',
    }).then((result) => {
      setTVLGRAPH(result.data.spiritswapFactories[0].totalLiquidityUSD)
    }
    )
      .catch(function (e) {
        console.log(e)
      })
  }, [GLOBAL_DATA]);
  const farms = useFarms()
  const bnbPrice = usePriceFtmUsdc()
  const spiritPrice = usePriceSpiritFtm()
  const lockedAmount = useSpiritLockedSupply()
  const lockedValue = spiritPrice.times(getBalanceNumber(lockedAmount))
  let value = new BigNumber(TVLGRAPH)
  
  // farms
  /*   for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val
      if (farm.quoteTokenSymbol === QuoteToken.FTM) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.SPIRIT) {
        val = spiritPrice.times(farm.lpTotalInQuoteToken)
      } else {
        val = farm.lpTotalInQuoteToken
      }
      value = value.plus(val)
    }
  } */
  
  value = value.plus(lockedValue.toNumber())
  return value.toNumber()
}
