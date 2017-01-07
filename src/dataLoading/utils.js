/**
 * Create promise func out of classic callback function.
 * @param func
 * @returns {inner}
 */
module.exports.promisify = function promisify (func) {
    return function inner (...args) {
        return new Promise((resolve, reject) => {
            func(...args, (err, result) => {
                if (err) { return reject(err) }
                resolve(result)
            })
        })
    }
}
