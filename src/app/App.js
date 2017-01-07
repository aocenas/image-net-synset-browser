const _ = require('lodash')
const axios = require('axios')
const cx = require('classnames')
const React = require('react')
const im = require('immutable')
const Node = require('./Node')

function toggleNode (node, wnid) {
    if (node.get('wnid') == wnid) {
        return node.set('open', !node.get('open'))
    } else if (node.get('children').size && _.startsWith(wnid, node.get('wnid')))  {
        const children = node.get('children').map(child => toggleNode(child, wnid))
        return node.set('children', children)
    }
    return node
}

function highlightNode (node, wnid, state) {
    if (_.startsWith(wnid, node.get('wnid'))) {
        let newNode = node.set('highlighted', state)
        if (node.get('wnid') != wnid && node.get('children').size) {
            const children = node.get('children').map(child => highlightNode(child, wnid, state))
            newNode = newNode.set('children', children)
        }
        return newNode;
    }
    return node
}

module.exports = class App extends React.Component {
    state = {
        data: null,
        search: '',
        loading: false,
        // stores paths of nodes that are highlighted so they can be unhighlighted without searching whole tree
        highlighted: [],
    }

    async componentWillMount () {
        const response = await axios.get('/data')
        this.setState({data: im.fromJS(response.data)})
    }

    render () {
        return (
            <div className="app">
                {this.state.data ?
                    <div>
                        <div className="search">
                            <input
                                className="input"
                                type="text"
                                value={this.state.search}
                                onChange={e => this.setState({search: e.target.value})}
                            />
                            <button
                                className={cx('button', {'is-loading': this.state.loading})}
                                onClick={this.search}
                            >
                                Search
                            </button>
                        </div>
                        <ul>
                            <Node
                                node={this.state.data}
                                onClick={this.toggleNode}
                            />
                        </ul>
                    </div>
                    :
                    <span className="icon spinner">
                        <i className="fa fa-refresh"/>
                    </span>
                }
            </div>
        )
    }

    /**
     * Opens or closes node, expanding or collapsing child nodes list in the UI
     * @param wnid
     */
    toggleNode = wnid => {
        this.setState({data: toggleNode(this.state.data, wnid)})
    }

    /**
     * Search for nodes containing search string. Sets highlighted on nodes afterwards with paths thet are returned
     * from the server.
     * @returns {Promise.<void>}
     */
    search = async () => {
       if (this.state.search.length) {
           this.setState({loading: true})
           const response = await axios.get('/search', {params: {q: this.state.search}})
           this.setState({loading: false})

           const wnids = response.data.map(item => item.wnid)
           const newData = wnids.reduce((data, wnid) => {
               return highlightNode(data, wnid, true)
           }, this.state.data)

           this.setState({
               data: newData,
               highlighted: wnids,
           })
       } else if (this.state.highlighted.length) {

           const newData = this.state.highlighted.reduce((data, wnid) => {
               return highlightNode(data, wnid, false)
           }, this.state.data)

           this.setState({
               data: newData,
               highlighted: [],
           })
       }
    }
}
