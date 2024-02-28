// NFTMusic.test.js
describe("NFTMusic", function () {
    let NFTMusic;
    let nftMusic;

    beforeEach(async function () {
        NFTMusic = await ethers.getContractFactory("NFTMusic");
        nftMusic = await NFTMusic.deploy();
        await nftMusic.deployed();
    });

    it("Should upload a song and retrieve its audio data", async function () {
        const songId = 1;
        const audioData = "Audio data for song 1";

        // Upload a song
        await nftMusic.uploadSong(songId, audioData);

        // Check if the song is available for listening
        const isAvailable = await nftMusic.isSongAvailable(songId);
        console.assert(isAvailable === true, "Song is not available for listening");

        // Retrieve audio data of the song
        const retrievedAudioData = await nftMusic.listenToSong(songId);
        console.assert(retrievedAudioData === audioData, "Retrieved audio data does not match uploaded audio data");
    });

    it("Should not upload a song with an existing ID", async function () {
        const songId = 1;
        const audioData1 = "Audio data for song 1";
        const audioData2 = "Audio data for song 2";

        // Upload a song with ID 1
        await nftMusic.uploadSong(songId, audioData1);

        try {
            // Try to upload another song with the same ID
            await nftMusic.uploadSong(songId, audioData2);
            // If uploadSong didn't revert, fail the test
            throw new Error("uploadSong should have reverted");
        } catch (error) {
            // Check if the error message matches the expected error message
            console.assert(error.message.includes("Song already exists"), "Incorrect error message");
        }
    });
});
