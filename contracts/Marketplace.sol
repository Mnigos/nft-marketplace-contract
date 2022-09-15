// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
  address payable public immutable chairPerson;
  uint256 public immutable feePercent;
  uint256 public itemCount;

  struct Item {
    uint256 id;
    uint256 tokenId;
    IERC721 nft;
    uint256 price;
    bool sold;
    address payable seller;
  }

  mapping(uint256 => Item) public items;

  event Offered(
    uint256 id,
    uint256 tokenId,
    uint256 price,
    IERC721 indexed nft,
    address indexed seller
  );
  event Bought(
    uint256 id,
    uint256 tokenId,
    uint256 price,
    IERC721 indexed nft,
    address indexed seller,
    address indexed buyer
  );

  constructor(uint256 _feePercent) {
    chairPerson = payable(msg.sender);
    feePercent = _feePercent;
  }

  function createOffer(
    IERC721 _nft,
    uint256 _tokenId,
    uint256 _price
  ) external nonReentrant {
    require(_price > 0, "Price must be greater than 0");
    require(
      _nft.ownerOf(_tokenId) == msg.sender,
      "You are not the owner of this NFT"
    );
    require(
      _nft.getApproved(_tokenId) == address(this),
      "You must approve this contract to sell this NFT"
    );

    _nft.transferFrom(msg.sender, address(this), _tokenId);

    itemCount++;
    items[itemCount] = Item(
      itemCount,
      _tokenId,
      _nft,
      _price,
      false,
      payable(msg.sender)
    );

    emit Offered(itemCount, _tokenId, _price, _nft, msg.sender);
  }

  function purchaseItem(uint256 _id) external payable nonReentrant {
    uint256 totalPrice = getTotalPrice(_id);
    Item storage item = items[_id];

    require(item.id > 0 && item.id <= itemCount, "Item does not exist");
    require(item.sold == false, "Item is already sold");
    require(item.price == msg.value, "Price is not correct");

    payable(item.seller).transfer(item.price);
    chairPerson.transfer(totalPrice - item.price);

    item.sold = true;

    item.nft.transferFrom(address(this), msg.sender, item.tokenId);

    emit Bought(
      _id,
      item.tokenId,
      item.price,
      item.nft,
      item.seller,
      msg.sender
    );
  }

  function getTotalPrice(uint256 _itemId)
    public
    view
    returns (uint256 totalPrice)
  {
    totalPrice = ((items[_itemId].price * (100 + feePercent)) / 100);
  }
}
