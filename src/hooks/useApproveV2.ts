import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useDispatch } from 'react-redux'
import { fetchFarmsV2UserDataAsync } from 'state/actions'
import { approveV2 } from 'utils/callHelpers'
import { useGaugeContract } from './useContract'

// Approve a Farm
const useApproveV2 = (lpContract: Contract, gaugeAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const gaugeContract = useGaugeContract(gaugeAddress)
  const handleApprove = useCallback(async () => {
    try {
      const tx = await approveV2(lpContract, gaugeAddress, account)
      dispatch(fetchFarmsV2UserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, gaugeAddress])

  return { onApprove: handleApprove }
}

export default useApproveV2
