// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicDAO {
    struct Proposal {
        uint id;
        address proposer;
        string description;
        uint yesVotes;
        uint noVotes;
        uint deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // DAO成员
    mapping(address => bool) public members;
    // 提案数量
    uint public proposalCount;
    // 提案映射
    mapping(uint => Proposal) public proposals;
    // 投票周期（3天）
    uint public constant VOTING_PERIOD = 3 days;
    // 最小赞成票数阈值（50%）
    uint public constant VOTE_THRESHOLD = 50;

    event MemberAdded(address member);
    event ProposalCreated(uint proposalId, string description, address proposer);
    event Voted(uint proposalId, address voter, bool vote);
    event ProposalExecuted(uint proposalId);

    modifier onlyMember() {
        require(members[msg.sender], "Not a member");
        _;
    }

    constructor() {
        // 创建者自动成为成员
        members[msg.sender] = true;
        emit MemberAdded(msg.sender);
    }

    // 添加成员
    function addMember(address _newMember) external onlyMember {
        require(!members[_newMember], "Already a member");
        members[_newMember] = true;
        emit MemberAdded(_newMember);
    }

    // 创建提案
    function createProposal(string memory _description) external onlyMember {
        proposalCount++;
        
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.proposer = msg.sender;
        proposal.description = _description;
        proposal.deadline = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(proposalCount, _description, msg.sender);
    }

    // 投票
    function vote(uint _proposalId, bool _support) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp <= proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");

        proposal.hasVoted[msg.sender] = true;

        if (_support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        emit Voted(_proposalId, msg.sender, _support);
    }

    // 执行提案
    function executeProposal(uint _proposalId) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp > proposal.deadline, "Voting still in progress");
        require(!proposal.executed, "Proposal already executed");
        
        uint totalVotes = proposal.yesVotes + proposal.noVotes;
        require(totalVotes > 0, "No votes cast");
        
        uint yesPercentage = (proposal.yesVotes * 100) / totalVotes;
        
        if (yesPercentage > VOTE_THRESHOLD) {
            proposal.executed = true;
            emit ProposalExecuted(_proposalId);
            // 这里可以添加具体的执行逻辑
        }
    }

    // 查看提案详情
    function getProposal(uint _proposalId) external view returns (
        address proposer,
        string memory description,
        uint yesVotes,
        uint noVotes,
        uint deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.deadline,
            proposal.executed
        );
    }
}