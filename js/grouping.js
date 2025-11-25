// Uses a tree like structure used for retrieving related groups based on a hierarchy:
// Used for quickly get filter counts, which category have certain sizes, which gender have certain categories etc...
// NOTE: color name gets saved, use colorGroupMap to get hex from name

/*
    root
        |>mens (30)
            (category)
            |>Tops (12)
                (size)
                |>XS (11)
                |>S (12)
                ...
                (Color)
                |>Blue (7) # Assuming a product can have multiple colors
                |>Black (9)
            |>Bottoms (18)
                (size)
                |>S ..
                |>XL ..
                ...
                (Color)
                |>Blue ..
                |>Red ..
                
        |>womens (70)
            (category)
            |>Tops (40)
                (size)
                |>XS (35)
                |>S (34)
                ...
                (Color)
                |>Pink (40)
                |>Red (12)
            |>Accessories 
                (size)
                |>One-Size
                ...
                (Color)
                |>Grey

*/

// LIMITATION: ONLY does top down, not bottom up counts. 
// Good for getting the count of size and colors count for a category 
// Not good for getting count of gender using only size
// REASON: intersection between sizes and colors make it fairly difficult to count upwards

// loads along with the products

// An object constructor used as the tree nodes
function TreeNode() {
    this.count = 0;
    this.childrenNodes = {};
    
    this.addChildNode = function (group, name) {
        if (!this.childrenNodes[group]) {this.childrenNodes[group] = {}}
        this.childrenNodes[group][name] = new TreeNode(); 
        return this.childrenNodes[group][name];
    };

    this.getChildNode = function (group, name) {
        if (!this.childrenNodes[group]) {this.childrenNodes[group] = {}}
        return this.childrenNodes[group][name];
    };

    this.increaseCount = function () {this.count++;};
}

// Sets containing everything seen from the product list
const genderSet = new Set();
const categorySet = new Set();
const sizeSet = new Set();

// color name -> color hex
export const colorGroupMap = new Map();

// Main tree
const groupings = {};

// Returns counts for gender/category/size/colorGroup, 
// based on provided filter lists.
// Only displays children with counts >= 1
// Empty arrays = "match all".
export function retrieve(genders=[], categories=[], sizes=[], colorGroups=[]) {

    const result = { gender: {}, category: {}, size: {}, colorGroup: {} };

    const genderList = genders.length === 0 ? Array.from(genderSet) : genders;
    const categoryList = categories.length  === 0 ? Array.from(categorySet) : categories;
    const sizeList = sizes.length === 0 ? Array.from(sizeSet) : sizes;
    const colorGroupList = colorGroups.length === 0 ? Array.from(colorGroupMap.keys()) : colorGroups;

    // Root level
    const root = groupings.root;
    
    // Gender level
    for (let gender of genderList) {
        const genderLevel = root.getChildNode("gender", gender);
        if (!genderLevel) {continue};

        result.gender[gender] = result.gender[gender] ? result.gender[gender] + genderLevel.count : genderLevel.count ;

        // Category level
        for (let category of categoryList) {
            const categoryLevel = genderLevel.getChildNode("category", category);
            if (!categoryLevel) {continue};
            
            result.category[category] = result.category[category] ? result.category[category] + categoryLevel.count : categoryLevel.count;

            // Size level
            for (let size of sizeList) {
                const sizeLevel = categoryLevel.getChildNode("size", size);
                if (!sizeLevel) {continue};

                result.size[size] = result.size[size] ? result.size[size] + sizeLevel.count : sizeLevel.count ;
            }

            // Color level
            for (let color of colorGroupList) {
                const colorLevel = categoryLevel.getChildNode("colorGroup", color);
                if (!colorLevel) {continue};

                result.colorGroup[color] = result.colorGroup[color] ? result.colorGroup[color] + colorLevel.count : colorLevel.count ;
            }
        }
    }
    return result;
}

// Must be called once after products are loaded.
// Populates the tree + sets used by retrieve().
export function initGrouping(products) {
    // gender -> category -> size + groupColor

    // Create root node
    groupings.root = new TreeNode();

    // Root level
    const root = groupings.root;

    for (let product of products) {
        root.increaseCount();
        
        // Gender level
        const gender = product.gender;
        const genderLevel = root.getChildNode("gender", gender) ?? root.addChildNode("gender", gender);
        genderSet.add(gender);
        genderLevel.increaseCount();

        // Category level
        const category = product.category;
        const categoryLevel = genderLevel.getChildNode("category", category) ?? genderLevel.addChildNode("category", category);
        categorySet.add(category);
        categoryLevel.increaseCount();

        // size level
        for (let size of product.sizes) {
            const sizeLevel = categoryLevel.getChildNode("size", size) ?? categoryLevel.addChildNode("size", size);
            sizeSet.add(size);
            sizeLevel.increaseCount();
         
        }

        // Color level 
        // NOTE: color name gets saved, use colorGroupMap to get hex from name
        for (let color of product.color) {
            const colorLevel = categoryLevel.getChildNode("colorGroup", color.name) ?? categoryLevel.addChildNode("colorGroup", color.name);
            colorGroupMap.set(color.name, color.hex);
            colorLevel.increaseCount();
        }
    }
}