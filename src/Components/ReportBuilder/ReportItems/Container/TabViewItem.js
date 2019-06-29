import React, { Fragment } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import BaseContainer from './BaseContainer';
import TabViewProperties from './TabViewProperties';

class TabViewItem extends BaseContainer {
    constructor(props) {
        super(props);
        var { data } = props;

        if (!data) {
            data = {};
            this.definition = data;
        }

        var { items = [
            { items: [], header: "Sheet 1" },
            { items: [], header: "Sheet 2" }
        ] } = data;
        data.items = items;

        this.state = { addedItems: items };
    }

    componentWillMount() {
        if (this.definition) {
            this.onChange(this.definition);
        }
    }

    itemChanged = (index, newItem) => {
        var { addedItems } = this.state;
        addedItems[index] = newItem;
        this.itemsChanged(addedItems);
    }

    itemsChanged = (addedItems) => {
        var { data = { items: addedItems } } = this.props;
        addedItems = [...addedItems];
        data.items = addedItems;
        this.setState({ addedItems });
        this.props.onChange(data);
    }

    onChange = (data) => {
        this.itemsChanged(data.items);
        this.hideProperties();
    }

    onItemRemoved = (index) => {
        var { addedItems } = this.state;
        addedItems.splice(index, 1);
        this.itemsChanged(addedItems);
    }

    render() {
        var { addedItems, showPropsDialog } = this.state;

        return super.renderBase(
            <Fragment>
                <TabView>
                    {addedItems.map((d, i) => (
                        <TabPanel header={d.header} key={d._uniqueId}>
                            <BaseContainer data={d} onChange={c => this.itemChanged(i, c)} onItemRemoved={this.onItemRemoved} />
                        </TabPanel>))}
                </TabView>
                {showPropsDialog && <TabViewProperties definition={this.props.data} onHide={this.hideProperties} onChange={this.onChange} />}
            </Fragment>
        );
    }
}

export default TabViewItem;