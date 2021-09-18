import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { FarmConfig } from 'config/constants/types'
import { fetchFarmUserDataAsync, fetchFarmsV2UserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, harvestV2 } from 'utils/callHelpers'
import { getGaugeContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { useMasterchef, useSousChef, useGaugeContract } from './useContract'


export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    dispatch(fetchFarmsV2UserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[], farms: string[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const web3 = useWeb3()
  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])
    const harvestPromisesV2 = farms.reduce((accum, farm) => {
      const gaugeContract = getGaugeContract(farm, web3)
      return [...accum, harvestV2(gaugeContract, account)]
    }, [])

    return Promise.all(harvestPromises.concat(harvestPromisesV2))
  }, [account, farmPids, masterChefContract, web3, farms])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(masterChefContract, 0, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}
