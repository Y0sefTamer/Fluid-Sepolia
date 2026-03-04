// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {FluidSepoliaV1} from "../src/FluidSepoliaV1.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract FluidSepoliaTest is Test {
    FluidSepoliaV1 public fluidSepolia;

    // بنعمل 3 مستخدمين وهميين للتجربة
    address public OWNER = makeAddr("owner");
    address public DONOR = makeAddr("donor");
    address public USER = makeAddr("user");

    function setUp() public {
        FluidSepoliaV1 logic = new FluidSepoliaV1();

        bytes memory initData = abi.encodeCall(FluidSepoliaV1.initialize, ());

        vm.prank(OWNER);
        ERC1967Proxy proxy = new ERC1967Proxy(address(logic), initData);

        fluidSepolia = FluidSepoliaV1(payable(address(proxy)));

        vm.deal(DONOR, 10 ether);
        vm.deal(USER, 10 ether);

        vm.warp(1700000000);
    }

    function test_InitialState() public view {
        assertEq(fluidSepolia.getWithdrawalAmount(), 0.05 ether);
        assertEq(fluidSepolia.getCooldownTime(), 1 days);
        assertEq(fluidSepolia.owner(), OWNER);
    }

    function test_DonateRevertsIfAmountTooLow() public {
        vm.prank(DONOR);

        vm.expectRevert(FluidSepoliaV1.FluidSepoliaV1_DonationMustBeGreaterThanThisAmount.selector);
        fluidSepolia.donate{value: 0.0009 ether}();
    }

    function test_DonateSuccess() public {
        vm.prank(DONOR);
        fluidSepolia.donate{value: 1 ether}();

        assertEq(fluidSepolia.getTotalDonated(), 1 ether);
        assertEq(fluidSepolia.getTotalDonations(DONOR), 1 ether);
        assertEq(fluidSepolia.getContractBalance(), 1 ether);
    }

    function test_WithdrawRevertsIfInsufficientBalance() public {
        vm.prank(USER);

        vm.expectRevert(FluidSepoliaV1.FluidSepoliaV1_InsufficientDonationAmount.selector);
        fluidSepolia.withdraw();
    }

    function test_WithdrawSuccessAndCooldown() public {
        vm.prank(DONOR);
        fluidSepolia.donate{value: 1 ether}();

        vm.prank(USER);
        fluidSepolia.withdraw();

        assertEq(USER.balance, 10 ether + 0.05 ether);

        vm.prank(USER);
        vm.expectRevert(FluidSepoliaV1.FluidSepoliaV1_CooldownNotPassed.selector);
        fluidSepolia.withdraw();

        vm.warp(block.timestamp + 1 days + 1 seconds);

        vm.prank(USER);
        fluidSepolia.withdraw();

        assertEq(USER.balance, 10 ether + 0.1 ether);
    }

    function test_TimerFunction() public {
        vm.prank(DONOR);
        fluidSepolia.donate{value: 1 ether}();

        vm.prank(USER);
        fluidSepolia.withdraw();

        uint256 timeLeft = fluidSepolia.getTimeUntilNextWithdrawal(USER);
        assertEq(timeLeft, 1 days);

        vm.warp(block.timestamp + 12 hours);
        timeLeft = fluidSepolia.getTimeUntilNextWithdrawal(USER);
        assertEq(timeLeft, 12 hours);

        vm.warp(block.timestamp + 12 hours);
        timeLeft = fluidSepolia.getTimeUntilNextWithdrawal(USER);
        assertEq(timeLeft, 0);
    }
}
