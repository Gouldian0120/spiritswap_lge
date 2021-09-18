import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { Coin98Connector } from '@yay-games/coin98-web3-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ConnectorNames } from '@pancakeswap-libs/uikit'
import Web3 from 'web3'
import { POLLING_INTERVAL } from 'config/constants/intervals'
import getNodeUrl from './getRpcUrl'

const rpcUrl = getNodeUrl()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

const coin98Connector = new Coin98Connector({ supportedChainIds: [chainId] })

const walletlink = new WalletLinkConnector({
  url: 'https://rpc.ftm.tools/',
  appName: 'spirit.swap',
  appLogoUrl: 'https://www.spiritswap.finance/assets/imgs/spiritswap_logo.png',
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Coin98]: coin98Connector,
  [ConnectorNames.WalletLink]: walletlink,
}

export const getLibrary = (provider): Web3 => {
  return provider
}

export const isCoin98Installed = () => {
  // @ts-ignore
  return !!(window?.ethereum?.isCoin98 || window?.coin98)
}

export const isMetamaskInstalled = () => {
  // @ts-ignore
  return !!window?.ethereum?.isMetaMask
}

// coinbase
export const isWalletLinkInstalled = () => {
  // @ts-ignore
  return !!window?.ethereum?.scanQRCode
}

export const getExtensionName = (connectorId: ConnectorNames) => {
  switch (connectorId) {
    case ConnectorNames.Injected:
      return 'MetaMask'
    case ConnectorNames.Coin98:
      return 'Coin98'
    case ConnectorNames.WalletLink:
      return 'CoinBase'
    default:
      return ''
  }
}
