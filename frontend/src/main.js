import {renderPlotlyFigure} from "@/components/common/PlotlyFigure";
import polyk from "@/components/transforms/polyk";
import appStartup from "@/Provider";
import history from "@/utils/localHistory";

window.app = {
    appStartup,
    history,
    renderPlotlyFigure,
    polyk,
};
