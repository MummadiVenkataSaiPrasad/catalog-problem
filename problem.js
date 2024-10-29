class SecretSharing {
    constructor() {
        this.digitMap = new Map();
        this.initializeDigitMap();
    }

    initializeDigitMap() {
        for (let i = 0; i <= 9; i++) {
            this.digitMap.set(i.toString(), BigInt(i));
        }
       
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode('a'.charCodeAt(0) + i);
            this.digitMap.set(letter, BigInt(i + 10));
            this.digitMap.set(letter.toUpperCase(), BigInt(i + 10));
        }
    }

    convertBaseToDecimal(number, base) {
        let result = BigInt(0);
        const baseBigInt = BigInt(base);
       
        for (const digit of number) {
            const value = this.digitMap.get(digit);
            if (value === undefined || value >= baseBigInt) {
                throw new Error(`Invalid digit ${digit} for base ${base}`);
            }
            result = result * baseBigInt + value;
        }
       
        return result;
    }

    extractPoints(testCase) {
        const k = testCase.keys.k;
        const points = [];
       
        for (let i = 1; i <= k; i++) {
            const point = testCase[i.toString()];
            if (!point) {
                throw new Error(`Missing point ${i}`);
            }
           
            const x = BigInt(i);
            const y = this.convertBaseToDecimal(point.value, parseInt(point.base));
            points.push({ x, y });
        }
       
        return points;
    }

    calculateInterpolationTerm(points, i, targetX) {
        let term = points[i].y;
        let numerator = BigInt(1);
        let denominator = BigInt(1);
       
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                numerator *= (targetX - points[j].x);
                denominator *= (points[i].x - points[j].x);
            }
        }
       
        return (term * numerator) / denominator;
    }

    interpolateSecret(points) {
        const targetX = BigInt(0); // We want f(0)
        let secret = BigInt(0);
       
        for (let i = 0; i < points.length; i++) {
            secret += this.calculateInterpolationTerm(points, i, targetX);
        }
       
        return secret;
    }

    findSecret(testCase) {
        try {
            const points = this.extractPoints(testCase);
            return this.interpolateSecret(points);
        } catch (error) {
            console.error('Error finding secret:', error.message);
            throw error;
        }
    }
}

function processTestCases() {
    const solver = new SecretSharing();
   
    const testCase1 = {
        "keys": { "n": 4, "k": 3 },
        "1": { "base": "10", "value": "4" },
        "2": { "base": "2", "value": "111" },
        "3": { "base": "10", "value": "12" },
        "6": { "base": "4", "value": "213" }
    };

    const testCase2 = {
        "keys": { "n": 10, "k": 7 },
        "1": { "base": "6", "value": "13444211440455345511" },
        "2": { "base": "15", "value": "aed7015a346d63" },
        "3": { "base": "15", "value": "6aeeb69631c227c" },
        "4": { "base": "16", "value": "e1b5e05623d881f" },
        "5": { "base": "8", "value": "316034514573652620673" },
        "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
        "7": { "base": "3", "value": "20120221122211000100210021102001201112121" }
    };

    try {
        const secret1 = solver.findSecret(testCase1);
        const secret2 = solver.findSecret(testCase2);
       
        console.log('Secret for test case 1:', secret1.toString());
        console.log('Secret for test case 2:', secret2.toString());
    } catch (error) {
        console.error('Error processing test cases:', error);
    }
}

processTestCases();


