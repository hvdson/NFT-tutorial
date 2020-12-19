/* eslint-disable no-undef */
const Colour = artifacts.require("./Colour.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("colour", (accounts) => {
  let contract;

  before(async () => {
    contract = await Colour.deployed();
  })

  describe("deployment", async() => {
    it("deploys successfully", async () => {   
      const address = await contract.address;
      console.log(address);
      assert.notEqual(address, "");
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })
    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "Colour");

    })
    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "COLOUR");
    })
  })
})