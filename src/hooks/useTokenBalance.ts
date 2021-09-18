import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getCakeContract, getInspiritContract } from 'utils/contractHelpers'
import { getSpiritAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import tokenABI from 'config/abi/erc20.json'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract()
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useSpiritLockedSupply = () => {
  const { slowRefresh } = useRefresh()
  const [locked, setLocked] = useState<BigNumber>()

  useEffect(() => {
    async function fetchSpiritLocked() {
      const inspiritContract = getInspiritContract()
      const supply = await inspiritContract.methods.supply().call()
      setLocked(new BigNumber(supply))
    }

    fetchSpiritLocked()
  }, [slowRefresh])

  return locked
}


export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      // const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      const res = await contract.methods.balanceOf('0x0BF34815D05f0f6cC91a6Fccb3CeAcD4a1254Ea1').call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export const useAddressBalance = (tokenAddress: string, walletAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(walletAddress).call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, walletAddress, slowRefresh])

  return balance
}

export const useMultiAddressBalances = ( defaultValues = []) => {
  const [balances, setBalances] = useState(defaultValues);
  const { slowRefresh } = useRefresh();
  const tokenAddress = getSpiritAddress()
 
  useEffect(() => {
    const fetchBalances = async () => {
      const calls =[
        {
          address: tokenAddress,
          name: 'balanceOf',
          params: ['0x4D5362dd18Ea4Ba880c829B0152B7Ba371741E59'],
        }, {
          address: tokenAddress,
          name: 'balanceOf',
          params: ['0x07E820762910672613636D44c6e70954A6C6052a'],
        }, {
          address: tokenAddress,
          name: 'balanceOf',
          params: ['0x513a6e7C37B010B9a4d6fb73204759934d7e8c46'],
        }, {
          address: tokenAddress,
          name: 'balanceOf',
          params: ['0xE2c37B0741FCb431A32973e5337dc0388a8666b7'],
        }]
      const result = await multicall.invoke(true)(tokenABI, calls);
      setBalances(result)
  }

    fetchBalances()
  }, [ tokenAddress, slowRefresh])
  return balances
}

export default useTokenBalance
