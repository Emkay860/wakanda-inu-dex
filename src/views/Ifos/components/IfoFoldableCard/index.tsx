import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableLabel,
  ExpandableButton,
  useMatchBreakpointsContext,
  Text,
  Flex,
  Button,
  Input,
  Skeleton,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { requiresApproval } from 'utils/requiresApproval'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useCatchTxError from 'hooks/useCatchTxError'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
// import useIfoApprove from '../../hooks/useIfoApprove'
import { useLaunchPad } from 'views/Ifos/hooks/useLaunchPad'
import { useWkdCommit } from 'views/Pools/hooks/useWkdCommit'
import BigNumber from 'bignumber.js'
import { ethers, utils } from 'ethers'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Details from 'views/Voting/Proposal/Details'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { formatNumber } from 'utils/useFormatter'
import ifoActive from '../../../../config/constants/ifo'
import { SkeletonCardDetails } from './IfoPoolCard/Skeletons'
import { CardsWrapper } from '../IfoCardStyles'
import { IfoRibbon } from './IfoRibbon'
import { EnableStatus } from './types'
import IfoPoolCard from './IfoPoolCard'
import IfoAchievement from './Achievement'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const StyledCard = styled(Card)<{ $isCurrent?: boolean }>`
  width: 100%;
  margin: auto;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;

  ${({ $isCurrent }) =>
    $isCurrent &&
    `
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  `}

  > div {
    background: ${({ theme, $isCurrent }) => ($isCurrent ? theme.colors.gradients.bubblegum : theme.colors.dropdown)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;

    > div {
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
    }
  }
`

