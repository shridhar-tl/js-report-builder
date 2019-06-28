import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import BaseContainer from './BaseContainer';

class TabViewItem extends BaseContainer {
    constructor(props) {
        super(props);
        var { data } = props;
        var { items = [
            { items: [], header: "Tab Page 1" },
            { items: [], header: "Tab Page 2" },
            { items: [], header: "Tab Page 3" }
        ] } = data || {};
        this.state = { addedItems: items };
    }

    itemChanged = (index, newItem) => {
        var { addedItems } = this.state;
        addedItems[index] = newItem;
        this.onChange(addedItems);
    }

    itemAdded = (item) => {
        if (item.type === "TPG") {
            var { addedItems } = this.state;
            var curIdx = addedItems.length;
            var newItem = { items: [], header: "Tab Page " + (curIdx + 1) };
            addedItems.push(newItem);
            this.itemChanged(curIdx, newItem);
        }
    }

    onChange = (addedItems) => {
        var { data = { items: addedItems } } = this.props;
        addedItems = [...addedItems];
        data.items = addedItems;
        this.setState({ addedItems });
        this.props.onChange(data);
    }

    onItemRemoved = (index) => {
        var { addedItems } = this.state;
        addedItems.splice(index, 1);
        this.onChange(addedItems);
    }

    render() {
        var { addedItems } = this.state;

        return super.renderBase(
            <TabView>
                {addedItems.map((d, i) => (
                    <TabPanel header={d.header}>
                        <BaseContainer data={d} onChange={c => this.itemChanged(i, c)} onUnknownItemAdded={this.itemAdded} onItemRemoved={this.onItemRemoved} />
                    </TabPanel>))}
            </TabView>
        );
    }
}

export default TabViewItem;