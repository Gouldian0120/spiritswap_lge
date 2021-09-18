import { MenuEntry } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'

const Config = () => {
  const TranslateString = useI18n()

  const config: MenuEntry[] = [
    {
      label: `${TranslateString(10013, 'Home')}`,
      icon: 'HomeIcon',
      href: '/',
    },
    {
      label: `${TranslateString(10039, 'Portfolio')}`,
      icon: 'NftIcon',
      href: '/portfolio',
    },
    {
      label: `${TranslateString(284, 'Exchange')}`,
      icon: 'TradeIcon',
      href: 'https://swap.spiritswap.finance/#/swap?outputCurrency=0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    },
    {
      label: `${TranslateString(10015, 'Farms')}`,
      icon: 'FarmIcon',
      href: '/farms',
    },
    {
      label: 'Boosted Farms',
      icon: 'GaugeIcon',
      href: '/boostedfarms',
    },
    {
      label: 'inSpirit',
      icon: 'inSpiritIcon',
      href: 'https://inspirit.spiritswap.finance/', 

    },
    {
      label: `${TranslateString(10016, 'Staking')}`,
      icon: 'PoolIcon',
      href: '/pools',
    },
    {
      label: 'Lend/Borrow',
      icon: 'LendIcon',
      href: 'https://app.ola.finance/networks/0x892701d128d63c9856A9Eb5d967982F78FD3F2AE/markets',
      target: '_blank',
    },
    {
      label: `${TranslateString(10018, 'Bridge')}`,
      icon: 'BridgeIcon',
      href: 'https://multichain.xyz/',
      target: '_blank',
    },
    {
      label: `${TranslateString(10019, 'Analytics')}`,
      icon: 'AnalyticIcon',
      href: 'https://info.spiritswap.finance',
      target: '_blank',
    },
    {
      label: 'IDO',
      icon: 'Rocket',
      href: 'https://idos.starter.xyz/spiritswap',
      target: '_blank',
    },
    {
      label: `${TranslateString(10037, 'NFTs')}`,
      icon: 'NftZoo',
      href: 'https://pet.zoocoin.cash/collections/85',
      target: '_blank',
    },

    {
      label: `${TranslateString(10022, 'More')}`,
      icon: 'MoreIcon',
      items: [
        {
          label: `${TranslateString(10020, 'Donate')}`,
          href: 'https://www.thegivingblock.com/donate-bitcoin',
          target: '_blank',
        },
        {
          label: `${TranslateString(10021, 'Store')}`,
          href: 'https://spiritswap.store/',
          target: '_blank',
        },
        {
          label: `${TranslateString(10034, 'Audit by MixBytes')}`,
          href: 'https://github.com/Layer3Org/spiritswap-core/blob/main/SpiritSwap-Core%20Security%20Audit%20Report.pdf',
          target: '_blank',
        },
        {
          label: `${TranslateString(10023, 'Tutorial')}`,
          href: 'https://www.youtube.com/channel/UCrKLtNctO0obN4-bDMGlFuQ/featured',
          target: '_blank',
        },

        {
          label: `${TranslateString(10024, 'GitHub')}`,
          href: 'https://github.com/Layer3Org/spiritswap-core/',
          target: '_blank',
        },
        {
          label: `${TranslateString(10025, 'Docs')}`,
          href: 'https://layer3.gitbook.io/spirit-swap/',
          target: '_blank',
        },
        {
          label: `${TranslateString(10026, 'Medium')}`,
          href: 'https://spiritswap.medium.com/',
          target: '_blank',
        },
        {
          label: `${TranslateString(10027, 'Announcements')}`,
          href: 'https://discord.com/invite/8FGd4nFQdT',
          target: '_blank',
        },
      ],
    },
  ]

  return config
}

export default Config
