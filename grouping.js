// loads along with the products
// Actually turned out super clean
// EXTRA STUFF, used for quickly get filter counts, which category have certain sizes, which gender have certain categories etc...
// 5AM coding

// Limitation, ONLY does top down, not bottom up counts. i.e good for getting the count of size and colors count for gender / 
// REASON: intersection ()
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

    this.getChildrenNode = function (group) {return this.childrenNodes.group}

    this.increaseCount = function () {this.count++;};
}


// tells what group specified category are in (I.e gender)
// sweater - > mens, womens
// dresses - > womens
// add color group
const genderSet = new Set();
const categorySet = new Set();
const sizeSet = new Set();
const colorGroupSet = new Set();

const groupings = {};

// Get the counts of non-
export function retrieve(genders=[], categories=[], sizes=[], colorGroups=[]) { //,... Move
    const object = {
        gender : {},
        category : {},
        size : {},
        colorGroup : {}
    }

    // TODO, if (genders.length === 0) {...}

    if (genders.length === 0) {genders = Array.from(genderSet)}
    if (categories.length === 0) {categories = Array.from(categorySet)}
    if (sizes.length === 0) {sizes = Array.from(sizeSet)}
    if (colorGroups.length === 0) {colorGroups = Array.from(colorGroupSet)}

    const root = groupings.root;
    
    //let genderTotalCount = 0;
    for (let gender of genders) {
        const genderLevel = root.getChildNode("gender", gender);

        object.gender[gender] = object.gender[gender] ? object.gender[gender] + genderLevel.count : genderLevel.count ;

        
        // let categoryTotalCount = 0;
        for (let category of categories) {
            const categoryLevel = genderLevel.getChildNode("category", category);
            if (!categoryLevel) {continue};
            
            object.category[category] = object.category[category] ? object.category[category] + categoryLevel.count : categoryLevel.count;

            let sizeTotalCount = 0;
            for (let size of sizes) {
                const sizeLevel = categoryLevel.getChildNode("size", size);
                if (!sizeLevel) {continue};

                object.size[size] = object.size[size] ? object.size[size] + sizeLevel.count : sizeLevel.count ;
                //sizeTotalCount += sizeLevel.count; Cannot due to intersections

                // More nested
            }

            for (let color of colorGroups) {
                const colorLevel = categoryLevel.getChildNode("colorGroup", color);
                if (!colorLevel) {continue};

                object.colorGroup[color] = object.colorGroup[color] ? object.colorGroup[color] + colorLevel.count : colorLevel.count ;
                //sizeTotalCount += sizeLevel.count; Cannot due to intersections

                // More nested
            }



            // object.category[category] = sizeTotalCount
            // categoryTotalCount += sizeTotalCount;
        }

        // object.gender[gender] = categoryTotalCount;
        // genderTotalCount += categoryTotalCount;

    }
    return object;
}
export function initGrouping(products) {
    // gender -> category -> size -> groupColor (Not yet added)
    groupings.root = new TreeNode();
    const root = groupings.root;

    for (let product of products) {
        root.increaseCount();
        
        const gender = product.gender;
        const genderLevel = root.getChildNode("gender", gender) ?? root.addChildNode("gender", gender);
        genderSet.add(gender);
        genderLevel.increaseCount();

        const category = product.category;
        const categoryLevel = genderLevel.getChildNode("category", category) ?? genderLevel.addChildNode("category", category);
        categorySet.add(category);
        categoryLevel.increaseCount();

        for (let size of product.sizes) {
            const sizeLevel = categoryLevel.getChildNode("size", size) ?? categoryLevel.addChildNode("size", size);
            sizeSet.add(size);
            sizeLevel.increaseCount();
            
        }

        for (let color of product.colorGroup) {
            const colorLevel = categoryLevel.getChildNode("colorGroup", color) ?? categoryLevel.addChildNode("colorGroup", color);
            colorGroupSet.add(color);
            colorLevel.increaseCount();
        }
        
    }

    console.log(groupings);
}