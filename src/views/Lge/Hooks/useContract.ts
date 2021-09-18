import { useState, useEffect, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { getDitributorContract, getDitributorBonusContract, getLiquidityGeneratorContract } from 'utils/contractHelpers'
import { useToast } from 'state/hooks'
import useWeb3 from '../../../hooks/useWeb3'
import { getDate, formatPeriodEndDate } from '../utils'

interface UseDatesReturn {
  urlContract: string
  resultBeginDate: string
  resultEndDate: string
  resultPeriodEndDate: string
}

interface UseDataReturn {
  totalFTM: BigNumber
  BQBPriceInLGE: BigNumber
  userShareFTM: BigNumber
  userShareBQB: BigNumber
  userShareBonusBQB: BigNumber
}

interface UseClaimReturn {
  claim: () => void
  claimBonus: () => void
  deposit: (amount) => void
}

const ADDR_LIQUIDITY_GENERATOR = 123
export const useDates = (): UseDatesReturn => {
  const urlContract = `https://testnet.ftmscan.com/address/${ADDR_LIQUIDITY_GENERATOR}`
  const [resultBeginDate, setresultBeginDate] = useState('')
  const [resultEndDate, setresultEndDate] = useState('')
  const [resultPeriodEndDate, setresultPeriodEndDate] = useState('')
  const web3 = useWeb3()

  const tokenLiquidityGenerator = getLiquidityGeneratorContract(web3)
  const tokenDistributor = getDitributorContract(web3)

  const getClaimDate = useCallback(async () => {
    try {
      const responseBegin = await tokenDistributor.methods.vestingBegin().call()
      const responseEnd = await tokenDistributor.methods.vestingEnd().call()

      setresultBeginDate(getDate(responseBegin * 1000))
      setresultEndDate(getDate(responseEnd * 1000))
    } catch (error) {
      console.error('tokenDistributor.vestingdate', error)
    }
  }, [tokenDistributor.methods])

  const getResultPeriodEndDate = useCallback(async () => {
    try {
      const response = await tokenLiquidityGenerator.methods.periodEnd().call()
      const enddate = response * 1000

      setresultPeriodEndDate(formatPeriodEndDate(enddate))
    } catch (error) {
      console.error('tokenLiquidityGenerator.vestingEnd', error)
    }
  }, [tokenLiquidityGenerator.methods])

  useEffect(() => {
    getClaimDate()
    getResultPeriodEndDate()
  }, [getClaimDate, getResultPeriodEndDate])

  return { urlContract, resultBeginDate, resultEndDate, resultPeriodEndDate }
}

export const useData = (account: string): UseDataReturn => {
  const [totalFTM, settotalFTM] = useState<BigNumber>()
  const [BQBPriceInLGE, setBQBPriceInLGE] = useState<BigNumber>()
  const [userShareFTM, setuserShareFTM] = useState<BigNumber>()
  const [userShareBQB, setuserShareBQB] = useState<BigNumber>()
  const [userShareBonusBQB, setuserShareBonusBQB] = useState<BigNumber>()
  const web3 = useWeb3()

  const tokenBonusDistributor = getDitributorBonusContract(web3)
  const tokenDistributor = getDitributorContract(web3)

  const getTotalFTM = useCallback(async () => {
    try {
      const response = await tokenDistributor.methods.totalShares().call()
      const bigNumberResponse = new BigNumber(response)
      if (bigNumberResponse.toNumber() > 0) settotalFTM(bigNumberResponse.shiftedBy(-18))
      else settotalFTM(new BigNumber(0))
    } catch (error) {
      console.error('tokenDistributor.totalSupply', error)
    }
  }, [tokenDistributor.methods])

  const getBQBPriceInLGE = useCallback(async () => {
    try {
      const response = await tokenDistributor.methods.vestingAmount().call()
      const amount = new BigNumber(response)
      const response2 = await tokenBonusDistributor.methods.vestingAmount().call()
      const totalFTMShare = await tokenDistributor.methods.totalShares().call()

      setBQBPriceInLGE(new BigNumber(totalFTMShare).dividedBy(amount.plus(response2)))
    } catch (error) {
      console.error('tokenBonusDistributor.vestingAmount', error)
    }
  }, [tokenBonusDistributor.methods, tokenDistributor.methods])

  const getUserShareFTM = useCallback(async () => {
    try {
      const recipientInfo = await tokenDistributor.methods.recipients(account).call()
      const bigNumberResponse = new BigNumber(recipientInfo.shares)

      if (bigNumberResponse.toNumber() > 0) setuserShareFTM(bigNumberResponse.shiftedBy(-18))
      else setuserShareFTM(new BigNumber(0))
    } catch (error) {
      console.error(error)
    }
  }, [account, tokenDistributor.methods])

  const getUserShareBQB = useCallback(async () => {
    try {
      const totalFTMShares = await tokenDistributor.methods.totalShares().call()
      const recipientInfo = await tokenDistributor.methods.recipients(account).call()
      const normalVestingBQB = await tokenDistributor.methods.vestingAmount().call()

      if (!Number(totalFTMShares) || !Number(recipientInfo.shares)) {
        setuserShareBQB(new BigNumber(0))
        return
      }

      const total = new BigNumber(totalFTMShares)
      const userShare = new BigNumber(recipientInfo.shares).shiftedBy(-18)
      const share = userShare.multipliedBy(100).dividedBy(total)
      const balance = new BigNumber(normalVestingBQB).multipliedBy(share).dividedBy(100).minus(recipientInfo.credit)
      setuserShareBQB(balance.shiftedBy(-18))
    } catch (error) {
      console.error(error)
    }
  }, [account, tokenDistributor.methods])

  const getUserShareBonusBQB = useCallback(async () => {
    try {
      const totalBonusFTMShares = await tokenBonusDistributor.methods.totalShares().call()
      const bonusRecipientInfo = await tokenBonusDistributor.methods.recipients(account).call()
      const bonusVestingBQB = await tokenBonusDistributor.methods.vestingAmount().call()

      if (!Number(totalBonusFTMShares) || !Number(bonusRecipientInfo.shares)) {
        setuserShareBonusBQB(new BigNumber(0))
        return
      }

      const total = new BigNumber(totalBonusFTMShares)
      const userShare = new BigNumber(bonusRecipientInfo.shares).shiftedBy(-18)

      const share = userShare.multipliedBy(100).dividedBy(total)
      const balance = new BigNumber(bonusVestingBQB).multipliedBy(share).dividedBy(100).minus(bonusRecipientInfo.credit)

      setuserShareBonusBQB(balance.shiftedBy(-18))
    } catch (err) {
      console.error(err)
    }
  }, [account, tokenBonusDistributor.methods])

  useEffect(() => {
    getTotalFTM()
    getBQBPriceInLGE()
    getUserShareFTM()
    getUserShareBQB()
    getUserShareBonusBQB()
  }, [getTotalFTM, getBQBPriceInLGE, getUserShareFTM, getUserShareBQB, getUserShareBonusBQB])

  return { totalFTM, BQBPriceInLGE, userShareFTM, userShareBQB, userShareBonusBQB }
}

export const useClaimAndDeposit = (account: string): UseClaimReturn => {
  const web3 = useWeb3()
  const { toastError, toastSuccess } = useToast()
  const tokenBonusDistributor = getDitributorBonusContract(web3)
  const tokenDistributor = getDitributorContract(web3)
  const tokenLiquidityGenerator = getLiquidityGeneratorContract()

  const claim = async () => {
    try {
      const response = await tokenDistributor.methods.calculateCredit(account).call()

      if (response > 0) {
        await tokenDistributor.methods.claim().send({ from: account })
        toastSuccess('BQB claim successfully')
      } else {
        toastError('Cannot Claim! Current Balance is Zero.')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const claimBonus = async () => {
    try {
      const response = await tokenBonusDistributor.methods.calculateCredit(account).call()

      if (response > 0) {
        await tokenBonusDistributor.methods.claim().send({ from: account })
        toastSuccess('Bonus BQB claim successfully')
        window.alert('success!')
      } else {
        toastError('Cannot Claim! Current Balance is Zero.')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deposit = async (amount: string) => {
    console.log(account)
    console.log(new BigNumber(amount).shiftedBy(18).integerValue().toString())

    if (Number(amount) < 10) {
      toastError('The amount must be greater than 10 FTM')
    } else {
      try {
        await tokenLiquidityGenerator.methods.deposit().send({
          from: account,
          value: new BigNumber(amount).shiftedBy(18).integerValue().toString(),
        })
        toastSuccess('Successfully operation')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return { claim, claimBonus, deposit }
}
