

export function generateFilters(productArray) {

}

/*
    returns an array of objects

    [
        {
            colorHex = #FFFFFF
            colorName = White
            relatedProductIds = ['P001', 'P002']
        },
        ....
    ]
*/

function getColorComponents(hex) {
    let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    return [
        parseInt(cleanHex.substring(0, 2), 16),
        parseInt(cleanHex.substring(2, 4), 16),
        parseInt(cleanHex.substring(4, 6), 16),
    ];
}

function compareColor(hex1, hex2) {
    const threshHold = 50;
    const rgb1 = getColorComponents(hex1);
    const rgb2 = getColorComponents(hex2);
    return (
        Math.sqrt(
            Math.pow((rgb1[0] - rgb2[0]), 2) +
            Math.pow((rgb1[1] - rgb2[1]), 2) +
            Math.pow((rgb1[2] - rgb2[2]), 2)
        ) <= threshHold
    );
}

export function groupColors(productArray) {
    const relatedColorArray = [
        {
            hex : "#FFFFFF",
            name : "White",
            relatedProductIds : []
        },
        {
            hex : "NA",
            name : "misc",
            relatedProductIds : []
        }
    ]


    for (let product of productArray) {
        for (let productColor of product.color) {
            for (let i = 0; i < relatedColorArray.length - 1; i++) {
                const currentObject = relatedColorArray[i];

                // As product.color is an array
                
                if (compareColor(productColor.hex, currentObject.hex)) {
                    //console.log(compareColor(productColor.hex, currentObject.hex), productColor.hex, currentObject.hex)
                    relatedColorArray[i].relatedProductIds.push(product.id);
                    break;         
                }
                
                //Add the end, add to misc
                if (i == relatedColorArray.length - 2) {
                    relatedColorArray[i + 1].relatedProductIds.push(product.id)
                    // relatedColorArray.push({
                    //     hex : "#FFFFFF",
                    //     name : "White",
                    //     relatedProductIds : []  
                    // })
                }
            }
        }
    }

    
    return relatedColorArray;
}


export function getFilterFunction() {

}

// export function groupColors(productArray) {
//     const relatedColorArray = [
//         /*{
//             averageColorComponent : [r, g, b]
//             name : "White",
//             relatedProductIds : []
//         },*/
//     ]

//     for (let product of productArray) {
//         for (let productColor of product.color) {
//             for (let i = 0; i < relatedColorArray.length - 1; i++) {
//                 const currentObject = relatedColorArray[i];

//                 // As product.color is an array
                
//                 if (compareColor(productColor.hex, currentObject.hex)) {
//                     //console.log(compareColor(productColor.hex, currentObject.hex), productColor.hex, currentObject.hex)
//                     relatedColorArray[i].relatedProductIds.push(product.id);
//                     break;
                    
//                 }
//                 //Add the end, add to misc
//                 if (i == relatedColorArray.length - 2) {
//                     relatedColorArray[i + 1].relatedProductIds.push(product.id)
//                     // relatedColorArray.push({
//                     //     hex : "#FFFFFF",
//                     //     name : "White",
//                     //     relatedProductIds : []  
//                     // })
//                 }
//             }
//         }
//     }

    
//     return relatedColorArray;
// }