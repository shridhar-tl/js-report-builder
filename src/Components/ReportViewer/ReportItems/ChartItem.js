import React from 'react';
import ItemsBase from './ItemsBase';
import { Chart } from 'primereact/chart';

class ChartItem extends ItemsBase {
    getStateObject = () => {
        var { definition: { style, type, hidden, data, options, responsive, width, height } } = this.props;

        hidden = this.parseExpr(hidden);
        data = this.parseExpr(data);
        options = this.parseExpr(options);
        width = this.tryParseExpression(width);
        height = this.tryParseExpression(height);

        return { style, type, hidden, data, options, responsive, width, height };
    }

    renderChild = () => {
        var { type, data, options, responsive, width, height } = this.state;
        return <Chart type={type} data={data} options={options} responsive={responsive} width={width} height={height} />
    }
}

export default ChartItem;