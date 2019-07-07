import React from 'react';
import { componentsMap } from '..';
import Droppable from '../../DragDrop/Droppable';
import ReportItemBase from '../ReportItemBase';
import DraggableHandle from '../../DragDrop/DraggableHandle';
import { getUniqueId } from '../../Common/HelperFunctions';

class BaseContainer extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition = {} } = props;
        var { items = [] } = definition;
        this.state = { definition, addedItems: items || [] };
        this.containerId = getUniqueId();
    }

    onItemAdded = (item, drg, index) => {
        var { addedItems } = this.state;
        if (this.unsupportedItems && ~this.unsupportedItems.indexOf(item.type)) {
            var { onUnknownItemAdded } = this.props;
            if (onUnknownItemAdded) { onUnknownItemAdded(item); }
        }
        else if (index >= 0) {
            addedItems.splice(index, 0, item);
        }
        else {
            var newItem = { type: item.type }; // ToDo: attrs property need to be added
            addedItems.push(newItem);
        }

        addedItems = [...addedItems];
        this.setState({ addedItems });

        var { definition } = this.state;
        definition.items = addedItems;
        this.props.onChange(definition);
    };

    moveItem = (srcIndex, destIndex, item) => {
        if (item.itemType === "EXST_ITMS") {
            var { addedItems } = this.state;

            var [movedItem] = addedItems.splice(srcIndex, 1);
            addedItems.splice(destIndex, 0, movedItem);
            addedItems = [...addedItems];

            this.setState({ addedItems });
            this.props.onChange(addedItems);
        } else {
            this.onItemAdded({ type: item.item.type }, null, destIndex); // ToDo: attrs property need to be added
        }
        return true;
    }

    onItemRemoved = index => {
        var { addedItems, definition } = this.state;
        addedItems.splice(index, 1);
        addedItems = [...this.state.addedItems];
        this.setState({ addedItems });

        definition.items = addedItems;
        this.props.onChange(definition);
    };

    onChanged = (itemData, index) => {
        var { addedItems, definition } = this.state;
        addedItems[index].data = itemData;
        definition.items = addedItems;
        this.props.onChange(definition);
    };

    getControl = (item, index) => {
        var Ctl = componentsMap[item.type].control;

        if (!Ctl) { Ctl = ReportItemBase; }

        return (
            <DraggableHandle className="cmp-drg" index={index} itemType="EXST_ITMS" item={item} key={item._uniqueId} containerId={this.containerId} onItemRemoved={this.onItemRemoved}>
                {({ connectDragSource }) => (
                    <Ctl
                        dragSource={connectDragSource}
                        containerId={this.containerId}
                        onItemMoved={this.moveItem}
                        onItemAdded={this.onItemAdded}
                        key={index}
                        index={index}
                        onItemRemoved={this.onItemRemoved}
                        data={item.data}
                        onChange={d => this.onChanged(d, index)}
                    />
                )}
            </DraggableHandle>);
    };

    getDroppableContainer() {
        var { addedItems } = this.state;

        return <Droppable className="drop-grp" type={["RPT_ITMS", "EXST_ITMS"]} index={addedItems.length} containerId={this.containerId}
            onItemAdded={this.onItemAdded} onItemMoved={this.moveItem}>
            {!addedItems.length && (
                <div className="message-no-items">
                    Drag and drop report items here
                        </div>
            )}
            {addedItems.map(this.getControl)}
        </Droppable>
    }

    render() {
        return super.renderBase(this.getDroppableContainer());
    }
}

export default BaseContainer;