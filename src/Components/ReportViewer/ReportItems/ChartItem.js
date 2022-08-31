import React from 'react';
import ItemsBase from './ItemsBase';
import { Chart } from 'primereact/chart';

class ChartItem extends ItemsBase {
    getStateObject = async () => {
        var { definition: { style, type, hidden, data, options, responsive, width, height } } = this.props;

        hidden = hidden ? await this.parseExpr(hidden) : hidden;
        data = data ? await this.parseExpr(data) : data;
        options = options ? await this.parseExpr(options) : options;
        width = width ? await this.tryParseExpression(width) : width;
        height = height ? await this.tryParseExpression(height) : height;

        return { style, type, hidden, data, options, responsive, width, height };
    }

    renderChild = () => {
        var { type, data, options, responsive, width, height } = this.state;
        return <Chart type={type} data={data} options={options} responsive={responsive} width={width} height={height} />
    }
}

export default ChartItem;