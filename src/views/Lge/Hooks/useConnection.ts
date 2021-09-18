import { useState } from 'react'

interface UseConnectionDataReturn {
  account: string
  connect: () => void
}

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

const UseConnection = (): UseConnectionDataReturn => {
  const [account, setaccount] = useState('')
  const [idChain, setid] = useState(false)

  const getChainId = async () => {
    const id = await window.ethereum.request({ method: 'eth_chainId' })
    setid(id === '0xfa2')
  }

  const connect = async () => {
    await getChainId()
    if (!idChain) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (!accounts.length) console.log('No connected')
          else {
            window.ethereum
              .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xfa2' }],
              })
              .then(() => setaccount(accounts[0]))
              .catch((error) => {
                console.log('error:wallet_switchEthereumChain', error)
                if (error.code === 4902 || error.code === -32603) {
                  window.ethereum
                    .request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: '0xfa2',
                          chainName: 'FantomNetwork',
                          rpcUrls: ['https://rpc.testnet.fantom.network'],
                          blockExplorerUrls: ['https://testnet.ftmscan.com'],
                          nativeCurrency: {
                            name: 'Fantom',
                            symbol: 'FTM',
                            decimals: 18,
                          },
                        },
                      ],
                    })
                    .then(() => setaccount(accounts[0]))
                    .catch(() => {
                      console.log('error:wallet_switchEthereumChain')
                    })
                }
              })
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.')
          } else {
            console.error(err)
          }
        })
    }
  }

  return { account, connect }
}

export default UseConnection
