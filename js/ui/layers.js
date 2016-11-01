function layersInit() {
    $('#radio1, #radio2').change( function(evt) {
        var isChecked = evt.target.checked;
        if (isChecked) {
            activeLayers[evt.target.value] = true;
            showLayer(evt.target.value)
        } else {
            activeLayers[evt.target.value] = false;
            hideLayer(evt.target.value);
        }
    });

    log("🔌", "layers module loaded");
}

function showLayer(layer) {
    if (Techo.db[layer] === undefined) {
        loadData(layer, fail, success);
        return;
    }

    drawPolygons(layer);

    function fail() {
        log("🔥", layer + " data NOT loaded", true);
    }

    function success(data) {
        Techo.db[layer] = data;
        log("🔌", layer + " data loaded");
        processData(layer);
        drawPolygons(layer);
    }
}

function hideLayer(layer) {
    removePolygons(layer);
}