const cx = require('classnames')
const React = require('react')

module.exports = class Node extends React.PureComponent {
    static propTypes = {
        // Immutable.Map
        node: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func.isRequired,
    }

    render () {
        const {node,  highlighted} = this.props
        const isOpened = node.get('open')
        const isHighlighted = node.get('highlighted')
        const children = node.get('children')
        const wnid = node.get('wnid')
        const name = node.get('name')

        return (
            <li className="node">
                <div
                    onClick={() => this.props.onClick(wnid)}
                    className={cx('node-label', {
                        'has-children': !!children.size,
                        'highlighted': isHighlighted,
                    })}
                >
                    {!!children.size &&
                    <span className="icon is-small">
                            <i className={cx('fa', isOpened ? 'fa-caret-down' : 'fa-caret-right')}/>
                        </span>
                    }
                    {name.split('>').slice(-1)} ({node.get('size')})
                </div>
                {!!children.size && isOpened &&
                <ul style={{marginLeft: 15}}>
                    {children.map(child =>
                        <Node
                            key={child.get('wnid')}
                            node={child}
                            onClick={this.props.onClick}
                        />
                    ).toJS()}
                </ul>
                }
            </li>
        );
    }
}
