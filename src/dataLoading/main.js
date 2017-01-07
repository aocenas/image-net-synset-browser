const loadXml = require('./scrape')
const transform = require('./transform')
const insertToDb = require('./insertToDb')

module.exports = async function main () {

    try {
        const imageNet = await loadXml()
        const transformed = await transform(imageNet)
        await insertToDb(transformed)
    } catch (err) {
        console.log(err)
    }
}

