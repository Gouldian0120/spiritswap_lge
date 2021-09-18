import React, { useState, useEffect } from 'react'
import { FAST_REFRESH_INTERVAL, SLOW_REFRESH_INTERVAL, SLOWEST_REFRESH_INTERVAL } from 'config/constants/intervals'

const RefreshContext = React.createContext({ slow: 0, fast: 0, slowest: 0 })

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }) => {
  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)
  const [slowest, setSlowest] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1)
    }, FAST_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1)
    }, SLOW_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlowest((prev) => prev + 1)
    }, SLOWEST_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return <RefreshContext.Provider value={{ slow, fast, slowest }}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }
