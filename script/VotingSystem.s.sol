// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import {HandleVote} from "../src/VotingSystem.sol";

contract DeployVotingSystem is Script {
    function run() public {
        vm.startBroadcast();

        HandleVote handleVote = new HandleVote();
        vm.stopBroadcast();

        console.log("HandleVote contract deployed at:", address(handleVote));
    }
}
