import React from 'react'
import styled from 'styled-components'
import { Text, Button } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { useClaimAndDeposit } from '../Hooks/useContract'

const Row = styled.div`
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`
const BonusRow = styled(Row)`
  margin: 0 0 0.5rem 1.5rem;
  @media only screen and (max-width: 600px) {
    margin: 0 0 0.5rem 0rem;
  }
`
const Price = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;

  @media only screen and (max-width: 600px) {
    flex-direction: row;
    justify-content: center;
    margin: 0.2rem 0 0.5rem 0;
  }
`
const StyledButton = styled(Button)`
  height: 2rem;
  margin-top: 2px;
`
const ClaimTitle = styled(Text)`
  margin: 0.5rem 1.8rem 0 0;
  @media only screen and (max-width: 600px) {
    margin-top: 0.5rem;
    margin-left: 1rem;
  }
`
const TextPrice = styled(Text)`
  display: flex;
`

interface Props {
  userShareBQB: BigNumber
  userShareBonusBQB: BigNumber
  account: string
}

const MainInActive: React.FC<Props> = ({ userShareBQB, userShareBonusBQB, account }) => {
  const { claim, claimBonus } = useClaimAndDeposit(account)

  return (
    <>
      <BonusRow>
        <ClaimTitle>Your BQB Bonus:</ClaimTitle>
        <Price>
          {userShareBonusBQB ? (
            <TextPrice fontSize="1.5rem">
              {userShareBonusBQB.toFixed(2)}
              <Text small>BQB</Text>
            </TextPrice>
          ) : (
            <Text bold fontSize="1.5rem">
              Locked
            </Text>
          )}
        </Price>

        <StyledButton style={{ margin: '2px 0 2px 0' }} onClick={() => claimBonus()}>
          Claim
        </StyledButton>
      </BonusRow>

      <Row>
        <ClaimTitle>Your Claimable BQB:</ClaimTitle>
        <Price>
          {userShareBQB ? (
            <TextPrice fontSize="1.5rem">
              {userShareBQB.toFixed(2)}
              <Text small>BQB</Text>
            </TextPrice>
          ) : (
            <Text bold fontSize="1.5rem">
              Locked
            </Text>
          )}
        </Price>

        <StyledButton onClick={() => claim()}>Claim</StyledButton>
      </Row>
    </>
  )
}

export default MainInActive
