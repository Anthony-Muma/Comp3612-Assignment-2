const activeFilters = {
    gender : [],
    category : []
    // size : [],
    // color : []
}

// HTML STUFF -------------------------------------------------------------------------------
function createSingleProductHtml(product) {
    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");

    const clone = productTemplate.content.cloneNode(true);
        
    const browseProduct = clone.querySelector(".browse-product")
    const title = clone.querySelector(".title");
    const price = clone.querySelector(".price");

    browseProduct.dataset.productId = `${product.id}`;
    title.textContent = `${product.name}`;
    price.textContent = `${product.price}`;

    parent.appendChild(clone);
}

// LOGIC -------------------------------------------------------------------------------
// i.e {color: "black"} or {gender: "male"}
export function addFilter(products, filterObject) {

    //Add filter to others
    for (let property in filterObject) {
        activeFilters[property].push(filterObject[property]);
    }
    
    // Filter the products
    const subSet = products.filter(product => {
        for (let property in activeFilters) {
            for (let f of activeFilters[property]) {
                if (product[property] != f) {
                    return false;
                }
            }
        }
        return true;
    });
    console.log(subSet);
    renderBrowse(subSet);
}

// MAIN -------------------------------------------------------------------------------
export function renderBrowse(products, sort=undefined) {

    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    parent.innerHTML = '';
    
    for (let product of products) {
        const clone = productTemplate.content.cloneNode(true);
        
        const browseProduct = clone.querySelector(".browse-product")
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");

        browseProduct.dataset.productId = `${product.id}`;
        title.textContent = `${product.name} + ${product.gender} + ${product.category}`;
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
