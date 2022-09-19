import { BigNumber, ethers } from 'ethers'

export const toWei = (value: number) =>
  ethers.utils.parseEther(value.toString())

export const fromWei = (value: BigNumber) => ethers.utils.formatEther(value)
