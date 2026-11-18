const DEFAULT_PRODUCTS = [
  {
    id: "soy-milk",
    name: "Sữa đậu nành",
    price: 12000,
    category: "classic",
    description: "Thơm ngon, béo nhẹ từ hạt đậu nành.",
    // Ảnh ly sữa trắng thanh mát
    image: "images/Sữa đậu nành.jpg"
  },
  {
    id: "mung-bean-milk",
    name: "Sữa đậu xanh",
    price: 16000,
    category: "classic",
    description: "Vị bùi dịu, thân quen từ đậu xanh.",
    // Ảnh ly sữa xanh matcha/đậu xanh
    image: "images/Sữa đậu xanh.jpg"
  },
  {
    id: "roasted-rice-milk",
    name: "Sữa gạo rang",
    price: 20000,
    category: "classic",
    description: "Hương gạo rang thơm nhẹ, dễ uống.",
    // Ảnh bình/ly sữa hạt tự nhiên
    image: "images/Sữa gạo rang.jpg"
  },
  {
    id: "walnut-milk",
    name: "Sữa óc chó",
    price: 25000,
    category: "special",
    description: "Bùi thơm, béo nhẹ với hương vị đặc trưng của óc chó.",
    // Ảnh sữa hạt kèm hạt dinh dưỡng
    image: "images/Sữa óc chó.jpg"
  },
  {
    id: "brown-rice-milk",
    name: "Sữa gạo lứt",
    price: 20000,
    category: "classic",
    description: "Thơm bùi vị gạo lứt rang, mộc mạc và gần gũi.",
    // Ảnh đồ uống tông nâu ấm
    image: "images/Sữa gạo lứt.jpg"
  },
  {
    id: "purple-sweet-potato-milk",
    name: "Sữa khoai tím",
    price: 22000,
    category: "special",
    description: "Màu tím dịu mắt, vị bùi ngọt tự nhiên.",
    // Ảnh ly đồ uống sắc tím khoai môn/khoai tím
    image: "images/Sữa khoai tím.jpg"
  },
  {
    id: "lotus-seed-milk",
    name: "Sữa hạt sen",
    price: 25000,
    category: "special",
    description: "Vị thanh bùi, nhẹ nhàng từ hạt sen.",
    // Ảnh chai/ly sữa hạt thanh khiết
    image: "images/Sữa hạt sen.jpg"
  }
];

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

let products = read("bean_products", DEFAULT_PRODUCTS);




let cart = read("bean_cart", []);
let orders = read("bean_orders", []);


// ==========================================
// 1. KHAI BÁO HÀM VÀ TIỆN ÍCH
// ==========================================

const $ = s => document.querySelector(s),
    money = n => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const save = () => {
    localStorage.setItem("bean_products", JSON.stringify(products));
    localStorage.setItem("bean_cart", JSON.stringify(cart));
    localStorage.setItem("bean_orders", JSON.stringify(orders));
};

const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[c]));


// ==========================================
// 2. HIỂN THỊ DANH SÁCH SẢN PHẨM
// ==========================================

function renderProducts(filter = "all") {
    const list = products.filter(p =>
        filter === "all" || p.category === filter
    );

    $("#productGrid").innerHTML = list.length
        ? list.map(p => `
            <article class="product-card">
                <div class="product-image">
                    <img
                        src="${safe(p.image || '')}"
                        alt="${safe(p.name)}"
                        onerror="this.src='https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80'"
                    >

                    <span class="product-tag">
                        ${p.category === "special"
                            ? "NHÀ BEAN GỢI Ý"
                            : "ĐƯỢC YÊU THÍCH"}
                    </span>
                </div>

                <div class="product-info">
                    <h3>${safe(p.name)}</h3>

                    <p>${safe(p.description)}</p>

                    <div class="product-bottom">
                        <span class="price">${money(p.price)}</span>

                        <button
                            class="add-btn"
                            data-add="${safe(p.id)}"
                            aria-label="Thêm ${safe(p.name)}"
                        >+</button>
                    </div>
                </div>
            </article>
        `).join("")
        : `<p>Chưa có sản phẩm trong danh mục này.</p>`;
}


// ==========================================
// 3. GIỎ HÀNG
// ==========================================

