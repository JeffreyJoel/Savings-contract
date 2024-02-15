import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveEther", function () {
  async function deploySaveEtherFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SaveEther = await ethers.getContractFactory("SaveEther");
    const saveEther = await SaveEther.deploy();

    return { saveEther, owner, otherAccount };
  }

  describe("depositEther", function () {
    it("Should check the account being deposited to and the value being deposited", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const deposit = await saveEther.deposit({ value: 1000000000 });

      expect(owner.address).is.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(deposit.value).is.not.equal(0);
    });

    it("Should check if the savings of the depositor is added", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const deposit = await saveEther.deposit({ value: 1000000000 });

      expect(await saveEther.checkSavings(deposit.from)).to.equal(1000000000);
    });
    it("Should check if the savings of the depositor is updated", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const userBalance = saveEther.getDepositorBalance();
      const firstDeposit = await saveEther.deposit({ value: 2000000000 });
      const secondDeposit = await saveEther.deposit({ value: 1000000000 });
      expect(await saveEther.getDepositorBalance()).to.equal(
        firstDeposit.value + secondDeposit.value
      );
    });
  });

  describe("withdrawEther", function () {
    it("Should check that the account being withdrawn to is not an invalid account", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      expect(owner.address).is.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should check that withdrawer's balance is not zero", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const deposit = await saveEther.deposit({ value: 1000000000 });
      expect(await saveEther.getDepositorBalance()).is.not.equal(0);
    });

    it("Should check that withdrawal is working", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const deposit = await saveEther.deposit({ value: 1000000000 });

      await saveEther.withdraw();

      expect(await saveEther.getDepositorBalance()).to.equal(0);
    });
  });

  describe("sendSavings", function () {
    
    it("Should check that the account of the sender is not an invalid account", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      expect(owner.address).is.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should check that amount to be sent is not zero", async function () {
      const { saveEther, otherAccount } = await loadFixture(deploySaveEtherFixture);
      const send = await saveEther.sendOutSaving(otherAccount.address, 0);
      await expect(saveEther.sendOutSaving(otherAccount.address, 0)).to.be.revertedWith(
        "can't send zero value"
      );
    });

    it("Should check that sending is working", async function () {
      const { saveEther, otherAccount } = await loadFixture(
        deploySaveEtherFixture
      );
      const depositAmount = ethers.parseEther("2.0");
      await saveEther.deposit({ value: depositAmount });

      // const txSenderBal = await saveEther.checkSavings(owner.address);

      // expect(txSenderBal).to.be.equal(depositAmount);

      const sentAmount = ethers.parseEther("1.0");

      await saveEther.sendOutSaving(otherAccount, sentAmount);

      const senderBal = await saveEther.getDepositorBalance();

      const remainingBalance = depositAmount - sentAmount;

      expect(senderBal).to.be.equal(remainingBalance);
    });
  });
  // })
});
