import React, { PureComponent } from 'react';
import { Menu } from 'primereact/menu';
import { ContextMenu as CMenu } from 'primereact/contextmenu';

let contextHandler = () => { /* Nothing to do */ };
export function showContextMenu(event, model) {
    event.preventDefault();
    contextHandler(event, model);
}

export function hideContextMenu() {
    contextHandler();
}

export default class ContextMenu extends PureComponent {
    state = { contextItems: [] };
    lastEvent = {};

    componentDidMount() {
        contextHandler = (event, contextItems) => {
            if (!event) {
                this.menu.hide(this.lastEvent);
                this.contextMenu.hide(this.lastEvent);
                return;
            }

            this.lastEvent = event;
            const isContextMenu = event.type === "contextmenu";

            if (!isContextMenu) {
                contextItems = contextItems.filter(c => !c.disabled || !c.items || c.items.length === 0);
            }

            if (!this.state.contextItems?.length || this.state.contextItems !== contextItems) {
                this.setState({ contextItems });
            }

            if (isContextMenu) {
                this.menu.hide(event);
                this.contextMenu.show(event);
            }
            else {
                this.contextMenu.hide(event);
                this.menu.show(event);
            }
        };
    }

    setMenuRef = el => this.menu = el;
    setContextMenuRef = el => this.contextMenu = el;

    render() {
        return <>
            <Menu appendTo={document.body} model={this.state.contextItems} popup={true} ref={this.setMenuRef} />
            <CMenu appendTo={document.body} model={this.state.contextItems} popup={true} ref={this.setContextMenuRef} />
        </>;
    }
}