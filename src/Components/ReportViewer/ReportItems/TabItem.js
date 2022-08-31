import React from 'react';
import ItemsBase from './ItemsBase';
import { TabView, TabPanel } from 'primereact/tabview';
import ItemsContainer from './ItemsContainer'

class TabItem extends ItemsBase {
    getStateObject = async () => {
        var { definition: { style, items, hidden, disabled } } = this.props;
        hidden = hidden && await this.parseExpr(hidden);
        disabled = disabled && await this.parseExpr(disabled);

        items = (await Promise.all(items.map(this.processItems))).filter(m => !!m);

        return { style, items, hidden, disabled };
    }

    processItems = async (itm) => {
        var { hidden, disabled, header, items } = itm;
        hidden = hidden && await this.parseExpr(hidden);
        disabled = disabled && await this.parseExpr(disabled);
        if (!hidden) {
            return { disabled, header, items };
        }
    }

    renderChild = () => {
        var { items, disabled, style } = this.state;
        return <TabView style={style} disabled={disabled}>
            {items && items.map(itm => <TabPanel key={itm._uniqueId} header={itm.header} disabled={itm.disabled}>
                {!itm.disabled && <ItemsContainer items={itm.items} />}
            </TabPanel>)}
        </TabView>;
    }
}

export default TabItem;