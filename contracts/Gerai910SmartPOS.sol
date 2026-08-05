// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface ISmartTreasury {
    function processSaaSPayment(uint256 _amount, address _tokenAddress) external;
}

/**
 * @title Gerai 910 Smart POS (Smart Retail & DMart Router)
 * @notice Kontrak pintar untuk memproses transaksi kasir retail secara on-chain.
 *         Membagi PPN 12% secara otonom ke dompet kas negara, fee platform ke Smart Treasury,
 *         dan sisa bersih ke dompet merchant lokal tanpa perantara perbankan.
 */
contract Gerai910SmartPOS {
    
    address public taxAuthorityWallet; // Dompet Dirjen Pajak (PPN 12%)
    address public platformTreasuryAddress; // Alamat kontrak Gerai910SmartTreasury
    address public operator;

    struct Transaction {
        uint256 id;
        address merchant;
        address customer;
        uint256 grossAmount;
        uint256 taxAmount; // PPN 12%
        uint256 platformFee; // Platform cut
        uint256 timestamp;
    }

    mapping(uint256 => Transaction) public transactions;
    uint256 public totalTransactions;

    event POSTransactionProcessed(
        uint256 indexed txId, 
        address indexed merchant, 
        address indexed customer, 
        uint256 grossAmount, 
        uint256 taxAmount
    );

    constructor(address _taxAuthorityWallet, address _platformTreasuryAddress) {
        taxAuthorityWallet = _taxAuthorityWallet;
        platformTreasuryAddress = _platformTreasuryAddress;
        operator = msg.sender;
    }

    /**
     * @notice Memproses transaksi retail POS on-chain.
     *         Mengirim 12% PPN langsung ke Kemenkeu, 5% fee platform ke Smart Treasury Singapura,
     *         dan 83% bersih ke kasir merchant.
     */
    function processPOSSale(
        uint256 _txId,
        address _merchantWallet,
        uint256 _grossAmount,
        address _tokenAddress
    ) external {
        require(_grossAmount > 0, "Nominal transaksi harus lebih besar dari nol");
        require(_merchantWallet != address(0), "Alamat merchant tidak valid");

        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _grossAmount), "Pecah dana transaksi gagal");

        // Perhitungan Pajak PPN 12% & Platform Fee 5%
        uint256 taxShare = (_grossAmount * 12) / 100;
        uint256 platformShare = (_grossAmount * 5) / 100;
        uint256 merchantNet = _grossAmount - taxShare - platformShare;

        // 1. Salurkan PPN 12% ke kas negara Indonesia
        require(token.transfer(taxAuthorityWallet, taxShare), "Gagal menyetor PPN 12% ke kas negara");

        // 2. Salurkan 5% Platform Fee ke Smart Treasury Singapura untuk konversi emas abadi (PAXG)
        require(token.transfer(platformTreasuryAddress, platformShare), "Gagal mengirim fee platform ke treasury");

        // 3. Salurkan sisa bersih 83% langsung ke dompet merchant lokal
        require(token.transfer(_merchantWallet, merchantNet), "Gagal mengirim pendapatan bersih ke merchant");

        totalTransactions++;
        transactions[totalTransactions] = Transaction({
            id: _txId,
            merchant: _merchantWallet,
            customer: msg.sender,
            grossAmount: _grossAmount,
            taxAmount: taxShare,
            platformFee: platformShare,
            timestamp: block.timestamp
        });

        emit POSTransactionProcessed(_txId, _merchantWallet, msg.sender, _grossAmount, taxShare);
    }
}
