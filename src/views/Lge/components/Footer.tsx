import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'

const CardFooter = styled(Card)`
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  padding: 1rem 0 1rem 0;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    margin-bottom: 2rem;
  }
`
const Col = styled.div`
  flex-direction: column;
  text-align: center;
  margin: 0 1.6rem 0 1.6rem;
  @media only screen and (max-width: 600px) {
    margin: 0.5rem 0 0.5rem 0;
  }
`
const Amount = styled(Text)`
  font-weight: bold;
  font-size: 1.1rem;
`

interface Props {
  totalFTM: BigNumber
  BQBPriceInLGE: BigNumber
  userShareFTM: BigNumber
  isMetaMaskConnected: boolean
}
const Footer: React.FC<Props> = ({ totalFTM, isMetaMaskConnected, BQBPriceInLGE, userShareFTM }) => {
  return (
    <CardFooter isActive>
      <Col>
        <Amount>{!totalFTM && 'Locked'}</Amount>
        {totalFTM?.isGreaterThan(2000) ? (
          <Amount>{totalFTM && `${totalFTM?.shiftedBy(-3)} K FTM`}</Amount>
        ) : (
          <Amount>{totalFTM && `${totalFTM?.toFormat(2)} FTM`}</Amount>
        )}
        <Text small>Total FMT Deposited</Text>
      </Col>
      <Col>
        <Amount>{!BQBPriceInLGE && 'Locked'}</Amount>
        <Amount>{BQBPriceInLGE && `${BQBPriceInLGE?.toFixed(7)} FTM`}</Amount>
        <Text small>Current BQB Price</Text>
      </Col>

      {isMetaMaskConnected && (
        <>
          <Col>
            <Amount> {!userShareFTM && 'Locked'}</Amount>
            <Amount>{userShareFTM && `${userShareFTM?.toFixed(2)} FTM`}</Amount>
            <Text small>Your FTM Sent</Text>
          </Col>
        </>
      )}
    </CardFooter>
  )
}

export default Footer
