
//Declaracion de variables y constantes globales
var hoteles = [{
    nombre:'Hotel Paraiso',
    ciudad:'Buenos Aires',
    telefono: '+54 9 (11) 0000-0000',
    ubicacion:{ lat:-34.6503729, lng:-58.5752127 },
    estrellas: 2
},{
    nombre:'Dissors Hotel',
    ciudad:'Buenos Aires',
    telefono: '+54 9 (11) 0000-0000',
    ubicacion:{ lat:-34.650383, lng:-58.575041 },
    estrellas: 5
},
{
    nombre:'Hotel Pennsylvania',
    ciudad:'Nueva York',
    telefono: '+54 9 (11) 0000-0000',
    ubicacion:{ lat:40.7497723, lng:-73.9928185 },
    estrellas: 5
}];
var nuevoHotel = {
    nombre: '',
    ciudad: '',
    telefono: '',
    ubicacion:{ lat:40.7497723, lng:40.7497723 },
    estrellas: 0
};

//funcion ready
$(function(){    
    
    //cambio de paginas
    $('button').click(function(){
        var pag = $(this).attr('data-idPage');
        cambiarPagina(pag);
    });

    //Listar hoteles
    listarHoteles('#listaHoteles');

    //registrar datos de hotel
    $('#registrar').click(function(){
        registrarDatos();
    });
    
});

/*------Definicion de funciones------*/

//Cambiar Pagina
function cambiarPagina(page) {

    $.mobile.changePage("#" + page, {
        transition: "none"
    });

    //Inicializo el mapa de registro hotel
    mostrarMapa(40.7497723,-73.9928185, 'mapa');
}

//ver hoteles
function verHoteles(id){
    
    $(id).delegate('li', 'click', function () {
        var nombre = $(this).text()
        //muestro datos del hotel en paginaVerHotel
        datosHotel(hoteles, nombre);
        //cambio pag
        cambiarPagina('paginaVerHotel');  
    });
}

//Funcion registrar datos
function registrarDatos() {

    //toma de datos del form
    var nombre = $('#registrarHotel input[id=nombre]').val();
    var ciudad = $('#registrarHotel input[id=ciudad]').val();
    var telefono = $('#registrarHotel input[id=telefono]').val();
    var estrellas = $('#registrarHotel input[id=estrellas]').val();
    var ubicacion = nuevoHotel.ubicacion;

    var obj = {
        nombre: nombre,
        ciudad:ciudad,
        telefono:telefono,
        ubicacion:ubicacion,
        estrellas:estrellas
    }
    console.log(ubicacion);

    //Añadir hotel 
    hoteles.push(obj);

    //limpio campos
    $('#registrarHotel input[id=nombre]').val('');
    $('#registrarHotel input[id=ciudad]').val('');
    $('#registrarHotel input[id=telefono]').val('');
    $('#registrarHotel input[id=estrellas]').val('');

    //Limpio el objeto
    obj = {};
    
    //limpio la ubicacion
    nuevoHotel.ubicacion = {};

    //listar hoteles
    listarHoteles('#listaHoteles');

    //cambio pag
    cambiarPagina('paginaListaHoteles');
}

//Mostrar datos de Hotel seleccionado
function datosHotel(arr, objProp){

    //recorro los hoteles
    $(arr).each(function(index, item){

        //chequeo si el hotel enviado coincide con algun hotel del array
        if (item.nombre == objProp){

            //traigo los datos del hotel
            $('#infoHotel input[id=nombre]').val(item.nombre);
            $('#infoHotel input[id=ciudad]').val(item.ciudad);
            $('#infoHotel input[id=telefono]').val(item.telefono);
            $('#infoHotel input[id=estrellas]').val(item.estrellas);

            //muestro el mapa del hotel consultado
            mostrarMapa(item.ubicacion.lat, item.ubicacion.lng, 'mapa2');
        }
    });
}

//Listar Hoteles
function listarHoteles(idLista){

    //Limpiar lista
    $(idLista).html('');

    //recorrido de hoteles
    $(hoteles).each(function(index, item){

        //agrego los hoteles a la lista
        $(idLista).append('<li class="ui-listview-item ui-listview-item-static ui-body-inherit" >' + item.nombre + '</li>');
    });

    //Ver hotel
    verHoteles(idLista);

    //inicializo listview
    $(idLista).listview();

    //refresco la lista
    $(idLista).listview("refresh");
    
}

//Generar mapa
function mostrarMapa(lat, lng, idMapa){

    //declaracion de variables
    var latlngInicial = new google.maps.LatLng(lat, lng); 
    var opciones = {            
        zoom: 10,
        center: latlngInicial,
        mapTypeId: google.maps.MapTypeId.ROADMAP        
    };
    var mapa;
    var marcador;

    //creo nuevo mapa
    mapa = new google.maps.Map(document.getElementById(idMapa), opciones);

    //evalua si es el mapa de registro de hotel
    if(idMapa == 'mapa'){        
        
        //inicializa el marcador
        marcador = new google.maps.Marker({            
            position: latlngInicial,
            map: mapa,
            draggable: true,
            title: "Mi punto!!"        
        }); 

        //si se arrastro el marcador
        google.maps.event.addListener(marcador, 'dragend', function(event) {

            //carga en nuevo hotel la ubicacion
            nuevoHotel.ubicacion.lat = event.latLng.lat();
            nuevoHotel.ubicacion.lng = event.latLng.lng();
           
        });
        
        

    }else{
        //si es el mapa de un hotel registrado crea un marcador sin draggable
        marcador = new google.maps.Marker({            
            position: latlngInicial,
            map: mapa,
            draggable: false,
            title: "Mi punto!!"        
        }); 
    }
     
}
