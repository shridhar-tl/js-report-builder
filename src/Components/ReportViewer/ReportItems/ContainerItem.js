
import React from 'react';
import ItemsBase from './ItemsBase';
import ItemsContainer from './ItemsContainer'

class ContainerItem extends ItemsBase {
    getStateObject = () => {
        var { definition: { style, items, hidden } } = this.props;
        hidden = this.parseExpr(hidden);
        return { style, items, hidden };
    }

    renderChild = () => {
        var { items, style } = this.state;
        return <div style={style}>
            <ItemsContainer items={items} />
        </div>;
    }
}

export default ContainerItem;