// -------------------------------------------------------------
// SAAS MERCHANT POS & CUSTOMER LOYALTY CRM SYSTEM

// Renders POS Cashier Inventory products
function renderPOSProducts() {
  const container = document.getElementById('pos-grid-products');
  if (!container || !appState.db?.posProducts) return;

  container.innerHTML = '';
  appState.db.posProducts.forEach(prod => {
    const item = document.createElement('div');
    item.className = "bg-slate-950 border border-cyber-border rounded-2xl p-4 flex flex-col justify-between hover:border-brand-500/50 transition cursor-pointer";
    item.onclick = () => addProductToCart(prod.id);
    
    item.innerHTML = `
      <div class="space-y-1">
        <h4 class="font-bold text-xs text-slate-200">${prod.name}</h4>
        <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Stok: ${prod.stock} ${prod.unit}</span>
      </div>
      <div class="flex justify-between items-center mt-3 border-t border-cyber-border/20 pt-2">
        <strong class="font-mono text-xs text-brand-400">Rp ${prod.price.toLocaleString('id-ID')}</strong>
        <span class="p-1 bg-slate-900 rounded-lg text-slate-500"><i data-lucide="plus" class="w-3.5 h-3.5"></i></span>
      </div>
    `;
    container.appendChild(item);
  });
  
  lucide.createIcons();
}

