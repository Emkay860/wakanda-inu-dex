import { serializeTokens } from 'utils/serializeTokens'
import { bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTokens)

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

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
]

export default farms
