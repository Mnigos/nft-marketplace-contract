import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerBalance = await deployer.getBalance()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', deployerBalance.toString())

  const NFT = await ethers.getContractFactory('NFT')
  const Marketplace = await ethers.getContractFactory('Marketplace')

  await Marketplace.deploy(1)
  await NFT.deploy()
}

try {
  main()
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
