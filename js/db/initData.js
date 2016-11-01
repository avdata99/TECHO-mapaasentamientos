function initData(cb) {
    var initialDataName = "r2016";
    var cb = cb || function () {};

    loadData(initialDataName, fail, success);

    function fail() {
        log("🔥", "r2016 data NOT loaded", true);
    }

    function success(data) {
        $.ajax({
            url: "no_relevados.json",
            dataType: 'json'
        })
            .done(function(norelevados) {
                Techo.db[initialDataName] = data;
                for (var i in norelevados) {
                    Techo.db[initialDataName][i] = norelevados[i]
                }
                log("🔌", "r2016 data loaded");
                processData(initialDataName);
                drawPolygons(initialDataName);
                cb();
            }).fail(function(err){
                console.log(err)
        });

    }
}

function loadData(dataName, fail, success) {
    $.ajax({
        url: dataName + ".json",
        dataType: 'json'
    })
        .done(success)
        .fail(fail);
}


function processData(dataName) {
    var neighbors = Techo.db[dataName];
    neighbors.localidades = [];
    neighbors.localidadesTemp = [];
    neighbors.poligonos = [];

    for (var n in neighbors) {
        var neighbor = neighbors[n];
        if (neighbor.constructor === Array) continue;
        row = toTitleCase(neighbor.localidad) + ' (' + toTitleCase(neighbor.provincia) + ')';
        neighbors.localidadesTemp.push(row);
        neighbors.poligonos.push({
            nid: neighbor.nid,
            id: neighbor.ID,
            poligono: neighbor.poligono
        });
    }

    neighbors.localidades = _.uniq(neighbors.localidadesTemp);

    log("🔌", dataName + " data processed");
    // $("#buscar").autocomplete({
    //     source: neighbors.localidades
    // });
}
