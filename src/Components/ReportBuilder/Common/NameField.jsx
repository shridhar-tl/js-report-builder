import React, { PureComponent } from 'react';
import { InputText } from 'primereact/inputtext';

class NameField extends PureComponent {
    onChange = (e) => {
        const value = e.currentTarget.value;
        this.props.onChange(value);
    };

    render() {
        return <InputText keyfilter="alphanum" value={this.props.value} onChange={this.onChange} />;
    }
}

export default NameField;