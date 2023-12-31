const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

const bmiHistory = [];

router.route('/bmicalculator')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../views/bmiCalculator.html'));
    })
    .post((req, res) => {
        const {height, weight, age, gender, unit} = req.body;
        const bmiResult = calculateBMI(height, weight, age, gender, unit);
        if (bmiResult.error) res.json({bmiResult});
        else {
            bmiHistory.push(bmiResult);
            res.redirect('/');
        }
    });


router.get('/history', (req, res) => {
    res.json({bmiHistory});
});

function calculateBMI(height, weight, age, gender, unit) {
    const numericHeight = parseFloat(height);
    const numericWeight = parseFloat(weight);
    const numericAge = parseInt(age);

    if (isNaN(numericHeight) || isNaN(numericWeight) || isNaN(numericAge) || numericHeight <= 0 || numericWeight <= 0) {
        return {
            error: 'Invalid input. Please enter valid numeric values for height, weight, and age.',
        };
    }

    let bmiExact;
    if (unit === 'metric') {
        const heightInMeters = numericHeight / 100;
        bmiExact = numericWeight / heightInMeters ** 2;
    } else if (unit === 'imperial') {
        bmiExact = numericWeight / numericHeight ** 2 * 703;
    } else {
        return {
            error: 'Invalid unit. Please select either Metric or Imperial.',
        };
    }

    let bmi;

    if (gender === 'female') {
        bmi = bmiExact + 0.3;
    }

    if (numericAge >= 2 && numericAge <= 20) {
        bmi = bmiExact + 0.5;
    }

    let interpretation;
    if (bmi < 18.5) {
        interpretation = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        interpretation = 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        interpretation = 'Overweight';
    } else {
        interpretation = 'Obese';
    }

    return {
        bmi: bmiExact.toFixed(2),
        interpretation: interpretation,
        input: {height, weight, age, gender, unit},
    };
}

module.exports = router;
