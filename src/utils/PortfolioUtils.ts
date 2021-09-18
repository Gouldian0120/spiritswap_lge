import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { fetchFarmUserDataAsync, fetchFarmsV2UserDataAsync, fetchInSpiritDataAsync } from 'state/actions'
import { useWeb3React } from '@web3-react/core'
import { getBalanceNumber } from 'utils/formatBalance'
import { QuoteToken } from 'config/constants/types'
import useRefresh from 'hooks/useRefresh'
import { useFarms, useFarmsV2, useInSpirit, usePriceFtmUsdc, usePriceSpiritFtmV2, usePriceEthUsdc, usePriceYfiUsdc } from 'state/hooks'
import questionMark from "../assets/question.svg"


const PortfolioUtils = () => {
    const spiritPrice = usePriceSpiritFtmV2()
    const bnbPrice = usePriceFtmUsdc()
    const yfiPrice = usePriceYfiUsdc()
    const ethPriceUsd = usePriceEthUsdc()
    const farmsLP = useFarms()
    const boostedFarms = useFarmsV2()
    const inSpirit = useInSpirit()
    const { account } = useWeb3React()
    const dispatch = useDispatch()
    const { fastRefresh } = useRefresh()

    useEffect(() => {
        if (account) {
          dispatch(fetchFarmUserDataAsync(account))
          dispatch(fetchFarmsV2UserDataAsync(account))
          dispatch(fetchInSpiritDataAsync(account))
        }
      }, [account, dispatch, fastRefresh])
    
    const handleEventError = (e) => {e.target.src = questionMark};
    
    const farmsBalance = () => {
      const FarmsV1AndV2 = [ ...farmsLP, ...boostedFarms ];
      const activeFarmsLP = FarmsV1AndV2.filter((farmLP) => !farmLP.isTokenOnly && farmLP.multiplier !== '0');
      const stackedOnlyFarms = activeFarmsLP.filter(
        (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
      )
      const stackedFarmsBalance = stackedOnlyFarms.map(singleFarm => {
        if(singleFarm?.quoteTokenSymbol === QuoteToken.FTM) {
          const isBoostedFarm = singleFarm.gaugeAddress ? 'Boosted Farm' : 'Farm'
          const totalBalance = bnbPrice.times(singleFarm?.lpTotalInQuoteToken);
          const stakedBalance = getBalanceNumber(singleFarm?.userData?.stakedBalance);
          const earningBalance = getBalanceNumber(singleFarm?.userData?.earnings);
          const lpPrice = Number(totalBalance) / Number(singleFarm?.lpTokenBalanceMC);
          const totalUSDValue = stakedBalance * lpPrice;
            return {
              pid: singleFarm.pid,
              lpSymbol: singleFarm.lpSymbol,
              tokenSymbolA: singleFarm.quoteTokenSymbol, 
              tokenSymbolB: singleFarm.tokenSymbol, 
              totalBalance,
              stakedBalance,
              earningBalance,
              lpPrice,
              totalUSDValue,
              isBoostedFarm
            }
        }
        if(singleFarm?.quoteTokenSymbol === QuoteToken.SPIRIT) {
          const isBoostedFarm = singleFarm.gaugeAddress ? 'Boosted Farm' : 'Farm'

          const totalBalance = spiritPrice.times(singleFarm?.lpTotalInQuoteToken);
          const stakedBalance = getBalanceNumber(singleFarm?.userData?.stakedBalance);
          const earningBalance = getBalanceNumber(singleFarm?.userData?.earnings);
          const lpPrice = Number(totalBalance) / Number(singleFarm?.lpTokenBalanceMC);
          const totalUSDValue = stakedBalance * lpPrice;
          return { 
            pid: singleFarm.pid,
            lpSymbol: singleFarm.lpSymbol,
            tokenSymbolA: singleFarm.quoteTokenSymbol, 
            tokenSymbolB: singleFarm.tokenSymbol, 
            totalBalance,
            stakedBalance,
            earningBalance,
            lpPrice,
            totalUSDValue,
            isBoostedFarm
          }
        }
        if(singleFarm?.quoteTokenSymbol === QuoteToken.ETH) {
          const isBoostedFarm = singleFarm.gaugeAddress ? 'Boosted Farm' : 'Farm'

          const totalBalance = ethPriceUsd.times(singleFarm?.lpTotalInQuoteToken);
          const stakedBalance = getBalanceNumber(singleFarm?.userData?.stakedBalance);
          const earningBalance = getBalanceNumber(singleFarm?.userData?.earnings);
          const lpPrice = Number(totalBalance) / Number(singleFarm?.lpTokenBalanceMC);
          const totalUSDValue = stakedBalance * lpPrice;
          return {
            pid: singleFarm.pid,
            lpSymbol: singleFarm.lpSymbol,
            tokenSymbolA: singleFarm.quoteTokenSymbol, 
            tokenSymbolB: singleFarm.tokenSymbol, 
            totalBalance,
            stakedBalance,
            earningBalance,
            lpPrice,
            totalUSDValue,
            isBoostedFarm
          }
        }
        if(singleFarm?.quoteTokenSymbol === QuoteToken.YFI) {
          const isBoostedFarm = singleFarm.gaugeAddress ? 'Boosted Farm' : 'Farm'

          const totalBalance = yfiPrice.times(singleFarm?.lpTotalInQuoteToken);
          const stakedBalance = getBalanceNumber(singleFarm?.userData?.stakedBalance);
          const earningBalance = getBalanceNumber(singleFarm?.userData?.earnings);
          const lpPrice = Number(totalBalance) / Number(singleFarm?.lpTokenBalanceMC);
          const totalUSDValue = stakedBalance * lpPrice;
          return {
            pid: singleFarm.pid,
            lpSymbol: singleFarm.lpSymbol,
            tokenSymbolA: singleFarm.quoteTokenSymbol, 
            tokenSymbolB: singleFarm.tokenSymbol, 
            totalBalance,
            stakedBalance,
            earningBalance,
            lpPrice,
            totalUSDValue,
            isBoostedFarm
          }
        }
        const totalBalance = singleFarm?.lpTotalInQuoteToken;
        const stakedBalance = getBalanceNumber(singleFarm?.userData?.stakedBalance);
        const earningBalance = getBalanceNumber(singleFarm?.userData?.earnings);
        const lpPrice = Number(totalBalance) / Number(singleFarm?.lpTokenBalanceMC);
        const totalUSDValue = stakedBalance * lpPrice;
        return {
          pid: singleFarm.pid,
          lpSymbol: singleFarm.lpSymbol,
          tokenSymbolA: singleFarm.quoteTokenSymbol, 
          tokenSymbolB: singleFarm.tokenSymbol, 
          totalBalance,
          stakedBalance,
          earningBalance,
          lpPrice,
          totalUSDValue
         }
      })

      
      return stackedFarmsBalance
    }

    const spiritBalance = () => {
      const spiritPriceValue = spiritPrice.toNumber();
      const spiritFarm = farmsLP[0]
      const stakedBalance = getBalanceNumber(spiritFarm?.userData?.stakedBalance);
      const earningBalance = getBalanceNumber(spiritFarm?.userData?.earnings);
      const totalUSDValue = stakedBalance * spiritPriceValue;
      const stakedSpiritBalance = {
        pid: spiritFarm.pid,
        lpSymbol: spiritFarm.lpSymbol,
        stakedBalance,
        earningBalance,
        totalUSDValue
      }
      return stakedSpiritBalance
    }
    
    const liquidityBalance = () => {
      const liquidityFarms = farmsLP.filter((farmLP) => {
        if(farmLP?.userData && new BigNumber(farmLP.userData.tokenBalance).isGreaterThan(0) && farmLP.pid !== 0) {
          return farmLP
        }
        return null
      });
      const stackedFarmsBalance = liquidityFarms.map(singleLP => {
        if(singleLP?.quoteTokenSymbol === QuoteToken.FTM) {
          const totalBalance = bnbPrice.times(singleLP?.lpTotalInQuoteToken);
          const tokenBalance = getBalanceNumber(singleLP?.userData?.tokenBalance);
          const lpPrice = Number(totalBalance) / Number(singleLP?.lpTokenBalanceMC);
          const totalUSDValue = tokenBalance * lpPrice;
            return {
              pid: singleLP.pid,
              lpSymbol: singleLP.lpSymbol,
              tokenSymbolA: singleLP.quoteTokenSymbol, 
              tokenSymbolB: singleLP.tokenSymbol, 
              tokenBalance,
              totalUSDValue
            }
        }
        if(singleLP?.quoteTokenSymbol === QuoteToken.SPIRIT) {
          const totalBalance = spiritPrice.times(singleLP?.lpTotalInQuoteToken);
          const tokenBalance = getBalanceNumber(singleLP?.userData?.tokenBalance);
          const lpPrice = Number(totalBalance) / Number(singleLP?.lpTokenBalanceMC);
          const totalUSDValue = tokenBalance * lpPrice;
          return { 
            pid: singleLP.pid,
            lpSymbol: singleLP.lpSymbol,
            tokenSymbolA: singleLP.quoteTokenSymbol, 
            tokenSymbolB: singleLP.tokenSymbol, 
            tokenBalance,
            totalUSDValue
          }
        }
        if(singleLP?.quoteTokenSymbol === QuoteToken.ETH) {
          const totalBalance = ethPriceUsd.times(singleLP?.lpTotalInQuoteToken);
          const tokenBalance = getBalanceNumber(singleLP?.userData?.tokenBalance);
          const lpPrice = Number(totalBalance) / Number(singleLP?.lpTokenBalanceMC);
          const totalUSDValue = tokenBalance * lpPrice;
          return {
            pid: singleLP.pid,
            lpSymbol: singleLP.lpSymbol,
            tokenSymbolA: singleLP.quoteTokenSymbol, 
            tokenSymbolB: singleLP.tokenSymbol, 
            tokenBalance,
            totalUSDValue
          }
        }
        if(singleLP?.quoteTokenSymbol === QuoteToken.YFI) {
          const totalBalance = yfiPrice.times(singleLP?.lpTotalInQuoteToken);
          const tokenBalance = getBalanceNumber(singleLP?.userData?.tokenBalance);
          const lpPrice = Number(totalBalance) / Number(singleLP?.lpTokenBalanceMC);
          const totalUSDValue = tokenBalance * lpPrice;
          return {
            pid: singleLP.pid,
            lpSymbol: singleLP.lpSymbol,
            tokenSymbolA: singleLP.quoteTokenSymbol, 
            tokenSymbolB: singleLP.tokenSymbol, 
            tokenBalance,
            totalUSDValue
          }
        }
        const totalBalance = singleLP?.lpTotalInQuoteToken;
        const tokenBalance = getBalanceNumber(singleLP?.userData?.tokenBalance);
        const lpPrice = Number(totalBalance) / Number(singleLP?.lpTokenBalanceMC);
        const totalUSDValue = tokenBalance * lpPrice;
        return {
          pid: singleLP.pid,
          lpSymbol: singleLP.lpSymbol,
          tokenSymbolA: singleLP.quoteTokenSymbol, 
          tokenSymbolB: singleLP.tokenSymbol, 
          tokenBalance,
          totalUSDValue
         }
      })

      return stackedFarmsBalance;
    }

    const inSpiritInfo = () => {
      const spiritPriceValue = spiritPrice.toNumber();
      const spiritLocked = inSpirit?.data?.spiritLocked;
      const spiritLockedUSD = spiritLocked * spiritPriceValue; 
      const inSpiritBalance = inSpirit?.data?.userBalance;
      const stakedSpiritBalance = {
        pid: 1,
        Symbol: inSpirit?.data?.Symbol,
        spiritLocked,
        spiritLockedUSD,
        inSpiritBalance,
        inSpiritUSDBalance: 0
      }
      return stakedSpiritBalance
    }
    
    
    
    return {handleEventError, farmsBalance, spiritBalance, liquidityBalance, inSpiritInfo, spiritPrice}
        
}

export default PortfolioUtils

