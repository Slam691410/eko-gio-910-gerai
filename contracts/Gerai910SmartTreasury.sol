// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Gerai 910 Premium Smart Treasury & Autonomous Estate Registry (Waris Blockchain)
 * @author Gerai 910 Core Developer
 * @notice Kontrak pintar otonom (Autopilot) untuk mengelola pendapatan platform SaaS, 
 *         alokasi dana cadangan anti-pailit (PAXG/USDT), dan otomatisasi pewarisan aset digital 
 *         lintas generasi berdasarkan hukum KHI (Kompilasi Hukum Islam) & Faraid.
 */

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Gerai910SmartTreasury {
    
    // DETAIL PEMILIK PLATFORM (SYSTEM ADMIN)
    address public platformOwner;
    uint256 public lastHeartbeat;
    uint256 public constant HEARTBEAT_TIMEOUT = 365 days; // Periode check-in pemilik sebelum switch waris aktif

    // DAFTAR AHLI WARIS (FARAID COMPLIANT Ratios)
    struct Heir {
        address wallet;
        uint256 sharePercentage; // e.g. 6667 (66.67% untuk anak laki-laki), 3333 (33.33% untuk anak perempuan)
        bool exists;
    }
    
    Heir[] public heirs;
    bool public isEstateDisbursed;
    
    // SECURITY REENTRANCY GUARD
    bool private locked;
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // ATURAN PENGEMBANGAN DANA CADANGAN SAAS (ANTI-PAILIT RESERVES)
    uint256 public creatorSplitPercent = 70; // Komisi Kreator/Sub-Affiliate
    uint256 public platformSplitPercent = 30; // Fee Master Platform

    // Distribusi Pendapatan Internal Platform (dari 30% Platform Fee):
    uint256 public reserveGoldPercent = 40;     // 40% dimasukkan ke dana abadi Emas Fisik (PAXG) / Crypto Reserve
    uint256 public operationalPercent = 40;     // 40% untuk biaya operasional cloud & pemeliharaan server
    uint256 public buybackTokensPercent = 20;   // 20% otomatis untuk buyback token platform (sistem likuiditas autopilot)

    // Akumulasi Dompet Kas Cadangan (Simulasi Kas On-Chain)
    address public reserveGoldWallet;
    address public operationalWallet;
    address public buybackContractWallet;

    // DATA TRANSAKSI GLOBAL SAAS
    uint256 public totalSaaSSubscriptions;
    uint256 public totalCommissionsProcessed;
    uint256 public totalReserveGoldAccumulated;

    event RevenueReceived(address indexed sender, uint256 amount, string paymentType);
    event CommissionDistributed(address indexed creator, address indexed platform, uint256 creatorShare, uint256 platformShare);
    event PlatformReserveSplit(uint256 goldReserve, uint256 operational, uint256 buyback);
    event HeartbeatUpdated(uint256 timestamp);
    event InheritanceClaimed(address indexed heir, uint256 amountDistributed);
    event HeirAdded(address indexed wallet, uint256 share);

    modifier onlyOwner() {
        require(msg.sender == platformOwner, "🚫 Otorisasi Khusus: Hanya Pemilik Platform (System Admin) yang berhak!");
        _;
    }

    modifier onlyIfAlive() {
        require(block.timestamp <= lastHeartbeat + HEARTBEAT_TIMEOUT, "🚫 Pemilik Platform Tidak Aktif: Masa transisi pewarisan telah aktif!");
        _;
    }

    constructor(
        address _reserveGoldWallet,
        address _operationalWallet,
        address _buybackContractWallet
    ) {
        platformOwner = msg.sender;
        lastHeartbeat = block.timestamp;
        
        reserveGoldWallet = _reserveGoldWallet;
        operationalWallet = _operationalWallet;
        buybackContractWallet = _buybackContractWallet;
    }

    /**
     * @notice Pemilik wajib melakukan check-in (Heartbeat) minimal 1 tahun sekali.
     *         Jika tidak, sistem mendeteksi kegagalan pemilik dan hak waris on-chain dapat diklaim.
     */
    function heartbeat() external onlyOwner {
        lastHeartbeat = block.timestamp;
        emit HeartbeatUpdated(block.timestamp);
    }

    /**
     * @notice Menambahkan ahli waris dengan persentase bagi hasil sesuai asas Faraid KHI (rasio 2:1 pria/wanita).
     */
    function configureHeir(address _heirWallet, uint256 _sharePercentage) external onlyOwner onlyIfAlive {
        require(_heirWallet != address(0), "Wallet ahli waris tidak boleh alamat nol");
        require(_sharePercentage > 0 && _sharePercentage <= 10000, "Persentase tidak valid (skala basis 10000 = 100%)");

        // Hitung total share ahli waris LAIN (untuk validasi total <= 100%),
        // valid di jalur tambah MAUPUN jalur ubah share yang sudah ada.
        uint256 othersTotal = 0;
        for (uint256 i = 0; i < heirs.length; i++) {
            if (heirs[i].wallet != _heirWallet) {
                othersTotal += heirs[i].sharePercentage;
            }
        }
        require(othersTotal + _sharePercentage <= 10000, "Total persentase ahli waris melampaui 100%!");

        for (uint256 i = 0; i < heirs.length; i++) {
            if (heirs[i].wallet == _heirWallet) {
                heirs[i].sharePercentage = _sharePercentage;
                emit HeirAdded(_heirWallet, _sharePercentage);
                return;
            }
        }

        heirs.push(Heir(_heirWallet, _sharePercentage, true));
        emit HeirAdded(_heirWallet, _sharePercentage);
    }

    /**
     * @notice Menghapus seluruh daftar ahli waris untuk konfigurasi ulang.
     */
    function resetHeirs() external onlyOwner onlyIfAlive {
        delete heirs;
    }

    /**
     * @notice Mengubah aturan pembagian platform fee secara otonom.
     */
    function updateSaaSAllocation(
        uint256 _reserveGold,
        uint256 _operational,
        uint256 _buyback
    ) external onlyOwner onlyIfAlive {
        require(_reserveGold + _operational + _buyback == 100, "Total alokasi harus genap 100%");
        reserveGoldPercent = _reserveGold;
        operationalPercent = _operational;
        buybackTokensPercent = _buyback;
    }

    /**
     * @notice Memproses penerimaan biaya langganan SaaS (USDT/USDC/Coin) secara otonom
     *         dan memecahnya langsung ke cadangan anti-pailit sesuai persentase aman.
     */
    function processSaaSPayment(uint256 _amount, address _tokenAddress) external nonReentrant {
        require(_amount > 0, "Nominal pembayaran harus lebih besar dari nol");
        
        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer token langganan gagal");

        totalSaaSSubscriptions += _amount;
        emit RevenueReceived(msg.sender, _amount, "SaaS_Subscription");

        // Alokasikan otonom untuk ketahanan platform (anti-pailit)
        uint256 goldShare = (_amount * reserveGoldPercent) / 100;
        uint256 opShare = (_amount * operationalPercent) / 100;
        uint256 buybackShare = _amount - goldShare - opShare;

        totalReserveGoldAccumulated += goldShare;

        // Distribusikan instan ke cold wallet cadangan
        require(token.transfer(reserveGoldWallet, goldShare), "Gagal menyetor dana cadangan emas");
        require(token.transfer(operationalWallet, opShare), "Gagal menyetor dana operasional cloud");
        require(token.transfer(buybackContractWallet, buybackShare), "Gagal menyetor dana buyback token");

        emit PlatformReserveSplit(goldShare, opShare, buybackShare);
    }

    /**
     * @notice Memproses distribusi komisi afiliasi global (e.g. penjualan TikTok Yellow Basket)
     *         dan membagi hasil secara instan di blockchain tanpa perantara pihak ketiga.
     */
    function processAffiliateCommission(
        uint256 _totalCommission, 
        address _creatorWallet, 
        address _tokenAddress
    ) external nonReentrant {
        require(_totalCommission > 0, "Komisi tidak boleh nol");
        
        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _totalCommission), "Transfer deposit komisi gagal");

        uint256 creatorShare = (_totalCommission * creatorSplitPercent) / 100;
        uint256 platformShare = _totalCommission - creatorShare;

        totalCommissionsProcessed += _totalCommission;

        // 1. Salurkan langsung komisi ke kreator (70% atau kustom)
        require(token.transfer(_creatorWallet, creatorShare), "Gagal membayar komisi kreator");

        // 2. Salurkan platform share (30%) ke dompet kas internal
        uint256 goldReserve = (platformShare * reserveGoldPercent) / 100;
        uint256 operational = (platformShare * operationalPercent) / 100;
        uint256 buyback = platformShare - goldReserve - operational;

        totalReserveGoldAccumulated += goldReserve;

        require(token.transfer(reserveGoldWallet, goldReserve), "Gagal mengirim cadangan emas platform");
        require(token.transfer(operationalWallet, operational), "Gagal mengirim operasional platform");
        require(token.transfer(buybackContractWallet, buyback), "Gagal mengirim buyback platform");

        emit CommissionDistributed(_creatorWallet, reserveGoldWallet, creatorShare, platformShare);
        emit PlatformReserveSplit(goldReserve, operational, buyback);
    }

    /**
     * @notice EKSEKUSI PEWARISAN OTOMATIS (Dead Man's Switch - Waris Lintas Generasi).
     *         Jika pemilik tidak check-in dalam 365 hari, ahli waris terdaftar dapat memanggil
     *         fungsi ini untuk mencairkan seluruh sisa dana kas treasury ke dompet waris masing-masing
     *         dan mentransfer kepemilikan platform secara otonom tanpa memerlukan proses pengadilan kaku!
     */
    function claimInheritance(address _tokenAddress) external nonReentrant {
        require(block.timestamp > lastHeartbeat + HEARTBEAT_TIMEOUT, "🚫 Pemilik Platform Masih Aktif: Hak waris belum terbuka.");
        require(heirs.length > 0, "Belum ada ahli waris yang didaftarkan oleh admin.");
        require(!isEstateDisbursed, "🚫 Warisan sudah pernah dicairkan.");
        
        IERC20 token = IERC20(_tokenAddress);
        uint256 totalBalance = token.balanceOf(address(this));
        require(totalBalance > 0, "Kas treasury kosong, tidak ada aset token untuk diwariskan.");

        // EFFECTS (State change first to prevent reentrancy)
        isEstateDisbursed = true;
        address primaryHeir = heirs[0].wallet;
        platformOwner = primaryHeir;
        lastHeartbeat = block.timestamp; // Reset heartbeat di tangan pemilik baru

        // INTERACTIONS (Token transfer last) — cek return value semua transfer
        for (uint256 i = 0; i < heirs.length; i++) {
            if (heirs[i].exists && heirs[i].wallet != address(0)) {
                uint256 heirShare = (totalBalance * heirs[i].sharePercentage) / 10000;
                if (heirShare > 0) {
                    require(token.transfer(heirs[i].wallet, heirShare), "Gagal transfer warisan");
                }
            }
        }
        
        emit InheritanceClaimed(primaryHeir, totalBalance);
    }

    // Mengambil rincian data cadangan kas secara transparan
    function getTreasuryStatus() external view returns (
        uint256 totalSubscriptions,
        uint256 totalCommissions,
        uint256 reserveGold,
        uint256 timeSinceLastHeartbeat,
        bool isWarisReady
    ) {
        uint256 timePassed = block.timestamp > lastHeartbeat ? block.timestamp - lastHeartbeat : 0;
        return (
            totalSaaSSubscriptions,
            totalCommissionsProcessed,
            totalReserveGoldAccumulated,
            timePassed,
            timePassed > HEARTBEAT_TIMEOUT
        );
    }
}
