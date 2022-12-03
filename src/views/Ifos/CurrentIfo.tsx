import { useEffect, useMemo, useState } from 'react'
// import useGetPublicIfoV3Data from 'views/Ifos/hooks/v3/useGetPublicIfoData'
// import useGetWalletIfoV3Data from 'views/Ifos/hooks/v3/useGetWalletIfoData'

import { Ifo } from 'config/constants/types'

import { useCurrentBlock } from 'state/block/hooks'
import { useWeb3React } from '@web3-react/core'
import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoContainer from './components/IfoContainer'
import IfoSteps from './components/IfoSteps'
import { useLaunchPad } from './hooks/useLaunchPad'
import { getStatus } from './hooks/helpers'

interface TypeProps {
  activeIfo: Ifo
}

const CurrentIfo: React.FC<TypeProps> = ({ activeIfo }) => {
  const { active, account } = useWeb3React()
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
  }, [active, account])
  const currentBlock = useCurrentBlock()
  const status = getStatus(currentBlock, block?.startBlock, block?.endBlock)

  return (
    <IfoContainer ifoSection={<IfoCurrentCard ifo={activeIfo} />} ifoSteps={<IfoSteps isLive={status === 'live'} />} />
  )
}

export default CurrentIfo
