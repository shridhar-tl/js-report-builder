import React, { PureComponent } from 'react';
import ReportItems from '.';

class ItemsContainer extends PureComponent {
    getReportItemComponent(item, i) {
        var { type } = item;
        var ItemType = ReportItems[type];

        var itemHtml = null;
        if (ItemType) {
            itemHtml = <ItemType definition={item.data} />;
        } else {
            itemHtml = (
                <div style={{ width: "100%", border: "1px solid grey", padding: "4px 12px" }}>An unknown report ui component found in this report</div>
            );
        }

        return (
            <div key={type + i} className={"report-item report-item-" + type.toLowerCase()}>
                {itemHtml}
            </div>
        );
    }

    render() {
        var { items } = this.props;
        return <>{items.map(this.getReportItemComponent)}</>
    }
}

export default ItemsContainer;