import React from 'react';
import { componentsMap } from '..';
import ReportItemBase from '../ReportItemBase';
import { getUniqueId } from '../../Common/HelperFunctions';
import Sortable from '../../DragDrop/Sortable';

const noReportItemsMessage = <div className="message-no-items">Drag and drop report items here</div>;
const accepts = ["RPT_ITMS", "RPT_CMPN"];

class BaseContainer extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition = {} } = props;
        var { items = [] } = definition;
        this.state = { definition, addedItems: items || [] };
        this.containerId = getUniqueId();
    }

    onItemAdded = (source, target) => {
        const { item } = source;
        let { index } = target;
        let { addedItems } = this.state;
        addedItems = [...addedItems];

        if (this.unsupportedItems && ~this.unsupportedItems.indexOf(item.type)) {
            var { onUnknownItemAdded } = this.props;
            if (onUnknownItemAdded) { onUnknownItemAdded(item); }
        }

        const newItem = { type: item.type }; // ToDo: attrs property need to be added
        if ((index !== 0 && !index) || index >= addedItems.length) {
            addedItems.push(newItem);
        }
        else {
            addedItems.splice(index, 0, newItem);
        }

        this.itemsChanged(addedItems);
    };

    onItemRemoved = index => {
        var { addedItems } = this.state;
        addedItems.splice(index, 1);
        addedItems = [...this.state.addedItems];
        this.setState({ addedItems });

        this.updateSource(addedItems);
    };

    onChanged = (itemData, index) => {
        let { addedItems } = this.state;
        addedItems[index].data = itemData;
        this.updateSource(addedItems);
    };

    itemsChanged = (addedItems) => {
        this.updateSource(addedItems);
        this.setState({ addedItems });
    }

    updateSource(addedItems) {
        var { definition } = this.state;
        definition.items = addedItems;
        this.props.onChange(definition);
    }

    getControl = (item, index, drpHndl, drgSrc) => {
        var Ctl = componentsMap[item.type].control;

        if (!Ctl) { Ctl = ReportItemBase; }

        return (
            <Ctl
                dragSource={drgSrc.dragHandle}
                dropHandle={drpHndl.dropConnector}
                key={index}
                index={index}
                onItemRemoved={this.onItemRemoved}
                data={item.data}
                onChange={d => this.onChanged(d, index)}
            />);
    };

    getDroppableContainer() {
        return <Sortable className="drop-grp" draggableClassName="component" itemType="RPT_ITMS" accepts={accepts}
            items={this.state.addedItems} keyName="_uniqueId" useDragHandle onItemAdded={this.onItemAdded}
            onChange={this.itemsChanged} placeholder={noReportItemsMessage}>{this.getControl}</Sortable>
    }

    render() {
        return super.renderBase(this.getDroppableContainer());
    }
}

export default BaseContainer;