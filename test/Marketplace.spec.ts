import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'hardhat'

import { fromWei, toWei } from '../utils'

describe('Marketplace', () => {
  const URI = 'sample URI'
  const feePercent = 1

  let NFT: Contract
  let Marketplace: Contract
  let deployer: SignerWithAddress
  let singers: SignerWithAddress[]

  beforeEach(async () => {
    const NFTFactory = await ethers.getContractFactory('NFT')
    const MarketplaceFactory = await ethers.getContractFactory('Marketplace')

    ;[deployer, ...singers] = await ethers.getSigners()
    NFT = await NFTFactory.deploy()
    Marketplace = await MarketplaceFactory.deploy(feePercent)
  })

  describe('Deployment', () => {
    it('Should track name and symbol of the nft collection', async () => {
      const nftName = 'DApp NFT'
      const nftSymbol = 'DAPP'

      expect(await NFT.name()).to.equal(nftName)
      expect(await NFT.symbol()).to.equal(nftSymbol)
    })

    it('Should track feeAccount and feePercent of the marketplace', async () => {
      expect(await Marketplace.chairPerson()).to.equal(deployer.address)
      expect(await Marketplace.feePercent()).to.equal(feePercent)
    })
  })

  describe('Creating marketplace items', () => {
    const price = 1
    let firstSinger: SignerWithAddress

    beforeEach(async () => {
      firstSinger = singers[0]

      await NFT.connect(firstSinger).mint(URI)
      await NFT.connect(firstSinger).setApprovalForAll(
        Marketplace.address,
        true
      )
    })

    it('Should track newly created item, transfer NFT from seller to marketplace and emit Offered event', async () => {
      await expect(
        Marketplace.connect(firstSinger).createOffer(
          NFT.address,
          1,
          toWei(price)
        )
      )
        .to.emit(Marketplace, 'Offered')
        .withArgs(1, 1, toWei(price), NFT.address, firstSinger.address)

      expect(await NFT.ownerOf(1)).to.equal(Marketplace.address)
      expect(await Marketplace.itemCount()).to.equal(1)

      const item = await Marketplace.items(1)

      expect(item.id).to.equal(1)
      expect(item.nft).to.equal(NFT.address)
      expect(item.tokenId).to.equal(1)
      expect(item.price).to.equal(toWei(price))
      expect(item.sold).to.equal(false)
    })

    it('Should fail if price is set to zero', async () => {
      await expect(
        Marketplace.connect(firstSinger).createOffer(NFT.address, 1, 0)
      ).to.be.revertedWith('Price must be greater than 0')
    })
  })

  describe('Purchasing marketplace items', () => {
    const price = 2
    const fee = (feePercent / 100) * price

    let totalPriceInWei: BigNumber
    let firstSinger: SignerWithAddress
    let secondSinger: SignerWithAddress

    beforeEach(async () => {
      firstSinger = singers[0]
      secondSinger = singers[1]

      await NFT.connect(firstSinger).mint(URI)
      await NFT.connect(firstSinger).setApprovalForAll(
        Marketplace.address,
        true
      )
      await Marketplace.connect(firstSinger).createOffer(
        NFT.address,
        1,
        toWei(price)
      )
    })

    it('Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event', async () => {
      const sellerInitalEthBal = await firstSinger.getBalance()
      const feeAccountInitialEthBal = await deployer.getBalance()

      totalPriceInWei = await Marketplace.getTotalPrice(1)

      await expect(
        Marketplace.connect(secondSinger).purchaseItem(1, {
          value: totalPriceInWei,
        })
      )
        .to.emit(Marketplace, 'Bought')
        .withArgs(
          1,
          1,
          toWei(price),
          NFT.address,
          firstSinger.address,
          secondSinger.address
        )

      const sellerFinalEthBal = await firstSinger.getBalance()
      const feeAccountFinalEthBal = await deployer.getBalance()
      const firstItem = await Marketplace.items(1)

      expect(firstItem.sold).to.equal(true)

      expect(+fromWei(sellerFinalEthBal)).to.equal(
        +price + +fromWei(sellerInitalEthBal)
      )

      expect(+fromWei(feeAccountFinalEthBal)).to.equal(
        +fee + +fromWei(feeAccountInitialEthBal)
      )

      expect(await NFT.ownerOf(1)).to.equal(secondSinger.address)
    })
  })
})
