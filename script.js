const DB_KEY = "topupstore";

const DEFAULT_DATA = {
    nama: "TOPUP STORE",
    user: "admin",
    pass: "admin123",
    wa: "60194939829",
    produk: [
        { id:1, game:"Free Fire", nama:"12 Diamonds", nominal:12, hargaAsal:1802, hargaJual:468, diskon:74, rewards:9, bestSeller:true },
        { id:2, game:"Free Fire", nama:"50 Diamonds", nominal:50, hargaAsal:7500, hargaJual:3750, diskon:50, rewards:25, bestSeller:true },
        { id:3, game:"Free Fire", nama:"70 Diamonds", nominal:70, hargaAsal:9000, hargaJual:4500, diskon:50, rewards:35, bestSeller:false },
        { id:4, game:"Free Fire", nama:"140 Diamonds", nominal:140, hargaAsal:18000, hargaJual:9000, diskon:50, rewards:70, bestSeller:true },
        { id:5, game:"Free Fire", nama:"355 Diamonds", nominal:355, hargaAsal:45000, hargaJual:22500, diskon:50, rewards:177, bestSeller:false },
        { id:6, game:"Free Fire", nama:"720 Diamonds", nominal:720, hargaAsal:90000, hargaJual:45000, diskon:50, rewards:360, bestSeller:false }
    ],
    order: []
};

let keranjang = null;
let metodeBayar = null;
let playerData = { id: "", nama: "" };

function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
    }
}

function getDB() { return JSON.parse(localStorage.getItem(DB_KEY)); }
function saveDB(data) { localStorage.setItem(DB_KEY, JSON.stringify(data)); }

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// STEP 1: Cek Player ID
function cekPlayerID(id) {
    playerData.id = id.trim();
    const nameDiv = document.getElementById('playerName');
    if (playerData.id.length >= 5) {
        playerData.nama = "DST XhellY";
        nameDiv.innerHTML = `✅ Selamat Datang <strong>${playerData.nama}</strong>`;
        nameDiv.style.display = "block";
    } else {
        nameDiv.style.display = "none";
    }
}

// STEP 2: Load Produk FF
function loadProdukFF() {
    const db = getDB();
    const ffProduk = db.produk.filter(p => p.game === "Free Fire");
    
    const bestSeller = ffProduk.filter(p => p.bestSeller);
    const all = ffProduk;

    renderProduk('bestSeller', bestSeller);
    renderProduk('allProducts', all);
}

function renderProduk(containerId, list) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    list.forEach(p => {
        container.innerHTML += `
            <div class="product-card" data-id="${p.id}" onclick="pilihNominal(${p.id})">
                <img src="https://img.icons8.com/fluency/96/FFC107/diamond.png" alt="Diamond">
                <div class="product-amount">${p.nominal} Diamonds</div>
                <div class="product-original">Dari ${formatRupiah(p.hargaAsal)}</div>
                <div class="product-price">${formatRupiah(p.hargaJual)}</div>
                <div class="product-discount">-${p.diskon}%</div>
                <div class="product-rewards">${p.rewards} Rewards</div>
            </div>
        `;
    });
}

