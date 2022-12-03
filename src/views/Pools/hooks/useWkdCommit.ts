import { bscTestnetTokens } from 'config/constants/tokens'
import { useERC20, useTokenContract, useWkdCommitContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { getWkdCommitContract } from 'utils/contractHelpers'
import { useWeb3React } from '@web3-react/core'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useHasPendingApproval, useTransactionAdder } from 'state/transactions/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { Signer } from 'ethers'
import bsc from '../../../config/constants/contracts'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export const useWkdCommit = () => {
  const contract = useWkdCommitContract(bsc.wkdCommit[56])
  const { account, active } = useWeb3React()
  // let token = useERC20(bscTestnetTokens.wkd2.address)
  const commit = useCallback(
    async (amount, callback) => {
      try {
        await contract.commitWkd(amount).then(callback)
      } catch (error) {
        console.log(error)
      }
    },
    [account, active],
  )

  // To fetch user commit balance to know which pool they can participate in
  const getUserCommitBalance = useCallback(async () => {
    const user = await contract.getUserCommit(account)
    return [user]
  }, [active, account])

  const removeWkd = useCallback(async () => {
    try {
      await contract.removeWkd()
    } catch (error) {
      console.log(error)
      // throw error
    }
  }, [account, active])

  // const getAllowance = useCallback(async (spender = bsc.wkdCommit[97]) => {
  //   try {
  //     const allowance = await token.allowance(account, spender)
  //     return allowance
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [])

  // const approve = async (spender = bsc.wkdCommit[97], amount, callback) => {
  //   if (!active) throw Error('you are not connected!')
  //   try {
  //     await token
  //       .approve(spender, amount)
  //       .then((hash) => callback(hash))
  //       .catch((error) => callback(error))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return {
    commit,
    contract,
    getUserCommitBalance,
    removeWkd,
    // getAllowance,
    // approve,
  }
}
