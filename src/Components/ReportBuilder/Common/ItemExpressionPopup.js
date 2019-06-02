import React, { PureComponent } from "react";

class ItemExpressionPopup extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TabView>
                    <TabPanel header="General" contentClassName="no-padding" className="no-padding">
                        <div />
                    </TabPanel>
                </TabView>
            </div>
        );
    }
}

export default ItemExpressionPopup;
