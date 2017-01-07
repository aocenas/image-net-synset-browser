function synsetSimple (synsets, synsetPrefix, wnidPrefix) {
    let accumulator = []

    synsets.forEach(synset => {
        const newSynsetPrefix = synsetPrefix ? `${synsetPrefix} > ${synset['$'].words}`: synset['$'].words
        // names and also wnids are not unique so we also need wnid path, which can be used as id
        const newWnidPrefix = wnidPrefix ? `${wnidPrefix}.${synset['$'].wnid}`: synset['$'].wnid

        // if synset is leaf, it has size 0
        let size = 0
        if (synset.synset) {
            let children = synsetSimple(synset.synset, newSynsetPrefix, newWnidPrefix)
            size = children.length
            accumulator = accumulator.concat(children)
        }

        let row = {
            name: newSynsetPrefix,
            wnid: newWnidPrefix,
            label: synset['$'].words,
            size
        }
        accumulator.push(row)
    })

    return accumulator
}

module.exports = function transform (imageNet) {
    console.log('transforming synset structure')
    const synset = imageNet.ImageNetStructure.synset
    return synsetSimple(synset)
}