const _ = require('lodash')
const axios = require('axios')
const cx = require('classnames')
const React = require('react')

function cloneObj (obj) {
    return JSON.parse(JSON.stringify(obj))
}

module.exports = class App extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            data: null,
            search: '',
            loading: false,

            // these two contains wnids of the nodes that has to be highlighted or opened. Wnids in this case means
            // wnids as they are in the db, so '.' joined path of wnids that gets you to the node. I decided to have
            // highlighted and opened nodes separately and not to open all highlighted nodes automatically after search.
            highlighted: {},
            opened: {},
        }
    }

    async componentWillMount () {
        const response = await axios.get('/data')
        this.setState({data: response.data})
    }

    render () {
        return (
            <div className="app">
                {this.state.data &&
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
                                opened={this.state.opened}
                                highlighted={this.state.highlighted}
                                onClick={this.toggleNode}
                            />
                        </ul>
                    </div>
                }
            </div>
        )
    }

    /**
     * Opens or closes node, expanding or collapsing child nodes list in the UI
     * @param wnid
     */
    toggleNode = wnid => {
        const cloned = cloneObj(this.state.opened)
        if (cloned[wnid]) {
            delete cloned[wnid]
        } else {
            cloned[wnid] = true
        }
        this.setState({opened: cloned})
    }

    /**
     * Search for node with string on the server. Sets highlighted nodes afterwards.
     * @returns {Promise.<void>}
     */
    search = async () => {
       if (this.state.search.length) {
           this.setState({loading: true})
           const response = await axios.get('/search', {params: {q: this.state.search}})
           this.setState({loading: false})

           // We only get wnid path id of the leafe node, but we want to highlight full path to that node, so we
           // explode the path to all the subpaths
           const wnidsToHighlight = _.flatMap(response.data, item => {
               const {wnid} = item
               return _.range(wnid.split('.').length).map(index => {
                   return wnid.split('.', index + 1).join('.')
               })
           })
           const pairs = wnidsToHighlight.map(wnid => [wnid, true])
           this.setState({highlighted: _.fromPairs(pairs)})
       } else {
           this.setState({highlighted: {}})
       }
    }
}

class Node extends React.PureComponent {
    render () {
        console.log('render node')
        const {node, opened, highlighted} = this.props
        const level = this.props.level || 0
        const isOpened = opened[node.wnid]
        const isHighlighted = highlighted[node.wnid]

        return (
            <li className="node">
                <div
                    onClick={() => this.props.onClick(node.wnid)}
                    className={cx('node-label', {
                        'has-children': !!node.children.length,
                        'highlighted': isHighlighted,
                    })}
                >
                    {!!node.children.length &&
                        <span className="icon is-small">
                            <i className={cx('fa', isOpened ? 'fa-caret-down' : 'fa-caret-right')}/>
                        </span>
                    }
                    {node.name.split('>').slice(-1)} ({node.size})
                </div>
                {!!node.children.length && isOpened &&
                    <ul style={{marginLeft: (level + 1) * 15}}>
                        {node.children.map(node =>
                            <Node
                                key={node.wnid}
                                node={node}
                                level={level + 1}
                                opened={opened}
                                highlighted={highlighted}
                                onClick={this.props.onClick}
                            />
                        )}
                    </ul>
                }
            </li>
        );
    }
}
