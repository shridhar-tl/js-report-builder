import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import BaseContainer from './BaseContainer';
import TabViewProperties from './TabViewProperties';
import ReportItemBase from '../ReportItemBase';

class TabViewItem extends ReportItemBase {
    constructor(props) {
        super(props);
        var { data: definition } = props;

        if (!definition) {
            definition = {};
            this.definition = definition;
        }

        var { items = [
            { items: [], header: "Sheet 1" },
            { items: [], header: "Sheet 2" }
        ] } = definition;
        definition.items = items;

        this.state = { definition, addedItems: items };
    }

    UNSAFE_componentWillMount() {
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
        var { definition } = this.state;
        addedItems = [...addedItems];
        definition.items = addedItems;
        this.setState({ addedItems });
        this.props.onChange(definition);
    }

    onChange = (definition) => {
        this.props.onChange(definition);
        this.setState({ definition, addedItems: definition.items });
        this.hideProperties();
    }

    onItemRemoved = (index) => {
        var { addedItems } = this.state;
        addedItems.splice(index, 1);
        this.itemsChanged(addedItems);
    }

    render() {
        var { addedItems, showPropsDialog, definition } = this.state;

        return super.renderBase(
            <>
                <TabView>
                    {addedItems.map((d, i) => (
                        <TabPanel header={d.header} key={d._uniqueId}>
                            <BaseContainer data={d} onChange={c => this.itemChanged(i, c)} onItemRemoved={this.onItemRemoved} />
                        </TabPanel>))}
                </TabView>
                {showPropsDialog && <TabViewProperties definition={definition} onHide={this.hideProperties} onChange={this.onChange} />}
            </>
        );
    }
}

export default TabViewItem;