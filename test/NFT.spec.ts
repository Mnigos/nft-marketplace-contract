import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'

describe('NFT', () => {
  const URI = 'sample URI'

  let NFT: Contract
  let singers: SignerWithAddress[]

  beforeEach(async () => {
    const NFTFactory = await ethers.getContractFactory('NFT')
    ;[, ...singers] = await ethers.getSigners()
    NFT = await NFTFactory.deploy()
  })

  describe('Deployment', () => {
    it('Should track name and symbol of the nft collection', async () => {
      const nftName = 'DApp NFT'
      const nftSymbol = 'DAPP'
      expect(await NFT.name()).to.equal(nftName)
      expect(await NFT.symbol()).to.equal(nftSymbol)
    })
  })

  describe('Minting', () => {
    it('Should track each minted NFT', async function () {
      const firstSinger = singers[0]
      const secondSinger = singers[1]

      await NFT.connect(firstSinger).mint(URI)
      expect(await NFT.tokenCount()).to.equal(1)
      expect(await NFT.balanceOf(firstSinger.address)).to.equal(1)
      expect(await NFT.tokenURI(1)).to.equal(URI)

      await NFT.connect(secondSinger).mint(URI)
      expect(await NFT.tokenCount()).to.equal(2)
      expect(await NFT.balanceOf(secondSinger.address)).to.equal(1)
      expect(await NFT.tokenURI(2)).to.equal(URI)
    })
  })
})
