//import { addToCart, removeFromCart, cartObject } from "./cartLogic.js";
import { addToCart, renderCart, removeFromCart } from "./WIP/cart.js";
import { initBrowse, addFilter, removeFilter, clearAllFilters, changeSort } from "./WIP/browse.js"
import { initGenderView } from "./WIP/genderview.js";
import { initHome } from "./WIP/home.js";
import { initGroup, COLOR_GROUPS } from "./color.js";
import { initGrouping, retrieve } from "./grouping.js";
import { showToast } from "./WIP/toast.js";
// import { initHome } from "./WIP/home.js";
//import {populateSingleProduct}  from "./WIP/singlepage.js"

// function loadHome(products) {
//     initHome(products);

/* -------------------------------------------------------------------------- */
/* Single Product Logic                                */
/* -------------------------------------------------------------------------- */

// Tracks the currently selected options in the Single Product View
let currentSingleProductState = {
    product: null,
    color: null,
    size: null,
    quantity: 1
};

function populateSingleProduct(product, allProducts) { 
    // 1. Update State
    currentSingleProductState.product = product;
    currentSingleProductState.color = product.color[0] ? product.color[0].hex : "#000000"; 
    currentSingleProductState.size = product.sizes[0] || "N/A";
    currentSingleProductState.quantity = 1;

    // 2. Breadcrumbs
    document.querySelector("#sp-breadcrumb-gender").textContent = product.gender;
    document.querySelector("#sp-breadcrumb-category").textContent = product.category;
    document.querySelector("#sp-breadcrumb-title").textContent = product.name;

    // 3. Main Details
    document.querySelector("#sp-title").textContent = product.name;
    document.querySelector("#sp-description").textContent = product.description;
    document.querySelector("#sp-material").textContent = product.material;
    
    // Format Price
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);
    document.querySelector("#sp-price").textContent = formattedPrice;
    
    // Reset Quantity
    document.querySelector("#sp-quantity").value = 1;

    // 4. Image
    const imgContainer = document.querySelector("#singleproduct .lg\\:col-span-8 > div:first-child");
    if(imgContainer) {
        imgContainer.innerHTML = `<img src="https://placehold.co/600x800?text=${encodeURIComponent(product.name)}" class="w-full h-full object-cover" alt="${product.name}">`;
    }

    // 5. Render Colors
    const colorContainer = document.querySelector("#sp-colors");
    colorContainer.innerHTML = ""; 
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

    // 6. Render Sizes
    const sizeContainer = document.querySelector("#sp-sizes");
    sizeContainer.innerHTML = "";
    product.sizes.forEach((s, index) => {
        const btn = document.createElement("button");
        btn.className = `w-12 h-10 border text-sm font-bold uppercase transition-colors ${index === 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}`;
        btn.textContent = s;

        btn.addEventListener("click", (e) => {
            Array.from(sizeContainer.children).forEach(b => {
                b.className = 'w-12 h-10 border border-gray-300 text-sm font-bold uppercase bg-white text-gray-900 hover:border-black transition-colors';
            });
            e.target.className = 'w-12 h-10 border border-black text-sm font-bold uppercase bg-black text-white transition-colors';
            currentSingleProductState.size = s;
        });
        sizeContainer.appendChild(btn);
    });

    // 7. Setup Add to Cart Button
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


    // 8. Related Products Section

    const relatedContainer = document.querySelector("#sp-related-container");
    relatedContainer.innerHTML = ""; // Clear previous items

    // Filter: SAME CATEGORY
    const relatedItems = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 5);

    const template = document.querySelector("#browse-product-template");

    relatedItems.forEach(p => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".browse-product");
        
        // Setup Data
        card.dataset.productId = p.id;
        card.querySelector(".title").textContent = p.name;
        card.querySelector(".price").textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price);
        
        // Setup Image
        const img = card.querySelector("img");
        if(img) {
            img.src = `https://placehold.co/600x800?text=${encodeURIComponent(p.name)}`;
        }

        relatedContainer.appendChild(clone);
    });
}

