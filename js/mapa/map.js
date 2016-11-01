function initMap() {

    Techo.mapa.capagrayscale = L.tileLayer("https://api.mapbox.com/styles/v1/juanlacueva/cit4k796a007l2ymqn1m0lbpm/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVhbmxhY3VldmEiLCJhIjoiRFh4T2xVZyJ9.EUqU8kwG9NutFNdVdL2JdQ", {
        id: "MapID",
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Desarrollado por <a href="http://www.winguweb.org" target="_blank">Wingu</a>',
        edgeBufferTiles: 2
    });

    Techo.mapa.capasat = L.tileLayer("https://api.mapbox.com/styles/v1/juanlacueva/citv45eqi002g2ilfclt4gpmt/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVhbmxhY3VldmEiLCJhIjoiRFh4T2xVZyJ9.EUqU8kwG9NutFNdVdL2JdQ", {
        id: "MapSat",
        attribution: 'Imágenes de <a href="http://www.mapbox.com/">Mapbox</a>. Desarrollado por <a href="http://www.winguweb.org" target="_blank">Wingu</a>',
        edgeBufferTiles: 1
    });

    Techo.mapa.map = L.map("map", {
        center: [-38.416, -63.642],zoom: 5,
        layers: [Techo.mapa.capagrayscale],
        zoomControl: false
    });

    var baseMaps = {
        "Mapa": Techo.mapa.capagrayscale,
        "Satelital": Techo.mapa.capasat
    };


    Techo.mapa.status = 'mapa';
    //  L.control.zoom({
    //      position: "bottomright"
    //  }).addTo(Techo.mapa.map);
    $('#zoomin').click( function zoomInButton() {
      Techo.mapa.map.zoomIn();
    });

    $('#zoomout').click( function zoomOutButton() {
      Techo.mapa.map.zoomOut();
    });

    $('#satbutton').click( function zoomOutButton() {
        if (Techo.mapa.status == 'mapa') {
            Techo.mapa.map.removeLayer(Techo.mapa.capagrayscale);
            Techo.mapa.capasat.addTo(Techo.mapa.map);
            Techo.mapa.status = 'sat';
            return true;
        }

        if (Techo.mapa.status == 'sat') {
            Techo.mapa.map.removeLayer(Techo.mapa.capasat);
            Techo.mapa.capagrayscale.addTo(Techo.mapa.map);
            Techo.mapa.status = 'mapa';
            return true;
        }

    });

    log("🔌", "map module loaded");
}

function centerZone(zones) {
    var zonesArray = getNeighbors(zones);
    var zonesArrayCoords = Object.keys(zonesArray).map(function(index) {
        var polygon = zonesArray[index].poligono.split(' ');
        var coords = [];
        for (var c in polygon) {
            var coord = polygon[c].split(',')
            if (isNaN(+coord[0]) || isNaN(+coord[1])) {
                continue;
            }
            coords.push([
                +coord[1],
                +coord[0]
            ]);
        }
        return [coords];
    });

    singleCoords = [];

    for (var z in zonesArrayCoords) {
        singleCoords = singleCoords.concat(zonesArrayCoords[z]);
    }

    var multiPolygon = L.polygon(zonesArrayCoords);


    Techo.mapa.map.fitBounds(multiPolygon.getBounds());

}
