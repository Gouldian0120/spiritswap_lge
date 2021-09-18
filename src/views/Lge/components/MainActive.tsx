import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Button } from '@pancakeswap-libs/uikit'
import Input from './Input'
import { useClaimAndDeposit } from '../Hooks/useContract'

const Container = styled.div`
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
  }
`
const Col = styled.div`
  flex-direction: column;
  margin-left: 1rem;
`
const TimeToEnd = styled(Text)`
  text-align: center;
`
const StyledButton = styled(Button)`
  height: 2.5rem;
`
// const Legend = styled(Text)`
//   font-size: 12px;

//   @media only screen and (max-width: 600px) {
//     margin-bottom: 1rem;
//   }
// `

interface Props {
  resultPeriodEndDate: string
  account: string
}

const MainActive: React.FC<Props> = ({ resultPeriodEndDate, account }) => {
  const [FTMamount, setFTMamount] = useState('')

  const { deposit } = useClaimAndDeposit(account)
  return (
    <Container>
      <Row>{resultPeriodEndDate && <TimeToEnd> Event ends in: {resultPeriodEndDate}</TimeToEnd>}</Row>

      <Row>
        <Col style={{ textAlign: 'center' }}>
          <Input onChange={(e) => setFTMamount(e.target.value)} />
        </Col>

        <StyledButton onClick={() => deposit(FTMamount)}>Add BQB</StyledButton>
      </Row>
    </Container>
  )
}

export default MainActive
