import { addToCart } from "./cart";
import { renderBrowse } from "./browse";

export function populateSingleProduct(product, allProducts) { 
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
        alert(`Added ${qty} ${currentSingleProductState.product.name} to cart`);
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