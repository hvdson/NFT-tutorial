pragma solidity ^0.6.2;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Colour is ERC721 {
  constructor() ERC721("Colour", "COLOUR") public {

  }
}