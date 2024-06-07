async function init() {
    // Modern dapp browsers
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access");
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

init();

const contractAddress = '0x3019E2658C92991F6224a34c6BdED0Ef5818043E'; // Update with your contract address
const contractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_songId",
                "type": "uint256"
            },
            {
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "uploadSong",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_songId",
                "type": "uint256"
            }
        ],
        "name": "listenToSong",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getTotalSongs",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_songId",
                "type": "uint256"
            }
        ],
        "name": "getSongId",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "songOwners",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_songId",
                "type": "uint256"
            }
        ],
        "name": "getOwnerOfSong",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


const web3 = window.web3;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function uploadSong() {
    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];

    if (!file) {
        document.getElementById('result').innerText = "No file selected.";
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZjhmNjk4Ni1iY2IxLTRmNmUtYmJmZi1kNDFmOTYzMWFmYjgiLCJlbWFpbCI6InNodmV0a295YW50b25AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRkNDc4YjZhZjM2YWEwMzEyYTM0Iiwic2NvcGVkS2V5U2VjcmV0IjoiYmI5YmExOWJjOGE3OGQ1MGY3NWY5ODZkNmQ0MGNkNWMzODJjNjQzZmU4N2IwZDQ5Nzk2YTY5MzJhZWQzODM3ZCIsImlhdCI6MTcwOTExMzI2MH0.3KdOzbQznRZyfzh8DBQHH2h2OaulZS5TA7sbu7d7P0E"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to upload file to IPFS.");
        }

        const data = await response.json();
        if (!data || !data.IpfsHash) {
            throw new Error("Failed to retrieve IPFS hash from response.");
        }
        const ipfsHash = data.IpfsHash.toString();

        const songId = prompt("Please enter the song ID:");
        const accounts = await web3.eth.getAccounts();
        await contract.methods.uploadSong(songId, ipfsHash).send({ from: accounts[0] });

        document.getElementById('result').innerText = `Song with ID ${songId} uploaded successfully.`;
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}

async function listenToSong() {
    const songId = prompt("Please enter the song ID:");
    try {
        const accounts = await web3.eth.getAccounts();
        const ipfsHash = await contract.methods.listenToSong(songId).call({ from: accounts[0] });
        document.getElementById('result').innerText = `You listened to the song with ID ${songId}.`;
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = `https://ipfs.io/ipfs/${ipfsHash}`; // Access the audio file from IPFS
        audioPlayer.play();
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}

async function displayAllSongIds() {
    try {
        const songCount = await contract.methods.getTotalSongs().call();
        const songIds = [];
        const songOwners = [];

        for (let i = 1; i <= songCount; i++) {
            const songId = await contract.methods.getSongId(i).call();
            const owner = await contract.methods.getOwnerOfSong(songId).call();
            songIds.push(songId);
            songOwners.push(owner);
        }

        const result = document.getElementById('result');
        result.innerHTML = "<strong>Song IDs and their Owners:</strong><br>";

        for (let i = 0; i < songIds.length; i++) {
            result.innerHTML += `Song ID: ${songIds[i]}, Owner: ${songOwners[i]}<br>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}