// Variabel global untuk menyimpan data kalkulasi belanja
let potonganDiskon = 0;
let kodePromoAktif = "";
let biayaOngkir = 0; // Default diatur ke 0 (Gratis Ongkir)

document.addEventListener('DOMContentLoaded', function () {
    // Jalankan fungsi render utama saat halaman dimuat
    renderCheckoutItems();

    // Event Listener untuk Tombol Apply Promo
    const btnApplyPromo = document.getElementById('btn-apply-promo');
    if (btnApplyPromo) {
        btnApplyPromo.addEventListener('click', prosesPromo);
    }

    // Aksi Klik Final Pembayaran
    const btnCheckout = document.querySelector('.btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function (e) {
            const cekIsi = localStorage.getItem('keranjangVPhone');
            if (!cekIsi || JSON.parse(cekIsi).length === 0) {
                alert('Tidak ada transaksi untuk diproses!');
                e.preventDefault();
                return;
            }
            localStorage.removeItem('keranjangVPhone');
            alert('Pembayaran Berhasil! Pesanan Anda segera diproses.');
            window.location.href = 'home.html';
        });
    }
});

// ====================================================
// FUNGSI UTAMA: MENCETAK BARANG DI HALAMAN CHECKOUT
// ====================================================
function renderCheckoutItems() {
    const dataKeranjang = localStorage.getItem('keranjangVPhone');
    
    const itemContainer = document.querySelector('.checkout-left .checkout-card:nth-child(1)');
    const subtotalElement = document.querySelectorAll('.summary-line span:last-child')[0];
    const discountElement = document.getElementById('discount-amount');
    const totalElement = document.querySelector('.total-line span:last-child');

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // TAMBAHAN: Template HTML untuk Tombol Kembali ke Katalog
    const tombolBackHTML = `
        <div style="margin-bottom: 1.5rem;">
            <a href="products.html" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #6c5ce7; text-decoration: none; font-weight: bold; font-size: 0.95rem; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#6c5ce7'">
                <i data-feather="arrow-left" style="width: 18px; height: 18px;"></i> Back to Shop
            </a>
        </div>
    `;

    if (dataKeranjang && JSON.parse(dataKeranjang).length > 0) {
        const daftarProduk = JSON.parse(dataKeranjang);
        
        // Memasukkan tombol back tepat di atas judul Items to Buy
        itemContainer.innerHTML = tombolBackHTML + `<h2><i data-feather="shopping-bag"></i> Items to Buy</h2>`;
        
        let hitungSubtotal = 0;

        daftarProduk.forEach(produk => {
            hitungSubtotal += (produk.harga * produk.qty);

            itemContainer.innerHTML += `
                <div class="cart-item" style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; background-color: #1a1a2e; padding: 1rem; border-radius: 10px; border: 1px solid rgba(108, 92, 231, 0.1);">
                    <img src="${produk.gambar}" alt="${produk.nama}" class="item-img" style="width: 80px; height: auto; object-fit: contain; background-color: #0b0b12; border-radius: 8px; padding: 5px;">
                    <div class="item-details" style="flex: 1;">
                        <h3 style="font-size: 1.2rem; margin-bottom: 0.3rem; color: #ffffff;">${produk.nama}</h3>
                        <p class="item-spec" style="font-size: 0.9rem; color: #aaa; margin-bottom: 0.5rem;">${produk.spek}</p>
                        <p class="item-price" style="font-size: 1.1rem; color: #6c5ce7; font-weight: bold;">${formatRupiah(produk.harga)}</p>
                    </div>
                    
                    <div class="item-quantity" style="display: flex; align-items: center; gap: 0.5rem; background: #0b0b12; padding: 5px 10px; border-radius: 20px;">
                        <button onclick="ubahQtyCheckout('${produk.id}', -1)" style="background: #333; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 1rem; display: flex; align-items: center; justify-content: center;">-</button>
                        <span style="color: white; font-size: 1.1rem; font-weight: bold; min-width: 25px; text-align: center;">${produk.qty}</span>
                        <button onclick="ubahQtyCheckout('${produk.id}', 1)" style="background: #6c5ce7; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 1rem; display: flex; align-items: center; justify-content: center;">+</button>
                    </div>
                </div>
            `;
        });

        // PERBAIKAN FORMULA: Menambahkan komponen biayaOngkir ke hitungan total akhir
        let totalAkhir = (hitungSubtotal + biayaOngkir) - potonganDiskon;
        if (totalAkhir < 0) totalAkhir = 0; 

        if (subtotalElement) subtotalElement.innerText = formatRupiah(hitungSubtotal);
        if (discountElement) discountElement.innerText = "- " + formatRupiah(potonganDiskon);
        if (totalElement) totalElement.innerText = formatRupiah(totalAkhir);
        
        if (typeof feather !== 'undefined') feather.replace();
    } else {
        // Tetap memunculkan tombol back walaupun keranjang belanja kosong
        itemContainer.innerHTML = tombolBackHTML + `
            <h2><i data-feather="shopping-bag"></i> Items to Buy</h2>
            <p style="color: #aaa; text-align: center; padding: 3rem 0; font-size: 1.1rem;">Keranjang belanja Anda kosong.</p>
        `;
        if (subtotalElement) subtotalElement.innerText = "Rp 0";
        if (discountElement) discountElement.innerText = "- Rp 0";
        if (totalElement) totalElement.innerText = "Rp 0";
        if (typeof feather !== 'undefined') feather.replace();
    }
}

