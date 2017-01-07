/**
 * Flatten the tree of synsets into one dimensional list of nodes.
 * @param synsets - Array of synset objects
 * @param synsetPrefix - Label prefix to use, basically a path of labels that gets you to current synset
 * @param wnidPrefix - Same as synsetPrefix, but instead of labels, it uses wnids
 * @returns {Array}
 */
function synsetSimple (synsets, synsetPrefix, wnidPrefix) {
    return synsets.reduce((rows, synset) => {
        const newSynsetPrefix = synsetPrefix ? `${synsetPrefix} > ${synset['$'].words}`: synset['$'].words
        // names and also wnids are not unique so we also need wnid path, which can be used as id
        const newWnidPrefix = wnidPrefix ? `${wnidPrefix}.${synset['$'].wnid}`: synset['$'].wnid

        // if synset is leaf, it has size 0
        let size = 0
        if (synset.synset) {
            let children = synsetSimple(synset.synset, newSynsetPrefix, newWnidPrefix)
            size = children.length
            rows = rows.concat(children)
        }

        let row = {
            name: newSynsetPrefix,
            wnid: newWnidPrefix,
            label: synset['$'].words,
            size
        }
        rows.push(row)
        return rows
    }, [])
}

module.exports = function transform (imageNet) {
    console.log('transforming synset structure')
    const synset = imageNet.ImageNetStructure.synset
    return synsetSimple(synset)
}