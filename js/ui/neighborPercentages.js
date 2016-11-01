function neighborPercentages(clickedNeighbor) {
    var breadcrumbs = $(".breadcrumbs-zone");
    var breadcrumbsText = "";
    switch (clickedNeighbor.type) {
        case "nombre_barrio": 
            breadcrumbsText += clickedNeighbor.nombre_barrio;
        case "localidad":
            breadcrumbsText += " | " + clickedNeighbor.localidad;
        case "departamento":
            breadcrumbsText += " | " + clickedNeighbor.departamento;
        case "provincia":
            breadcrumbsText += " | " + clickedNeighbor.provincia;
    }

    if (breadcrumbsText == "") { breadcrumbsText = " Todo";}
    breadcrumbs.text(breadcrumbsText);

    if (clickedNeighbor.type === "nombre_barrio") return;
    var arrayConDatos = filterLayer(getNeighbors(clickedNeighbor));
    var fichaPorcentajes = $('#fichaPorcentajes');
    fichaPorcentajes.css('display', 'block');
    var EXCLUDE_DEFINITIONS = true;
    var families = countFamilies(arrayConDatos, EXCLUDE_DEFINITIONS);
    var familiesLabel = $(".count-families");
    familiesLabel.text(families);

    var settlements = countSettlements(arrayConDatos, EXCLUDE_DEFINITIONS);
    var settlementsLabel = $(".count-settlements");
    settlementsLabel.text(settlements);

    generateCharts({type: "agua", title: "Acceso al agua", data: arrayConDatos, colors: generateColors("#D64329")});
    generateCharts({type: "excretas", title: "Eliminación de excretas", data: arrayConDatos, colors: generateColors("#0D61A8")});
    generateCharts({type: "luz", title: "Energía eléctrica", data: arrayConDatos, colors: generateColors("#F58238")});
    generateCharts({type: "energia_calefaccion", title: "Energía para calefacción", data: arrayConDatos, colors: generateColors("#83B728")});
    generateCharts({type: "energia_cocinar", title: "Energía para cocinar", data: arrayConDatos, colors: generateColors("#F0A600")});
}

function getNeighbors(properties) {
    var data = Techo.db.r2016;
    var type = properties.type;
    var name = properties[type];


    var filteredKeys = Object.keys(data).filter(function (index) {
        var isOkToAppend = true;
        if (!name || !type) {return true}
        switch (type) {
            case "nombre_barrio":
                isOkToAppend &= data[index].nombre_barrio === properties.nombre_barrio;
            case "localidad":
                isOkToAppend &= data[index].localidad === properties.localidad;
            case "departamento":
                isOkToAppend &= data[index].departamento === properties.departamento;
            case "provincia":
                isOkToAppend &= data[index].provincia === properties.provincia;
        }

        return isOkToAppend;
    });

    var neighbors = [];
    for (var index in filteredKeys) {
        var id = filteredKeys[index];
        neighbors[id] = (data[id]);
    }

    return neighbors;
}

function generateColors(hexa) {
    var r, g, b;
    var rHex, gHex, bHex;
    var colors = [];
    var count = 7;
    var step = Math.round(100 / count);
    for (var i = 0; i < 100; i+= step) {
        var color = Highcharts.Color(hexa).brighten(i / 100 * 0.7).get()
        colors.push(color);
    }
    return colors;
}