// ====================================================
// PERBAIKAN BUG: Mengubah variabel pengecekan dari getKeranjang menjadi keranjang
// ====================================================
function ubahQtyCheckout(id, perubahan) {
    let keranjang = localStorage.getItem('keranjangVPhone');
    if (!keranjang) return; // FIX: Sebelumnya !getKeranjang (Penyebab eror)
    
    keranjang = JSON.parse(keranjang);
    const produk = keranjang.find(item => item.id === id);
    
    if (produk) {
        produk.qty += perubahan;
        if (produk.qty < 1) {
            const konfirmasi = confirm(`Apakah Anda ingin menghapus ${produk.nama} dari daftar belanja?`);
            if (konfirmasi) {
                keranjang = keranjang.filter(item => item.id !== id);
            } else {
                produk.qty = 1;
            }
        }
    }
    
    localStorage.setItem('keranjangVPhone', JSON.stringify(keranjang));
    renderCheckoutItems(); 
}

function ubahMetodeShipping(nilaiOngkir) {
    biayaOngkir = nilaiOngkir;
    
    const labelRegular = document.getElementById('label-shipping-regular');
    const labelFree = document.getElementById('label-shipping-free');

    if (nilaiOngkir === 0) {
        if (labelFree) labelFree.style.borderColor = "#6c5ce7";
        if (labelRegular) labelRegular.style.borderColor = "rgba(255,255,255,0.1)";
    } else {
        if (labelRegular) labelRegular.style.borderColor = "#6c5ce7";
        if (labelFree) labelFree.style.borderColor = "rgba(255,255,255,0.1)";
    }

    renderCheckoutItems(); 
}

function prosesPromo() {
    const inputPromo = document.getElementById('promo-code').value.trim().toUpperCase();
    const msgElement = document.getElementById('promo-message');

    if (inputPromo === "") {
        msgElement.style.display = "block";
        msgElement.style.color = "#ff4757";
        msgElement.innerText = "Silakan masukkan kode promo!";
        return;
    }

    const databasePromo = {
        "VPHONEGAMING": 500000,    
        "VPHONELITE": 200000,      
        "PROMOHEMAT": 150000,      
        "DISKONMEMBER": 300000,
        "FREEONGKIR": 25000,     
        "GRATISONGKIR": 25000    
    };

    if (databasePromo.hasOwnProperty(inputPromo)) {
        potonganDiskon = databasePromo[inputPromo];
        kodePromoAktif = inputPromo;

        msgElement.style.display = "block";
        msgElement.style.color = "#00b894"; 
        msgElement.innerText = `Kode promo ${inputPromo} berhasil digunakan!`;
        
        if (inputPromo === "GRATISONGKIR" || inputPromo === "FREEONGKIR") {
            const radioFree = document.querySelector('input[value="free"]');
            if (radioFree) {
                radioFree.checked = true;
                ubahMetodeShipping(0);
            }
        }
        
        renderCheckoutItems(); 
    } else {
        potonganDiskon = 0;
        kodePromoAktif = "";
        
        msgElement.style.display = "block";
        msgElement.style.color = "#ff4757"; 
        msgElement.innerText = "Kode promo tidak valid atau sudah kedaluwarsa.";
        
        renderCheckoutItems();
    }
}