// }
function loadBrowse(products) {
    // 1. Initialize Filter Options
    initBrowse(products);

    // 2. Product Grid Event Listener (Quick Add & View Product)
    const productContainer = document.querySelector("#filtered-product-container");
    
    // Prevent duplicate listeners if loadBrowse is run multiple times
    const newProductContainer = productContainer.cloneNode(true);
    productContainer.parentNode.replaceChild(newProductContainer, productContainer);

    newProductContainer.addEventListener("click", (e) => {
        const element = e.target;
        const card = element.closest(".browse-product"); 
        if (!card) return; 
    
        // Case A: Quick Add (+) Button
        if (element.classList.contains("add-to-cart") || element.closest(".add-to-cart")) {
            const productId = card.dataset.productId; 
            const productData = products.find(p => p.id == productId);
            if (productData) {
                const defaultColor = productData.color[0] ? productData.color[0].hex : "#000000";
                const defaultSize = productData.sizes[0] || "One Size";
                addToCart(productData, 1, defaultColor, defaultSize);
                showToast(`Added ${productData.name} to bag`);
            }
            return;
        }
    
        // Case B: View Single Product
        const productId = card.dataset.productId;
        const productData = products.find(p => p.id == productId); 
    
        if (productData) {
            populateSingleProduct(productData, products); 
            swapView("singleproduct");
            window.scrollTo(0,0);
        }
    });

    // 3. Filter Tag Events (Clear All & Remove Tag)
    const filterTagContainer = document.querySelector("#active-filters");
    const newFilterTagContainer = filterTagContainer.cloneNode(true);
    filterTagContainer.parentNode.replaceChild(newFilterTagContainer, filterTagContainer);

    newFilterTagContainer.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;

        if (button.id === "clear-filter") {
            clearAllFilters(products);
        } else if (button.dataset.key) {
            removeFilter(products, button.dataset.key, button.dataset.value);
        }
    });

    // 4. Filter Menu Sidebar Events 
    const filterMenuContainer = document.querySelector("#filter");
    const newFilterMenuContainer = filterMenuContainer.cloneNode(true);
    filterMenuContainer.parentNode.replaceChild(newFilterMenuContainer, filterMenuContainer);

    newFilterMenuContainer.addEventListener("click", (e) => {
        // Toggle Accordion
        const toggle = e.target.closest(".filter-toggle");
        if (toggle) {
            const dropdown = toggle.nextElementSibling;
            if (dropdown) dropdown.classList.toggle("hidden");
            return;
        }

        // Apply/Remove Filter Option
        const button = e.target.closest(".filter-button");
        if (button) {
            if (button.classList.contains("active")) {
                removeFilter(products, button.dataset.key, button.dataset.value);
            } else {
                addFilter(products, button.dataset.key, button.dataset.value);
            }
        }
    });

    // 5. Related Products Event Listener
    const relatedContainer = document.querySelector("#sp-related-container");
    const newRelatedContainer = relatedContainer.cloneNode(true);
    relatedContainer.parentNode.replaceChild(newRelatedContainer, relatedContainer);

    newRelatedContainer.addEventListener("click", (e) => {
        const element = e.target;
        const card = element.closest(".browse-product");
        if (!card) return;

        const productId = card.dataset.productId;
        const productData = products.find(p => p.id == productId);
        if (!productData) return;

        // Quick Add Logic
        if (element.classList.contains("add-to-cart") || element.closest(".add-to-cart")) {
             const defaultColor = productData.color[0] ? productData.color[0].hex : "#000000";
             const defaultSize = productData.sizes[0] || "One Size";
             addToCart(productData, 1, defaultColor, defaultSize);
             showToast(`Added ${productData.name} to bag`);
             return;
        }

        // View Product Logic
        populateSingleProduct(productData, products);
        swapView("singleproduct");
        window.scrollTo(0,0);
    });
}

function loadGenderView(products) {
    // Init
    initGenderView(products);

    function onClickCategories(e) {
        const element = e.target
        console.log(e.nodeName);
        if (element.dataset.category || element.parentNode.dataset.category) {
            const gender = element.dataset.gender ?? element.parentNode.dataset.gender;
            const category = element.dataset.category ?? element.parentNode.dataset.category;
            console.log(category);
            // apply filter
            clearAllFilters(products);
            addFilter(products, "gender", gender);
            addFilter(products, "category", category);

            // switch view
            swapView("browse");
        }
    }

    const mensCategories = document.querySelector("#mens-categories");
    mensCategories.addEventListener("click", onClickCategories);

    const womensCategories = document.querySelector("#womens-categories");
    womensCategories.addEventListener("click", onClickCategories);

    // Add events for featured

}

function loadCart(products) {
    renderCart(products);

    // Cart Events
    document.querySelector("#cart-product-container").addEventListener("click", (e) => {
        const element = e.target;

        if (element.classList.contains("remove-from-cart")) {
            const parent = element.closest(".cart-product");
            removeFromCart(parent.dataset.productId, parent.dataset.size, parent.dataset.color, parent); // Add color and size
        }
    });
}


function loadAll(products) {
    loadBrowse(products);
    loadGenderView(products);
    loadCart(products);

}

// hides 
function swapView(articleId) {
    const articles = document.querySelectorAll("main article");
    for (let article of articles) {
        if (article.id == articleId) {
            // make hidden

            article.style.display = "block"
        } else {
            article.style.display = "none"
            // make hidden
        }
    }
}

function aboutPopupOpen() {

}

function aboutPopupClose() {

}


document.addEventListener("DOMContentLoaded", () => {
    // Swap Event
    document.querySelector("#nav-home").addEventListener("click", () => { swapView("home") });
    document.querySelector("#nav-women").addEventListener("click", () => { swapView("women") });
    document.querySelector("#nav-men").addEventListener("click", () => { swapView("men") });
    document.querySelector("#nav-browse").addEventListener("click", () => { swapView("browse") });
    document.querySelector("#nav-cart").addEventListener("click", () => { swapView("cart") });

    swapView("home");

    // About setup
    document.querySelector("#nav-about").addEventListener("click", () => { aboutPopupOpen() });

    const productData = localStorage.getItem("productData")

    if (!productData) {
        fetch("./data/data-minifed.json")
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("fetch failed")
                }
            })
            .then(data => {
                initGroup(data);
                initGrouping(data);
                localStorage.setItem("productData", JSON.stringify(data))
                loadAll(data);

            })
        // .catch(err=>{
        //     alert(err);
        // });

    } else {
        initGrouping(JSON.parse(productData));
        retrieve(["mens"], ["Bottoms", "Tops"], ["M", "XS", '0']);
        loadAll(JSON.parse(productData));
    }
});



