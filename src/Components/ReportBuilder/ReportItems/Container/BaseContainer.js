import React from 'react';
import { componentsMap } from '..';
import ReportItemBase from '../ReportItemBase';
import { getUniqueId } from '../../Common/HelperFunctions';
import Sortable from '../../DragDrop/Sortable';

const noReportItemsMessage = <div className="message-no-items">Drag and drop report items here</div>;
const dropMoreItemsMessage = <div className="message-no-items">Drag and drop more items here</div>;
const accepts = ["RPT_ITMS", "RPT_CMPN"];

class BaseContainer extends ReportItemBase {
    constructor(props) {
        super(props);
        const { data: definition = {} } = props;
        const { items = [] } = definition;
        this.state = { definition, addedItems: items || [] };
        this.containerId = getUniqueId();
    }

    onItemAdded = (source, target) => {
        const { item } = source;
        const { index } = target;
        let { addedItems } = this.state;
        addedItems = [...addedItems];

        if (this.unsupportedItems && ~this.unsupportedItems.indexOf(item.type)) {
            const { onUnknownItemAdded } = this.props;
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
        let { addedItems } = this.state;
        addedItems.splice(index, 1);
        addedItems = [...this.state.addedItems];
        this.setState({ addedItems });

        this.updateSource(addedItems);
    };

    onChanged = (itemData, index) => {
        const { addedItems } = this.state;
        addedItems[index].data = itemData;
        this.updateSource(addedItems);
    };

    itemsChanged = (addedItems) => {
        this.updateSource(addedItems);
        this.setState({ addedItems });
    };

    updateSource(addedItems) {
        const { definition } = this.state;
        definition.items = addedItems;
        this.props.onChange(definition);
    }

    getControl = (item, index, drpHndl, drgSrc) => {
        let { control: Ctl, icon, text } = componentsMap[item.type];

        if (!Ctl) { Ctl = ReportItemBase; }

        return (
            <Ctl
                dragSource={drgSrc.dragHandle}
                dropHandle={drpHndl.dropConnector}
                key={index}
                index={index}
                onItemRemoved={this.onItemRemoved}
                data={item.data}
                icon={icon}
                text={text}
                onChange={d => this.onChanged(d, index)}
            />);
    };

    getDroppableContainer() {
        const hasSomeItems = this.state.addedItems?.length > 0;
        return <Sortable className="drop-grp" draggableClassName="component" itemType="RPT_ITMS" accepts={accepts}
            items={this.state.addedItems} keyName="_uniqueId" useDragHandle onItemAdded={this.onItemAdded}
            onChange={this.itemsChanged} placeholder={hasSomeItems ? dropMoreItemsMessage : noReportItemsMessage}>{this.getControl}</Sortable>;
    }

    render() {
        return super.renderBase(this.getDroppableContainer());
    }
}

export default BaseContainer;