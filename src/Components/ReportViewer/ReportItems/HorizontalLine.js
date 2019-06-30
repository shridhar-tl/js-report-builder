import React, { PureComponent } from 'react';

class HorizontalLine extends PureComponent {
    render() {
        var { definition: { style } = {} } = this.props;
        return <hr style={style} />
    }
}

export default HorizontalLine;