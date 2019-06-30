import React from 'react';
import { componentsMap } from '..';
import Droppable from '../../DragDrop/Droppable';
import ReportItemBase from '../ReportItemBase';

class BaseContainer extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition = {} } = props;
        var { items = [] } = definition;
        this.state = { definition, addedItems: items || [] };
    }

    onItemAdded = item => {
        var addedItems = this.state.addedItems.map(i => i);
        if (this.unsupportedItems && ~this.unsupportedItems.indexOf(item.type)) {
            var { onUnknownItemAdded } = this.props;
            if (onUnknownItemAdded) { onUnknownItemAdded(item); }
        } else {
            addedItems.push({ type: item.type }); // ToDo: attrs property need to be added
        }
        this.setState({ addedItems });

        var { definition } = this.state;
        definition.items = addedItems;
        this.props.onChange(definition);
    };

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
            <Ctl
                key={index}
                index={index}
                onItemRemoved={this.onItemRemoved}
                data={item.data}
                onChange={d => this.onChanged(d, index)}
            />
        );
    };

    getDroppableContainer(addedItems, onItemAdded) {
        if (!addedItems) {
            addedItems = this.state.addedItems;
        }

        return <Droppable className="drop-grp" type="RPT_ITMS" onItemAdded={onItemAdded || this.onItemAdded}>
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