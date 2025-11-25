import { addToCart } from "./cart.js";
import { showToast } from "./toast.js";

// State tracks the currently selected options
let currentSingleProductState = {
    product: null,
    color: null,
    size: null,
    quantity: 1
};

/* --- Helper Functions --- */

function updateState(product) {
    currentSingleProductState.product = product;
    // Safe check for color/size existence
    currentSingleProductState.color = (product.color && product.color[0]) ? product.color[0].hex : "#000000";
    currentSingleProductState.size = (product.sizes && product.sizes[0]) ? product.sizes[0] : "N/A";
    currentSingleProductState.quantity = 1;
}

function updateBreadcrumbs(product) {
    document.querySelector("#sp-breadcrumb-gender").textContent = product.gender;
    document.querySelector("#sp-breadcrumb-category").textContent = product.category;
    document.querySelector("#sp-breadcrumb-title").textContent = product.name;
}

function updateProductDetails(product) {
    document.querySelector("#sp-title").textContent = product.name;
    document.querySelector("#sp-description").textContent = product.description;
    document.querySelector("#sp-material").textContent = product.material;

    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);
    document.querySelector("#sp-price").textContent = formattedPrice;

    document.querySelector("#sp-quantity").value = 1;
}

function updateProductImage(product) {
    
    const imgContainer = document.querySelector("#sp-image-container");
    
    if (imgContainer) {
        imgContainer.textContent = ''; // Clear existing

        const img = document.createElement('img');
        img.src = `https://placehold.co/600x800?text=${encodeURIComponent(product.name)}`;
        img.alt = product.name;
        
        img.className = "object-cover w-full h-full"; 

        imgContainer.appendChild(img);
    }
}

function renderColorOptions(product) {
    const colorContainer = document.querySelector("#sp-colors");
    colorContainer.innerHTML = ""; 

    if (product.color) {
        product.color.forEach((c, index) => {
            const btn = document.createElement("button");
            btn.className = `w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${index === 0 ? 'ring-2 ring-black' : ''}`;
            btn.style.backgroundColor = c.hex;
            btn.title = c.name;
            
            btn.addEventListener("click", (e) => {
                Array.from(colorContainer.children).forEach(b => b.classList.remove('ring-2', 'ring-black'));
                e.target.classList.add('ring-2', 'ring-black');
                currentSingleProductState.color = c.hex;
            });
            colorContainer.appendChild(btn);
        });
    }
}

function renderSizeOptions(product) {
    const sizeContainer = document.querySelector("#sp-sizes");
    sizeContainer.innerHTML = "";

    if (product.sizes) {
        product.sizes.forEach((s, index) => {
            const btn = document.createElement("button");
            btn.className = `w-12 h-10 border text-sm font-bold uppercase transition-colors ${index === 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}`;
            btn.textContent = s;

            btn.addEventListener("click", (e) => {
                Array.from(sizeContainer.children).forEach(b => {
                    b.className = 'w-12 h-10 text-sm font-bold text-gray-900 uppercase transition-colors bg-white border border-gray-300 hover:border-black';
                });
                e.target.className = 'w-12 h-10 text-sm font-bold text-white uppercase transition-colors bg-black border border-black';
                currentSingleProductState.size = s;
            });
            sizeContainer.appendChild(btn);
        });
    }
}

function setupAddToCartButton() {
    const oldBtn = document.querySelector("#sp-add-btn");
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    newBtn.addEventListener("click", () => {
        const qtyInput = document.querySelector("#sp-quantity");
        const qty = parseInt(qtyInput.value) || 1;
        
        addToCart(
            currentSingleProductState.product, 
            qty, 
            currentSingleProductState.color, 
            currentSingleProductState.size
        );
        showToast(`Added ${qty} ${currentSingleProductState.product.name} to bag`);
    });
}

function renderRelatedProducts(product, allProducts) {
    const relatedContainer = document.querySelector("#sp-related-container");
    relatedContainer.innerHTML = ""; 

    const relatedItems = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 5);

    const template = document.querySelector("#browse-product-template");

    relatedItems.forEach(p => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".browse-product");
        
        card.dataset.productId = p.id;
        card.querySelector(".title").textContent = p.name;
        card.querySelector(".price").textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price);
        
        
        const img = card.querySelector("img");
        if(img) {
             img.src = `https://placehold.co/600x800?text=${encodeURIComponent(p.name)}`;
        }

        relatedContainer.appendChild(clone);
    });
}

export function populateSingleProduct(product, allProducts) {
    updateState(product);
    updateBreadcrumbs(product);
    updateProductDetails(product);
    updateProductImage(product);
    renderColorOptions(product);
    renderSizeOptions(product);
    setupAddToCartButton();
    renderRelatedProducts(product, allProducts);
}