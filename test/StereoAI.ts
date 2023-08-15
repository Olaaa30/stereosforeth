import {
  time,
  loadFixture,
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
        const deployTime = await time.latest();

        [deployer, otherAddress] = await ethers.getSigners();

        const StereoAI = await ethers.getContractFactory("StereoAI");
        const stereoAI = await StereoAI.deploy();

        return { stereoAI, deployer, otherAddress };
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
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = maxSupply / divider;
          const stereoAIBalance: bigint =
            await stereoAI.getCurrentTotalSupply();
          expect(stereoAIBalance).to.equal(halfOfTotalSupply);
        });
        it("should mint half of the max supply to the deployer", async () => {
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = (maxSupply / divider) * decimals;
          const deployerBalance = await stereoAI.balanceOf(deployer.address);
          expect(deployerBalance).to.equal(halfOfTotalSupply);
        });
      });
      describe("Contract Functions", function () {
        it("mintAfterOneWeek - should revert when the rest of the tokens are minted too early", async () => {
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          await expect(stereoAI.mintAfterOneWeek()).to.be.revertedWith(
            "Minting too early, It hasn't been a week since launch"
          );
        });
        it("mintAfterFourWeeks - should revert when the rest of the tokens are minted too early", async () => {
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          await expect(stereoAI.mintAfterFourWeeks()).to.be.revertedWith(
            "Minting too early, It hasn't been four weeks since launch"
          );
        });
        it("mintAfterTenSeconds",async () => {
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          const decimals: bigint = BigInt(1e18);
          const expectedBalance : bigint = BigInt(750000000) * decimals;
          await stereoAI.mintAfterTenSeconds();
          // const deployerBalance = await ;
          expect(await stereoAI.balanceOf(deployer.address)).to.equal(expectedBalance);
        })
      });
      describe("Transactions", () => {
        it("should tranfer tokens between accounts", async () => {
          const { stereoAI, deployer, otherAddress } = await loadFixture(
            deployStereoAIFixture
          );
          // Transfer 50 tokens from deployer to otherAddress
          const decimals: bigint = BigInt(1e18);
          const amount: bigint = BigInt(50);
          await expect(
            stereoAI.transfer(otherAddress.address, amount)
          ).to.changeTokenBalances(
            stereoAI,
            [deployer, otherAddress],
            [-amount, amount]
          );

          // Transfer 50 tokens from otherAddress to deployer
          // We use .connect(signer) to send a transaction from another account
          await expect(
            (stereoAI.connect(otherAddress) as StereoAI).transfer(deployer.address, amount)
          ).to.changeTokenBalances(
            stereoAI,
            [otherAddress, deployer],
            [-amount, amount]
          );
        });
      });
    });
