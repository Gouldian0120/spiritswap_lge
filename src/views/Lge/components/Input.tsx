import React from 'react'
import { Input } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

interface Props {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledInput = styled(Input)`
  border-radius: 0.5rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 5px;
  width: 250px;

  @media only screen and (max-width: 600px) {
    margin-bottom: 0.5rem;
  }
`
const Row = styled.div`
  display: flex;
  justify-content: center;

`

const Span = styled.span`
  font-weight: bold;
  background-color: #483f5a;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding-top: 12px;
  margin-right: 0.5rem;
  margin-left: 0.3rem;
`

const InputValue: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Row>
      <StyledInput type="number" value={value} onChange={onChange} placeholder="0.00" />
      <Span>FTM</Span>
    </Row>
  )
}

export default InputValue
