var Techo = {
    mapa: {},
    db: {},
    charts: {},
    filters: null
};

var layerColors = {
    "r2013": "#dbe349",
    "r2016": "#0092dd"
}

var appliedFilters = [];

var activeLayers = {"r2016": true}

var clickedNeighbor = {};

var __DEBUG__ = true;

function log(icon, message, error) {
    if (!__DEBUG__) {return;}
    if (error) {
        console.log("%c" + icon + " " + message, "border-left: 2px solid #e33; background:#eee; padding: 2px 4px; border-radius: 2px; color: red");
        return;
    }
    console.log("%c" + icon + " " + message, "border-left: 2px solid #3e8; background:#eee; padding: 2px 4px; border-radius: 2px;");
}