function renderCart() {
    let count = cart.reduce((a, x) => a + x.qty, 0),
        total = cart.reduce((a, x) => a + x.price * x.qty, 0);

    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = money(total);
    $("#checkoutTotal").textContent = money(total);

    $("#cartItems").innerHTML = cart.length
        ? cart.map(x => `
            <div class="cart-line">
                <img src="${safe(x.image)}" alt="">

                <div>
                    <strong>${safe(x.name)}</strong>

                    <small>${money(x.price)}</small>

                    <div class="qty">
                        <button
                            data-qty="${safe(x.id)}"
                            data-delta="-1"
                        >−</button>

                        <span>${x.qty}</span>

                        <button
                            data-qty="${safe(x.id)}"
                            data-delta="1"
                        >+</button>
                    </div>
                </div>

                <button
                    class="remove"
                    data-remove="${safe(x.id)}"
                >Xóa</button>
            </div>
        `).join("")
        : `
            <p style="color:#687468;font-size:13px;padding:25px 0">
                Giỏ hàng đang trống. Mời bạn chọn vị yêu thích nhé!
            </p>
        `;

    $("#checkoutOpen").disabled = !cart.length;
    $("#checkoutOpen").style.opacity = cart.length ? 1 : .5;
}


// ==========================================
// 4. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ==========================================

function addToCart(id) {
    let p = products.find(x => x.id === id);

    if (!p) return;

    let item = cart.find(x => x.id === id);

    item ? item.qty++ : cart.push({ ...p, qty: 1 });

    save();
    renderCart();
    openCart();
}


// ==========================================
// 5. ĐIỀU KHIỂN GIỎ HÀNG VÀ MODAL
// ==========================================

function openCart() {
    $("#overlay").classList.add("show");
    $("#cartDrawer").classList.add("open");
}

function closeAll() {
    $("#overlay").classList.remove("show");
    $("#cartDrawer").classList.remove("open");

    document.querySelectorAll(".modal").forEach(m =>
        m.classList.remove("show")
    );
}


// ==========================================
// 6. XỬ LÝ CÁC SỰ KIỆN CLICK
// ==========================================

document.addEventListener("click", e => {

    let add = e.target.closest("[data-add]");

    if (add) addToCart(add.dataset.add);


    let qty = e.target.closest("[data-qty]");

    if (qty) {
        let item = cart.find(x => x.id === qty.dataset.qty);

        if (item) {
            item.qty += Number(qty.dataset.delta);

            if (item.qty <= 0) {
                cart = cart.filter(x => x.id !== item.id);
            }

            save();
            renderCart();
        }
    }


    let rem = e.target.closest("[data-remove]");

    if (rem) {
        cart = cart.filter(x => x.id !== rem.dataset.remove);

        save();
        renderCart();
    }


    if (e.target.matches("[data-close]")) closeAll();


    let tab = e.target.closest("[data-tab]");

    if (tab) {
        document.querySelectorAll(".tab").forEach(x =>
            x.classList.toggle("active", x === tab)
        );

        document.querySelectorAll(".admin-panel").forEach(x =>
            x.classList.toggle("hidden", x.id !== tab.dataset.tab)
        );
    }
});


// ==========================================
// 7. NÚT GIỎ HÀNG, THANH TOÁN VÀ ADMIN
// ==========================================

$("#cartOpen").onclick = openCart;

$("#overlay").onclick = closeAll;

$("#checkoutOpen").onclick = () => {
    if (cart.length) {
        $("#checkoutModal").classList.add("show");

        $("#checkoutTotal").textContent = money(
            cart.reduce((a, x) => a + x.price * x.qty, 0)
        );
    }
};

$("#adminOpen").onclick = () => {
    renderAdmin();
    $("#adminModal").classList.add("show");
};


// ==========================================
// 8. MENU ĐIỀU HƯỚNG
// ==========================================

$("#menuToggle").onclick = () =>
    $("#mainNav").classList.toggle("show");

document.querySelectorAll("#mainNav a").forEach(a =>
    a.onclick = () => $("#mainNav").classList.remove("show")
);


// ==========================================
// 9. LỌC SẢN PHẨM THEO DANH MỤC
// ==========================================

$("#filters").onclick = e => {
    let b = e.target.closest("[data-filter]");

    if (!b) return;

    document.querySelectorAll(".filter").forEach(x =>
        x.classList.toggle("active", x === b)
    );

    renderProducts(b.dataset.filter);
};


// ==========================================
// 10. XỬ LÝ ĐẶT HÀNG
// ==========================================

$("#checkoutForm").onsubmit = e => {
    e.preventDefault();

    if (!cart.length) return;

    let f = new FormData(e.target),
        order = {
            id: "NB" + Date.now().toString().slice(-7),
            created: new Date().toLocaleString("vi-VN"),
            name: f.get("name"),
            phone: f.get("phone"),
            address: f.get("address"),
            note: f.get("note"),
            items: cart.map(x => ({ ...x })),
            total: cart.reduce((a, x) => a + x.price * x.qty, 0),
            status: "Mới"
        };

    orders.unshift(order);
    cart = [];

    save();
    renderCart();

    e.target.reset();
    closeAll();

    $("#successText").textContent =
        `Mã đơn ${order.id} · Tổng ${money(order.total)}. Nhà Bean sẽ liên hệ ${order.phone} để xác nhận.`;

    $("#successModal").classList.add("show");
};


