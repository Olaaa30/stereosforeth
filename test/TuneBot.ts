import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { developmentChains } from "../helper-hardhat-config";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { it } from "mocha";
import { TuneBot } from "../typechain-types/contracts/";

// * if the newwork will be hardhat or localhost then these tests will be run.

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("tuneBot Contract - Unit tests", () => {
      let deployer, otherAddress;
      let maxSupply: bigint = 1000000000n;
      let tuneBot: tuneBot;
      const ONE_WEEK_IN_SECS: bigint = BigInt(60 * 60 * 24 * 7);

      async function deploytuneBotFixture() {
        const deployTime = await time.latest();

        [deployer, otherAddress] = await ethers.getSigners();

        const tuneBot = await ethers.getContractFactory("tuneBot");
        const tuneBot = await tuneBot.deploy();

        return { tuneBot, deployer, otherAddress };
      }
      // beforeEach(async () => {
      //   if (!developmentChains.includes(network.name)) {
      //     throw new Error("You need to be on a development chain to run tests");
      //   }
      //   [deployer, otherAddress] = await ethers.getSigners();
      //   const tuneBot = await ethers.getContractFactory("tuneBot");
      //   const tuneBot = await tuneBot.deploy();
      //   // tuneBot.waitForDeployment();
      //   // const addr = tuneBot.getAddress()
      // });

      // afterEach(() => {
      //   deployer = null;
      // });
      describe("Deployment", function () {
        it("should mint half of the max supply", async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = maxSupply / divider;
          const tuneBotBalance: bigint =
            await tuneBot.getCurrentTotalSupply();
          expect(tuneBotBalance).to.equal(halfOfTotalSupply);
        });
        it("should mint half of the max supply to the deployer", async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          const divider: bigint = 2n;
          const decimals: bigint = BigInt(1e18);
          const halfOfTotalSupply: bigint = (maxSupply / divider) * decimals;
          const deployerBalance = await tuneBot.balanceOf(deployer.address);
          expect(deployerBalance).to.equal(halfOfTotalSupply);
        });
      });
      describe("Contract Functions", function () {
        it("mintAfterOneWeek - should revert when the rest of the tokens are minted too early", async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          await expect(tuneBot.mintAfterOneWeek()).to.be.revertedWith(
            "Minting too early, It hasn't been a week since launch"
          );
        });
        it("mintAfterFourWeeks - should revert when the rest of the tokens are minted too early", async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          await expect(tuneBot.mintAfterFourWeeks()).to.be.revertedWith(
            "Minting too early, It hasn't been four weeks since launch"
          );
        });
        it("mintAfterTenSeconds",async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          const decimals: bigint = BigInt(1e18);
          const expectedBalance : bigint = BigInt(750000000) * decimals;
          await tuneBot.mintAfterTenSeconds();
          // const deployerBalance = await ;
          expect(await tuneBot.balanceOf(deployer.address)).to.equal(expectedBalance);
        })
      });
      describe("Transactions", () => {
        it("should tranfer tokens between accounts", async () => {
          const { tuneBot, deployer, otherAddress } = await loadFixture(
            deploytuneBotFixture
          );
          // Transfer 50 tokens from deployer to otherAddress
          const decimals: bigint = BigInt(1e18);
          const amount: bigint = BigInt(50);
          await expect(
            tuneBot.transfer(otherAddress.address, amount)
          ).to.changeTokenBalances(
            tuneBot,
            [deployer, otherAddress],
            [-amount, amount]
          );

          // Transfer 50 tokens from otherAddress to deployer
          // We use .connect(signer) to send a transaction from another account
          await expect(
            (tuneBot.connect(otherAddress) as tuneBot).transfer(deployer.address, amount)
          ).to.changeTokenBalances(
            tuneBot,
            [otherAddress, deployer],
            [-amount, amount]
          );
        });
      });
    });
