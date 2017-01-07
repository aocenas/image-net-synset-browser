const fs = require('fs')
const path = require('path')
const loadXml = require('./scrape')
const transform = require('./transform')
const insertToDb = require('./insertToDb')
const { promisify } = require('./utils')

module.exports = async function main () {

    try {
        const imageNet = await loadXml()
        const transformed = await transform(imageNet)
        await promisify(fs.writeFile)(path.join('data', 'imageNetSimple.json'), JSON.stringify(transformed))
        await insertToDb(transformed)
    } catch (err) {
        console.log(err)
    }
}

