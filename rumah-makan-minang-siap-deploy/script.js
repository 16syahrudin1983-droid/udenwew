// Data Menu Otentik Rumah Makan Minang
const MENU_ITEMS = [
    {
        id: 1,
        name: "Rendang Daging Sapi",
        category: "daging",
        price: 26000,
        desc: "Daging sapi pilihan dimasak 8 jam dengan santan kental dan rempah Minang otentik hingga hitam karamel.",
        icon: "🥩",
        tag: "Terlaris"
    },
    {
        id: 2,
        name: "Ayam Pop Ranah Minang",
        category: "daging",
        price: 23000,
        desc: "Ayam kampung empuk direbus air kelapa dan rempah, digoreng kilat disajikan sambal lado tomat istimewa.",
        icon: "🍗",
        tag: "Favorit"
    },
    {
        id: 3,
        name: "Dendeng Batokok Lado Mudo",
        category: "daging",
        price: 27000,
        desc: "Irisan daging sapi empuk dipukul (batokok) lalu disiram sambal cabai hijau segar dan minyak kelapa panas.",
        icon: "🥩",
        tag: "Pedas Segar"
    },
    {
        id: 4,
        name: "Gulai Kepala Ikan Kakap",
        category: "seafood",
        price: 45000,
        desc: "Kepala kakap merah segar dalam kuah gulai rempah kuning asam kandis yang gurih dan tidak amis.",
        icon: "🐟",
        tag: "Spesial"
    },
    {
        id: 5,
        name: "Gulai Tunjang (Kikil)",
        category: "gulai",
        price: 25000,
        desc: "Kikil sapi lembut kenyal dengan kuah santan bumbu gulai pekat beraroma kapulaga dan serai.",
        icon: "🍲",
        tag: "Gurih Mantap"
    },
    {
        id: 6,
        name: "Cumi Sambal Ijo",
        category: "seafood",
        price: 24000,
        desc: "Cumi asin segar dimasak oseng sambal ijo kasar khas Padang dengan aroma daun jeruk.",
        icon: "🦑",
        tag: "Favorit"
    },
    {
        id: 7,
        name: "Gulai Daun Singkong & Nangka",
        category: "gulai",
        price: 12000,
        desc: "Sayur nangka muda dan daun singkong lembut berkuah santan kunyit khas pelengkap nasi kapau.",
        icon: "🥬",
        tag: "Wajib"
    },
    {
        id: 8,
        name: "Telur Dadar Barendo",
        category: "daging",
        price: 14000,
        desc: "Telur bebek dadar tebal, renyah bersarang (barendo) di luar dan lembut gurih di dalam.",
        icon: "🍳",
        tag: "Krispi"
    },
    {
        id: 9,
        name: "Teh Talua (Teh Telur)",
        category: "minuman",
        price: 15000,
        desc: "Minuman penambah stamina khas Minang racikan kuning telur kocok, teh pekat, susu, dan perasan jeruk nipis.",
        icon: "☕",
        tag: "Tradisional"
    },
    {
        id: 10,
        name: "Es Tebak Padang",
        category: "minuman",
        price: 18000,
        desc: "Es campur Minang dengan olahan tepung beras (tebak), tape singkong, cincau hitam, dan sirup merah legit.",
        icon: "🍧",
        tag: "Segar"
    }
];

// State Cart
let cart = [];

// DOM References
const menuGrid = document.getElementById("menuGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}

// Render Menu
function renderMenu(category = "all") {
    menuGrid.innerHTML = "";
    const filtered = category === "all" 
        ? MENU_ITEMS 
        : MENU_ITEMS.filter(item => item.category === category);

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-item-card";
        card.innerHTML = `
            <div class="menu-item-img">
                ${item.icon}
                <span class="menu-tag">${item.tag}</span>
            </div>
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">${formatRupiah(item.price)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">+ Tambah</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Filter Event
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.getAttribute("data-category"));
    });
});

// Cart Drawer Handlers
function toggleCart(open = true) {
    if (open) {
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
    } else {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
    }
}

openCartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// Cart Operations
window.addToCart = function(id) {
    const item = MENU_ITEMS.find(m => m.id === id);
    if (!item) return;

    const existing = cart.find(ci => ci.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    toggleCart(true);
};

function changeQty(id, delta) {
    const item = cart.find(ci => ci.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(ci => ci.id !== id);
    }
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

clearCartBtn.addEventListener("click", clearCart);

function updateCartUI() {
    // Total count
    const totalCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
    cartCount.textContent = totalCount;

    // Items list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty-state">Keranjang Anda masih kosong.</div>';
        cartTotalPrice.textContent = "Rp 0";
        return;
    }

    cartItemsContainer.innerHTML = "";
    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";
        cartItemEl.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)} x ${item.qty}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalPrice.textContent = formatRupiah(grandTotal);
}

// WhatsApp Checkout
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Pilih menu terlebih dahulu!");
        return;
    }

    const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp aktif
    let message = "Halo Rumah Makan Minang, saya ingin memesan menu berikut:\n\n";

    let grandTotal = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        grandTotal += subtotal;
        message += `${index + 1}. ${item.name} (${item.qty}x) = ${formatRupiah(subtotal)}\n`;
    });

    message += `\n*Total Estimasi: ${formatRupiah(grandTotal)}*\n\n`;
    message += "Mohon konfirmasi ketersediaan dan rincian ongkir. Terima kasih!";

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
});

// Initial Init
document.addEventListener("DOMContentLoaded", () => {
    renderMenu("all");
    updateCartUI();
});
