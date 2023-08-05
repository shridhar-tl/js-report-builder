import React, { PureComponent } from 'react';
import ReportItems from '.';

class ItemsContainer extends PureComponent {
    getReportItemComponent(item, i) {
        const { type } = item;
        const ItemType = ReportItems[type];

        let itemHtml = null;
        if (ItemType) {
            itemHtml = <ItemType key={type + i} definition={item.data} />;

            // This if block is primarly for BlockItem component which should not render wrapper div
            if (ItemType.noWrapper) {
                return itemHtml;
            }
        } else {
            itemHtml = (
                <div style={{ width: "100%", border: "1px solid grey", padding: "4px 12px" }}>An unknown report ui component found in this report</div>
            );
        }

        return (
            <div key={type + i} className={`report-item report-item-${type.toLowerCase()}`}>
                {itemHtml}
            </div>
        );
    }

    render() {
        const { items } = this.props;
        if (!Array.isArray(items)) { return null; }

        return <>{items.map(this.getReportItemComponent)}</>;
    }
}

export default ItemsContainer;