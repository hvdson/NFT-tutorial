/* eslint-disable no-undef */
const Colour = artifacts.require("./Colour.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("colour", (accounts) => {
  let contract;

  describe("deployment", async() => {
    it("deploys successfully", async () => {
      contract = await Colour.deployed()
      const address = contract.address;
      console.log(address);
      assert.notEqual(address, "");
    })
  })
})