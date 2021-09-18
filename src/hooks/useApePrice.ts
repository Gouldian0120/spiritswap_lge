import { useEffect, useState } from 'react'
import apeABI from 'config/abi/ape.json'
import { getWeb3NoAccount } from 'utils/web3'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'

const useApePrice = async () => {
  const [price, setApePrice] = useState([])
  const web3 = getWeb3NoAccount()
  const bnToDec = (bn, decimals = 18) => {
    return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
  }

  const callMethod = async (method, args = []) => {
    const result = await method(...args).call()
    return result
  }

  useEffect(() => {
    async function getPrice() {
      const busdBNBPairContractAddress = '0x25BD1c1e8E406B8f5294903a2C00D3b5cb0Cffb7'
      const IbusdBNBPairContract = new web3.eth.Contract((apeABI as unknown) as AbiItem, busdBNBPairContractAddress)
      const busdBNBPairContract = {
        address: busdBNBPairContractAddress,
        abi: (apeABI as unknown) as AbiItem,
        contract: IbusdBNBPairContract,
        decimals: 18,
      }
      const result = await callMethod(busdBNBPairContract.contract.methods.getReserves, [])

      setApePrice(result)
    }

    getPrice()
  }, [price, web3])

  return bnToDec(new BigNumber(price[1])) / bnToDec(new BigNumber(price[0]))
}

export default useApePrice