// Renders CRM Customers list
function renderCRMCustomers() {
  const select = document.getElementById('pos-customer-select');
  const listContainer = document.getElementById('crm-customers-list');
  if (!appState.db?.crmCustomers) return;

  if (select) {
    select.innerHTML = '<option value="">-- Pembeli Non-CRM (Cash / Ritel Umum) --</option>';
    appState.db.crmCustomers.forEach(cust => {
      const option = document.createElement('option');
      option.value = cust.id;
      option.innerText = `${cust.name} [CRM ${cust.tier}]`;
      select.appendChild(option);
    });
  }

  if (listContainer) {
    listContainer.innerHTML = '';
    appState.db.crmCustomers.forEach(cust => {
      const card = document.createElement('div');
      card.className = "bg-slate-950 border border-cyber-border rounded-xl p-3 flex justify-between items-center";
      
      let tierBadge = "bg-slate-900 text-slate-400 border border-slate-700";
      let discLabel = "Diskon Pokok: 0%";
      if (cust.tier === 'Gold') {
        tierBadge = "bg-yellow-950 text-yellow-400 border border-yellow-800";
        discLabel = "Diskon Loyal: 5%";
      } else if (cust.tier === 'Platinum') {
        tierBadge = "bg-brand-950 text-brand-400 border border-brand-800";
        discLabel = "Diskon Loyal: 10%";
      }

      card.innerHTML = `
        <div class="space-y-0.5">
          <strong class="text-xs text-slate-200 block">${cust.name}</strong>
          <span class="text-[9px] text-slate-500 font-semibold block">${cust.phone}</span>
          <span class="text-[9px] text-brand-500 font-bold block">${discLabel}</span>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${tierBadge}">${cust.tier}</span>
          <span class="text-[9px] text-slate-500 block mt-1">Belanja: ${cust.totalOrders}x</span>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }
}

// Add custom retail product to database physical store inventory
async function addNewInventoryProduct() {
  const name = document.getElementById('new-prod-name').value.trim();
  const price = parseFloat(document.getElementById('new-prod-price').value) || 0;
  const stock = parseInt(document.getElementById('new-prod-stock').value, 10) || 0;
  const unit = document.getElementById('new-prod-unit').value.trim() || 'Pcs';

  if (!name || price <= 0 || stock <= 0) {
    alert('Mohon lengkapi seluruh kolom produk dengan benar.');
    return;
  }

  const newProd = {
    id: appState.db.posProducts.length > 0 ? Math.max(...appState.db.posProducts.map(p => p.id)) + 1 : 1,
    name,
    price,
    stock,
    unit
  };

  appState.db.posProducts.push(newProd);
  await saveDatabase();

  renderPOSProducts();
  
  // Reset inputs
  document.getElementById('new-prod-name').value = '';
  document.getElementById('new-prod-price').value = '';
  document.getElementById('new-prod-stock').value = '';

  alert(`✅ Sukses Tambah Barang Ritel!\n\nProduk '${name}' berhasil didaftarkan rill ke database inventaris.`);
}

// POS Cart Cashier Operations
function addProductToCart(productId) {
  const prod = appState.db.posProducts.find(p => p.id === productId);
  if (!prod) return;

  if (prod.stock <= 0) {
    alert('🚫 Transaksi Ditolak: Stok produk habis!');
    return;
  }

  const existing = appState.cart.items.find(item => item.productId === productId);
  if (existing) {
    if (existing.qty >= prod.stock) {
      alert('🚫 Transaksi Ditolak: Tidak bisa melebihi stok yang tersedia!');
      return;
    }
    existing.qty++;
    existing.subtotal = existing.qty * prod.price;
  } else {
    appState.cart.items.push({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1,
      subtotal: prod.price
    });
  }

  recalculatePOSCartTotals();
}

function updateCartQty(productId, qty) {
  const item = appState.cart.items.find(i => i.productId === productId);
  const prod = appState.db.posProducts.find(p => p.id === productId);
  if (!item || !prod) return;

  const newQty = parseInt(qty, 10);
  if (isNaN(newQty) || newQty <= 0) {
    appState.cart.items = appState.cart.items.filter(i => i.productId !== productId);
  } else {
    if (newQty > prod.stock) {
      alert(`Stok hanya tersedia ${prod.stock} ${prod.unit}`);
      item.qty = prod.stock;
    } else {
      item.qty = newQty;
    }
    item.subtotal = item.qty * item.price;
  }

  recalculatePOSCartTotals();
}

function selectPOSCustomer() {
  const select = document.getElementById('pos-customer-select');
  const custId = parseInt(select.value, 10);
  
  if (custId) {
    const cust = appState.db.crmCustomers.find(c => c.id === custId);
    if (cust) {
      appState.cart.customerId = cust.id;
      appState.cart.customerName = cust.name;
      
      // Multi-tiered loyalty discounts: 10% for Platinum, 5% for Gold, 0% Regular
      if (cust.tier === 'Platinum') appState.cart.discount = 0.10;
      else if (cust.tier === 'Gold') appState.cart.discount = 0.05;
      else appState.cart.discount = 0;
    }
  } else {
    appState.cart.customerId = null;
    appState.cart.customerName = 'Pembeli Ritel Umum';
    appState.cart.discount = 0;
  }

  recalculatePOSCartTotals();
}

function setPOSPaymentMethod(method) {
  appState.cart.paymentMethod = method;
  
  document.getElementById('pos-pay-cash').className = "p-3 border rounded-xl flex flex-col items-center gap-1 hover:border-brand-500 transition " + (method === 'CASH' ? "bg-slate-900 border-brand-500 text-brand-400" : "bg-slate-950 border-cyber-border text-slate-400");
  document.getElementById('pos-pay-qris').className = "p-3 border rounded-xl flex flex-col items-center gap-1 hover:border-brand-500 transition " + (method === 'QRIS' ? "bg-slate-900 border-brand-500 text-brand-400" : "bg-slate-950 border-cyber-border text-slate-400");
}

function recalculatePOSCartTotals() {
  const list = document.getElementById('pos-cart-items-list');
  if (!list) return;

  list.innerHTML = '';
  let grossTotal = 0;

  if (appState.cart.items.length === 0) {
    list.innerHTML = '<div class="text-slate-500 italic text-center py-8 text-xs">Keranjang belanja kasir kosong. Pilih barang di atas.</div>';
    document.getElementById('pos-summary-discount').innerText = "Rp 0";
    document.getElementById('pos-summary-tax').innerText = "Rp 0";
    document.getElementById('pos-summary-total').innerText = "Rp 0";
    return;
  }

  appState.cart.items.forEach(item => {
    grossTotal += item.subtotal;

    const row = document.createElement('div');
    row.className = "flex justify-between items-center text-xs bg-slate-900/60 p-2 border border-cyber-border/40 rounded-xl";
    row.innerHTML = `
      <div class="space-y-0.5">
        <strong class="text-slate-200 block">${item.name}</strong>
        <span class="text-[10px] text-slate-500 font-mono">Rp ${item.price.toLocaleString('id-ID')} / pcs</span>
      </div>
      <div class="flex items-center gap-3">
        <input type="number" value="${item.qty}" min="1" onchange="updateCartQty(${item.productId}, this.value)" class="w-12 bg-slate-950 border border-cyber-border rounded text-center py-1 text-slate-200">
        <strong class="font-mono text-slate-300">Rp ${item.subtotal.toLocaleString('id-ID')}</strong>
      </div>
    `;
    list.appendChild(row);
  });

  // Calculate discounts and dynamic 12% PPN tax locally compliant per August 2026!
  const discountAmount = Math.round(grossTotal * appState.cart.discount);
  const netTotal = grossTotal - discountAmount;
  const taxPPN = Math.round(netTotal * 0.12); // PPN 12% Indonesia 2026 HPP compliant!
  const finalTotal = netTotal + taxPPN;

  appState.cart.tax = taxPPN;
  appState.cart.total = finalTotal;

  document.getElementById('pos-summary-discount').innerText = `Rp ${discountAmount.toLocaleString('id-ID')} (${appState.cart.discount * 100}%)`;
  document.getElementById('pos-summary-tax').innerText = `Rp ${taxPPN.toLocaleString('id-ID')} (PPN 12%)`;
  document.getElementById('pos-summary-total').innerText = `Rp ${finalTotal.toLocaleString('id-ID')}`;
}

// Confirm checkout and record transaction rill in database.json
async function executePOSCheckout() {
  if (appState.cart.items.length === 0) {
    alert('Keranjang belanja masih kosong!');
    return;
  }

  // Deduct stocks rill
  appState.cart.items.forEach(item => {
    const prod = appState.db.posProducts.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.qty);
    }
  });

  // Save new transaction record physically
  const newTx = {
    id: appState.db.posTransactions.length > 0 ? Math.max(...appState.db.posTransactions.map(t => t.id)) + 1 : 1,
    date: new Date().toISOString().split('T')[0],
    customerName: appState.cart.customerName,
    itemsCount: appState.cart.items.reduce((acc, curr) => acc + curr.qty, 0),
    totalPrice: appState.cart.total,
    taxPPN: appState.cart.tax,
    paymentMethod: appState.cart.paymentMethod
  };

  appState.db.posTransactions.unshift(newTx);

  // If CRM customer, increment totalOrders counter
  if (appState.cart.customerId) {
    const cust = appState.db.crmCustomers.find(c => c.id === appState.cart.customerId);
    if (cust) cust.totalOrders++;
  }

  await saveDatabase();

  alert(`🛒 TRANSAKSI KASIR SUKSES!\n\nNama Pembeli: ${appState.cart.customerName}\nTotal Bayar: Rp ${appState.cart.total.toLocaleString('id-ID')}\nMetode: ${appState.cart.paymentMethod}\nPPN 12% Disisihkan: Rp ${appState.cart.tax.toLocaleString('id-ID')}\n\nPembukuan rill berhasil disimpan ke database.json`);

  // Clear cart
  appState.cart.items = [];
  appState.cart.customerId = null;
  appState.cart.customerName = 'Pembeli Ritel Umum';
  appState.cart.discount = 0;
  
  const select = document.getElementById('pos-customer-select');
  if (select) select.value = '';

  recalculatePOSCartTotals();
  renderPOSProducts();
  renderCRMCustomers();
  renderPOSTransactions();
}

// Render local POS transaction history logs
function renderPOSTransactions() {
  const container = document.getElementById('pos-transactions-tbody');
  if (!container || !appState.db?.posTransactions) return;

  container.innerHTML = '';
  appState.db.posTransactions.forEach(tx => {
    const row = document.createElement('tr');
    row.className = "hover:bg-slate-900/30 border-b border-cyber-border/20 transition duration-150";
    row.innerHTML = `
      <td class="p-3 font-mono text-slate-400">${tx.date}</td>
      <td class="p-3 text-slate-200 font-semibold">${tx.customerName}</td>
      <td class="p-3 text-slate-400 text-center font-mono">${tx.itemsCount} Pcs</td>
      <td class="p-3 text-right text-brand-400 font-mono font-bold">Rp ${tx.totalPrice.toLocaleString('id-ID')}</td>
      <td class="p-3 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">${tx.paymentMethod}</td>
    `;
    container.appendChild(row);
  });
}
