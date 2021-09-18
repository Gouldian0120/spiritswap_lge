import React from 'react'
import styled from 'styled-components'
import { Text, Button } from '@pancakeswap-libs/uikit'

const detailURL = 'http://docs.bloqball.com/bqb/bqb-fair-launch-with-spiritswap-liquidity-generation-event'

const LinksContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`
const StyledButton = styled(Button)`
  margin-left: 10px;
  height: 2.4rem;
  padding: 0 1rem 0 1rem;
  & > a {
    font-size: 0.8rem;
  }
  &:hover {
    opacity: 0.65;
  }
  @media only screen and (max-width: 600px) {
    width: 50%;
  }
`
const Title = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  @media only screen and (max-width: 600px) {
    text-align: center;
  }
`
const Info = styled.div`
  text-align: center;
  padding: 0 2rem 0 2rem;
  margin-bottom: 2rem;

  @media only screen and (max-width: 600px) {
    text-align: justify;
  }
`
const HugeTitle = styled.h1`
  font-size: clamp(22px, 5vw, 25px);
`

const TextEvent = styled(Text)`
  font-size: 1.2rem;
  color: red;

  @media only screen and (max-width: 600px) {
    text-align: center;
  }
`

const ClaimDate = styled(Text)`
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }

`

interface Props {
  isMetaMaskConnected: boolean
  urlContract: string
  resultEndDate: string
  resultBeginDate: string
  resultPeriodEndDate: string
}

const Header: React.FC<Props> = ({
  isMetaMaskConnected,
  urlContract,
  resultEndDate,
  resultBeginDate,
  resultPeriodEndDate,
}) => {
  return (
    <>
      <LinksContainer>
        <StyledButton>
          <a href={detailURL} target="_blank" rel="noopener noreferrer">
            Go to BQB
          </a>
        </StyledButton>
        <StyledButton>
          <a href={urlContract} target="_blank" rel="noopener noreferrer">
            LGE contract
          </a>
        </StyledButton>
      </LinksContainer>

      <Title>
        <HugeTitle>BQB Token Liquidity Generation</HugeTitle>
      </Title>

      <Info>
        {isMetaMaskConnected && !resultPeriodEndDate  && (
          <TextEvent fontSize="1.2rem" color="red">
            The event has ended
          </TextEvent>
        )}

        {isMetaMaskConnected && resultBeginDate && resultEndDate && (
          <ClaimDate>
            Claiming Date: <Text > {resultBeginDate} ~ {resultEndDate}</Text>
          </ClaimDate>
        )}

        <Text>
          BloqBall is going to be the most fairly launched token in the history of DeFi. Launch of BQB token is a 100%
          community-centric Liquidity Generation Event.
        </Text>
        {/* {!isMetaMaskConnected && (
          <Text style={{ color: 'red', marginTop: '1rem' }}>Please connect wallet to check the status.</Text>
        )} */}
      </Info>
    </>
  )
}

export default Header
