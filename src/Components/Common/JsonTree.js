import React, { PureComponent } from "react";
import "./JsonTree.scss";
import DraggableHandle from "../ReportBuilder/DragDrop/DraggableHandle";

class JsonTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { items: props.items };
    }

    getItems(obj) {
        let items = Object.keys(obj);
        return items.Select(item => {
            let itm = { key: item, type: this.getItemType(obj[item]), hasChild: false };
            itm.hasChild = itm.type === "object" && Object.keys(obj[item]).length > 0;
            return itm;
        });
    }

    getItemType(item) {
        if (item == null) {
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
        var { items } = this.state;
        return (
            <div className="tree" style={{ height: (this.props.height || 200) + "px" }}>
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
        var { node } = this.props;
        var { children } = node;
        var { expanded } = this.state;
        var hasChildren = children && children.length;
        return (
            <div className="node">
                <DraggableHandle itemType="RPT_DS_PRPS" item={node}>
                    <div className="text">
                        {hasChildren && (
                            <i
                                className={"togglable fa " + (expanded ? "fa-minus" : "fa-plus")}
                                onClick={this.toggleItem}
                                title="Click to toggle the node"
                            />
                        )}
                        {!hasChildren && <i className="fa fa-minus" />}
                        <span className="key">{node.key}</span>
                        <span className="sub">({node.type})</span>
                    </div>
                </DraggableHandle>
                {expanded && children && children.map((item, i) => <JsonTreeNode key={i} node={item} />)}
            </div>
        );
    }
}
