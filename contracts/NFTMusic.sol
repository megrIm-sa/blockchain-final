// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMusic {
    uint256 public songCount;

    // Mapping to store the owner of each song
    mapping(uint256 => address) private songOwners;
    // Mapping to store whether a song is available for listening
    mapping(uint256 => bool) private songAvailability;
    // Mapping to store IPFS hash of each song
    mapping(uint256 => string) private songIPFSHash;

    event SongUploaded(uint256 indexed songId, address indexed owner, string ipfsHash);
    event SongListened(uint256 indexed songId, address indexed listener);

    // Function to upload a song
    function uploadSong(uint256 _songId, string memory _ipfsHash) external {
        require(songOwners[_songId] == address(0), "Song already exists");
        songOwners[_songId] = msg.sender;
        songAvailability[_songId] = true;
        songIPFSHash[_songId] = _ipfsHash;
        songCount++;
        emit SongUploaded(_songId, msg.sender, _ipfsHash);
    }

    // Function to listen to a song
    function listenToSong(uint256 _songId) external view returns (string memory) {
        require(songAvailability[_songId], "Song not available");
        return songIPFSHash[_songId];
    }

    // Function to check if a song is available for listening
    function isSongAvailable(uint256 _songId) external view returns (bool) {
        return songAvailability[_songId];
    }

    // Function to get the owner of a song
    function getOwnerOfSong(uint256 _songId) external view returns (address) {
        return songOwners[_songId];
    }

    // Function to get the total number of songs
    function getTotalSongs() external view returns (uint256) {
        return songCount;
    }

    // Function to get the ID of a song at a specific index
    function getSongId(uint256 _index) external view returns (uint256) {
        require(_index > 0 && _index <= songCount, "Invalid index");
        uint256 songId = 0;
        for (uint256 i = 1; i <= songCount; i++) {
            if (songOwners[i] != address(0)) {
                songId++;
            }
            if (songId == _index) {
                return i;
            }
        }
        revert("Song not found");
    }
}
