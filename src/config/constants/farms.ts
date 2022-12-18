import { serializeTokens } from 'utils/serializeTokens'
import { bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTokens)

export const CAKE_BNB_LP_MAINNET = '0x9E388345D94C853bB26186ac735F40F7680c4c9f'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'WKD-BNB LP',
    lpAddresses: {
      // eslint-disable-next-line spaced-comment
      97: '',
      56: '0x9E388345D94C853bB26186ac735F40F7680c4c9f',
    },
    token: serializedTokens.wkd,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'WKD-BUSD LP',
    lpAddresses: {
      // eslint-disable-next-line spaced-comment
      97: '',
      56: '0x8a11224c517716226F4De09a1834888a6192a7DB',
    },
    token: serializedTokens.wkd,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 2,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      // eslint-disable-next-line spaced-comment
      97: '',
      56: '0xA610fa3c8F2418150A2b77dA216A0fF29b0fd43E',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
]

export default farms
