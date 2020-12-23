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

  describe("minting", async () => {
    
    it("creates a new token", async () => {
      const result = await contract.mint("#FFFFFF")
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply, 1);
      console.log(result.logs);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, "id is correct");
      assert.equal(event.from, "0x0000000000000000000000000000000000000000", "from is correct");
      assert.equal(event.to, accounts[0], "to is correct"); 
      assert.equal(result.logs[0].event, "Transfer", "is a transfer event"); 

      //Failure
      await contract.mint("#FFFFFF").should.be.rejected;
    })
  })

  describe("indexing", async () => {
    it("lists colours", async () => {
      // mint 3 tokens
      await contract.mint("#111111")
      await contract.mint("#5386E4")
      await contract.mint("#000000")
      const totalSupply = await contract.totalSupply();
      let colour;
      let result = [];
      for (let i = 0; i < totalSupply; i++) {
        colour = await contract.colours(i);
        result.push(colour);
      }
      let expected =  ["#FFFFFF","#111111", "#5386E4", "#000000"]
      assert.equal(result.join(','), expected.join(','));
    })
  })
})