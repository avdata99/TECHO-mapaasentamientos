function searchInit() {
    var searchSourceDefault = "r2016";
    var searchInput = $("#search_input");

    var data = {
        localidades: getKeywordsByProperty(Techo.db[searchSourceDefault], 'localidad'),
        provincias: getKeywordsByProperty(Techo.db[searchSourceDefault], 'provincia'),
        nombre_barrios: getKeywordsByProperty(Techo.db[searchSourceDefault], 'nombre_barrio'),
        departamentos: getKeywordsByProperty(Techo.db[searchSourceDefault], 'departamento')
    };
    /* se llama a la búsqueda luego de 300ms de no haber tecleado nada */
    searchInput.keyup(debounce(search, 300));

    function search(evt) {
        /*  normaliza el texto de búsqueda quitando caracteres especiales
            y pasando el texto a minúsculas */
        var query = convertSpecialChars(evt.target.value.toLowerCase());

        /* se obtiene un array de datos filtrado por resultados de búsqueda */
        filteredResults = {
            localidad: filterDataBySearch(data.localidades, "localidad", query),
            departamento: filterDataBySearch(data.departamentos, "departamento", query),
            nombre_barrio: filterDataBySearch(data.nombre_barrios, "nombre_barrio", query),
            provincia: filterDataBySearch(data.provincias, "provincia", query)
        };

        /* se agregan los resultados al DOM */
        appendResults(filteredResults, query );
    }
    log("🔌", "search module loaded");
}

function getKeywordsByProperty(data, property) {
    var dataAsDict = [];
    var dataAsArray = [];

    /* Obtiene todos los índices numéricos de data para obtener cada barrio */
    var indexes = Object.keys(data).filter(function(index) {
        return data[index].ID !== undefined;
    });

    /* Crea un nuevo array con esos barrios como indices para evitar duplicados */
    for (var i in indexes) {
        var index = indexes[i];
        actualData = data[index];
        dataAsDict.push({
            id: actualData.ID,
            provincia: actualData.provincia,
            departamento: actualData.departamento,
            localidad: actualData.localidad,
            nombre_barrio: actualData.nombre_barrio,
            no_relevado: actualData.no_relevado
        });
    }

    return dataAsDict;
}

function appendResults(results, query) {
    var searchResults = $("#search_results");
    var blockinConstructor = "<div class='blockin'></div>";
    var textwConstructor = "<div class='textw'></div>";
    var h5Constructor = "<h5></h5>";
    var h6Constructor = "<h6></h6>";
    var titles = {
        provincia: "Provincia",
        localidad: "Localidad",
        departamento: "Partido/Departamento",
        nombre_barrio: "Asentamiento"
    }

    /* se limpian los resultados anteriores y se agregan los nuevos */
    searchResults.html('');

    /* agrega resultados por provincia, localidad y departamento */
    buildFields("provincia");
    buildFields("departamento");
    buildFields("localidad");
    buildFields("nombre_barrio");

    function buildFields(tag) {
        var $blockinDOM = $(blockinConstructor);
        /* flag para saber si ya se agregó el título de categoría */
        var titleSet = false;
        if (results[tag].length > 0) {
            /* limita el maximo, si es mas de tres caracteres sin contar los espacios,
             * muestra todos los resultados */
            var maxItemsByType = query.replace(" ","").length <= 3 ? 5 : results[tag].length;
            var loopTo = Math.min(results[tag].length , maxItemsByType);
            for (var i = 0; i < loopTo; i++) {
                var result = results[tag][i];
                var $textwDOM = $(textwConstructor);
                var text = convertSpecialChars(result[tag].toLowerCase());
                var label = text.replace(query, "<b style='color: black'>" + query + "</b>").toUpperCase()
                label += result.label;

                if (result.no_relevado) {
                    label += " - <i class='norelevado'>NO RELEVADO</i>";
                }

                var $h5DOM = $(h5Constructor)
                    .html(label)
                    .attr('data-norelevado', result.no_relevado)
                    .attr('data-id', result.id)
                    .attr('data-type', tag)
                    .attr('data-provincia', result.provincia)
                    .attr('data-departamento', result.departamento)
                    .attr('data-localidad', result.localidad)
                    .attr('data-barrio', result.nombre_barrio);
                $textwDOM.append($h5DOM);

                /* si el título del tipo de resultado no se agregó nunca, se agrega */
                if (!titleSet) {
                    titleSet = true;
                    var $h6DOM = $(h6Constructor).text(titles[tag]);
                    $textwDOM.append($h6DOM);
                }

                $blockinDOM.append($textwDOM);
            }

            searchResults.append($blockinDOM).fadeIn();
        }
    }



}

function filterDataBySearch(data, property, query) {
    var queryRegExp = new RegExp(".*" + query + ".*", "g");
    /* filtra los datos dejando sólo los que matchean */

    var filteredData = data.filter(function(item) {
        item.searchSort = convertSpecialChars(item[property]).toLowerCase().indexOf(query) + 1 || 0;

        if (item.no_relevado === true && property !== "provincia") {return false;}
        var label = "";
        switch (property) {
            case "nombre_barrio":
                label += ", " + item.localidad;
            case "localidad":
                label += ", " + item.departamento;
            case "departamento":
                label += ", " + item.provincia;
            case "provincia":
                break;
        }
        item.uniqueTag = item[property] + label;
        item.label = label;
        return queryRegExp.test(convertSpecialChars(item[property].toLowerCase()));
    });

    var filteredData = _.uniq(filteredData, function(item) {
        return item.uniqueTag;
    });

    filteredData = filteredData.sort(function(itemA, itemB) {
        var sortAlph = 0;
        var sortPos = itemA.searchSort - itemB.searchSort;
        if (itemA[property] < itemB[property]) {sortAlph = -1}
        if (itemA[property] > itemB[property]) {sortAlph = 1}

        return sortPos * 1000 + sortAlph;
    });

    return filteredData;
}

/* función que se encarga de convertir caracteres especiales en simples*/
function convertSpecialChars(str){
    var conversions = { "o": "ö", "u": "ü", "U": "Ü", "O": "Ö", "A": "Á", "a": "á", "E": "É",
        "e": "é", "I": "Í", "i": "í", "N": "Ñ", "n": "ñ", "O": "Ó", "o": "ó", "U": "Ú", "u": "ú" };

    for(var i in conversions){
        var re = new RegExp(conversions[i],"g");
        str = str.replace(re, i);
    }

    return str;
}


/*  la función debounce hace que una función se ejecute
    luego de haber pasado un tiempo determinado desde que
    se llamó la última vez. */

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
