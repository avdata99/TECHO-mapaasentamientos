function generateCharts(options) {
    var data = Techo.db.r2016;

    //CAMBIO LOS COLORES
    Highcharts.setOptions({
        colors: options.colors
    });

    var nodes = [];

    for (var n in options.data) {
        if (options.data[n].IDENTIFICAR !== "CUMPLE CON LA DEFINICIÓN ") {continue;}
        nodes.push(options.data[n]);
    }

    var counts = {};
    for (var n in nodes) {
        var node = nodes[n];
        var key = node[options.type].split("(")[0].toLowerCase();
        counts[key] = counts[key] === undefined ? 1 : counts[key] + 1;
    }

    //ACUMULO LOS NODOS EN UN ARRAY NOMBRE/VALOR
    var unifiedValues = [];
    var unifiedSummatory = 0;

    var keys = Object.keys(counts).sort(function(itemA, itemB){
        return counts[itemB] - counts[itemA];

    });
    for (var i in keys) {
        var key = keys[i];
        if (key == "") {continue;}
        unifiedSummatory += counts[key];
        unifiedValues.push([key, counts[key]]);
    }
    //SACO EL PORCENTAJE DE LOS NODOS Y LOS MUESTRO EN UN DIV
    $(".contenedorDatosDe_" + options.type).html('');
    var valuePercentage = 0;
    var appendToDOM = "";

    for (var i in unifiedValues) {
        valuePercentage = (unifiedValues[i][1] * 100) / unifiedSummatory;
        appendToDOM += "<span class='leyenda-porcentaje'>" + unifiedValues[i][0] + "</span>" +
            "<span class='valor-porcentaje'>" + valuePercentage.toFixed(1) + " <span class='percentage-symbol'>%</span></span>";
    }

    $(".tituloDe_" + options.type).text(options.title);
    $(".contenedorDatosDe_" + options.type).append(appendToDOM);

    //GENERO EL GRÁFICO
    var contenedor = $("#contenedorGraficoDe_" + options.type);
    Techo.charts[options.type] = contenedor.highcharts({
        chart: {
            type: "pie",
            options3d: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: options.title,
            style: {
                fontSize: "12px",
                display: "none"
            }
        },
        plotOptions: {
            pie: {
                innerSize: 60,
                depth: 45,
                dataLabels: {
                    enabled: false,
                },
                showInLegend: false
            }
        },
        series: [{
            name: "Cantidad",
            data: unifiedValues

        }],
        tooltip: {
            enabled: false
        },
    });
}