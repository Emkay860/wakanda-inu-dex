import { useMemo } from 'react'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { Box, Card, CardBody, CardHeader, Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { Ifo, PoolIds } from 'config/constants/types'
import { useProfile } from 'state/profile/hooks'
import useCriterias from 'views/Ifos/hooks/v3/useCriterias'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { EnableStatus, CardConfigReturn } from '../types'
// import IfoCardTokens from './IfoCardTokens'
import IfoCardActions from './IfoCardActions'
// import IfoCardDetails from './IfoCardDetails'
// import IfoVestingCard from './IfoVestingCard'

const StyledCard = styled(Card)`
  width: 100%;
  margin: 0 auto;
  padding: 0 0 3px 0;
  height: fit-content;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
}

export const cardConfig = (
  t: ContextApi['t'],
  poolId: PoolIds,
  meta: {
    version: number
    needQualifiedPoints?: boolean
    needQualifiedNFT?: boolean
  },
): CardConfigReturn => {
  switch (poolId) {
    case PoolIds.poolBasic:
      if (meta?.version >= 3.1) {
        const MSG_MAP = {
          needQualifiedNFT: t('Set PancakeSquad NFT as Pancake Profile avatar.'),
          needQualifiedPoints: t('Reach a certain Pancake Profile Points threshold.'),
        }

        const msgs = Object.keys(meta)
          .filter((criteria) => meta[criteria])
          .map((criteria) => MSG_MAP[criteria])
          .filter(Boolean)

        return {
          title: t('Private Sale'),
          variant: 'blue',
          tooltip: msgs?.length ? (
            <>
              <Text>{t('Meet any one of the requirements to join:')}</Text>
              {msgs.map((msg) => (
                <Text ml="16px" key={msg} as="li">
                  {msg}
                </Text>
              ))}
            </>
          ) : null,
        }
      }

      return {
        title: t('Basic Sale'),
        variant: 'blue',
        tooltip: t(
          'Every person can only commit a limited amount, but may expect a higher return per token committed.',
        ),
      }
    case PoolIds.poolUnlimited:
      return {
        title: meta?.version >= 3.1 ? t('Public Sale') : t('Unlimited Sale'),
        variant: 'violet',
        tooltip: t('No limits on the amount you can commit. Additional fee applies when claiming.'),
      }

    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const SmallCard: React.FC<IfoCardProps> = ({ poolId, ifo, publicIfoData, walletIfoData, onApprove, enableStatus }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const { admissionProfile, pointThreshold, vestingInformation } = publicIfoData[poolId]

  // const { needQualifiedNFT, needQualifiedPoints } = useMemo(() => {
  //   return ifo.version >= 3.1 && poolId === PoolIds.poolBasic
  //     ? {
  //         needQualifiedNFT: Boolean(admissionProfile),
  //         needQualifiedPoints: pointThreshold ? pointThreshold > 0 : false,
  //       }
  //     : {}
  // }, [ifo.version, admissionProfile, pointThreshold, poolId])

  // const config = cardConfig(t, poolId, {
  //   version: ifo.version,
  //   needQualifiedNFT,
  //   needQualifiedPoints,
  // })

  // const { hasActiveProfile, isLoading: isProfileLoading } = useProfile()
  // const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  // const isLoading = isProfileLoading || publicIfoData.status === 'idle'

  // const { isEligible, criterias } = useCriterias(walletIfoData[poolId], {
  //   needQualifiedNFT,
  //   needQualifiedPoints,
  // })

  // const isVesting = useMemo(() => {
  //   return (
  //     account &&
  //     ifo.version >= 3.2 &&
  //     vestingInformation.percentage > 0 &&
  //     publicIfoData.status === 'finished' &&
  //     walletIfoData[poolId].amountTokenCommittedInLP.gt(0)
  //   )
  // }, [account, ifo, poolId, publicIfoData, vestingInformation, walletIfoData])

  return (
    <>
      {/* {tooltipVisible && tooltip} */}
      <StyledCard>
        {/* */}
        {/* <CardBody p="12px">

            <>
              <IfoCardTokens
                criterias={criterias}
                isEligible={isEligible}
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
                hasProfile={hasActiveProfile}
                isLoading={isLoading}
                onApprove={onApprove}
                enableStatus={enableStatus}
              />
              <Box mt="24px">
                <IfoCardActions
                  isEligible={isEligible}
                  poolId={poolId}
                  ifo={ifo}
                  publicIfoData={publicIfoData}
                  walletIfoData={walletIfoData}
                  hasProfile={hasActiveProfile}
                  isLoading={isLoading}
                  enableStatus={enableStatus}
                />
              </Box>
              <IfoCardDetails
                isEligible={isEligible}
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
              />
            </>
        </CardBody> */}
      </StyledCard>
    </>
  )
}

export default SmallCard
