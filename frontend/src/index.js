import appStartup from "@/AppRoot";
import {renderPlotlyFigure} from "@/components/common/PlotlyFigure";
import polyk from "@/components/transforms/polyk";
import history from "@/utils/localHistory";

window.app = {
    appStartup,
    history,
    renderPlotlyFigure,
    polyk,
};
