require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.0",
    networks: {
        sepolia: {
            url: "https://sepolia.infura.io/v3/804b0813948e4580b599cd173b24a467",
            accounts: ["e449d3eb89bb22244ecf13b420fb98d60725050bb4d819a041b066569f1ebc06"],
        },
        goerli: {
            url: "https://goerli.infura.io/v3/7233f80b5baf477ca670c0b1658700dc",
            accounts: ["e449d3eb89bb22244ecf13b420fb98d60725050bb4d819a041b066569f1ebc06"],
        }
    },
};
