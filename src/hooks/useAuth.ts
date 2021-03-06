import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { ConnectorNames } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import {
  connectorsByName,
  isCoin98Installed,
  isMetamaskInstalled,
  isWalletLinkInstalled,
  getExtensionName,
} from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      if (
        (connectorID === ConnectorNames.Injected && isMetamaskInstalled()) ||
        (connectorID === ConnectorNames.Coin98 && isCoin98Installed()) ||
        (connectorID === ConnectorNames.WalletLink && isWalletLinkInstalled())
      ) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            }
          } else {
            toastError(error.name, error.message)
          }
        })
      } else {
        toastError(
          "Can't connect the wallet",
          `Install or turn on ${getExtensionName(connectorID)} extension only!`,
        )
      }
    } else {
      toastError("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, logout: deactivate }
}

export default useAuth
