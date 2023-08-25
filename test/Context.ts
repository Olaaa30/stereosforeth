// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { it } from "mocha";

// describe("Context", function () {
//   const deployContext = async () => {
//     //grab accounts for testing
//     const [deployer, otherAccount] = await ethers.getSigners();

//     const Context = await ethers.getContractFactory("Context");
//     const context = await Context.deploy();

//     return { context, deployer, otherAccount };
//   };

//   describe("contract functions", () => {
//     it("should return deployer as _msgsender", async () => {
//         const {context, deployer} = await deployContext();
//         const functionCaller = await context._msgSender();

//         expect(deployer.toString()).to.equal(functionCaller.toString());
//     });
//   });
// });
