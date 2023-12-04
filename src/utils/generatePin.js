const {
    Random
} = require('random-js');

const generatePin = () => {
    const random = new Random();
    const value = random.integer(100000, 999999);
    return value;
}

module.exports = generatePin;