import React from 'react'
import styled, { keyframes } from 'styled-components'
import Page from './layout/Page'

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${pulse} 800ms linear infinite;
  background: linear-gradient(to top, #151e31 40%, #1f2b46 80%);
  height: 100vh;
  & > * {
    width: 240px;
  }
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img alt="SpiritSwap" src="/images/spiritswap/logo.png" />
    </Wrapper>
  )
}

export default PageLoader
