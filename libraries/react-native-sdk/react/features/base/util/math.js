"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leastCommonMultiple = exports.greatestCommonDivisor = void 0;
/**
 * Compute the greatest common divisor using Euclid's algorithm.
 *
 * @param {number} num1 - First number.
 * @param {number} num2 - Second number.
 * @returns {number}
 */
function greatestCommonDivisor(num1, num2) {
    let number1 = num1;
    let number2 = num2;
    while (number1 !== number2) {
        if (number1 > number2) {
            number1 = number1 - number2;
        }
        else {
            number2 = number2 - number1;
        }
    }
    return number2;
}
exports.greatestCommonDivisor = greatestCommonDivisor;
/**
 * Calculate least common multiple using gcd.
 *
 * @param {number} num1 - First number.
 * @param {number} num2 - Second number.
 * @returns {number}
 */
function leastCommonMultiple(num1, num2) {
    const number1 = num1;
    const number2 = num2;
    const gcd = greatestCommonDivisor(number1, number2);
    return (number1 * number2) / gcd;
}
exports.leastCommonMultiple = leastCommonMultiple;
