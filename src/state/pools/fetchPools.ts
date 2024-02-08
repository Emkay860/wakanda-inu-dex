import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import wkdPoolABI from 'config/abi/wkdPool.json'
import poolsConfig from 'config/constants/pools'
import { getAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)

const startEndBlockCalls = poolsWithEnd.flatMap((poolConfig) => {
  return [
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    },
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    },
  ]
})

export const fetchPoolsBlockLimits = async () => {
  const startEndBlockRaw = await multicall(wkdPoolABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const [[startBlock], [endBlock]] = startEndBlockResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: startBlock.toNumber(),
      endBlock: endBlock.toNumber(),
    }
  })
}

const poolsBalanceOf = poolsConfig.map((poolConfig) => {
  return {
    address: poolConfig.stakingToken.address,
    name: 'balanceOf',
    params: [getAddress(poolConfig.contractAddress)],
  }
})

const availableRewards = poolsConfig.map((poolConfig) => {
  return {
    address: getAddress(poolConfig.contractAddress),
    name: 'availableRewards',
    params: [],
  }
})

export const fetchPoolsTotalStaking = async () => {
  const balances = await multicall(erc20ABI, poolsBalanceOf)
  const rewards = await multicall(wkdPoolABI, availableRewards)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    // the first pool is having the stakingtoken and earning token as wkd, this is a workaround to ensure we dont don't add the tokens in the contract for reward to the total staked
    totalStaked:
      p.stakingToken.address.toLowerCase() === p.earningToken.address.toLowerCase()
        ? new BigNumber(balances[index]).minus(new BigNumber(rewards[index])).toJSON()
        : new BigNumber(balances[index]).toJSON(),
  }))
}
