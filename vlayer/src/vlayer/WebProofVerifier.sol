// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {WebProofProver} from "./WebProofProver.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

import {ERC721} from "@openzeppelin-contracts-5.0.1/token/ERC721/ERC721.sol";

contract WebProofVerifier is Verifier, ERC721 {
    address public prover;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _prover) ERC721("ETHWarsawTicket", "EWT") {
        prover = _prover;
        owner = msg.sender;
    }

    function verify(Proof calldata, string memory username, address account)
        public
        onlyVerified(prover, WebProofProver.main.selector)
    {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(username)));
        require(_ownerOf(tokenId) == address(0), "User has already minted an ETHWarsawTicket");

        _safeMint(account, tokenId);
    }

    function mint(string memory username, address account) public onlyOwner {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(username)));
        require(_ownerOf(tokenId) == address(0), "User has already minted an ETHWarsawTicket");
        _safeMint(account, tokenId);
    }

    function burn(string memory username) public onlyOwner {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(username)));
        _burn(tokenId);
    }
}
