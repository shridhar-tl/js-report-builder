import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";

const dropTarget = {
    /*canDrop(props, monitor, component) {
        return true; // need to handle if it can be dropped
    },*/
    //hover(props, monitor, component) { },
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        } // This line is to handle drop event of nested components
        var item = monitor.getItem();

        if (props.onItemMoved && (!item.containerId || props.containerId === item.containerId)) {
            if (props.onItemMoved(item.index, props.index, item) === true) { return; }
        }

        if (item.itemType === "EXST_ITMS" && props.containerId !== item.containerId) {
            if (component.props.onItemAdded) {
                component.props.onItemAdded(item.item, item, props.index);
            }
            if (item.onItemRemoved) {
                item.onItemRemoved(item.index);
            }
        }
        else {
            if (component.props.onItemAdded) {
                component.props.onItemAdded(item.item, item);
            }
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class Droppable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        //this.canDrop = true;
    }


    renderOverlay(color) {
        return (
            <div
                className="shadow"
                style={{
                    height: "30px",
                    width: "100%",
                    opacity: 0.5,
                    backgroundColor: color
                }}
            />
        );
    }
    /*
        renderItems() {
        if (!this.props.items) { return; }
        return this.props.items.map((item, index) => {
          var itemObj = drag_drop_items[item.id];
          let params = itemObj.params || {};
          return <itemObj.itemType key={index} index={index} item={item} headerText={itemObj.text} {...params} onRemoved={this.props.onItemRemoved} />;
        });
      }*/

    render() {
        const { connectDropTarget, className, isOver } = this.props;
        var result = this.props.children;

        if (className) {
            result = (
                <div style={{ width: "100%", height: "100%" }} className={className}>
                    {result}

                    {isOver && !this.canDrop && this.renderOverlay('red')}
                    {!isOver && this.canDrop && this.renderOverlay('yellow')}
                    {isOver && this.canDrop && this.renderOverlay('green')}
                </div>
            );
        }
        return connectDropTarget(result);
    }
}

Droppable.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
};

export default DropTarget(prop => prop.type, dropTarget, collect)(Droppable);
