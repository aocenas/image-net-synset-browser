const db = require('./../db')

module.exports = function insertToDb (imageNetData) {
    console.log('inserting rows')
    return db.batchInsert('image_net', imageNetData)
}