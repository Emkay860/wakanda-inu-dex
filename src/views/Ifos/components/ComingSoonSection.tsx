import { useMemo } from 'react'
import { Card, Text, BunnyPlaceholderIcon, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { PoolIds } from 'config/constants/types'

import { StyledCardBody } from './IfoFoldableCard/index'
import { cardConfig } from './IfoFoldableCard/IfoPoolCard'
import GenericIfoCard from './IfoFoldableCard/GenericIfoCard'
import BunnyKnownPlaceholder from './IfoFoldableCard/IfoPoolCard/Icons/BunnyKnownPlaceholder'

const CurveBox = styled(Box)`
  border-bottom-left-radius: 100% 40px;
  border-bottom-right-radius: 100% 40px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`

export default function ComingSoonSection() {
  const { t } = useTranslation()

  const unlimitedConfig = useMemo(
    () =>
      cardConfig(t, PoolIds.poolUnlimited, {
        version: 3.1,
      }),
    [t],
  )

  return (
    <Card
      background="bubblegum"
      style={{
        width: '100%',
      }}
    >
      <StyledCardBody>
        <GenericIfoCard
          title={unlimitedConfig?.title}
          variant={unlimitedConfig?.variant}
          tooltip={unlimitedConfig?.tooltip}
          content={
            <>
              <BunnyKnownPlaceholder width={80} mb="16px" />
              <Text textAlign="center" fontWeight={600}>
                {t('Follow our social channels to learn more about the next LaunchPad.')}
              </Text>
            </>
          }
          action={null}
        />
      </StyledCardBody>
    </Card>
  )
}
