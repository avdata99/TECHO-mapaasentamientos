function filtersInit(dataName) {

    loadFilters(fail, success);

    function success(filters) {
        Techo.filters = filters;
        attachFiltersToDOM();
    }

    function fail(err) {
        console.error(err);
        console.error("No se encontraron los filtros");
    }

    log("🔌", "filters module loaded");
}

function filterLayer(layer) {
    if (Techo.filters) {
        for(var i in appliedFilters) {
            if (!appliedFilters[i]) {continue;}
            var filter = Techo.filters[i];
            layer = applyFilter(layer, filter)
        }
    }

    return layer;
}

function applyFilter(layer, filter) {
    var keys = Object.keys(layer);
    var filteredIndexes = [];

    for (var i in keys) {
        var layerItem = layer[keys[i]];
        var passed = true;

        for (var r in filter.rules) {
            var rule = filter.rules[r];

            var valueA = layerItem[rule.field];
            valueA = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
            var valueB = rule.value;
            valueB = typeof valueB === "string" ? valueB.toLowerCase() : valueB;
            var operator = rule.operator;
            passed &= testOperation(valueA, valueB, operator);
        }

        if (passed) {
            filteredIndexes[keys[i]] = layer[keys[i]];
        }

    }
    return filteredIndexes;
}

function testOperation(valueA, valueB, operator) {
    switch (operator) {
        case "eq":
            return valueA === valueB;
        case "lt":
            return valueA < valueB;
        case "gt":
            return valueA > valueB;
        case "lte":
            return valueA <= valueB;
        case "gte":
            return valueA >= valueB;
        case "not":
            return valueA !== valueB;
        default:
            return false;
    }

}

function loadFilters(fail, success) {
    $.ajax({
        url: "filters.json",
        dataType: 'json'
    })
        .done(success)
        .fail(fail);
}

function attachFiltersToDOM() {
    var $container = $(".filters-menu");
    var filters = Techo.filters;
    var structure = filterDOMStructure(filters);
    var titles = structure.titles;
    var categories = structure.categories;
    var subcategories = structure.subcategories;
    var items = structure.items;
    $parent = $container;
    for (var t in titles) {
        var title = titles[t];
        var $title = $("*[data-title='" + title.title + "']");
        if ($title[0]) {continue;}
        var $title = $("<div class='rows'><div class='toprow clickeable'><h6>" + title.title + "</h6> <span class='rowarrow'> </span></div><div class='botrow clickeable'><div data-title='" + title.title  + "' class='blockin'></div></div></div></div>");
        $parent.append($title);
    }

    for (var c in categories) {
        var category = categories[c];
        var $category = $("*[data-category='" + category.category + "']");
        if ($category[0]) {continue;}
        $parent= $("*[data-title='" + category.title + "']");
        var $category = $("<div class='blockins'><div class='blocktops'><span>" + category.category + "</span><em class='arrowin'></em></div><div data-category='" + category.category + "' class='blockbots'></div></div>");
        $parent.append($category);
    }

    for (var s in subcategories) {
        var subcategory = subcategories[s];
        var $subcategory = $("*" + (subcategory.category ? "[data-category='" + subcategory.category + "'] " : "") + "[data-subcategory='" + subcategory.subcategory + "']");
        if ($subcategory[0]) {continue;}
        $parent= $("* [data-title='"    + subcategories[s].title    + "'] " +
            (subcategory.category ? " [data-category='" + subcategory.category + "']" : ""));
        var $subcategory = $("<div data-subcategory='" + subcategory.subcategory + "'><h6>" + subcategory.subcategory + "</h6></div>");
        $parent.append($subcategory);
    }

    for (var i in items) {
        var item = items[i];
        $parent= $("* [data-title='"       + item.title +       "'] " +
            (item.category ? "  [data-category='"    + item.category    + "'] " : "") +
            (item.subcategory ? "  [data-subcategory='" + item.subcategory + "']" : ""));
        var $item = $("<div class='checkbox'> <input type='checkbox' value='" + item.filter + "' id='check_" + item.filter + "' class='fltrChkbx'> <label for='check_" + item.filter + "'>" + item.item + "</label> </div>");
        $parent.append($item);
    }

    initUI();

    $(".f_chckbx").click(function () {
        $("#verresumen").css("background", "#FC6C44");
    });

    $(".fltrChkbx").click(function fltrChkbxClicked(evt) {
        /* TODO: Esta lógica necesita mejorar cuando este definido
         * el comportamiento de los filtros */
        var checkStatus = evt.target.checked;
        appliedFilters = [];
        $(evt.target).parent().parent().find(".fltrChkbx").attr("checked", false);
        evt.target.checked = checkStatus;
        $(".fltrChkbx").each(function(key, item) {
            appliedFilters[item.value] = item.checked;
        })

        for (var i in activeLayers) {
            if (!activeLayers[i]) {continue;}
            hideLayer(i);
            showLayer(i);
        }
    });
}

function filterDOMStructure(filters) {
    var filter;
    var structure = {
        titles: [],
        categories: [],
        subcategories: [],
        items: [],
    };


    for (var f in filters) {
        filter = filters[f];
        if (filter.title) {
            structure.titles.push({
                title: filter.title
            });
        }
        if (filter.category) {
            structure.categories.push({
                title: filter.title,
                category: filter.category
            })
        }
        if (filter.category && filter.subcategory) {
            structure.subcategories.push({
                title: filter.title,
                category: filter.category,
                subcategory: filter.subcategory
            })
        } else if (filter.subcategory) {
            structure.subcategories.push({
                title: filter.title,
                subcategory: filter.subcategory
            })
        }
        if (filter.item) {
            structure.items.push({
                title: filter.title,
                category: filter.category,
                subcategory: filter.subcategory,
                item: filter.item,
                filter: f
            })
        };
    }
    return structure;
}