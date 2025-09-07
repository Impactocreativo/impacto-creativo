/* ====== Carrito con localStorage + mejoras de accesibilidad ====== */
const PHONE = "59899063756";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const els = {
  modal: null,
  itemsContainer: null,
  counter: null,
  total: null,
  emptyMsg: null,
  checkoutBtn: null,
};

document.addEventListener("DOMContentLoaded", () => {
  // Cache de elementos
  els.modal = document.getElementById("cart-modal");
  els.itemsContainer = document.getElementById("cart-items-container");
  els.counter = document.getElementById("cart-counter");
  els.total = document.getElementById("cart-total");
  els.emptyMsg = document.getElementById("empty-cart-message");
  els.checkoutBtn = document.getElementById("checkout-btn");

  // Listeners globales (delegación)
  document.body.addEventListener("click", handleGlobalClicks);
  document.addEventListener("keydown", handleKeydown);

  // Lazy + fallback para imágenes
  setupImageFallback();

  // Pintar carrito inicial
  updateCartUI();
});

/* ========== Delegación de eventos ========== */
function handleGlobalClicks(e) {
  const t = e.target;

  // Abrir modal carrito
  if (t.closest(".cart-icon-container")) {
    openModal();
    return;
  }
  // Cerrar modal
  if (t.closest(".close-button")) {
    closeModal();
    return;
  }
  // Cerrar modal al hacer click en el fondo
  if (t === els.modal) {
    closeModal();
    return;
  }
  // Agregar al carrito
  if (t.closest(".add-to-cart-btn")) {
    addToCartFromButton(t.closest(".add-to-cart-btn"));
    return;
  }
  // Cambiar cantidad (+/-)
  if (t.matches("[data-qty]")) {
    changeQuantity(t.dataset.name, Number(t.dataset.qty));
    return;
  }
  // Eliminar item
  if (t.matches(".remove-item-btn")) {
    removeItem(t.dataset.name);
    return;
  }
  // Toggle plegable
  if (t.closest(".toggle-button")) {
    const btn = t.closest(".toggle-button");
    const targetSel = btn.getAttribute("data-toggle");
    if (targetSel) toggleDisplay(targetSel, btn);
    return;
  }
}

function handleKeydown(e) {
  if (e.key === "Escape") closeModal();
}

/* ========== Utilidades imágenes ========== */
function setupImageFallback() {
  // Placeholder SVG por si falta imagen
  const placeholderSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'>
    <rect width='100%' height='100%' fill='#eeeeee'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      fill='#888' font-family='Arial, sans-serif' font-size='20'>Imagen no disponible</text>
  </svg>`;
  const fallback = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(placeholderSVG);

  document.querySelectorAll("img").forEach(img => {
    img.setAttribute("loading", img.getAttribute("loading") || "lazy");
    img.setAttribute("decoding", img.getAttribute("decoding") || "async");
    img.addEventListener("error", () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = "true";
        img.src = fallback;
        img.alt = (img.alt || "Imagen") + " (no disponible)";
      }
    });
  });
}

/* ========== Carrito ========== */
function addToCartFromButton(buttonEl) {
  const productItem = buttonEl.closest(".product-item");
  if (!productItem) return;

  const name = productItem.getAttribute("data-name") || productItem.querySelector("h4")?.textContent?.trim() || "Producto";
  const priceStr = productItem.getAttribute("data-price") || productItem.querySelector(".product-price")?.textContent || "0";
  const price = parseFloat(String(priceStr).replace(/[^\d.,]/g, "").replace(",", "."));

  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price: isFinite(price) ? price : 0, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  els.itemsContainer.innerHTML = "";
 
