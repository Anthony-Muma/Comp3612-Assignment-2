import { showToast } from "./toast.js";

// OBJECT CONSTRUCTORS

// An object constructor for a single cart item
function singleCartItemObject(id, quantity, name, price, color, size) {
  this.id = id;
  this.quantity = quantity;
  this.name = name;
  this.price = price;
  this.color = color;
  this.size = size;
}

// An object constructor for the cart object
function cartObject() {
  this.quantity = 0;
  this.content = [];
}

// Cart adding & removing functions -------------------------------------------------------------------------------

export function addToCart(productData, quantity = 1, color = "#ffffff", size = "M") { 

  const cartData = JSON.parse(localStorage.getItem("cart"));

  let cartItemData = cartData.content.find(item =>
    item.id === productData.id &&
    item.color === color &&
    item.size === size
  );

  // If product was found within cart
  if (cartItemData) {

    // Logic
    cartItemData.quantity += quantity;
    cartData.quantity += quantity;

    // Update cart HTML
    const cartItemHtml = document.querySelector(`#cart-product-container [data-product-id='${productData.id}'][data-color='${color}'][data-size='${size}']`);
    updateCartProductHtml(cartItemHtml, cartItemData);

  // Else create new cart item
  } else {

    // Logic
    cartItemData = new singleCartItemObject(productData.id, quantity, productData.name, productData.price, color, size)
    cartData.content.push(cartItemData);
    cartData.quantity += quantity;

    // Create cart HTML
    createSingleCartProductHtml(cartItemData);

  }

  // Update Cart Icon Button
  updateCartButton(cartData);

  // Save Cart
  localStorage.setItem("cart", JSON.stringify(cartData));
  updateOrderSummary();
}

export function removeFromCart(id, size, color, cartItemHtml) {

  const cartData = JSON.parse(localStorage.getItem("cart"));

  const cartItemDataIndex = cartData.content.findIndex(item => 
    item.id === id && 
    item.size === size && 
    item.color === color
  );

  let cartItemData = cartData.content[cartItemDataIndex];

  // If product was found within cart
  if (cartItemData) {

    // Logic
    cartItemData.quantity -= 1;
    cartData.quantity -= 1;

    // Update cart HTML
    updateCartProductHtml(cartItemHtml, cartItemData);
    
    // Remove object when quantity is 0
    if (cartItemData.quantity <= 0) {
      cartData.content.splice(cartItemDataIndex, 1);
      removeCartProductHtml(cartItemHtml);
    }
  }

  // Update cart icon button
  updateCartButton(cartData);

  // Save Cart
  localStorage.setItem("cart", JSON.stringify(cartData));
  updateOrderSummary();
}

// Internal cart functions -------------------------------------------------------------------------------

// 1. Currency Formatter https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/
const money = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

// 2. Shipping Logic Matrix
const getShippingCost = (destination, method) => {
  const rates = {
    'Canada': { 'Standard': 10, 'Express': 25, 'Priority': 35 },
    'US': { 'Standard': 15, 'Express': 25, 'Priority': 50 },
    'Int': { 'Standard': 20, 'Express': 30, 'Priority': 50 }
  };
  return rates[destination][method];
};

// 3.Calculation Logic
function updateOrderSummary() {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  if (!cartData) return;

  // A. Calculate Merchandise Total
  const merchTotal = cartData.content.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // B. Get selected dropdown values
  const dest = document.querySelector("#cart-destination").value;
  const method = document.querySelector("#cart-shipping-method").value;

  // C. Calculate Shipping (Free if > $500)
  let shipCost = (merchTotal > 500) ? 0 : getShippingCost(dest, method);

  // D. Calculate Tax, apply 5% if canada else 0
  let tax = (dest === 'Canada') ? (merchTotal + shipCost) * 0.05 : 0;

  // E. Update HTML Elements
  document.querySelector("#summary-merchandise").textContent = money(merchTotal);
  document.querySelector("#summary-shipping").textContent = (shipCost === 0) ? "Free" : money(shipCost);
  document.querySelector("#summary-tax").textContent = money(tax);
  document.querySelector("#summary-total").textContent = money(merchTotal + shipCost + tax);
  document.querySelector("#tax-label").textContent = (dest === 'Canada') ? "(5% GST)" : "(0%)";

  // F. Toggle Empty State visibility
  const isEmpty = cartData.content.length === 0;
  document.querySelector("#cart-empty-message").classList.toggle("hidden", !isEmpty);
  document.querySelector("#cart-footer").classList.toggle("hidden", isEmpty);

  // Disable checkout if empty
  document.querySelector("#btn-checkout").disabled = isEmpty;
}

