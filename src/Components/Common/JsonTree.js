import React, { PureComponent } from "react";
import "./JsonTree.scss";
import Draggable from "../ReportBuilder/DragDrop/Draggable";

const itemTarget = ["GRID_ITEM"];

class JsonTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { items: props.items };
    }

    getItems(obj) {
        const items = Object.keys(obj);
        return items.Select(item => {
            const itm = { key: item, type: this.getItemType(obj[item]), hasChild: false };
            itm.hasChild = itm.type === "object" && Object.keys(obj[item]).length > 0;
            return itm;
        });
    }

    getItemType(item) {
        if (item === null || item === undefined) {
            return "unknown";
        }
        if (Array.isArray(item)) {
            return "array";
        }
        if (item instanceof Date) {
            return "date";
        }
        return (typeof item).toLowerCase();
    }

    getNode(items) {
        return items.map((item, i) => <JsonTreeNode key={i} node={item} />);
    }

    render() {
        const { items } = this.state;

        return (
            <div className="tree" style={{ height: `${this.props.height || 200}px` }}>
                {this.getNode(items)}
            </div>
        );
    }
}

export default JsonTree;

class JsonTreeNode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toggleItem = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    render() {
        const { node } = this.props;

        if (!node) { return null; }

        const { children } = node;
        const { expanded } = this.state;
        const hasChildren = children && children.length;

        return (
            <div className="node">
                <Draggable itemType="RPT_DS_PRPS" item={node} itemTarget={itemTarget}>
                    <div className="text">
                        {hasChildren && (
                            <i
                                className={`togglable fa ${expanded ? "fa-minus" : "fa-plus"}`}
                                onClick={this.toggleItem}
                                title="Click to toggle the node"
                            />
                        )}
                        {!hasChildren && <i className="fa fa-minus" />}
                        <span className="key">{node.key}</span>
                        <span className="sub">({node.type})</span>
                    </div>
                </Draggable>
                {expanded && children && children.map((item, i) => <JsonTreeNode key={i} node={item} />)}
            </div>
        );
    }
}
