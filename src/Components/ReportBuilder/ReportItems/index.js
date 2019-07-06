import HorizontalLine from "./HorizontalLine";
import ImageItem from "./Image/ImageItem";
import Grid from "./Grid/Grid";
import ChartItem from "./Chart/ChartItem";
import ContainerItem from "./Container/ContainerItem";
import PanelContainer from "./Container/PanelContainer";
import TabViewItem from "./Container/TabViewItem";
import MenuItems from "./MenuItems/MenuItems";

export const defaultComponents = [
    { type: 'TBL', icon: 'fa fa-table', text: 'Table', control: Grid },
    {
        type: 'IMG', icon: 'fa fa-image', text: 'Image', control: ImageItem,
        target: ['rpt-items', 'rpt-cntr', 'table-cell']
    },
    { type: 'TAB', icon: 'fa fa-list-alt', text: 'Tab view', control: TabViewItem },
    { type: 'CHT', icon: 'fa fa-bar-chart', text: 'Chart', control: ChartItem },
    { type: 'CTR', icon: 'fa fa-object-group', text: 'Container', control: ContainerItem },
    { type: 'PNL', icon: 'fa fa-window-maximize', text: 'Panel', control: PanelContainer },
    { type: 'HLN', icon: 'fa fa-window-minimize', text: 'Horizontal line', control: HorizontalLine },
    { type: 'MNU', icon: 'fa fa-th-list', text: 'Menu items', control: MenuItems },
    // { type: 'TXT', icon: 'fa fa-font', text: 'Text item' }, //ToDo: need to find appropriate approach
    { type: 'REP', icon: 'fa fa-repeat', text: 'Repeator', control: ContainerItem },
    { type: 'RPT', icon: 'fa fa-font', text: 'Sub report' }
];

export const componentsMap = defaultComponents.reduce((obj, cur) => { obj[cur.type] = cur; return obj; }, {});