import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: #0d0e21;
  color: white;
  overflow: auto;
  border-radius: 0.5rem;
  margin-bottom: 20px;
  padding: 20px;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`
