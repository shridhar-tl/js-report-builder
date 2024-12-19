
import React from 'react';
import ItemsBase from './ItemsBase';
import ItemsContainer from './ItemsContainer';
import { Panel } from 'primereact/panel';

class PanelItem extends ItemsBase {
    getStateObject = async () => {
        const { style, items, header } = this.props.definition;
        let { hidden, toggleable, collapsed } = this.props.definition;

        hidden = hidden && await this.parseExpr(hidden);
        toggleable = toggleable && await this.parseExpr(toggleable);
        collapsed = collapsed && await this.parseExpr(collapsed);

        return { style, items, header, hidden, toggleable, collapsed };
    };

    renderChild = () => {
        const { style, items, header, toggleable, collapsed } = this.state;
        return <Panel style={style} header={header} toggleable={toggleable} collapsed={collapsed}>
            <ItemsContainer items={items} />
        </Panel>;
    };
}

export default PanelItem;