// Pilih Nominal
function pilihNominal(id) {
    const db = getDB();
    const produk = db.produk.find(p => p.id === id);
    if (!produk) return;

    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.product-card[data-id="${id}"]`)?.classList.add('selected');

    keranjang = produk;
    document.getElementById('selectedInfo').innerHTML = `${produk.nominal} Diamonds • ${formatRupiah(produk.hargaJual)}`;
    document.getElementById('bottomBar').style.display = "flex";
    document.querySelector('.continue-btn').disabled = false;
}

// Lanjut ke Pembayaran
function lanjutKePembayaran() {
    if (!keranjang) return;
    document.getElementById('step2').style.display = "none";
    document.getElementById('step3').style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Pilih Metode Bayar
function pilihBayar(metode, harga) {
    metodeBayar = { nama: metode, harga: harga };
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    document.getElementById('step3').style.display = "none";
    document.getElementById('step4').style.display = "block";
    
    const pajak = Math.round(keranjang.hargaJual * 0.11);
    const total = keranjang.hargaJual + pajak;
    
    document.getElementById('detailProduct').textContent = keranjang.nama;
    document.getElementById('detailId').textContent = playerData.id;
    document.getElementById('detailMethod').textContent = metode;
    document.getElementById('detailPrice').textContent = formatRupiah(keranjang.hargaJual);
    document.getElementById('detailTax').textContent = formatRupiah(pajak);
    document.getElementById('detailTotal').textContent = formatRupiah(total);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tampil Popup
function showPopup() {
    const email = document.getElementById('buyerEmail').value.trim();
    if (!playerData.id) { alert('⚠️ Masukkan Player ID dulu!'); return; }
    if (!keranjang) { alert('⚠️ Pilih nominal top up!'); return; }
    if (!metodeBayar) { alert('⚠️ Pilih metode pembayaran!'); return; }
    if (!email) { alert('⚠️ Masukkan email Anda!'); return; }
    if (!document.getElementById('agreePromo').checked) { alert('⚠️ Setuju dengan syarat & ketentuan!'); return; }

    const pajak = Math.round(keranjang.hargaJual * 0.11);
    const total = keranjang.hargaJual + pajak;

    document.getElementById('popNickname').textContent = playerData.nama;
    document.getElementById('popId').textContent = playerData.id;
    document.getElementById('popProduct').textContent = keranjang.nama;
    document.getElementById('popMethod').textContent = metodeBayar.nama;
    document.getElementById('popPrice').textContent = formatRupiah(keranjang.hargaJual);
    document.getElementById('popTax').textContent = formatRupiah(pajak);
    document.getElementById('popTotal').textContent = formatRupiah(total);

    document.getElementById('popupOverlay').style.display = "flex";
    document.getElementById('popup').style.display = "block";
}

function tutupPopup() {
    document.getElementById('popupOverlay').style.display = "none";
    document.getElementById('popup').style.display = "none";
}

// Konfirm Pesanan
function konfirmPesanan() {
    tutupPopup();
    document.getElementById('loadingOverlay').style.display = "flex";

    const pajak = Math.round(keranjang.hargaJual * 0.11);
    const total = keranjang.hargaJual + pajak;

    // Simpan ke Database
    const db = getDB();
    const orderBaru = {
        id: Date.now(),
        nama: playerData.nama,
        playerId: playerData.id,
        produk: keranjang.nama,
        nominal: keranjang.nominal,
        harga: keranjang.hargaJual,
        pajak: pajak,
        total: total,
        metode: metodeBayar.nama,
        email: document.getElementById('buyerEmail').value.trim(),
        status: "Baru",
        tarikh: new Date().toLocaleString('id-ID')

      const rewards = Math.floor(nominal / 2);
const bestSeller = document.getElementById('prodBest').checked;

if (!game || !nama || !nominal || !hargaAsal || !hargaJual) {
    alert('⚠️ Lengkapi semua data!');
    return;
}

if (editId) {
    // Edit produk sedia ada
    const idx = db.produk.findIndex(p => p.id === parseInt(editId));
    if (idx !== -1) {
        db.produk[idx] = {
            ...db.produk[idx],
            game, nama, nominal, hargaAsal, hargaJual, diskon, rewards, bestSeller
        };
    }
    document.getElementById('editId').value = '';
} else {
    // Tambah produk baru
    db.produk.push({
        id: Date.now(), game, nama, nominal, hargaAsal, hargaJual, diskon, rewards, bestSeller
    });
}

saveDB(db);
alert('✅ Produk disimpan!');
document.getElementById('prodForm').reset();
loadProdukAdmin();
}

function editProduk(id) {
    const db = getDB();
    const p = db.produk.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('editId').value = p.id;
    document.getElementById('prodGame').value = p.game;
    document.getElementById('prodNama').value = p.nama;
    document.getElementById('prodNominal').value = p.nominal;
    document.getElementById('prodHargaAsal').value = p.hargaAsal;
    document.getElementById('prodHargaJual').value = p.hargaJual;
    document.getElementById('prodBest').checked = p.bestSeller;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function padamProduk(id) {
    if (!confirm('⚠️ Pasti hapus produk ini?')) return;
    const db = getDB();
    db.produk = db.produk.filter(p => p.id !== id);
    saveDB(db);
    loadProdukAdmin();
}

function loadSetting() {
    const db = getDB();
    document.getElementById('setNama').value = db.nama;
    document.getElementById('setWa').value = db.wa;
    document.getElementById('setUser').value = db.user;
}

function simpanSetting() {
    const db = getDB();
    db.nama = document.getElementById('setNama').value.trim();
    db.wa = document.getElementById('setWa').value.trim();
    db.user = document.getElementById('setUser').value.trim();
    const passBaru = document.getElementById('setPass').value.trim();
    if (passBaru) db.pass = passBaru;
    saveDB(db);
    alert('✅ Tetapan disimpan!');
}

function exportData() {
    const db = getDB();
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topupstore-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Auto-init bila halaman load
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    if (document.getElementById('bestSeller')) loadProdukFF();
    if (document.getElementById('totalProduk')) loadDashboard();
    if (document.getElementById('produkList')) loadProdukAdmin();
    if (document.getElementById('orderList')) loadOrderAdmin();
    if (document.getElementById('setNama')) loadSetting();
});
      
