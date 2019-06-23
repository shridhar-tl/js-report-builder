import HorizontalLine from "./HorizontalLine";
import ImageItem from "./ImageItem";
import Grid from "./Grid/Grid";

export const defaultComponents = [
    { type: 'TBL', icon: 'fa fa-table', text: 'Table', control: Grid },
    {
        type: 'IMG', icon: 'fa fa-image', text: 'Image', control: ImageItem,
        target: ['rpt-items', 'rpt-cntr', 'table-cell']
    },
    { type: 'TAB', icon: 'fa fa-list-alt', text: 'Tab view' },
    { type: 'TPG', icon: 'fa fa-square', text: 'Tab page' },
    { type: 'CHT', icon: 'fa fa-bar-chart', text: 'Chart' },
    { type: 'PNL', icon: 'fa fa-object-group', text: 'Container' },
    { type: 'CPL', icon: 'fa fa-window-maximize', text: 'Collapsible panel' },
    { type: 'HLN', icon: 'fa fa-window-minimize', text: 'Horizontal line', control: HorizontalLine },
    { type: 'MNU', icon: 'fa fa-th-list', text: 'Menu Items' }
];

export const componentsMap = defaultComponents.reduce((obj, cur, i, src) => { obj[cur.type] = cur; return obj; }, {});