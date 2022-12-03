import { useWeb3React } from '@web3-react/core'
import { useLaunchPadContract } from 'hooks/useContract'
import React, { useEffect, useState, useCallback } from 'react'
import { multicallv2 } from 'utils/multicall'
import { useWkdCommit } from 'views/Pools/hooks/useWkdCommit'
import bsc from '../../../config/constants/launchPad'
import launchpadabi from '../../../config/abi/launchpad.json'

export const useLaunchPad = () => {
  const { active, account } = useWeb3React()
  const contract = useLaunchPadContract(bsc.test[56])
  const { getUserCommitBalance } = useWkdCommit()
  // const [balance, setBalance] = useState(0)
  // console.log(contract)
  //   useEffect(() =>{
  // fetchUserCommit()
  //   },[active,account])

  // const fetchUserCommit = async() =>{
  //   const result:any = await getUserCommitBalance()
  //   setBalance(result.toString())
  // }

  // console.log('balance', balance)

  const getIfoInfo = async () => {
    const info = await contract.getLaunchPadInfo()
    return info
  }

  const getAmountRaised = async () => {
    const info = await contract.raisedAmount()
    return info
  }

  const depositBnb = async (amount, callback) => {
    if (!active) return
    await contract.deposit(amount).then(callback)
  }

  const claimToken = async () => {
    if (!active) return
    await contract.claimToken()
    // try {
    // } catch (error) {
    //   throw error
    // }
  }

  const getClaimedStatus = async () => {
    const result = await contract.hasClaimed(account)
    return result
  }

  const address = bsc.test[56]
  const fetchBlock = async () => {
    const [startBlock, endBlock] = await multicallv2(
      launchpadabi,
      [
        {
          address,
          name: 'StartBlock',
        },
        {
          address,
          name: 'EndBlock',
        },
      ].filter(Boolean),
    )
    return {
      startBlock,
      endBlock,
    }
  }

  return {
    contract,
    getIfoInfo,
    depositBnb,
    getAmountRaised,
    fetchBlock,
    claimToken,
    getClaimedStatus,
  }
}
