pragma solidity ^0.6.2;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Colour is ERC721 {
  string[] public colours;
  mapping(string => bool) _colourExists;

  constructor() ERC721("Colour", "COLOUR") public {
  }

// todo: restrict functionality to just owner/mintor
// is public right now

  // E.G colour == "#FFFFFF"
  function mint(string memory _colour) public {
    // Require unique colour
    // .push no longer returns length! version ^0.6.0
    colours.push(_colour);
    // todo: is this redundant?
    uint _id = getLengthColours();
    _safeMint(msg.sender, _id);
    _colourExists[_colour] = true;
  }

  function getLengthColours() public view returns(uint) {
    return colours.length;
  }
}