// 4. Checkout Logic
function handleCheckout() {
  localStorage.removeItem("cart");
  showToast("Order placed! Returning to home."); 
  document.querySelector("#nav-home").click(); // Navigate home

  const emptyCart = { quantity: 0, content: [] };
  localStorage.setItem("cart", JSON.stringify(emptyCart)); //forgot to set a new cart on checkout
  //TODO must reset the checkout /footer
  document.querySelector("#cart-footer").classList.toggle("hidden");
  document.querySelector("#cart-empty-message").classList.toggle("hidden");


  // Reset UI
  document.querySelector("#cart-product-container").innerHTML = "";
  updateCartButton({ quantity: 0 });
}

// DOM helper functions -------------------------------------------------------------------------------

function createSingleCartProductHtml(cartItemData) {
  const container = document.querySelector("#cart-product-container");
  const template = document.querySelector("#cart-product-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".title").textContent = cartItemData.name;
  clone.querySelector(".quantity").textContent = cartItemData.quantity;

  clone.querySelector(".price").textContent = money(cartItemData.price); //formatted price

  const lineTotal = cartItemData.price * cartItemData.quantity;
  clone.querySelector(".subtotal").textContent = money(lineTotal); // subtotal for one specific row

  clone.querySelector(".size").textContent = cartItemData.size // size
  const colorBox = clone.querySelector(".cart-color");

  colorBox.style.backgroundColor = cartItemData.color;
  colorBox.title = cartItemData.color;


  clone.querySelector(".cart-product").dataset.productId = cartItemData.id
  clone.querySelector(".cart-product").dataset.color = cartItemData.color
  clone.querySelector(".cart-product").dataset.size = cartItemData.size

  container.appendChild(clone);
}

function updateCartProductHtml(element, cartItemData) {
  const newSubTotal = cartItemData.price * cartItemData.quantity;
  element.querySelector(".quantity").textContent = cartItemData.quantity;
  element.querySelector(".subtotal").textContent = money(newSubTotal);
}

function removeCartProductHtml(element) {
  element.remove();
}

function updateCartButton(cartData) {
  const cartButtonNumber = document.querySelector("#nav-cart span");
  cartButtonNumber.textContent = cartData.quantity;
}

// Init -------------------------------------------------------------------------------

export function initCart(products) {
  let cartData = JSON.parse(localStorage.getItem("cart"));
  const container = document.querySelector("#cart-product-container");

  // Clear previous items to prevent duplicates on re-render
  container.innerHTML = "";

  // Render Existing Cart
  if (cartData && cartData.content.length > 0) {
    cartData.content.forEach(cartItemData => {
      createSingleCartProductHtml(cartItemData);
    });
  } else {
    // If no cart exists, create empty one
    if (!cartData) {
      cartData = new cartObject();
      localStorage.setItem("cart", JSON.stringify(cartData));
    }
  }


  // 1. Update the nav button
  updateCartButton(cartData);

  // 2. Attach Listeners for Shipping/Checkout
  const destSelect = document.querySelector("#cart-destination");
  const methodSelect = document.querySelector("#cart-shipping-method");
  const checkoutBtn = document.querySelector("#btn-checkout");

  destSelect.addEventListener("change", updateOrderSummary);
  methodSelect.addEventListener("change", updateOrderSummary);
  checkoutBtn.addEventListener("click", handleCheckout);

  // 3. Initial Calculation
  updateOrderSummary();
}
