import { Token, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from './tokens'
import { CAKE_BNB_LP_MAINNET } from './farms'
import { Ifo } from './types'

export const cakeBnbLpToken = new Token(ChainId.BSC, CAKE_BNB_LP_MAINNET, 18, 'WKD-BNB LP')

const ifos: Ifo[] = [
  {
    id: 'peel',
    address: '0x35Bb6Dd4E8C63491057c32621c8cDdE43BabE201',
    isActive: true,
    name: 'Meta Apes ($PEEL)',
    symbol: 'PEEL',
    token: bscTokens.peel,
    decimal: 18,
    fundsToRaise: '2 Bnb',
    offeringAmount: '83333333333333328',
    articleUrl:
      'https://pancakeswap.finance/voting/proposal/bafkreibomj5nilvyckdro7ztmm62syt55dcfnonxs63ji6hm2ijq35lru4',
    twitterUrl: 'https://twitter.com/MetaApesGame',
    description:
      'Meta Apes is a free-to-play, play-and-earn massively multiplayer online (MMO) strategy game designed for mobile and the first game to launch on the BNB Sidechain with their own dedicated chain, Ape Chain.',
  },
  // {
  //   id: 'trivia',
  //   address: '0x23C520d8227524E2cDD00360358864fF3fFC36b4',
  //   isActive: false,
  //   name: 'TRIVIA',
  //   symbol:"TRIVIA",
  //   token: bscTokens.trivia,
  //   fundsToRaise:"5.5 Bnb",
  //   offeringAmount:"93333333333333328",
  //   articleUrl:
  //     'https://pancakeswap.finance/voting/proposal/bafkreihrc2d55vrowbn2oajzs77ffv73g4hzch2e7wulnuccmbwl5u4hvq',
  //   telegramUrl: 'https://t.me/TriviansGlobal',
  //   twitterUrl: 'https://twitter.com/PlayTrivians',
  //   description:
  //     'Trivian is a trivia gaming platform with different game modes such as multiplayer mode, single player mode, 1v1 games, instant play, scheduled tournaments, and live shows … all while earning TRIVIA tokens!',
  // },
]

export default ifos
