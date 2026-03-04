// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {FluidSepoliaLayout} from "./FluidSepoliaLayout.sol";

// @title FluidSepoliaV1 - A simple donation and withdrawal contract with cooldown mechanism
// @notice This contract allows users to donate Ether and withdraw a fixed amount after a cooldown period. The owner can update the cooldown time.

// @dev This contract is designed to be upgradeable using OpenZeppelin's UUPS proxy pattern. It inherits from Initializable, OwnableUpgradeable, and UUPSUpgradeable for upgradeability and access control. The layout of the contract is defined in FluidSepoliaLayout, which includes state variables and events for tracking donations and withdrawals.

// error
error FluidSepoliaV1_CooldownNotPassed();
error FluidSepoliaV1_InsufficientDonationAmount();
error FluidSepoliaV1_DonationMustBeGreaterThanThisAmount();
error FluidSepoliaV1_OnlyOwnerCanUpdateCooldownTime();

contract FluidSepoliaV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable, FluidSepoliaLayout {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Initializer function to replace constructor for upgradeable contracts
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        withdrawalAmount = 0.05 ether; // Default withdrawal amount
        cooldownTime = 1 days; // Default cooldown time
    }

    // Function to receive donations
    function donate() public payable {
        if (msg.value < 0.001 ether) {
            revert FluidSepoliaV1_DonationMustBeGreaterThanThisAmount();
        }
        donations[msg.sender] += msg.value;
        totalDonated += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Function to withdraw funds
    function withdraw() external {
        if (block.timestamp < lastWithdrawalTime[msg.sender] + cooldownTime) {
            revert FluidSepoliaV1_CooldownNotPassed();
        }
        if (address(this).balance < withdrawalAmount) {
            revert FluidSepoliaV1_InsufficientDonationAmount();
        }

        lastWithdrawalTime[msg.sender] = block.timestamp;
        (bool success,) = msg.sender.call{value: withdrawalAmount}("");
        require(success, "Withdrawal failed");
        emit WithdrawalMade(msg.sender, withdrawalAmount);
    }

    // Function to update cooldown time
    function updateCooldownTime(uint256 _newCooldownTime) external onlyOwner {
        uint256 oldCooldown = cooldownTime;
        cooldownTime = _newCooldownTime;
        emit CooldownTimeUpdated(oldCooldown, _newCooldownTime);
    }

    // Function to update withdrawal amount
    function updateWithdrawalAmount(uint256 _newWithdrawalAmount) external onlyOwner {
        uint256 oldWithdrawalAmount = withdrawalAmount;
        withdrawalAmount = _newWithdrawalAmount;
        emit WithdrawalAmountUpdated(oldWithdrawalAmount, _newWithdrawalAmount);
    }

    // Function to get total donations for a specific address
    function getTotalDonations(address _donor) external view returns (uint256) {
        return donations[_donor];
    }

    // Function to get the last withdrawal time for a specific address
    function getLastWithdrawalTime(address _user) external view returns (uint256) {
        return lastWithdrawalTime[_user];
    }

    // Function to get the total donations received by the contract
    function getTotalDonated() external view returns (uint256) {
        return totalDonated;
    }

    // Function to get the current cooldown time
    function getCooldownTime() external view returns (uint256) {
        return cooldownTime;
    }

    // Function to get the current withdrawal amount
    function getWithdrawalAmount() external view returns (uint256) {
        return withdrawalAmount;
    }

    // Function to get the contract's current balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // fallback function to accept Ether sent directly to the contract
    receive() external payable {
        donate();
    }

    // fallback function to handle calls to non-existent functions
    fallback() external payable {
        donate();
    }

    // Function to calculate remaining time for a user's next withdrawal
    function getTimeUntilNextWithdrawal(address _user) external view returns (uint256) {
        uint256 nextAvailableTime = lastWithdrawalTime[_user] + cooldownTime;

        // If the current time is past the next available time, return 0 to indicate that the user can withdraw immediately
        if (block.timestamp >= nextAvailableTime) {
            return 0;
        }
        // Otherwise, return the remaining time until the next withdrawal is available
        return nextAvailableTime - block.timestamp;
    }

    // Required by UUPSUpgradeable to authorize upgrades
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
