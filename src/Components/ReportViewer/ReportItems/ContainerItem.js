
import React from 'react';
import ItemsBase from './ItemsBase';
import ItemsContainer from './ItemsContainer';

class ContainerItem extends ItemsBase {
    static noWrapper = true;

    getStateObject = async () => {
        const { definition } = this.props;
        const { style, items } = definition;
        let { hidden, blockSize } = definition;

        hidden = hidden ? await this.parseExpr(hidden) : hidden;
        // as of now blockSize is not an expression. It supports only int
        //blockSize = blockSize ? await this.parseExpr(blockSize) : blockSize;

        if (blockSize) {
            blockSize = parseInt(blockSize);
            if (!blockSize) { blockSize = undefined; }
            else if (blockSize < 1) { blockSize = 1; }
            else if (blockSize > 12) { blockSize = 12; }
        } else {
            blockSize = undefined;
        }

        return { style, items, hidden, blockSize };
    };

    renderChild = () => {
        const { items, style, blockSize } = this.state;
        const className = blockSize && blockSize !== 12 ? `col-${blockSize}` : undefined;

        return <div style={style} className={className}>
            <ItemsContainer items={items} />
        </div>;
    };
}

export default ContainerItem;