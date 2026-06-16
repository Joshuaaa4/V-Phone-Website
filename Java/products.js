const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

if (hamburger) {
    hamburger.onclick = (e) => {
        navbarNav.classList.toggle('active');
        if (shoppingCart) shoppingCart.classList.remove('active');
        e.preventDefault();
    };
}


const shoppingCart = document.querySelector('.shopping-cart');
const cartBtn = document.querySelector('#shopping-cart-btn');

if (cartBtn) {
    cartBtn.onclick = (e) => {
        if (shoppingCart) shoppingCart.classList.toggle('active');
        navbarNav.classList.remove('active');
        e.preventDefault();
        e.stopPropagation(); 
    };
}


if (shoppingCart) {
    shoppingCart.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


document.addEventListener('click', function(e) {
    if (hamburger && !hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    if (cartBtn && shoppingCart && !cartBtn.contains(e.target) && !shoppingCart.contains(e.target)) {
        shoppingCart.classList.remove('active');
    }
});


const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});


const databaseSpesifikasi = {
    "vphone-x1": {
        chipset: "MediaTek Dimensity 8200 Ultra",
        ram: "8GB RAM + 256GB ROM",
        battery: "5000 mAh",
        screen: "6.67-inch OLED 120Hz"
    },
    "vphone-x2": {
        chipset: "MediaTek Dimensity 9300",
        ram: "12GB RAM + 256GB ROM",
        battery: "5000 mAh",
        screen: "6.67-inch OLED 144Hz"
    },
    "vphone-vision": {
        chipset: "Snapdragon 7+ Gen 2",
        ram: "8GB RAM + 256GB ROM",
        battery: "5000 mAh",
        screen: "6.7-inch AMOLED"
    },
    "vphone-ultra": {
        chipset: "Snapdragon 8 Gen 2 (4nm)",
        ram: "12GB RAM + 512GB ROM",
        battery: "5100 mAh",
        screen: "6.73-inch AMOLED 2K"
    },
    "vphone-lite": {
        chipset: "Snapdragon 685",
        ram: "6GB RAM + 128GB ROM",
        battery: "5000 mAh",
        screen: "6.67-inch AMOLED"
    },
    "vphone-mini": {
        chipset: "Helio G99",
        ram: "4GB RAM + 128GB ROM",
        battery: "4500 mAh",
        screen: "6.1-inch IPS LCD"
    }
};

const modal = document.getElementById('product-modal');
const closeModalBtn = document.querySelector('.close-modal');
const detailButtons = document.querySelectorAll('.btn-detail');

detailButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const id = card.getAttribute('data-id') || "vphone-x1";
        const name = card.getAttribute('data-name') || card.querySelector('.prod-name').innerText;
        const priceText = card.querySelector('.prod-price').innerText;
        const imgSrc = card.querySelector('img').src;
        
        const dataSpecs = databaseSpesifikasi[id] || databaseSpesifikasi["vphone-x1"];

        document.getElementById('modal-title').innerText = name;
        document.getElementById('modal-price').innerText = priceText;
        document.getElementById('modal-img').src = imgSrc;
        
        const specsContainer = document.getElementById('modal-specs');
        specsContainer.innerHTML = `
            <p>⚙️ <b>Processor:</b> ${dataSpecs.chipset}</p>
            <p>💾 <b>Memory:</b> ${dataSpecs.ram}</p>
            <p>🔋 <b>Power:</b> ${dataSpecs.battery}</p>
            <p>📱 <b>Display:</b> ${dataSpecs.screen}</p>
        `;

        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('show'); }, 10);
    });
});

if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
}

function hideModal() {
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}


function beliLangsung(button) {
    const card = button.closest('.card');
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name') || card.querySelector('.prod-name').innerText;
    const priceText = card.querySelector('.prod-price').innerText;
    const imgSrc = card.querySelector('img').src;
    
    const dataSpecs = databaseSpesifikasi[id];
    const specs = dataSpecs ? dataSpecs.ram : "Standard Edition";

    tambahKeKeranjangData(id, name, priceText, imgSrc, specs);
    
    showToastNotification(name);
}

