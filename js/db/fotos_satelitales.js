function fotosSatelitalesInit() {

   Techo.db.fotos_satelitales = new Array();
   $.ajax({
       //url: 'results.json',
       url: 'fotos_satelitales.json',
       type: 'GET',
       dataType: 'json'
   })
       .done(function(data) {
           Techo.db.fotos_satelitales = data;
       })
       .fail(function() {
           console.log("error");
           // TO-DO: informar algo en la ui
           // TO-DO: logeamos esto xlas?
       })
       .always(function() {
           //console.log("complete");
       });

   log("🔌", "fotos_satelitales json loaded");

}
