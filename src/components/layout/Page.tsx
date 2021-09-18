import styled from 'styled-components'
import Container, { FarmContainer } from './Container'

export const FarmPage = styled(FarmContainer)`
  padding-top: 0px;
  padding-bottom: 16px;
  height: 100%;

  #wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media only screen and (min-width: 576px) {
    padding: 0 10%;
  }
  @media only screen and (min-width: 1200px) {
    padding: 0 12%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 5px;
    padding-bottom: 0px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 5px;
    padding-bottom: 0px;
  }
`
const Page = styled(Container)`
  padding: 0px 17% 60px 17%;

  height: 100%;
  width: 100%;
  background: transparent;
  
  @media only screen and (max-width: 1250px) {
    padding: 0px 10% 60px 10%;
  }
  @media only screen and (max-width: 1100px) {
    padding: 20px 6% 60px 6%;
  }
  @media only screen and (max-width: 998px) {
    padding: 0% 12%;
  }

`
export default Page
