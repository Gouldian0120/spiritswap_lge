import { ApolloClient, InMemoryCache} from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics',
  cache: new InMemoryCache(),
})

export default client