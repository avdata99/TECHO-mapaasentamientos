function fotosInit() {

   Techo.db.fotos = new Array();
   $.ajax({
       //url: 'results.json',
       url: 'fotos.json',
       type: 'GET',
       dataType: 'json'
   })
       .done(function(data) {
           Techo.db.fotos = data;
       })
       .fail(function() {
           console.log("error");
           // TO-DO: informar algo en la ui
           // TO-DO: logeamos esto xlas?
       })
       .always(function() {
           //console.log("complete");
       });

   log("🔌", "fotos json loaded");

}
