// Loading Page
function renderBrowseProducts(products) {
    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    for (let product of products) {
        const clone = productTemplate.content.cloneNode(true);
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");
        title.textContent = `${product.name}`;
        price.textContent = `${product.price}`;
        parent.appendChild(clone);
    }

    //Sort 
    
    elements = Array.from(parent.querySelectorAll(".browse-product"))
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

    elements.sort(priceSort);

    parent.innerHTML = '';
    for (let element of elements) {
        parent.appendChild(element)
    }
}

function renderBrowse(products) {
    renderBrowseProducts(products);

}

function renderAll(products) {
    renderBrowse(products);
}

// JSON Stuff
async function loadLocalJson(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error loading JSON file:", error);
  }
}

// Example usage (assuming 'data.json' is in the same directory or accessible via a relative path)
loadLocalJson('./data/data-minifed.json').then(jsonData => {
  if (jsonData) {
    // Process your JSON data here
    renderAll(jsonData);
    console.log("Loaded JSON data:", jsonData);
  }
}); 

// hides 
function swapView(articleId) {
    const articles = document.querySelectorAll("main article");
    for (let article of articles) {
        console.log(article.id)
        if (article.id == articleId) {
            // make hidden
            
            article.style.display = "block"
        } else {
            article.style.display = "none"
            // make hidden
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DOM loaded");
    document.querySelector("#nav-home").addEventListener("click", ()=>{swapView("home")});
    document.querySelector("#nav-women").addEventListener("click", ()=>{swapView("women")});
    document.querySelector("#nav-men").addEventListener("click", ()=>{swapView("men")});
    document.querySelector("#nav-browse").addEventListener("click", ()=>{swapView("browse")});
});



