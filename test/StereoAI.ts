import {
  time,
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { developmentChains } from "../helper-hardhat-config";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { it } from "mocha";
import { StereoAI } from "../typechain-types/contracts/StereoAI";

// * if the newwork will be hardhat or localhost then these tests will be run.

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("StereoAI Contract - Unit tests", () => {
      let deployer, otherAddress;
      let maxSupply: bigint = 1000000000n;
      let stereoAI: StereoAI;
      const ONE_WEEK_IN_SECS: bigint = BigInt(60 * 60 * 24 * 7);


      async function deployStereoAIFixture() {
        const deployTime = (await time.latest());

        [deployer, otherAddress] = await ethers.getSigners();

        const StereoAI = await ethers.getContractFactory("StereoAI");
        const stereoAI = await StereoAI.deploy();

        return { stereoAI, deployer, otherAddress}
      }
      // beforeEach(async () => {
      //   if (!developmentChains.includes(network.name)) {
      //     throw new Error("You need to be on a development chain to run tests");
      //   }
      //   [deployer, otherAddress] = await ethers.getSigners();
      //   const StereoAI = await ethers.getContractFactory("StereoAI");
      //   const stereoAI = await StereoAI.deploy();
      //   // stereoAI.waitForDeployment();
      //   // const addr = stereoAI.getAddress()
      // });

      // afterEach(() => {
      //   deployer = null;
      // });
      describe("Deployment", function () {
        it("should mint half of the max supply", async () => {
          const { stereoAI, deployer, otherAddress} = await loadFixture(deployStereoAIFixture);
          const divider: bigint = 2n;
          const halfOfTotalSupply: bigint = maxSupply / divider;
          const deployerBalance = await stereoAI.balanceOf(deployer.address);
          const stereoAIBalance: bigint = await stereoAI.getCurrentTotalSupply();
          expect(deployerBalance).to.equal(halfOfTotalSupply);
        });
      });
    });
