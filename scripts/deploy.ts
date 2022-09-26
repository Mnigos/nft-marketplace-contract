import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerBalance = await deployer.getBalance()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', deployerBalance.toString())

  const NFTFactory = await ethers.getContractFactory('NFT')
  const MarketplaceFactory = await ethers.getContractFactory('Marketplace')

  console.log(`Deploying NFT contract...`)

  const Marketplace = await MarketplaceFactory.deploy(1)
  const NFT = await NFTFactory.deploy()

  console.log('NFT contract deployed to:', NFT.address)
  console.log('Marketplace contract deployed to:', Marketplace.address)
}

try {
  main()
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
