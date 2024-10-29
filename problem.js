const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(value, base) {
    return value.split('').reduce((acc, digit) => {
        const num = isNaN(digit) ? (digit.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10) : parseInt(digit, 10);
        return acc * base + num;
    }, 0);
}

// Function to calculate the constant term using Lagrange interpolation
function lagrangeInterpolation(x, y, xValue) {
    let total = 0;
    const k = x.length;

    for (let i = 0; i < k; i++) {
        let term = y[i];
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= (xValue - x[j]) / (x[i] - x[j]);
            }
        }
        total += term;
    }
    return total;
}

// Read JSON input
fs.readFile('testcase.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Could not open the file!", err);
        return;
    }

    try {
        const root = JSON.parse(data); // Parse JSON
        const n = root.keys.n;
        const k = root.keys.k;
        const xValues = [];
        const yValues = [];

        // Read and decode the roots
        for (const key in root) {
            if (key === 'keys') continue; // Skip the keys section

            const x = parseInt(key);
            const base = parseInt(root[key].base);
            const value = root[key].value;

            const y = decodeValue(value, base);
            xValues.push(x);
            yValues.push(y);
        }

        // Calculate the constant term using Lagrange interpolation
        const secretC = lagrangeInterpolation(xValues, yValues, 0); // Evaluate at x = 0
        console.log("Secret c:", secretC);
    } catch (parseError) {
        console.error("Error parsing JSON:", parseError.message);
    }
});


