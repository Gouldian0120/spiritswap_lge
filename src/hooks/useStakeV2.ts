import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchFarmsV2UserDataAsync } from 'state/actions'
import { stakeV2 } from 'utils/callHelpers'
import { useGaugeContract } from './useContract'

const useStake = (gaugeAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const gaugeContract = useGaugeContract(gaugeAddress)
  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeV2(gaugeContract, amount, account)
      dispatch(fetchFarmsV2UserDataAsync(account))
    },
    [account, dispatch, gaugeContract],
  )

  return { onStake: handleStake }
}

export default useStake
