//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract PollResults is Ownable {
	uint256 public totalPolls = 0;

	mapping(string => mapping(string => bytes)) public answers;
	mapping(string => string[]) public polls;
	mapping(string => bool) public isPollCreated;
	mapping(string => mapping(string => uint256)) public pollResults;
	mapping(string => mapping(string => bool)) public isPollSubmitted;
	mapping(string => uint256) public pollTotalQuestions;

	constructor() {}

	function createPoll(
		string calldata pollCid,
		string[] calldata options
	) external onlyOwner {
		require(!isPollCreated[pollCid], "Poll already created");
		for (uint256 i = 0; i < options.length; i++) {
			polls[pollCid].push(options[i]);
		}
		pollTotalQuestions[pollCid] = options.length;
		isPollCreated[pollCid] = true;
	}

	function submitAnswer(
		string calldata fid,
		string calldata pollCid,
		string[] calldata option
	) external onlyOwner {
		require(isPollCreated[pollCid], "Poll not created");
		require(!isPollSubmitted[fid][pollCid], "Poll already submitted");
		require(
			option.length == polls[pollCid].length,
			"Invalid number of options"
		);

		uint256 score = 0;
		for (uint256 i = 0; i < option.length; i++) {
			if (
				keccak256(abi.encodePacked(option[i])) ==
				keccak256(abi.encodePacked(polls[pollCid][i]))
			) {
				score += 1;
			}
		}

		pollResults[fid][pollCid] = score;
		isPollSubmitted[fid][pollCid] = true;
	}

	function getResult(
		string calldata fid,
		string calldata pollCid
	) external view returns (uint256, uint256) {
		require(isPollSubmitted[fid][pollCid], "Poll not submitted");
		return (pollResults[fid][pollCid], pollTotalQuestions[pollCid]);
	}
}
