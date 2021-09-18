import BigNumber from 'bignumber.js'
import { useFarmV2User, useInSpirit } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import useLpApy from './useLpApy'

const useGaugeswithApy = (farm) => {
  const { stakedBalance } = useFarmV2User(farm.pid)

  const { lpApy, lpApyNumber } = useLpApy(farm)
  const fullApy = new BigNumber(farm.apy).plus(lpApyNumber)
  const GaugeAPYMin = fullApy.isGreaterThan(0) ? fullApy.times(0.4) : new BigNumber(0)
  const GaugeAPYMax = fullApy.isGreaterThan(0) ? fullApy : new BigNumber(0)
  const AprRange = `${GaugeAPYMin.toFormat(2)}% ~ ${GaugeAPYMax.toFormat(2)}%`

  const UserBalanceInFarm = getBalanceNumber(stakedBalance)
  const DerivedBalance = UserBalanceInFarm * 0.4;

  const { inSpiritSupply, userBalance } = useInSpirit().data
  const InspiritTotalSupply = inSpiritSupply
  const UserInspiritBalance = userBalance ? Number(userBalance) : 1

  const TotalDepositedInFarm = Number(farm.lpTotalInGauge)

  const AdjustedBalance = ((TotalDepositedInFarm * UserInspiritBalance) / InspiritTotalSupply) * 0.6

  const BoostFactor = new BigNumber(stakedBalance).isGreaterThan(0)
    ? Math.min(DerivedBalance + AdjustedBalance, UserBalanceInFarm) / UserBalanceInFarm
    : 0.4
  const Booster = BoostFactor ? BoostFactor / 0.4 : 1


  // FullApy * BoostFactor
  const realAPY = UserBalanceInFarm ? fullApy.times(new BigNumber(BoostFactor)).toFormat(2) : 0

  // - inSPIRIT Required for Max Boost = (User Liquidity in Farm) * (Total inSPIRIT Supply) / (Total Liquidity in Farm)
  const MaximizeBoost = UserBalanceInFarm > 0 ? (UserBalanceInFarm / Number(farm.lpTotalInGauge)) * InspiritTotalSupply : InspiritTotalSupply / Number(farm.liquidity)

  let isMaxBAchieved = false;
  if (UserInspiritBalance >= MaximizeBoost) {
    isMaxBAchieved = true;
  }
  // Minimum Booster 1, if there's no inSpirit holdings, the minimum APY users get is the minimum of the range.

  return {
    Booster: Booster.toFixed(2),
    MaximizeBoost: MaximizeBoost.toFixed(2),
    isMaxBAchieved,
    UserBalanceInFarm,
    AprRange,
    realAPY,
    lpApy
  }
}

export default useGaugeswithApy