// ==========================================
// 11. QUẢN LÝ ADMIN
// ==========================================

function renderAdmin() {

    // Danh sách sản phẩm

    $("#adminProductList").innerHTML = products.map(p => `
        <div class="admin-row">
            <div>
                <strong>${safe(p.name)}</strong>

                <small>
                    ${money(p.price)} ·
                    ${p.category === "special"
                        ? "Vị đặc biệt"
                        : "Vị quen thuộc"}
                </small>
            </div>

            <div>
                <button data-edit="${safe(p.id)}">Sửa</button>
                <button data-delete="${safe(p.id)}">Xóa</button>
            </div>
        </div>
    `).join("") || "<p>Chưa có sản phẩm.</p>";


    // Danh sách đơn hàng

    $("#adminOrderList").innerHTML = orders.length
        ? orders.map(o => `
            <div class="admin-row">
                <div>
                    <strong>${safe(o.id)} · ${safe(o.name)}</strong>

                    <small>
                        ${safe(o.phone)} · ${safe(o.created)}<br>
                        ${o.items.map(i =>
                            safe(i.name) + " × " + i.qty
                        ).join(", ")}<br>
                        ${safe(o.address)}<br>
                        <b>${money(o.total)}</b>
                    </small>
                </div>

                <div>
                    <span class="order-status">
                        ${safe(o.status)}
                    </span>

                    <button data-done="${safe(o.id)}">
                        Đã xử lý
                    </button>
                </div>
            </div>
        `).join("")
        : "<p>Chưa có đơn hàng nào.</p>";
}


// ==========================================
// 12. THÊM VÀ CẬP NHẬT SẢN PHẨM
// ==========================================

$("#productForm").onsubmit = e => {
    e.preventDefault();

    let f = new FormData(e.target),
        id = f.get("id") || "p" + Date.now(),
        p = {
            id,
            name: f.get("name"),
            price: Number(f.get("price")),
            category: f.get("category"),
            description: f.get("description"),
            image: f.get("image") ||
                "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80"
        };

    let i = products.findIndex(x => x.id === id);

    i >= 0 ? products[i] = p : products.push(p);

    save();

    renderProducts(
        document.querySelector(".filter.active")?.dataset.filter || "all"
    );

    renderAdmin();

    e.target.reset();
};


// ==========================================
// 13. RESET FORM SẢN PHẨM
// ==========================================

$("#productReset").onclick = () =>
    $("#productForm").reset();


// ==========================================
// 14. SỬA, XÓA SẢN PHẨM VÀ CẬP NHẬT ĐƠN HÀNG
// ==========================================

document.addEventListener("click", e => {

    // Sửa sản phẩm

    let edit = e.target.closest("[data-edit]");

    if (edit) {
        let p = products.find(x => x.id === edit.dataset.edit),
            f = $("#productForm");

        Object.entries(p).forEach(([k, v]) => {
            if (f.elements[k]) {
                f.elements[k].value = v;
            }
        });

        f.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    // Xóa sản phẩm

    let del = e.target.closest("[data-delete]");

    if (del && confirm("Xóa sản phẩm này?")) {
        products = products.filter(x => x.id !== del.dataset.delete);

        cart = cart.filter(x => x.id !== del.dataset.delete);

        save();

        renderProducts();
        renderCart();
        renderAdmin();
    }


    // Cập nhật trạng thái đơn hàng

    let done = e.target.closest("[data-done]");

    if (done) {
        let o = orders.find(x => x.id === done.dataset.done);

        if (o) o.status = "Đã xử lý";

        save();
        renderAdmin();
    }
});


// ==========================================
// 15. KHỞI TẠO WEBSITE
// ==========================================

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();



// Xử lý hộp thoại chat Zalo
const zaloBox = $("#zaloBox");
const openZaloBox = (e) => {
  if (e) e.preventDefault();
  zaloBox.classList.toggle("open");
};

$("#zaloFloatBtn").onclick = openZaloBox;
$("#zaloCta").onclick = openZaloBox;
$("#zaloBoxClose").onclick = () => zaloBox.classList.remove("open");

$("#zaloSendBtn").onclick = () => {
  const text = $("#zaloInput").value.trim();
  const zaloUrl = "https://zalo.me/0779191188";
  // Copy sẵn lời nhắn nếu khách có nhập, sau đó mở cửa sổ chat Zalo
  if (text && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  window.open(zaloUrl, "_blank", "noopener");
};
