// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/VotingSystem.sol";

contract HandleVoteTest is Test {
    HandleVote handleVote;

    address public owner = address(0x1);
    address public voter1 = address(0x2);
    address public voter2 = address(0x3);

    function setUp() public {
        // Use the contract-level owner
        vm.startPrank(owner);

        handleVote = new HandleVote();

        handleVote.addCandidate("Alice");
        handleVote.addCandidate("Bob");

        vm.stopPrank();
    }

    function testAddCandidate() public view {
        (string memory name, uint256 votesCount) = getCandidate(0);
        assertEq(name, "Alice");
        assertEq(votesCount, 0);

        (string memory name2, uint256 votesCount2) = getCandidate(1);
        assertEq(name2, "Bob");
        assertEq(votesCount2, 0);
    }

    function testCastVote() public {
        // Simulate voter1
        vm.startPrank(voter1);
        bytes32 serialNo = keccak256(abi.encodePacked("unique_serial_no"));
        uint256 cnic = 1234567890123;
        uint256 candidateIndex = 0;

        handleVote.balletPaper(serialNo, cnic, candidateIndex);

        (string memory name, uint256 votesCount) = getCandidate(candidateIndex);
        assertEq(name, "Alice");
        assertEq(votesCount, 1);

        HandleVote.CandidateDetail memory voteRecord = getVoteRecord(serialNo);
        assertEq(voteRecord.name, "Alice");

        vm.stopPrank();
    }

    function testGetVoteRecord() public {
        // Simulate voter1
        vm.startPrank(voter1);
        bytes32 serialNo = keccak256(abi.encodePacked("unique_serial_no"));
        uint256 cnic = 1234567890123;
        uint256 candidateIndex = 0;

        handleVote.balletPaper(serialNo, cnic, candidateIndex);

        HandleVote.CandidateDetail memory voteRecord = handleVote.getVoteRecord(
            serialNo
        );
        assertEq(voteRecord.name, "Alice");

        vm.stopPrank();
    }

    function testGetResult() public {
        // Simulate voter1 voting for Alice
        vm.startPrank(voter1);
        bytes32 serialNo1 = keccak256(abi.encodePacked("unique_serial_no_1"));
        uint256 cnic1 = 1234567890123;
        uint256 candidateIndex1 = 0;

        handleVote.balletPaper(serialNo1, cnic1, candidateIndex1);

        vm.stopPrank();

        // Simulate voter2 voting for Bob
        vm.startPrank(voter2);
        bytes32 serialNo2 = keccak256(abi.encodePacked("unique_serial_no_2"));
        uint256 cnic2 = 1234567890124;
        uint256 candidateIndex2 = 1;

        handleVote.balletPaper(serialNo2, cnic2, candidateIndex2);

        vm.stopPrank();

        HandleVote.VoteResult[] memory results = handleVote.getResult();
        assertEq(results[0].candidateName, "Alice");
        assertEq(results[1].candidateName, "Bob");
    }

    function getCandidate(
        uint256 _index
    ) internal view returns (string memory, uint256) {
        HandleVote.CandidateDetail memory candidate = handleVote.getCandidate(
            _index
        );
        return (candidate.name, candidate.votesCount);
    }

    function getVoteRecord(
        bytes32 _serialNo
    ) internal view returns (HandleVote.CandidateDetail memory) {
        return handleVote.getVoteRecord(_serialNo);
    }
}
