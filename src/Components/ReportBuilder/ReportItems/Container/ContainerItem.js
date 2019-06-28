import React from 'react';
import BaseContainer from './BaseContainer';
import './ContainerItem.scss'

class ContainerItem extends BaseContainer {
    render() {
        return super.renderBase(<div className="container-item">
            {this.getDroppableContainer()}
        </div>);
    }
}

export default ContainerItem;