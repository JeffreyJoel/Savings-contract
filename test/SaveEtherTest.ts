import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveEther", function () {
  async function deploySaveEtherFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const SaveEther = await ethers.getContractFactory("SaveEther");
    const saveEther = await SaveEther.deploy();

    return { saveEther, owner };
  }

  describe("saveEther", function () {
    it("Should check the account being deposited to and the value being deposited", async function () {
      const { saveEther, owner } = await loadFixture(deploySaveEtherFixture);
      const deposit = await saveEther.deposit({ value: 1000000000 });

      expect(owner.address).is.not.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(deposit.value).is.not.equal(0);
    });


  });
  // })
});
