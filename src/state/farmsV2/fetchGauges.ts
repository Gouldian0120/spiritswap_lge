import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import lpGaugeABI from 'config/abi/lp-gauge.json'
import gaugesABI from 'config/abi/gauges.json'
import gaugesProxyABI from 'config/abi/gaugesProxy.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddressV2, getMasterChefAddress, getGaugesProxyAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import farmsV2Config from 'config/constants/farmsV2'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
const GaugeProxyAddress = getGaugesProxyAddress()

const newFetchGauges = async () => {
  const data = await Promise.all(
    farmsV2Config.map(async (farmConfig) => {
      const tokenAddresses = getAddress(farmConfig.tokenAddresses)
      const quoteTokenAdresses = getAddress(farmConfig.quoteTokenAdresses)
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const erc20Calls = [
        {
          // Balance of token in the LP contract
          address: tokenAddresses,
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: quoteTokenAdresses,
          name: 'balanceOf',
          params: [lpAddress],
        },

        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Quote token decimals
        {
          address: quoteTokenAdresses,
          name: 'decimals',
        },
      ]
      const [tokenBalanceLP, quoteTokenBlanceLP, lpTokenBalanceMC, quoteTokenDecimals] = await multicall.invoke()(
        erc20,
        erc20Calls,
      )
      const tokenDecimals = 18

      const gaugeProxyCalls = [
        // Gettting Gauge from proxy with lp
        {
          address: GaugeProxyAddress,
          name: 'getGauge',
          params: [lpAddress],
        },
        {
          address: GaugeProxyAddress,
          name: 'getDepositFeeRate',
        },
        {
          address: GaugeProxyAddress,
          name: 'pid',
        },
        {
          // I think the weights should be this instead of asking to the mastercheff as in FarmsV1
          address: GaugeProxyAddress,
          name: 'weights',
          params: [lpAddress], // to LP contract, not GaugeContract (as in InSpirit voting page)
        },
        {
          address: GaugeProxyAddress,
          name: 'totalWeight',
        },
      ]
      const [gaugeAddress, depositFee, gaugeProxyPid, gaugeWeight, totalWeight] = await multicall.invoke()(
        gaugesProxyABI,
        gaugeProxyCalls,
      )
      const [realGaugeAddress] = gaugeAddress

      const gaugeCalls = [
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // total supply of lp in respective gauge
        {
          address: realGaugeAddress,
          name: 'totalSupply',
        },
        {
          address: realGaugeAddress,
          name: 'derivedSupply',
        },
        {
          address: realGaugeAddress,
          name: 'rewardRate',
        },
        {
          address: realGaugeAddress,
          name: 'rewardPerToken',
        },
        {
          address: realGaugeAddress,
          name: 'getRewardForDuration',
        },
      ]
      const [lpTotalSupply, lpTotalInGauge, derivedSupply, rewardRate, rewardPerToken, getRewardForDuration] =
        await multicall.invoke()(gaugesABI, gaugeCalls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // 1- lpTokenRatio shoudl be the LP's balances (lpTotalInGauge) in a gauge -not in the MC- / lpTotalSupply
      // 2- lpTotalInQuoteToken is fine.
      // 3- tokenAmount, quoteTokenAmount & point 2- are fixed with lpTokenRatio fixed.

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatio)
        
      // ------ Just in case we need a different ratio for Gauges --------------------------------- =>
      const ratio = new BigNumber(lpTotalInGauge).div(new BigNumber(lpTotalSupply))

      const quoteTokenInGauge = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(new BigNumber(2))
      .times(ratio)
      // ------ -------------------------------------------------------------------------------- <=

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      let tokenPriceVsQuote: BigNumber
      if (tokenAmount.comparedTo(0) > 0) {
        tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
      } else {
        tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP))
      }

      const [info, totalAllocPoint, spiritPerBlock] = await multicall.invoke()(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [new BigNumber(gaugeProxyPid).toFormat(0)],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getMasterChefAddress(),
          name: 'spiritPerBlock',
        },
      ])

      const GaugesAllocPoint = new BigNumber(info.allocPoint._hex).div(totalAllocPoint) // All gauges together
      const GWeight = new BigNumber(gaugeWeight) // Each Gauge
      const poolWeight = GWeight.div(new BigNumber(totalWeight)).times(100) // pool weight inside gaugeProxy, divided total
      const multiplier = GaugesAllocPoint.times(poolWeight) // pool weight X multiplier = specific pool multiplier

        // console.log("info.allocPoint._hex-----", new BigNumber(info))
        // console.log("GaugesAllocPoint", new BigNumber(info.allocPoint._hex).toNumber())
        // console.log("totalAllocPoint", new BigNumber(totalAllocPoint).toNumber())
        // console.log("multiplier", new BigNumber(multiplier).toNumber())
        // console.log("lpTokenRatio", new BigNumber(lpTokenRatio).toNumber())
        // console.log("lpTotalInQuoteToken", new BigNumber(lpTotalInQuoteToken).toNumber())
      return {
        ...farmConfig,
        lpAddress,
        gaugeAddress: realGaugeAddress,
        lpTotalInGauge: getBalanceNumber(lpTotalInGauge),
        tokenAmount: tokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: multiplier.toString(),
        depositFeeBP: new BigNumber(depositFee).toNumber(),
        spiritPerBlock: getBalanceNumber(spiritPerBlock),
        lpTotalSupply: new BigNumber(lpTotalSupply).div(new BigNumber(10).pow(tokenDecimals)).toJSON(),
        lpTokenBalanceMC: new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(18)).toJSON(),
        rewardRate: new BigNumber(rewardRate).toNumber(),
        derivedSupply: getBalanceNumber(derivedSupply),
        totalAllocPoint: new BigNumber(totalAllocPoint).toNumber(),
        getRewardForDuration: new BigNumber(getRewardForDuration).toNumber(),
        quoteTokenInGauge: quoteTokenInGauge.toJSON() // Don't know about this. Different ratio, different apy.
      }
    }),
  )
  return data
}

export default newFetchGauges
