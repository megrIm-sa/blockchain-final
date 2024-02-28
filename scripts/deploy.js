const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const NFTMusic = await ethers.getContractFactory("NFTMusic");

    // Deploy the contract
    const nftMusic = await NFTMusic.deploy();

    // Wait for the contract to be deployed
    await nftMusic.deployed();

    // Print the contract address after deployment
    console.log("NFTMusic deployed to:", nftMusic.address);
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
