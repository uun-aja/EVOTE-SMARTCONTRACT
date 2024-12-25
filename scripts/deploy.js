const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const Create = await hre.ethers.getContractFactory("Create");
    const create = await Create.deploy();

    await create.deployed();
    console.log("Kontrak berhasil dideploy di alamat:", create.address);

    // Path ke file constant.js
    const constantsPath = path.join(__dirname, "../context/constant.js");

    // Perbarui file constant.js
    const content = `
import voting from "../artifacts/contracts/VotingContracts.sol/Create.json";

export const VotingAddrss = "${create.address}";
export const VotingAddressABI = voting.abi;
    `;
    fs.writeFileSync(constantsPath, content, "utf8");

    console.log("File constant.js berhasil diperbarui dengan alamat kontrak.");
}

main().catch((error) => {
    console.error("Error saat deploy:", error);
    process.exitCode = 1;
});
