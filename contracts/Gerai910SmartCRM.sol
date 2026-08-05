// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Gerai 910 Smart CRM (Decentralized Loyalty Points & NFT Memberships)
 * @notice Kontrak pintar untuk mengelola kartu keanggotaan NFT (Regular, Gold, Platinum)
 *         dan mencetak poin loyalitas ERC20 secara otonom untuk setiap aktivitas belanja.
 */

contract Gerai910SmartCRM {
    
    address public platformAdmin;
    
    string public constant tokenName = "Gerai Loyalty Points";
    string public constant tokenSymbol = "G-POINTS";
    uint8 public constant decimals = 18;

    // Balances for loyalty points
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    // Mapping for NFT Membership tiers
    // 0 = None/Regular, 1 = Gold (5% discount), 2 = Platinum (10% discount)
    mapping(address => uint8) public membershipTiers;

    event LoyaltyPointsAwarded(address indexed customer, uint256 amount);
    event MembershipUpgraded(address indexed customer, uint8 tier);

    constructor() {
        platformAdmin = msg.sender;
    }

    /**
     * @notice Menghadiahkan loyalty points kepada pelanggan atas aktivitas belanjanya.
     */
    function awardPoints(address _customer, uint256 _amount) external {
        balanceOf[_customer] += _amount;
        totalSupply += _amount;
        emit LoyaltyPointsAwarded(_customer, _amount);
    }

    /**
     * @notice Meng-upgrade tingkat keanggotaan CRM pelanggan (1 = Gold, 2 = Platinum).
     */
    function upgradeMembership(address _customer, uint8 _newTier) external {
        require(_newTier <= 2, "Tingkatan tier membership tidak valid");
        membershipTiers[_customer] = _newTier;
        emit MembershipUpgraded(_customer, _newTier);
    }

    /**
     * @notice Mendapatkan status diskon CRM berdasarkan tingkatan keanggotaan NFT on-chain.
     */
    function getCustomerDiscountPercent(address _customer) external view returns (uint256) {
        uint8 tier = membershipTiers[_customer];
        if (tier == 2) return 10; // Platinum: 10%
        if (tier == 1) return 5;  // Gold: 5%
        return 0;                 // Regular: 0%
      }
}
