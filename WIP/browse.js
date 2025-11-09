export function renderBrowse(products) {

    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    
    for (let product of products) {
        const clone = productTemplate.content.cloneNode(true);
        
        const browseProduct = clone.querySelector(".browse-product")
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");

        browseProduct.dataset.productId = `${product.id}`;
        title.textContent = `${product.name}`;
        price.textContent = `${product.price}`;

        parent.appendChild(clone);
    }
    
    //Sort functions
    
    //console.log(groupColors(products))
    const nameSort = function(a,b) {
        const titleA = a.querySelector(".title").textContent;
        const titleB = b.querySelector(".title").textContent;
        if (titleA > titleB) return 1
        else if (titleA < titleB) return -1
        else return 0
        

    }
    const priceSort = function(a,b) {
        const priceA = a.querySelector(".price").textContent;
        const priceB = b.querySelector(".price").textContent;
        return priceB - priceA;
    }

    //Filter Functions


    const elements = Array.from(parent.querySelectorAll(".browse-product"))
    
    elements.sort(priceSort);

    parent.innerHTML = '';
    for (let element of elements) {
        parent.appendChild(element)
    }

}