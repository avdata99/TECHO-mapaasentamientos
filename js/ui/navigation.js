$(document).ready(function () {
    splash();
    searchResultClick();
    showChartsClick();
    summaryButton();
    downloadButton();
});

function downloadButton() {
    var $downloadForm = $("#downloadForm");
    var $downloadRequest = $("#downloadRequest");
    var $downloadFormButton = $(".form-download-button");
    var $downloadMenu = $(".download-menu");
    var $downloadUserData = $(".download-user-data");

    /* Limpia localstorage */
    localStorage.clear();

    $downloadForm.submit(function(evt) {
        var data = filterLayer(getNeighbors(clickedNeighbor));
        var requestData = {"barrios": {"2016": {}}};
        for (var i in data) {
            requestData.barrios[2016][i] = {"nid": i};
        }
        $downloadRequest.val(JSON.stringify(requestData));
    });

    $downloadFormButton.click(submitDownload)
    $(".download-user-data input").keydown(function(evt) {
        if (evt.keyCode === 13) {submitDownload()}
    })

    function submitDownload() {
        var name = $("#user_name").val();
        var institution = $("#user_institution").val();
        var phone = $("#user_phone").val();
        var email = $("#user_email").val();
        var validEmail = (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(email);

        if (name && validEmail) {
            localStorage.setItem("downloadName", name);
            localStorage.setItem("downloadEmail", email);
            localStorage.setItem("downloadPhone", phone);
            localStorage.setItem("downloadInstitution", institution);
            $.ajax({
                url: 'formulario/guardarDatosFormularioDescarga.php',
                type: 'POST',
                data: {
                    "nombre": localStorage.name,
                    "organizacion": localStorage.institution,
                    "telefono": localStorage.phone,
                    "email": localStorage.email
                },
                dataType: 'json'
            })
                .done(function(data) {
                    $downloadMenu.addClass("slider");
                    $downloadUserData.removeClass("slider");
                    localStorage.setItem("downloadCompleted", true);
                })
                .fail(function() {
                    $(".request-error").addClass("active");
                });
            return;
        }

        if (name === "") {
            $("#user_name").css("outline", "1px solid red");
        } else {
            $("#user_name").css("outline", "1px solid #d9d9d9");
        }
        if (!validEmail) {
            $("#user_email").css("outline", "1px solid red");
        } else {
            $("#user_email").css("outline", "1px solid #d9d9d9");
        }
    }
}

function searchResultClick() {
    $("#fichaPorcentajes").prepend("<div id='closePorcentajes'>X</div>")
    $("#closePorcentajes").css("cursor", "pointer").click(function () {
        $('#fichaPorcentajes').css("display", "none")
        $(".show-map").addClass("active");
        $(".show-charts").removeClass("active");
        Techo.charts.agua.highcharts().destroy();
        Techo.charts.luz.highcharts().destroy();
        Techo.charts.energia_calefaccion.highcharts().destroy();
        Techo.charts.energia_cocinar.highcharts().destroy();
        Techo.charts.excretas.highcharts().destroy();
    });

    $("#search_results").on("click", "h5", function (evt) {
        if ($(evt.target).attr("data-norelevado") === "true") {return;}
        clickedNeighbor = {
            id: $(evt.target).attr("data-id"),
            type: $(evt.target).attr("data-type"),
            provincia: $(evt.target).attr("data-provincia"),
            departamento: $(evt.target).attr("data-departamento"),
            localidad: $(evt.target).attr("data-localidad"),
            nombre_barrio: $(evt.target).attr("data-barrio")
        };
        $("#search_input").val(clickedNeighbor[clickedNeighbor.type]);
        centerZone(clickedNeighbor);
    });
}

function showChartsClick() {
    $("#show_charts, #show_charts_summary").click(function() {
        $(".show-map").removeClass("active");
        $(".show-charts").addClass("active");
        neighborPercentages(clickedNeighbor);
    });
}

function summaryButton() {
    var $summaryButton = $(".ver-resumen");
    var $summaryCloseButton = $(".filter-compile .closebfc");
    var $editFilters = $(".editf");

    $summaryButton.click(function() {



        layerData = Techo.db["r2016"];

        /* filtra los poligonos */
        var EXCLUDE_DEFINITIONS = true;
        var filteredLayerIds = filterLayer(getNeighbors(clickedNeighbor));

        var families = countFamilies(filteredLayerIds, EXCLUDE_DEFINITIONS);

        var settlements = countSettlements(filteredLayerIds, EXCLUDE_DEFINITIONS);

        var $filtersContainer = $(".filtros-aplicados");
        $filtersContainer.html('');

        var DOMFilters = "";

        /* arma el texto de cada filtro aplicado */
        var filterName = "";
        switch (clickedNeighbor.type) {
            case "nombre_barrio":
                filterName += clickedNeighbor.nombre_barrio + ", ";
            case "localidad":
                filterName += clickedNeighbor.localidad + ", ";
            case "departamento":
                filterName += clickedNeighbor.departamento + ", ";
            case "provincia":
                filterName += clickedNeighbor.provincia;
        }

        DOMFilters += "<div class='blkin'><h6>" + filterName + " </h6> </div>"
        for(var i in appliedFilters) {
            if (appliedFilters[i] === false) {continue;}
            var filter = Techo.filters[i];
            filterName = "";
            if (filter.title) {filterName += filter.title + " > "}
            if (filter.category) {filterName += filter.category + " > "}
            if (filter.subcategory) {filterName += filter.subcategory + " > "}
            if (filter.item) {filterName += filter.item}
            DOMFilters += "<div class='blkin'><h6>" + filterName + " </h6> </div>"
        }

        /* agrega los datos de los filtros aplicados al resumen */
        $filtersContainer.append($(DOMFilters));

        $(".cantidad-asentamientos").text(settlements)
        $(".cantidad-familias").text(families)

        /* muestra el resumen */
        $(".filter-compile").addClass("active");
        $(".first, .last").removeClass("slider");
    });

    $summaryCloseButton.click(function() {
        $(".filter-compile").removeClass("active");
    });

    $editFilters.click(function() {
        $(".filter-compile").removeClass("active");
        $(".last").addClass("slider");
    })
}

function countFamilies(layerIds, excludeDefinitions) {
    /* cuenta las familias de esos poligonos filtrados */
    var families = 0;

    for (var f in layerIds) {
        if (excludeDefinitions && layerIds[f].IDENTIFICAR !== "CUMPLE CON LA DEFINICIÓN ") {continue;}
        families += parseInt(layerIds[f].cantidad_de_familias) || 0;
    }
    return families;
}

function countSettlements(layerIds, excludeDefinitions) {

    /* fix numero asentamientos para nacion */
    if (clickedNeighbor.type === undefined) {
        return 2432;
    }

    /* fix numero asentamientos para ciudad de buenos aires */
    if (clickedNeighbor.type === "provincia" && clickedNeighbor.provincia.toLowerCase() === "ciudad autónoma de buenos aires") {
        return 42;
    }

    /* cuenta la cantidad de poligonos filtrados */
    return Object.keys(layerIds).filter(function(index) {
        return !excludeDefinitions || layerIds[index].IDENTIFICAR === "CUMPLE CON LA DEFINICIÓN ";
    }).length;
}

function splash() {

    var splashScreen = $(".homepopup");
    var splashClose = $(".homepopup .closep");
    var splashGoToMap = $(".btns.btns1");

    splashClose.click(function() {
        splashScreen.fadeOut();
    });

    splashGoToMap.click(function() {
        splashScreen.fadeOut();
    });
}

function hideLoader() {
    $(".site-loader").fadeOut(1000);
}