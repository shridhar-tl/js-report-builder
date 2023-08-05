import GridItem from "./GridItem/GridItem";
import ImageItem from "./ImageItem";
import TabItem from "./TabItem";
import ContainerItem from "./ContainerItem";
import PanelItem from "./PanelItem";
import HorizontalLine from "./HorizontalLine";
import MenuItem from "./MenuItem";
import ChartItem from "./ChartItem";
import SubReport from "./SubReport";
import TextItem from "./TextItem";

const components = {
    TBL: GridItem,
    IMG: ImageItem,
    TXT: TextItem,
    TAB: TabItem,
    CTR: ContainerItem,
    PNL: PanelItem,
    HLN: HorizontalLine,
    MNU: MenuItem,
    CHT: ChartItem,
    RPT: SubReport
};

export default components;