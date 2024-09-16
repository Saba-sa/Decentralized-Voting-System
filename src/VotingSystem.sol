// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract HandleVote {
    struct CandidateDetail {
        string name;
        uint256 votesCount;
    }

    struct VoteResult {
        bytes32 serialNo;
        string candidateName;
    }

    mapping(uint256 => bool) public cnicVotes;
    mapping(uint256 => CandidateDetail) internal candidates;
    mapping(bytes32 => bool) public votesCount;
    mapping(bytes32 => CandidateDetail) public voteRecords;
    mapping(address => bool) internal alreadyVoted;

    bytes32[] public serialNumbers;
    address public owner;
    uint8 public candidateCount;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You have no authority");
        _;
    }

    modifier hasVoted() {
        require(!alreadyVoted[msg.sender], "You have already voted.");
        _;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates[candidateCount] = CandidateDetail(_name, 0);
        candidateCount++;
    }

    function balletPaper(
        bytes32 _serialno,
        uint256 _cnic,
        uint256 _i
    ) public hasVoted {
        require(!votesCount[_serialno], "Serial number already used");
        require(
            bytes(candidates[_i].name).length > 0,
            "Invalid candidate index"
        );
        require(!cnicVotes[_cnic], "CNIC is already present, sorry.");
        alreadyVoted[msg.sender] = true;

        cnicVotes[_cnic] = true;
        votesCount[_serialno] = true;
        candidates[_i].votesCount++;
        voteRecords[_serialno] = candidates[_i];
        serialNumbers.push(_serialno);
    }

    function getCandidate(
        uint256 _index
    ) public view returns (CandidateDetail memory) {
        require(_index < candidateCount, "Candidate does not exist");
        return candidates[_index];
    }

    function getVoteRecord(
        bytes32 _serialno
    ) public view returns (CandidateDetail memory) {
        require(votesCount[_serialno], "Serial number has not voted");
        return voteRecords[_serialno];
    }

    function getResult() public view returns (VoteResult[] memory) {
        uint256 length = serialNumbers.length;
        VoteResult[] memory results = new VoteResult[](length);

        for (uint256 i = 0; i < length; i++) {
            bytes32 serial = serialNumbers[i];
            string memory candidateName = voteRecords[serial].name;
            results[i] = VoteResult(serial, candidateName);
        }

        return results;
    }
}
