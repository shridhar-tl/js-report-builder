import React, { PureComponent } from "react";

const excludedCSSProps = ["resize", "position", "-webkit", "object", "offset", "orphans", "empty", "widows", "will", "zoom", "backface", "column", "grid", "perspective", "shape", "stroke", "paint"];

class StyleEditor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { element: props.element, styleList: [], style: { ...(props.elementData.style || {}) } };
    }

    UNSAFE_componentWillMount() {
        this.setStyleProps(this.props.element);
    }

    UNSAFE_componentWillReceiveProps(newProps, oldProps) {
        if (newProps.element !== oldProps.element) {
            this.setState({ element: newProps.element, style: { ...(newProps.elementData.style || {}) } });
            this.setStyleProps(newProps.element);
        }
    }

    getJSPropName = (name) => {
        if (name === 'float') { return 'cssFloat'; }
        const slices = name.split('-');
        let result = slices[0];
        for (let i = 1; i < slices.length; i++) {
            const word = slices[i];
            result += word[0].toUpperCase() + word.substring(1);
        }
        return result;
    };

    setStyleProps(element) {
        const properties = window.getComputedStyle(element);
        let propName = null;
        const styleList = [];
        let i = 0;
        while (propName = properties[i++]) {
            // eslint-disable-next-line no-loop-func
            if (propName.length <= 2 || excludedCSSProps.some(t => propName.indexOf(t) === 0)) { continue; }

            const propValue = properties[propName];
            const jsPropName = this.getJSPropName(propName);
            styleList[styleList.length] = { key: propName, prop: jsPropName, value: propValue };
        }
        this.setState({ styleList });
    }

    styleChanged = (propName, jsPropName, value, oldValue) => {
        let { element, style } = this.state;
        element.style[propName] = value;
        const newValue = element.style[jsPropName];
        if (newValue && newValue !== oldValue) {
            style = { ...style };
            style[jsPropName] = newValue;
            this.props.onChange(style);
            this.setState({ style });
        }
        return newValue;
    };

    render() {
        const { styleList, element, style } = this.state;

        return <div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
            <table className="table">
                <thead>
                    <tr><th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {styleList.map(s => <tr key={s.key}><td>{s.key}</td>
                        <td><StyleValueEditor propName={s.prop} attr={s.key} customized={!!style[s.prop]}
                            value={style[s.prop] || s.value} onChange={this.styleChanged} element={element} /></td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    }
}

export default StyleEditor;

class StyleValueEditor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value, oldValue: props.value, customized: props.customized
        };
    }

    UNSAFE_componentWillReceiveProps(newProps, oldProps) {
        const { value, element, customized } = newProps;
        const newState = {
            value, element, customized
        };
        if (oldProps.element !== element) {
            newState.oldValue = value;
        }
        this.setState(newState);
    }

    valueChanged = (e) => {
        const ctl = e.currentTarget;
        const value = ctl.value;
        this.setState({ value });
    };

    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.setValue();
        }
        else if (e.keyCode === 27) {
            const { oldValue } = this.state;
            this.setState({ value: oldValue }, () => this.ctl.blur());
        }
    };

    setValue = (e) => {
        let { value, oldValue, customized } = this.state;
        if (value !== oldValue) {
            let newValue = this.props.onChange(this.props.attr, this.props.propName, value, oldValue);
            if (value && !newValue) { newValue = oldValue; }
            else { customized = true; }
            this.setState({ value: newValue, oldValue: newValue, customized }, () => {
                if (!e) {
                    this.ctl.blur();
                }
            });
        }
    };

    fieldFocused = () =>
        this.ctl.select();


    render() {
        const { value, customized } = this.state;
        return <input ref={(e) => this.ctl = e} type="text" value={value}
            style={{ width: '100%', height: '100%', border: '1px', fontWeight: (customized ? 'bold' : '') }}
            onChange={this.valueChanged} onKeyDown={this.onKeyDown} onFocus={this.fieldFocused} onBlur={this.setValue} />;
    }
}