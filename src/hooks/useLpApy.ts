import { useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'

const useLpApy = (farm) => {
  const { slowestRefresh } = useRefresh()
  const [lpApyNumber, setLpApyNumber] = useState(0)

  useEffect(() => {
    // fetch the data for the LP Apy using the CovalentHQ api
    fetch(
      `https://api.covalenthq.com/v1/${process.env.REACT_APP_CHAIN_ID}/xy=k/spiritswap/pools/address/${farm.lpAddresses[
        process.env.REACT_APP_CHAIN_ID
      ].toLowerCase()}/?key=${process.env.REACT_APP_COVALENT_API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.items[0]) {
          const lpData = {
            total: data.data.items[0].total_liquidity_quote,
            volume: data.data.items[0].volume_24h_quote,
            fee: data.data.items[0].fee_24h_quote,
          }
          if (lpData.fee && lpData.total) {
            setLpApyNumber(((lpData.fee / lpData.total) * 365 * 100 * 5) / 6)
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [farm.lpAddresses, slowestRefresh])

  return {
    lpApyNumber, 
    lpApy: lpApyNumber && lpApyNumber.toLocaleString('en-US').slice(0, -1)
  };
}

export default useLpApy
