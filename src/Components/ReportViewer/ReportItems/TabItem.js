import React from 'react';
import ItemsBase from './ItemsBase';
import { TabView, TabPanel } from 'primereact/tabview';
import ItemsContainer from './ItemsContainer'

class TabItem extends ItemsBase {
    getStateObject = () => {
        var { definition: { style, items, hidden, disabled } } = this.props;
        hidden = this.parseExpr(hidden);
        disabled = this.parseExpr(disabled);

        items = items.map(this.processItems).filter(m => !!m);

        return { style, items, hidden, disabled };
    }

    processItems = (itm) => {
        var { hidden, disabled, header, items } = itm;
        hidden = this.parseExpr(hidden);
        disabled = this.parseExpr(disabled);
        if (!hidden) {
            return { disabled, header, items };
        }
    }

    renderChild = () => {
        var { items, disabled, style } = this.state;
        return <TabView style={style} disabled={disabled}>
            {items.map(itm => <TabPanel header={itm.header} disabled={itm.disabled}>
                {!itm.disabled && <ItemsContainer items={itm.items} />}
            </TabPanel>)}
        </TabView>;
    }
}

export default TabItem;