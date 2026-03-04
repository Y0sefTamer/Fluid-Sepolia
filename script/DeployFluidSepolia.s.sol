// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {FluidSepoliaV1} from "../src/FluidSepoliaV1.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployFluidSepolia is Script {
    function run() public returns (address) {
        // Start broadcasting transactions to the network
        vm.startBroadcast();

        // Deploy the logic contract
        FluidSepoliaV1 logic = new FluidSepoliaV1();
        console.log("Logic Contract Deployed at:", address(logic));
        // Prepare initialization data for the proxy
        bytes memory initData = abi.encodeCall(FluidSepoliaV1.initialize, ());

        // Deploy the proxy contract, pointing to the logic contract and passing the initialization data
        ERC1967Proxy proxy = new ERC1967Proxy(address(logic), initData);
        console.log("Proxy Contract Deployed at:", address(proxy));

        vm.stopBroadcast();

        // Return the address of the deployed proxy contract
        return address(proxy);
    }
}
