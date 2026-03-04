// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract FluidSepoliaLayout {
    // State Variables
    uint256 internal withdrawalAmount; // Amount that can be withdrawn by users
    uint256 internal cooldownTime; // Time in seconds for cooldown between withdrawals
    uint256 internal totalDonated; // Tracks total donations received
    mapping(address => uint256) internal lastWithdrawalTime; // Tracks last withdrawal time for each address
    mapping(address => uint256) internal donations; // Tracks total donations for each address

    // event for logging donations
    event DonationReceived(address indexed donor, uint256 amount);
    // event for logging withdrawals
    event WithdrawalMade(address indexed recipient, uint256 amount);
    // event for logging cooldown time updates
    event CooldownTimeUpdated(uint256 oldCooldownTime, uint256 newCooldownTime);
    // event for logging withdrawal amount updates
    event WithdrawalAmountUpdated(uint256 oldWithdrawalAmount, uint256 newWithdrawalAmount);

    // Storage Gap
    uint256[50] private __gap; // for future upgrades
}
