import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, fetchFarmsV2UserDataAsync } from 'state/actions'
import { unstakeV2 } from 'utils/callHelpers'
import { useGaugeContract } from './useContract'

const useUnstake = (gaugeAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const gaugeContract = useGaugeContract(gaugeAddress)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstakeV2(gaugeContract, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      dispatch(fetchFarmsV2UserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, gaugeContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
