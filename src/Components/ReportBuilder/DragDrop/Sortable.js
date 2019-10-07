import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Draggable from './Draggable';
import Droppable from './Droppable';

let globalContainerId = 0;
class Sortable extends PureComponent {
    constructor(props) {
        super(props);
        this.containerId = ++globalContainerId;
    }

    handleDrop = (source, target) => {
        const { itemType: sourceItemType, item: sourceItem } = source;
        const { items, onChange, itemType, onItemAdded } = this.props;

        if (itemType !== sourceItemType) {
            if (typeof onItemAdded === "function") {
                onItemAdded(source, target);
            }
            return;
        }

        const newArr = [...items];

        let removedItem = sourceItem;
        if (source.containerId === this.containerId) {
            [removedItem] = newArr.splice(source.index, 1);
        }

        let targetIndex = target.index;
        if (targetIndex >= newArr.length) {
            newArr.push(removedItem);
        }
        else {
            newArr.splice(targetIndex, 0, removedItem);
        }

        onChange(newArr);
    }

    handleRemove = (source, targetId) => {
        if (this.containerId === targetId || this.props.nonRemovable === true) {
            return;
        }

        const { items, onChange } = this.props;

        const newArr = [...items];

        const [sourceItem] = newArr.splice(source.index, 1);
        onChange(newArr);

        return sourceItem;
    }

    renderItem = (c, i, itemTemplate) => {
        const { containerId, props: { itemType, accepts = itemType, keyName, draggableClassName, itemTarget, useDragHandle } } = this;

        return <Droppable containerId={containerId} key={keyName ? c[keyName] : i} accepts={accepts} itemType={itemType} index={i} onDrop={this.handleDrop}>
            {(dropConnector, isOver, canDrop) => <Draggable containerId={containerId} className={draggableClassName} itemTarget={itemTarget}
                itemType={itemType} item={c} index={i} onRemove={this.handleRemove}>
                {useDragHandle ?
                    (dragHandle, isDragging) => itemTemplate(c, i, { dropConnector, isOver, canDrop }, { dragHandle, isDragging })
                    : itemTemplate(c, i, { dropConnector, isOver, canDrop })
                }
            </Draggable>}
        </Droppable>
    }

    renderItems = (itemTemplate) => {
        const { props: { items } } = this;

        return items.map((c, i) => this.renderItem(c, i, itemTemplate));
    }

    renderChildren = (c, i) => {
        const { props: { children } } = this;

        return this.renderItem(c, i, children);
    }

    render() {
        const { containerId, props: { useCustomContainer, items, children, itemType, accepts = itemType, className, placeholder } } = this;

        let itemsToRender = null;
        if (useCustomContainer) {
            if (typeof children !== "function") {
                throw new Error("When useCustomContainer=true, children must be a function");
            }

            itemsToRender = children(this.renderItems);
        }
        else if (items && items.length > 0) {
            itemsToRender = <div className={className}>{items.map(this.renderChildren)}</div>;
        }
        else {
            itemsToRender = placeholder;
        }

        return <Droppable containerId={containerId} accepts={accepts} itemType={itemType} index={items.length} onDrop={this.handleDrop}>
            {itemsToRender}
        </Droppable>;
    }
}

Sortable.propTypes = {
    items: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onItemAdded: PropTypes.func,
    nonRemovable: PropTypes.bool
};

export default Sortable;