import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>How can i participate in the WakandaLaunchpad?</Trans>,
    description: [
      <Trans>
        In order to be able to participate in the Launchpad users will have to deposit WKD into the WKDCommit contract
        before the start time of the launchpad, afterwards they use BNB to purchase the offering token.
      </Trans>,
    ],
  },
  {
    title: <Trans>What&apos;s the difference between Tier 1 and Tier2?</Trans>,
    description: [
      <Trans>
        Users are categorized into tiers based on the amount of WKD they have commit which is a factor to determine the
        amount of offering tokens to be allocated to them
      </Trans>,
    ],
  },
  {
    title: <Trans>What&apos;s my reward for participating in the Launchpad?</Trans>,
    description: [
      <Trans>
        You will get the offering token in the proportion of your deposits and amount to be shared by your tier
      </Trans>,
    ],
  },
]
export default config
