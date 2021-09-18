import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme'

import image from '../assets/transparent_spiritswap_background-min.png'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Lato', sans-serif;
  }
  body {
    background: #151e31 ;
    background-image: url(${image});
    background-image: url(${image}), linear-gradient(to top, #151e31, #1F2B46 );
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
    overflow-x: hidden;
  }
`


export default GlobalStyle