const Header = styled(CardHeader)<{ ifoId: string; $isCurrent?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${({ $isCurrent }) => ($isCurrent ? '64px' : '112px')};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg'), url('/images/ifos/${ifoId}-bg.png')`};
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

export const StyledCardBody = styled(CardBody)`
  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  padding: 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledNoHatBunny = styled.div<{ $isLive: boolean; $isCurrent?: boolean }>`
  position: absolute;
  left: -24px;
  z-index: 1;
  top: 33px;
  display: none;

  > img {
    width: 78px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
    left: auto;
    top: ${({ $isLive }) => ($isLive ? '63px' : '48px')};
    right: ${({ $isCurrent }) => ($isCurrent ? '17px' : '90px')};

    > img {
      width: 123px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 90px;
  }
`

const NoHatBunny = ({ isLive, isCurrent }: { isLive?: boolean; isCurrent?: boolean }) => {
  const { isXs, isSm, isMd } = useMatchBreakpointsContext()
  const isSmallerThanTablet = isXs || isSm || isMd
  if (isSmallerThanTablet && isLive) return null
  return (
    <StyledNoHatBunny $isLive={isLive} $isCurrent={isCurrent}>
      <img
        src={`/images/ifos/assets/bunnypop-${!isSmallerThanTablet ? 'right' : 'left'}.png`}
        width={123}
        height={162}
        alt="bunny"
      />
    </StyledNoHatBunny>
  )
}

// Active Ifo
export const IfoCurrentCard = ({ ifo }: { ifo: Ifo }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  const { fetchBlock } = useLaunchPad()

  const [block, setBlock] = useState<any>()

  const fetchBlockDetails = async () => {
    const result = await fetchBlock()
    const format = {
      startBlock: result ? Number(result?.startBlock) : 0,
      endBlock: result ? Number(result?.endBlock) : 0,
    }
    setBlock(format)
  }

  useEffect(() => {
    fetchBlockDetails()
  }, [])

  const currentBlock = useCurrentBlock()
  const status = getStatus(currentBlock, block?.startBlock, block?.endBlock)

  const shouldShowBunny = status === 'live' || status === 'coming_soon'

  return (
    <>
      {isMobile && (
        <Box
          className="sticky-header"
          position="sticky"
          bottom="48px"
          width="100%"
          zIndex={6}
          maxWidth={['400px', '400px', '400px', '100%']}
        >
          <Header $isCurrent ifoId={ifo.id} />
          {shouldShowBunny && <NoHatBunny isLive={status === 'live'} />}
        </Box>
      )}
      <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '400px', '400px', '100%']}>
        {!isMobile && shouldShowBunny && <NoHatBunny isCurrent isLive={status === 'live'} />}
        <StyledCard $isCurrent>
          {!isMobile && (
            <>
              <Header $isCurrent ifoId={ifo.id} />
              {/* <IfoRibbon publicIfoData={publicIfoData} /> */}
            </>
          )}
          <IfoCard ifo={ifo} />
          <StyledCardFooter>
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Details')}
            </ExpandableLabel>
            {isExpanded && <IfoAchievement ifo={ifo} />}
          </StyledCardFooter>
        </StyledCard>
      </Box>
    </>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

// Past Ifo
const IfoFoldableCard = ({ ifo }) => {
  const { asPath } = useRouter()
  const { isDesktop } = useMatchBreakpointsContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const wrapperEl = useRef<HTMLDivElement>(null)
  // const ifo = ifoActive.find((ifo) => ifo.isActive)
  console.log('history:', ifo)
  useEffect(() => {
    const hash = asPath.split('#')[1]
    if (hash === ifo.id) {
      setIsExpanded(true)
      wrapperEl.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [asPath, ifo])

  return (
    <Box id={ifo.id} ref={wrapperEl} position="relative">
      {isExpanded && isDesktop && <NoHatBunny isLive={false} />}
      <Box as={StyledCard} borderRadius="32px">
        <Box position="relative">
          <Header ifoId={ifo.id}>
            <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
          </Header>
          {/* {isExpanded && (
            <>
              <IfoRibbon  />
            </>
          )} */}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} showtier={false} />
          <IfoAchievement ifo={ifo} />
        </FoldableContent>
      </Box>
    </Box>
  )
}

const IfoCard = ({ ifo, showtier = true }: { ifo: Ifo; showtier?: boolean }) => {
  const { account, active } = useWeb3React()
  const { getIfoInfo, depositBnb, getAmountRaised, fetchBlock, claimToken, getClaimedStatus } = useLaunchPad()
  const { getUserCommitBalance } = useWkdCommit()
  const [detail, setDetails] = useState<any>()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState(0)
  const [amountRaised, setAmountRaised] = useState('')
  const { toastError, toastSuccess } = useToast()
  const [depositing, setDepositing] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [block, setBlock] = useState<any>()
  const { isMobile } = useMatchBreakpointsContext()
  const [hasClaimed, setHasClaimed] = useState(false)

  const activeIfo = ifoActive.find((_ifo) => _ifo.isActive)

  const fetchLaunchPad = async () => {
    try {
      const result: any = await getIfoInfo()
      const format = {
        offeringAmount: formatNumber(result._offeringAmount.toString() / activeIfo.decimal ?? 18),
        raisingAmount: ethers.utils.formatUnits(result?._raisingAmount),
        tier1Amount: formatNumber(result?._tier1Amount.toString() / activeIfo.decimal ?? 18),
        tier2Amount: formatNumber(result?._tier2Amount.toString() / activeIfo.decimal ?? 18),
        minimumRequirementTier2: result?._minimumRequirementForTier2.toString(),
        tier1Percent: result._tier1Percentage.toString(),
        tier2Percent: result?._tier2Percentage.toString(),
        launchShare: result?._launchPercentShare.toString(),
      }
      setDetails(format)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchClaimedStatus = async () => {
    const result = await getClaimedStatus()
    setHasClaimed(result)
  }

  // changes this to 8
  // parse deposit to 8 too
  const fetchAmountRaised = async () => {
    try {
      const result: any = await getAmountRaised()
      const format = ethers.utils.formatEther(result?.toString())
      setAmountRaised(format)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUserCommit = async () => {
    try {
      const result: any = await getUserCommitBalance()
      setBalance(result?.toString())
    } catch (error) {
      console.log(error)
    }
  }

  const fetchBlockDetails = async () => {
    const result = await fetchBlock()
    const format = {
      startBlock: result ? Number(result?.startBlock) : 0,
      endBlock: result ? Number(result?.endBlock) : 0,
    }
    setBlock(format)
  }

  const requirement = balance < detail?.minimumRequirementTier2
  const tier = requirement ? detail?.tier1Amount : detail?.tier2Amount
  const tierTitle = requirement ? 'Tier1' : 'Tier2'
  const tierPercent = requirement ? detail?.tier1Percent : detail?.tier2Percent

  const amountChangeHandler = (event) => {
    setAmount(() => {
      return event.target.value ? event.target.value : 0
    })
  }

  const currentBlock = useCurrentBlock()
  const status = getStatus(currentBlock, block?.startBlock, block?.endBlock)

  const depositToPool = async () => {
    const parsed = amount.toString()
    if (!!amount === false) {
      toastError('value cannot be empty')
      return
    }
    setDepositing(true)
    try {
      await depositBnb(
        {
          value: ethers.utils.parseEther(parsed),
          gasLimit: '500000',
        },
        async (res) => {
          console.log(res)
          if (!res.hash) {
            toastError(res.message)
          }
          await res.wait()
          setDepositing(false)
          fetchData()
          toastSuccess(`You have successfully deposited ${amount}`)
        },
      )
    } catch (error: any) {
      setDepositing(false)
      toastError(error.message)
    }
  }

  async function fetchData() {
    await Promise.all([
      fetchLaunchPad(),
      fetchUserCommit(),
      fetchAmountRaised(),
      fetchBlockDetails(),
      fetchClaimedStatus(),
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [account])

  const claimOfferingToken = async () => {
    setClaiming(true)
    try {
      const res: any = await claimToken()
      if (!res?.hash) toastError(res?.message)
      await res?.wait()
      setClaiming(false)
      toastSuccess('You have successfully claimed!')
    } catch (error: any) {
      setClaiming(false)
      toastError(error.data.message)
    }
  }

  return (
    <>
      {/* {/* <StyledCardBody> */}
      <StyledCard style={{ width: '100%' }}>
        {loading ? <SkeletonCardDetails /> : <></>}

        {loading === false ? (
          <CardBody>
            <Text textAlign="center" fontSize="20px" fontWeight={800}>{`Status: ${status}`}</Text>
            {showtier ? (
              <Flex justifyContent="space-between" alignItems="center" marginY="1rem">
                <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                  Tier Percentage
                </Text>

                <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                  {`${tierPercent ?? 0} %`}
                </Text>
              </Flex>
            ) : null}

            <Flex justifyContent="space-between" alignItems="center" marginY="1rem">
              <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                Offering Amount
              </Text>

              <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                {`${formatNumber(ifo.offeringAmount)} ${ifo.symbol}`}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" marginY="1rem">
              <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                Funds to raise
              </Text>

              <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                {`${ifo.fundsToRaise}`}
              </Text>
            </Flex>
            {showtier ? (
              <Flex justifyContent="space-between" alignItems="center" marginY="1rem">
                <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                  Raised Amount
                </Text>
                {/* {JSON.stringify(activeIfo)} */}
                <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                  {`${amountRaised ?? 0} Bnb`}
                </Text>
              </Flex>
            ) : null}

            {showtier ? (
              <Flex justifyContent="space-between" alignItems="center" marginY="1rem">
                <Text fontSize={isMobile ? `13px` : '20px'} lineHeight={1}>
                  {tierTitle}
                </Text>

                <Text fontSize={isMobile ? `10px` : '20px'} lineHeight={1}>
                  {`${tier ?? 0} ${ifo.symbol}`}
                </Text>
              </Flex>
            ) : null}
            {!active ? (
              <ConnectWalletButton width="100%" />
            ) : (
              <>
                {status === 'finished' ? null : (
                  <Input onChange={amountChangeHandler} type="number" style={{ marginTop: '2rem' }} />
                )}
                {status === 'idle' && (
                  <Button width="100%" marginY="1rem">
                    LaunchPad will start soon
                  </Button>
                )}
                {status === 'live' && (
                  <Button
                    disabled={depositing === true || +balance <= 0}
                    onClick={depositToPool}
                    width="100%"
                    marginY="1rem"
                  >
                    {+balance <= 0 ? 'Commit wkd first' : depositing ? 'Depositing' : 'Deposit'}
                  </Button>
                )}
                {status === 'finished' && (
                  <Button
                    width="100%"
                    disabled={claiming === true || hasClaimed}
                    onClick={claimOfferingToken}
                    marginY="1rem"
                  >
                    {hasClaimed ? "You've Claimed" : 'Claim Reward'}
                  </Button>
                )}
              </>
            )}
          </CardBody>
        ) : null}
      </StyledCard>

      {/* <CardsWrapper
          shouldReverse={ifo.version >= 3.1}
          singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}
        >
          {publicIfoData.poolBasic && walletIfoData.poolBasic && (
            <IfoPoolCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              onApprove={handleApprove}
              enableStatus={enableStatus}
            />
          )}
          <IfoPoolCard
            poolId={PoolIds.poolUnlimited}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            onApprove={handleApprove}
            enableStatus={enableStatus}
          />
        </CardsWrapper> */}
      {/* </StyledCardBody>  */}
    </>
  )
}

export default IfoFoldableCard
