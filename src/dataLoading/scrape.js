const fs = require('fs')
const path = require('path')
const axios = require('axios')
const parseString = require('xml2js').parseString
const { promisify } = require('./utils')


module.exports = async function loadXml () {
    let imageNetData
    try {
        console.log('checking cache file')
        const fileData = await promisify(fs.readFile)(path.join('data', 'imageNet.json'))
        imageNetData = JSON.parse(fileData)
        console.log('data loaded from cache')
    } catch (err) {
        console.log('cache file not available, loading data')
        const res = await axios.get('http://www.image-net.org/api/xml/structure_released.xml')
        imageNetData = await promisify(parseString)(res.data)

        console.log('caching data')

        try {
            await promisify(fs.mkdir)('data')
        } catch (err) {
            console.log('dir "data" exists')
        }
        await promisify(fs.writeFile)(path.join('data', 'imageNet.json'), JSON.stringify(imageNetData))
    }

    return imageNetData
}
