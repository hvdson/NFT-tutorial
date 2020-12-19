const Colour = artifacts.require("Colour");

module.exports = function(deployer) {
  deployer.deploy(Colour);
};

