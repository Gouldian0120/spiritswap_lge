import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getGaugesProxyAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getSpiritAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getMasterChefAddress,
  getMasterChefAddressV2,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getInSpiritAddress,
  getDistributorAddress,
  getBonusDistributorAddress,
  getliquidityGeneratorAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import cakeAbi from 'config/abi/cake.json'
import ifoAbi from 'config/abi/ifo.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryAbi from 'config/abi/lottery.json'
import lotteryTicketAbi from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV2 from 'config/abi/masterchefV2.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import gaugeProxyABI from 'config/abi/gaugesProxy.json'
import gaugeABI from 'config/abi/gauges.json'
import lpABI from 'config/abi/lp-gauge.json'
import inspiritABI from 'config/abi/inspirit.json'

import liquidityGeneratorABI from 'config/abi/LiquidityGenerator.json'
import distributorABI from 'config/abi/Distributor.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getIfoContract = (address: string, web3?: Web3) => {
  return getContract(ifoAbi, address, web3)
}
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), web3)
}
export const getPointCenterIfoContract = (web3?: Web3) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), web3)
}
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getSpiritAddress(), web3)
}
export const getProfileContract = (web3?: Web3) => {
  return getContract(profileABI, getPancakeProfileAddress(), web3)
}
export const getPancakeRabbitContract = (web3?: Web3) => {
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), web3)
}
export const getBunnyFactoryContract = (web3?: Web3) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), web3)
}
export const getBunnySpecialContract = (web3?: Web3) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), web3)
}
export const getLotteryContract = (web3?: Web3) => {
  return getContract(lotteryAbi, getLotteryAddress(), web3)
}
export const getLotteryTicketContract = (web3?: Web3) => {
  return getContract(lotteryTicketAbi, getLotteryTicketAddress(), web3)
}
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3)
}
export const getMasterchefContractV2 = (web3?: Web3) => {
  return getContract(masterChefV2, getMasterChefAddressV2(), web3)
}
export const getGaugeProxyContract = (web3?: Web3) => {
  return getContract(gaugeProxyABI, getGaugesProxyAddress(), web3)
}
export const getGaugeContract = (address: string, web3?: Web3) => {
  return getContract(gaugeABI, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpABI, address, web3)
}
export const getClaimRefundContract = (web3?: Web3) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), web3)
}
export const getInspiritContract = (web3?: Web3) => {
  return getContract(inspiritABI, getInSpiritAddress(), web3)
}
export const getDitributorContract = (web3?: Web3) => {
  return getContract(distributorABI, getDistributorAddress(), web3)
}
export const getDitributorBonusContract = (web3?: Web3) => {
  return getContract(distributorABI, getBonusDistributorAddress(), web3)
}
export const getLiquidityGeneratorContract = (web3?: Web3) => {
  return getContract(liquidityGeneratorABI, getliquidityGeneratorAddress(), web3)
}
