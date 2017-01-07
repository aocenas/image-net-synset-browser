require("babel-polyfill")
const express = require('express')
const db = require('./db')
const app = express()

const rootWnid = 'fall11'

app.get('/data', (req, res) => {
    (async function inner() {
        const rows = await db.select('*').from('image_net').orderBy('wnid')
        const treeMap = {}

        // cheating a bit here, thanks to ordering by wnid, which is actually a concatenated wnids of all synsets
        // on that node (eg parent2.parent.child.child2). That means that when iterating over the nodes, we get parent
        // nodes first, then children nodes. We can than be sure that for every node we see, parent nodes are already
        // present. Otherwise we would have to traverse to the root an make sure all parent nodes exists.
        rows.forEach(row => {
            treeMap[row.wnid] = Object.assign({}, row, { children: [] })
            const hasParent = row.wnid != rootWnid
            if (hasParent) {
                const parentWnid = row.wnid.split('.').slice(0, -1).join('.')
                treeMap[parentWnid].children.push(treeMap[row.wnid])
            }
        })
        res.json(treeMap['fall11'])
    })()
})

app.get('/search', async (req, res) => {
    const rows = await db.select('wnid')
        .from('image_net')
        .where('label', 'like', `%${req.query.q}%`)
        .orderBy('wnid')
    res.json(rows)
})

app.use(express.static('public'))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})