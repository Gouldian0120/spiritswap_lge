import styled from 'styled-components'

const FlexLayout = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  & > * {

    margin: 0 8px;
    margin-bottom: 32px;

    @media only screen and (max-width: 720px) {
      min-width: 300px;
      max-width: 350px;
    }
    @media only screen and (min-width: 720px) {
      width: 30%;
      min-width: 320px;
      max-width: 350px;
    }
    @media only screen and (min-width: 1360px) {
      width: 30%;
      max-width: 350px;
    }
    @media only screen and (min-width: 1800px) {
      width: 30%;
      max-width: 350px;
    }
    @media only screen and (min-width: 1730px) {
      width: 30%;
      max-width: 350px;
    }
  }
`

export default FlexLayout

