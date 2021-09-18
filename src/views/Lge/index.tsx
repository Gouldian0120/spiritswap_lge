import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import Header from './components/Header'
import MainActive from './components/MainActive'
import MainInActive from './components/MainInActive'
import Footer from './components/Footer'
import useConnection from './Hooks/useConnection'
import { useDates, useData } from './Hooks/useContract'

const CardContainer = styled(Card)`
  background: #0d0e21;
  color: #fcfae2;
  padding: 2rem 3rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;

  @media only screen and (max-width: 600px) {
    padding: 2rem 1rem 2rem 1rem;
  }
`

const Lge: React.FC = () => {
  const { account, connect } = useConnection()
  const { urlContract, resultBeginDate, resultEndDate, resultPeriodEndDate } = useDates()
  const { totalFTM, BQBPriceInLGE, userShareFTM, userShareBQB, userShareBonusBQB } = useData(account)

  const isMetaMaskConnected = Boolean(account.length)

  useEffect(() => {
    connect()
  }, [connect])

  return (
    <Page>
      <CardContainer isActive>
        <Header
          urlContract={urlContract}
          isMetaMaskConnected={isMetaMaskConnected}
          resultEndDate={resultEndDate}
          resultBeginDate={resultBeginDate}
          resultPeriodEndDate={resultPeriodEndDate}
        />

        {!resultPeriodEndDate ? (
          <MainInActive userShareBQB={userShareBQB} userShareBonusBQB={userShareBonusBQB} account={account} />
        ) : (
          <MainActive resultPeriodEndDate={resultPeriodEndDate} account={account}/>
        )}
      </CardContainer>

      <Footer
        totalFTM={totalFTM}
        userShareFTM={userShareFTM}
        BQBPriceInLGE={BQBPriceInLGE}
        isMetaMaskConnected={isMetaMaskConnected}
      />
    </Page>
  )
}

export default Lge