function tambahKeKeranjangData(id, name, price, imgSrc, specs) {
    let keranjang = localStorage.getItem('keranjangVPhone');
    keranjang = keranjang ? JSON.parse(keranjang) : [];

    const angkaHarga = parseInt(price.replace(/[^0-9]/g, ''));
    const produkEksis = keranjang.find(item => item.id === id);

    if (produkEksis) {
        produkEksis.qty += 1;
    } else {
        keranjang.push({
            id: id,
            nama: name,
            harga: angkaHarga,
            gambar: imgSrc,
            spek: specs,
            qty: 1
        });
    }

    localStorage.setItem('keranjangVPhone', JSON.stringify(keranjang));
    renderDropdownCart();
}

function renderDropdownCart() {
    const container = document.getElementById('cart-items-container');
    const totalText = document.getElementById('dropdown-cart-total');
    if (!container) return;

    const data = localStorage.getItem('keranjangVPhone');
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    if (data && JSON.parse(data).length > 0) {
        const daftar = JSON.parse(data);
        container.innerHTML = '';
        let total = 0;
        let totalQty = 0;

        daftar.forEach(item => {
            total += (item.harga * item.qty);
            totalQty += item.qty;
            
            container.innerHTML += `
                <div class="cart-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <img src="${item.gambar}" alt="${item.nama}" style="width: 50px; height: auto; object-fit: contain; background: #0b0b12; padding: 3px; border-radius: 5px;">
                    <div style="flex:1;">
                        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 0.2rem;">${item.nama}</h4>
                        <p style="font-size: 0.9rem; color: #6c5ce7; font-weight: bold; margin-bottom: 0.5rem;">${formatRupiah(item.harga)}</p>
                        
                        <div style="display: flex; align-items: center; gap: 0.5rem;" onclick="event.stopPropagation()">
                            <button onclick="ubahQty('${item.id}', -1, event)" style="background: #333; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.9rem;">-</button>
                            <span style="color: white; font-size: 1rem; font-weight: bold; min-width: 20px; text-align: center;">${item.qty}</span>
                            <button onclick="ubahQty('${item.id}', 1, event)" style="background: #6c5ce7; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.9rem;">+</button>
                        </div>
                    </div>
                    <button onclick="hapusItemDariDropdown('${item.id}', event)" style="background: transparent; color: #ff4757; border: none; cursor: pointer; font-size: 0.9rem;">
                        <i data-feather="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            `;
        });
        if (totalText) totalText.innerText = formatRupiah(total);

        const cartCountBadge = document.getElementById('cart-count');
        if (cartCountBadge) cartCountBadge.innerText = totalQty;

        if (typeof feather !== 'undefined') feather.replace();

    } else {
        container.innerHTML = `<p class="empty-message" style="text-align: center; color: #aaa; padding: 2rem 0; font-size: 1.1rem;">Keranjang masih kosong.</p>`;
        if (totalText) totalText.innerText = "Rp 0";
        
        const cartCountBadge = document.getElementById('cart-count');
        if (cartCountBadge) cartCountBadge.innerText = "0";
    }
}

function ubahQty(id, perubahan, e) {
    if (e) e.stopPropagation();

    let keranjang = localStorage.getItem('keranjangVPhone');
    if (!keranjang) return;
    
    keranjang = JSON.parse(keranjang);
    const produk = keranjang.find(item => item.id === id);
    
    if (produk) {
        produk.qty += perubahan;
        if (produk.qty < 1) {
            keranjang = keranjang.filter(item => item.id !== id);
        }
    }
    
    localStorage.setItem('keranjangVPhone', JSON.stringify(keranjang));
    renderDropdownCart();
}

function hapusItemDariDropdown(id, e) {
    if (e) e.stopPropagation();

    let keranjang = localStorage.getItem('keranjangVPhone');
    if (!keranjang) return;
    
    keranjang = JSON.parse(keranjang);
    keranjang = keranjang.filter(item => item.id !== id);
    
    localStorage.setItem('keranjangVPhone', JSON.stringify(keranjang));
    renderDropdownCart();
}

function showToastNotification(productName) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: #1a1a26;
        color: white;
        border-left: 4px solid #6c5ce7;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    toast.innerHTML = `
        <span style="color: #00b894; font-weight: bold;">✓</span> 
        <span><b>${productName}</b> berhasil ditambahkan ke keranjang!</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 50);

    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', renderDropdownCart);