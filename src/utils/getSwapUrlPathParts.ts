// https://swape.spiritswap.finance/#/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x5Cc61A78F164885776AA610fb0FE1257df78E59B
const getSwapUrlPathParts = ({ tokenAddresses }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return `#/swap?outputCurrency=${tokenAddresses[chainId]}`
}

export default getSwapUrlPathParts
