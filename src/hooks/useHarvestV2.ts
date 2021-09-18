import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmsV2UserDataAsync } from 'state/actions'
import { harvestV2 } from 'utils/callHelpers'
import { useGaugeContract } from './useContract'

const useHarvest = (gaugeAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const gaugeContract = useGaugeContract(gaugeAddress)

  const handleHarvest = useCallback(async () => {
    const txHash = await harvestV2(gaugeContract, account)
    dispatch(fetchFarmsV2UserDataAsync(account))
    return txHash
  }, [account, dispatch, gaugeContract])

  return { onReward: handleHarvest }
}

export default useHarvest