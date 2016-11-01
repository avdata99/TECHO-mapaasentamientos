$(document).ready( function() {
   // $('#fichaBarrio').prepend('<div id="closeFicha">X</div>')
   $('#closeFichaBarrio').css('cursor', 'pointer').click( function() {  $('#fichaBarrio').css('display', 'none') });
});

function neighborStatics(idClicked) {

   clickedNeighbor.data = _.findWhere( Techo.db.r2016, { ID:  idClicked.name  } )

   // populate the fields

   $('#tituloFichaBarrio').text(clickedNeighbor.data.nombre_barrio);
   $('#b_nombre').text(clickedNeighbor.data.nombre_barrio);
   $('#b_nombre_alt').text(clickedNeighbor.data.otros_nombres_barrio);
   $('#b_partido').text(clickedNeighbor.data.departamento );
   $('#b_provincia').text(clickedNeighbor.data.provincia);
   $('#b_anio').text(clickedNeighbor.data.anio_creo_barrio);
   $('#b_cantfamilias').text(clickedNeighbor.data.cantidad_de_familias);
   $('#b_excretas').text(clickedNeighbor.data.excretas);
   $('#b_agua').text(clickedNeighbor.data.agua);
   $('#b_luz').text(clickedNeighbor.data.luz);
   $('#b_cocina').text(clickedNeighbor.data.energia_cocinar);
   $('#b_calefa').text(clickedNeighbor.data.energia_calefaccion);
   $('#b_pluviales').text('');
   $('#b_alumbrado').text(clickedNeighbor.data.alumbrado);
   $('#b_residuos').text(clickedNeighbor.data.recoleccion_de_residuos);
   $('#b_alias').text(clickedNeighbor.data.ID);
   $('#b_poligono').text(clickedNeighbor.data.poligono);
   $('#b_imgs').text(clickedNeighbor.data.foto + ' ' + clickedNeighbor.data.foto2 + ' ' + clickedNeighbor.data.foto3 + ' ' + clickedNeighbor.data.foto4 + ' ' + clickedNeighbor.data.foto5);
   $('#b_sat').text('');

   // fallback text
   $.each( $('.datoficha'), function() {
      if ( $(this).text() == "" ) {
         $(this).text("No disponible")
      }
   })



  mostrarImagenes();
  mostrarImagenesSatelitales();



   //search for satellite
   //




   // done populating, show
   $('#fichaBarrio').css('display', 'block')

  $(".twentytwenty-container").twentytwenty({default_offset_pct: 0.5});
  $(".twentytwenty-container").height(300);


    


}


function mostrarImagenes(){
  if (Techo.db.fotos.barrios[clickedNeighbor.data.ID] != "") {

    //CALCULO LA CANTIDAD DE FOTOS
    var cantidadDeFotos = $(Techo.db.fotos.barrios[clickedNeighbor.data.ID].foto).size(); 
    
    //SACO LAS FOTOS PUESTAS POR DEFECTO PARA QUE NO SE ROMPA EL SLIDER DE BOOTSTRAP
    $('.carousel-indicators').find('li').remove();
    $('.carousel-inner').find('div').remove();


    //RECORRO LAS FOTOS QUE PODRÍA LLEGAR A HABER
    $.each( Techo.db.fotos.barrios[clickedNeighbor.data.ID].foto, function cadaFoto(key,val){
        var active = '';
        if(key == 0){
          active = 'active';
        }else{
        }

        //AGREGO LAS FOTOS AL DIV
       $(".carousel-indicators").append('<li data-target="#myCarousel" data-slide-to="'+key+'" class="'+active+'"></li>');
       $(".carousel-inner").append('<div class="item '+active+'"><img id="imgBarrio'+key+'" src="'+val+'" height="230" alt="gallery_img"></div>');

    });

    //SI NO HAY FOTOS AGREGO LA FOTO POR DEFECTO
    if(cantidadDeFotos == 0){
      $(".carousel-inner").append('<div class="item active"><img id="imgBarrio0" src="http://placehold.it/1221x530?text=Foto+no+disponible" height="230" alt="gallery_img"></div>');
    }

  } else {
    //SI NO HAY FOTOS AGREGO LA FOTO POR DEFECTO    
    $('#contenedorFotos').html().append('<div class="item"><img id="imgBarrio" class="active" src="http://placehold.it/1221x530?text=Foto+no+disponible" height="230" alt="gallery_img"></div>');
  }
}


function mostrarImagenesSatelitales(){
  if (Techo.db.fotos_satelitales[clickedNeighbor.data.ID] != "") {

    $('.twentytwenty-container').remove();
    $( ".large-12" ).append('<div class="twentytwenty-container"><img id="antes" src="http://placehold.it/1221x530?text=Imagen+satelital+no+disponible" height="300"/><img id="despues" src="http://placehold.it/1221x530?text=Imagen+satelital+no+disponible" height="300"/></div>');


    var cantidadDeFotosSatelitales = $(Techo.db.fotos_satelitales[clickedNeighbor.data.ID]).size(); 
    //$(".satelital-pane").addClass("active");
    
    if(cantidadDeFotosSatelitales == 0){
      $('#antes').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
      $('#despues').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
    }else{
      $('#antes').attr("src", Techo.db.fotos_satelitales[clickedNeighbor.data.ID].imagen2013[0]);
      $('#despues').attr("src", Techo.db.fotos_satelitales[clickedNeighbor.data.ID].imagen2016[0]);      
    }
  }else{
    $('#antes').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
    $('#despues').attr("src", "http://placehold.it/1221x530?text=Imagen+satelital+no+disponible");
  }
}

