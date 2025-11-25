

export function initHome(products) {
    const container = document.querySelector("#featured-product-container");
    const template = document.querySelector("#browse-product-template");

    if (!container || !template) return;

    container.innerHTML = "";

    // Randomly select 4 products to feature
    // shuffle a copy of the array and take the first 4
    const featuredItems = [...products] // using copy because don't want to sort main array
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    featuredItems.forEach(product => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".browse-product");
        
        // Populate Data
        card.dataset.productId = product.id;
        clone.querySelector(".title").textContent = product.name;
        clone.querySelector(".price").textContent = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(product.price);
        const sizeSpan = clone.querySelector(".sizes span");
        if (sizeSpan) {
            sizeSpan.textContent = product.sizes.join(", ");
        }

    
        const colorSpan = clone.querySelector(".colors span");
        if (colorSpan && product.color && product.color.length > 0) {
            colorSpan.style.backgroundColor = product.color[0].hex;
            colorSpan.title = product.color[0].name;
        }

        // Image
        const img = clone.querySelector("img");
        if(img) {
            img.src = `https://placehold.co/600x800?text=${encodeURIComponent(product.name)}`;
            img.alt = product.name;
        }
        
        container.appendChild(clone);
    });
}