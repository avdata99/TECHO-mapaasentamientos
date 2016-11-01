function removePolygons(dataName) {
    if(Techo.db[dataName] && Techo.db[dataName].layer) {
        Techo.db[dataName].layer.remove();
    }
}

function drawPolygons(dataName) {
    var layerColor = layerColors[dataName];
    layerData = Techo.db[dataName];
    var filteredLayerIds = filterLayer(layerData);
    layerData.geoJson = [];
    layerData.polygon = [];
    layerData.layer = [];
    i = 0;
    for (var key in layerData.poligonos) {
        var value = layerData.poligonos[key];


        if (value.id in filteredLayerIds === false) {continue;}
        if (i < 9000 && value['poligono'] != "#N/A" && value['poligono'] != 0) {
            i++;
            comaSplit = value['poligono'].split(' ');
            comaSpace = [];

            $.each(comaSplit, function cadaLatLngPoligono(key, value) {
                latlngSpace = value.split(',');

                if (latlngSpace !== null && latlngSpace != "") {
                    revert = [latlngSpace[0], latlngSpace[1]]
                    comaSpace.push(revert);
                }
            });

            if (comaSpace !== null) {
                polygon = {
                    "type": "Feature",
                    "properties": {
                        "name": value['id'],
                        "id": key,
                        "style": {
                            "color": layerColor,
                            "weight": 1,
                            "opacity": 1
                        }
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [comaSpace]
                    }
                };
                layerData.geoJson.push(polygon);
            }

        }

    }

    layerData.layer = L.geoJson(layerData.geoJson, {
        style: function (feature) {
            return feature.properties.style;
        },
        onEachFeature: function (feature, layer) {
            //layer.bindPopup(feature.properties.name);
        }
    });

    layerData.layer.addData(layerData.geoJson);
    layerData.layer.addTo(Techo.mapa.map);

    if (dataName === "r2016") {
        layerData.layer.on("click", function (poligonoClicked) {
            neighborStatics(poligonoClicked.layer.feature.properties)
        });
    }

// end document ready
    $('#fichaclose').click(function (event) {
        closeNeighborStatics();
    });
}

function abrirFicha() {
    $('#ficha').removeClass('ficha_on').addClass('ficha_on');
}

function closeNeighborStatics() {
    $('#ficha').removeClass('ficha_on').addClass('ficha_off');
}
