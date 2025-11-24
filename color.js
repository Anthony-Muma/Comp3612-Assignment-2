export const COLOR_GROUPS = [
  { "name": "Black",   "hex": "#000000" },
  { "name": "White",   "hex": "#FFFFFF" },
  { "name": "Red",     "hex": "#FF0000" },
  { "name": "Green",   "hex": "#008000" },
  { "name": "Blue",    "hex": "#0000FF" },
  { "name": "Yellow",  "hex": "#FFFF00" },
 // { "name": "Cyan",    "hex": "#00FFFF" },
  { "name": "Magenta", "hex": "#FF00FF" },
  { "name": "Gray",    "hex": "#808080" }
//  { "name": "Silver",  "hex": "#C0C0C0" },
 // { "name": "Maroon",  "hex": "#800000" },
 // { "name": "Olive",   "hex": "#808000" },
 // { "name": "Lime",    "hex": "#00FF00" },
  // { "name": "Navy",    "hex": "#000080" },
  // { "name": "Teal",    "hex": "#008080" },
  // { "name": "Purple",  "hex": "#800080" },
  // { "name": "Orange",  "hex": "#FFA500" },
  // { "name": "Brown",   "hex": "#A52A2A" },
  // { "name": "Pink",    "hex": "#FFC0CB" },
  // { "name": "Gold",    "hex": "#FFD700" }
]

function colorDiffRGB(hex1, hex2) {
  const r1 = parseInt(hex1.substr(1,2),16);
  const g1 = parseInt(hex1.substr(3,2),16);
  const b1 = parseInt(hex1.substr(5,2),16);

  const r2 = parseInt(hex2.substr(1,2),16);
  const g2 = parseInt(hex2.substr(3,2),16);
  const b2 = parseInt(hex2.substr(5,2),16);

  return Math.sqrt(
    (r1-r2)**2 +
    (g1-g2)**2 +
    (b1-b2)**2
  );
}

// ---- HEX to RGB (0-255) ----
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// ---- sRGB -> linear RGB ----
function srgbToLinear(c) {
  c = c / 255;
  return (c <= 0.04045)
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);
}

// ---- linear RGB -> XYZ (D65) ----
function rgbToXyz({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);

  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

  return { X, Y, Z };
}

// ---- XYZ -> Lab ----
function xyzToLab({ X, Y, Z }) {
  // D65 reference white
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  function f(t) {
    const delta = 6 / 29;
    return t > Math.pow(delta, 3)
      ? Math.cbrt(t)
      : (t / (3 * Math.pow(delta, 2))) + (4 / 29);
  }

  const fx = f(X / Xn);
  const fy = f(Y / Yn);
  const fz = f(Z / Zn);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { L, a, b };
}

// ---- Lab -> LCh ----
function labToLch({ L, a, b }) {
  const C = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * 180 / Math.PI; // radians -> degrees
  if (h < 0) h += 360;
  return { L, C, h }; // h in degrees
}

// ---- Shortest angular difference in degrees ----
function hueAngleDifferenceDeg(h1, h2) {
  let dh = h2 - h1;
  while (dh > 180) dh -= 360;
  while (dh < -180) dh += 360;
  return dh;
}

// ---- Hue difference in Lab (ΔH component) ----
function labHueDifference(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lab1 = xyzToLab(rgbToXyz(rgb1));
  const lab2 = xyzToLab(rgbToXyz(rgb2));

  const lch1 = labToLch(lab1);
  const lch2 = labToLch(lab2);

  const dhDeg = hueAngleDifferenceDeg(lch1.h, lch2.h);
  const dhRad = dhDeg * Math.PI / 180;

  // CIE LCh (1976) hue difference component:
  const deltaH = 2 * Math.sqrt(lch1.C * lch2.C) * Math.sin(dhRad / 2);

  return {
    h1: lch1.h,
    h2: lch2.h,
    deltaHueDegrees: Math.abs(dhDeg), // simple angle difference
    deltaH: Math.abs(deltaH)          // Lab hue difference component
  };
}


/**
 * Adds a new column that 
 *
 * @param {[{}]} products - Description of the first parameter.
 * @returns {void} - Description of what the function returns.
 * @example
 * // Example usage:
 * initGroup(data);
 */
export function initGroup(products) {

    // Closest Color
    for (let product of products) {
        product["colorGroup"] = [];
        for (let productColor of product.color) {

            // Set up
            let closestColorName = "";
            let smallestDifference = 1000000000000;

            for (let groupColor of COLOR_GROUPS) {
                let h1, h2, deltaHueDegrees, deltaH;
                ({h1, h2, deltaHueDegrees, deltaH} = labHueDifference(productColor.hex, groupColor.hex))
                const currentColorDiff = deltaHueDegrees * 0.9 + deltaH * 0.1;

                if (currentColorDiff < smallestDifference) {
                    closestColorName = groupColor.name;
                    smallestDifference = currentColorDiff;
                }
            }

            //
            console.log(smallestDifference);
            product["colorGroup"].push(closestColorName);
        }
    }

    console.log(products);
}