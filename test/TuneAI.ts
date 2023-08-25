import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { developmentChains } from "../helper-hardhat-config";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { it } from "mocha";
import { TuneAI } from "../typechain-types/contracts/TuneAI";

// * if the newwork will be hardhat or localhost then these tests will be run.

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("tuneAI Contract - Unit tests", () => {
      let deployer, otherAddress;
      let maxSupply: bigint = 1000000000n;
      let tuneAI: TuneAI;
      // const ONE_WEEK_IN_SECS: bigint = BigInt(60 * 60 * 24 * 7);

      async function deploytuneAIFixture() {
        const deployTime = await time.latest();

        [deployer, otherAddress] = await ethers.getSigners();

        const TuneAI = await ethers.getContractFactory("TuneAI");
        const tuneAI = await TuneAI.deploy();

        return { tuneAI, deployer, otherAddress };
      }
      // beforeEach(async () => {
      //   if (!developmentChains.includes(network.name)) {
      //     throw new Error("You need to be on a development chain to run tests");
      //   }
      //   [deployer, otherAddress] = await ethers.getSigners();
      //   const tuneAI = await ethers.getContractFactory("tuneAI");
      //   const tuneAI = await tuneAI.deploy();
      //   // tuneAI.waitForDeployment();
      //   // const addr = tuneAI.getAddress()
      // });

      // afterEach(() => {
      //   deployer = null;
      // });
      describe("Deployment", function () {
        it("should mint half of the max supply", async () => {
          const { tuneAI, deployer, otherAddress } = await loadFixture(
            deploytuneAIFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = maxSupply / divider;
          const tuneAIBalance: bigint =
            await tuneAI.getCurrentTotalSupply();
          expect(tuneAIBalance).to.equal(halfOfTotalSupply);
        });
        it("should mint half of the max supply to the deployer", async () => {
          const { tuneAI, deployer, otherAddress } = await loadFixture(
            deploytuneAIFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = (maxSupply / divider) * decimals;
          const deployerBalance = await tuneAI.balanceOf(deployer.address);
          expect(deployerBalance).to.equal(halfOfTotalSupply);
        });
      });
      describe("Contract Functions", function () {
        it("mintAfterOneWeek - should revert when the rest of the tokens are minted too early", async () => {
          const { tuneAI, deployer, otherAddress } = await loadFixture(
            deploytuneAIFixture
          );
          await expect(tuneAI.mintAfterOneWeek()).to.be.revertedWith(
            "Minting too early, It hasn't been a week since launch"
          );
        });
        it("mintAfterFourWeeks - should revert when the rest of the tokens are minted too early", async () => {
          const { tuneAI, deployer, otherAddress } = await loadFixture(
            deploytuneAIFixture
          );
          await expect(tuneAI.mintAfterFourWeeks()).to.be.revertedWith(
            "Minting too early, It hasn't been four weeks since launch"
          );
        });
        // it("mintAfterTenSeconds",async () => {
        //   const { tuneAI, deployer, otherAddress } = await loadFixture(
        //     deploytuneAIFixture
        //   );
        //   const decimals: bigint = BigInt(1e18);
        //   const expectedBalance : bigint = BigInt(750000000) * decimals;
        //   await tuneAI.mintAfterTenSeconds();
        //   // const deployerBalance = await ;
        //   expect(await tuneAI.balanceOf(deployer.address)).to.equal(expectedBalance);
        // })
      });
      describe("Transactions", () => {
        it("should tranfer tokens between accounts", async () => {
          const { tuneAI, deployer, otherAddress } = await loadFixture(
            deploytuneAIFixture
          );
          // Transfer 50 tokens from deployer to otherAddress
          const decimals: bigint = BigInt(1e18);
          const amount: bigint = BigInt(50);
          await expect(
            tuneAI.transfer(otherAddress.address, amount)
          ).to.changeTokenBalances(
            tuneAI,
            [deployer, otherAddress],
            [-amount, amount]
          );

          // Transfer 50 tokens from otherAddress to deployer
          // We use .connect(signer) to send a transaction from another account
          await expect(
            (tuneAI.connect(otherAddress) as TuneAI).transfer(deployer.address, amount)
          ).to.changeTokenBalances(
            tuneAI,
            [otherAddress, deployer],
            [-amount, amount]
          );
        });
      });
    });
