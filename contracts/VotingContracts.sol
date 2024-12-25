// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Create {
    using Counters for Counters.Counter;

    Counters.Counter private _voteid;
    Counters.Counter private _candidatId;

    address public votingOrganizer;

    struct Candidat {
        uint256 candidateId;
        string name;
        uint256 voteCount;
        address _address;
        string imageUrl; // Menambahkan field imageUrl untuk kandidat
    }

    struct Voter {
        uint256 vote_voterId;
        string voter_name;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string imageUrl; // URL gambar pemilih
    }

    event CandidateCreated(
        uint256 candidateId,
        string name,
        uint256 voteCount,
        address _address,
        string imageUrl // Menambahkan imageUrl pada event
    );

    event VoterCreated(
        uint256 indexed vote_voterId,
        string voter_name,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string imageUrl // Menambahkan imageUrl pada event
    );

    event Voted(
        address indexed voter,
        address indexed candidate,
        uint256 candidateId
    );

    address[] private candidateAddress;
    mapping(address => Candidat) private candidates;

    address[] private votedVoters;
    address[] private votersAddress;
    mapping(address => Voter) private voters;

    modifier onlyOrganizer() {
        require(votingOrganizer == msg.sender, "Only organizer allowed");
        _;
    }

    constructor() {
        votingOrganizer = msg.sender;
    }

    // Fungsi untuk menambahkan kandidat baru
    function setCandidates(address _address, string memory _name, string memory _imageUrl) public onlyOrganizer {
        require(_address != address(0), "Invalid candidate address");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty"); // Validasi untuk imageUrl

        _candidatId.increment();
        uint256 idNumber = _candidatId.current();

        require(candidates[_address].candidateId == 0, "Candidate already exists");

        candidates[_address] = Candidat({
            candidateId: idNumber,
            name: _name,
            voteCount: 0,
            _address: _address,
            imageUrl: _imageUrl // Menyimpan imageUrl pada kandidat
        });

        candidateAddress.push(_address);

        emit CandidateCreated(idNumber, _name, 0, _address, _imageUrl); // Emit imageUrl pada event
    }

    // Fungsi untuk mendapatkan alamat kandidat
    function getCandidate() public view returns (address[] memory) {
        require(candidateAddress.length > 0, "No candidates available");
        return candidateAddress;
    }

    // Fungsi untuk mendapatkan data kandidat
    function getCandidateData(address _address) public view returns (
        string memory, uint256, uint256, address, string memory // Menambahkan imageUrl pada return
    ) {
        Candidat memory candidate = candidates[_address];
        require(candidate.candidateId != 0, "Candidate does not exist");

        return (candidate.name, candidate.candidateId, candidate.voteCount, candidate._address, candidate.imageUrl); // Menambahkan imageUrl pada return
    }

    // Fungsi untuk mendapatkan semua data kandidat
    function getAllCandidates() public view returns (Candidat[] memory) {
        uint256 length = candidateAddress.length;
        Candidat[] memory allCandidates = new Candidat[](length);

        for (uint256 i = 0; i < length; i++) {
            allCandidates[i] = candidates[candidateAddress[i]];
        }

        return allCandidates;
    }

    // Fungsi untuk mendaftarkan pemilih baru
    function voterRight(
        address _address,
        string memory _name,
        string memory _imageUrl // Parameter tambahan
    ) public onlyOrganizer {
        require(_address != address(0), "Invalid voter address");
        require(bytes(_name).length > 0, "Voter name cannot be empty");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");

        _voteid.increment();
        uint256 idNumber = _voteid.current();

        require(voters[_address].voter_allowed == 0, "Voter already registered");

        voters[_address] = Voter({
            vote_voterId: idNumber,
            voter_name: _name,
            voter_address: _address,
            voter_allowed: 1,
            voter_voted: false,
            voter_vote: 0,
            imageUrl: _imageUrl
        });

        votersAddress.push(_address);

        emit VoterCreated(idNumber, _name, _address, 1, false, 0, _imageUrl); // Emit imageUrl pada event
    }

    // Fungsi untuk melakukan pemilihan
    function vote(address _candidateAddress, uint256 _candidateVoteId) external {
        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed == 1, "You are not allowed to vote");

        Candidat storage candidate = candidates[_candidateAddress];
        require(candidate.candidateId == _candidateVoteId, "Invalid candidate ID");
        require(candidate.candidateId != 0, "Candidate does not exist");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;

        votedVoters.push(msg.sender);

        candidate.voteCount += 1;

        emit Voted(msg.sender, _candidateAddress, _candidateVoteId);
    }

    // Fungsi untuk mendapatkan jumlah pemilih
    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }

    // Fungsi untuk mendapatkan data pemilih berdasarkan alamat
    function getVoterData(address _address) public view returns (
        uint256, string memory, address, uint256, bool, string memory
    ) {
        Voter memory voter = voters[_address];
        require(voter.voter_allowed != 0, "Voter does not exist");

        return (
            voter.vote_voterId,
            voter.voter_name,
            voter.voter_address,
            voter.voter_allowed,
            voter.voter_voted,
            voter.imageUrl
        );
    }

    // Fungsi untuk mendapatkan daftar pemilih yang sudah memilih
    function getVoteList() public view returns (address[] memory) {
        return votedVoters;
    }

    // Fungsi untuk mendapatkan daftar semua pemilih
    function getVoterList() public view returns (address[] memory) {
        return votersAddress;
    }
}
