$( window ).load(function() {

    initMap();
    initData(function(){
        filtersInit("r2016");
        layersInit();
        searchInit();
        hideLoader();
        fotosInit();
        fotosSatelitalesInit();
        log("🔌", "All modules initialized");
    });
    // UI




    // DB
    // functionDB2016();

    // busquedaInit();


});
