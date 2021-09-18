import { useEffect } from 'react'
import { usePriceSpiritFtm } from 'state/hooks'

const useGetDocumentTitlePrice = () => {
  const spiritPriceUsd = usePriceSpiritFtm()
  useEffect(() => {
    document.title = `SpiritSwap - $${Number(spiritPriceUsd).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`
  })
}
export default useGetDocumentTitlePrice
