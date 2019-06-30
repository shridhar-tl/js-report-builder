
import React from 'react';
import ItemsBase from './ItemsBase';
import ItemsContainer from './ItemsContainer'
import { Panel } from 'primereact/panel';

class PanelItem extends ItemsBase {
    getStateObject = () => {
        var { definition: { style, items, header, hidden, toggleable, collapsed } } = this.props;

        hidden = this.parseExpr(hidden);
        toggleable = this.parseExpr(toggleable);
        collapsed = this.parseExpr(collapsed);

        return { style, items, header, hidden, toggleable, collapsed };
    }

    renderChild = () => {
        var { style, items, header, toggleable, collapsed } = this.state;
        return <Panel style={style} header={header} toggleable={toggleable} collapsed={collapsed}>
            <ItemsContainer items={items} />
        </Panel>;
    }
}

export default PanelItem;