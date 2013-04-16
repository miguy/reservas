Lungo.init({	name: 'example'	});
$$('#error').hide();
$$('#error_hora').hide();
$$('#error_fecha').hide();
$$('#pistas').hide();
$$('.columns-res').hide();

var userR=[];
var horasR=[];
var pistaSR;
var horaSR;
var fechaSR;
var tipores=0;
var invitados=0;
var now = new Date();
var dia = ("0" + now.getDate()).slice(-2);
var mes = ("0" + (now.getMonth() + 1)).slice(-2);
var anyo = now.getFullYear();
var hoy = (anyo)+"-"+(mes)+"-"+(dia) ;
var horaA = now.getHours();


function listado_horas(){
	var cargarHoras = function(result){		
					if(result){
						$$.each(result, function(i) {
							$$('#hora_res').append('<option value='+i+'>'+ result[i] + '</option>');
							horasR[i]=result[i];
						});
					}
				}
			
	var ok = {ok: "1"};
	var url = "http://www.grupogenter.es/app_reservas/horas.php";
	$$.post(url, ok, cargarHoras, "json");  
}


$$('#ingresar').tap(function() {
    userlog=$$('#nomuser').val();
    passlog=$$('#passuser').val();
		
	if(userlog || passlog){
        var loginUser = function(result){
			if(result){
	            Lungo.Router.section("user");
	            $$('#nuser').html(result.nombre);
	            $$('#tuser').html(result.tlf);
				$$('#muser').html(result.mail);
				$$('#nombre').html(result.nombre);
	            $$('#tlf').val(result.tlf);
				$$('#email').val(result.mail);
				$$('#hora_res').empty();			// para el listados de las horas
				$$('#hora_res').append('<option value=0>--Seleccione Hora--</option>');

				userR[0]=result.cod;
				userR[1]=result.user;
				userR[2]=result.nombre;
				$$('#fecha_res').val(hoy);
				listado_horas();			// llama a al funcion para listar las horas	
				
			}else{	$$('#error').show();	}
		}				
		var datos = {user: userlog, pass: passlog};
		var url = "http://www.grupogenter.es/app_reservas/login.php";
		$$.post(url, datos, loginUser, "json");
	}else{	$$('#error').show();	}	
});

// si la reserva le pertenece al usuario podrá cancelarla, si no, no verá ningun boton
function usuarios_reserva(anyo,mes,dia,elemF,diferencia,fecha,hora){
	var usuariores = function(ok){			
		if(ok==1){
			if (anyo==elemF[0] && mes==elemF[1] && dia==elemF[2]){
				if ( (diferencia) >= 4) {	$$('#cancel-res').show();
				} else {	$$('#err-cancel').show();	}	
			} else {
				if(anyo<elemF[0]){ $$('#cancel-res').show(); }
				else {
					if(anyo==elemF[0]) {
						if(mes<elemF[1]){ $$('#cancel-res').show(); }
						else {$$('#err-cancel').show();}
						if (dia<elemF[2]){ $$('#cancel-res').show(); }
						else {$$('#err-cancel').show();}
					} else { $$('#err-cancel').show(); }
				}
			}

		} else {	$$('#cancel-res').hide();	}
	}

	var info={user: userR[0], fecha: fecha, hora: hora, pista: pistaSR};
	var url = "http://www.grupogenter.es/app_reservas/usuario_reserva.php";
	$$.post(url, info, usuariores, "json"); 
}

function comentariosReserva(fecha, hora, pistaSR){
		var cargarcomentarios = function(result){
			if(result){
				$$('.ncomentarios').html(result['notas']);
			}
		}
		var comment = {fecha: fecha, hora: hora, pista: pistaSR };
		var url = "http://www.grupogenter.es/app_reservas/comentarios.php";
		$$.post(url, comment, cargarcomentarios, "json");

}

// listara el total de pistas
// ademas de msotrar las libres y las ocupadas 
function listado_pistas(elemH,elemF,diferencia,hora,fecha){
	var j=0;
	var pistasR=[];
	var dobleR=[];
	var asistentesR=[];
	var comentariosR=[];
	var cantidadPistas = function(cnt){	
		if(cnt){
			var cantidad=cnt['cantidad'];
			var cargarPistas = function(reservadas){			
				if(reservadas){
					$$.each(reservadas, function(i) { 
						pistasR[i]=reservadas[i].pista; 
						dobleR[i]=reservadas[i].doble;
						asistentesR[i]=reservadas[i].asistentes;
					});
				}	
				for (var i = 1; i <=cantidad; i++) {
					if(pistasR[j]==i){
						if(dobleR[j]==1){
							if (asistentesR[j]==3){
									$$('#pistas').append('<li data-name='+ i +' class="completa"> Pista '+ i + ' - Completa Doble - </li>');
							} else {
									$$('#pistas').append('<li data-name='+ i +' class="incompleta"> Pista '+ i + ' - Incompleta Doble - </li>');
							}
						} else {
							if (dobleR[j]==0){
								if (asistentesR[j]==2){
									$$('#pistas').append('<li data-name='+ i +' class="completa"> Pista '+ i + ' - Completa Individual - </li>');
								} else {
									$$('#pistas').append('<li data-name='+ i +' class="incompleta"> Pista '+ i + ' - Incompleta Individual - </li>');
								}
							}
						}
								j++;
					} else {
						$$('#pistas').append('<li data-name='+ i +' class="libre" id="pres'+ i +'">Pista '+ i + ' - Libre - </li>');								
					}
				};

				// pistas libres
				$$('li.libre').on('click', function(){
					Lungo.Router.section("reservar-pistas");
						
					$$('.columns-res').show();
					pistaSR=$$(this).attr('data-name');
					$$('.npista').html(pistaSR);
					$$('.horapista').html(horasR[hora]);
					$$('.nreserva').html('Reserva del ' + fecha);
							
					if(anyo==elemF[0] && mes==elemF[1] && dia==elemF[2]){
						if ( (diferencia) >= 4) { $$('#btn-reservar').show(); } 
					
					}else {
						if(anyo<elemF[0]){ $$('#btn-reservar').show(); }
						else {
							if(anyo==elemF[0]) {
								if(mes<elemF[1]){ $$('#btn-reservar').show(); }
								else {$$('#btn-reservar').hide();}
								if (dia<elemF[2]){ $$('#btn-reservar').show(); }
								else {$$('#btn-reservar').hide();}
							} else { $$('#btn-reservar').hide(); }
						}
					}
				});

				

				// pistas ocupadas
				$$('li.completa').on('click', function(){
					Lungo.Router.section("pista-reservada");
				
					$$('.columns-res').show();
					pistaSR=$$(this).attr('data-name');
					$$('.npista').html(pistaSR);
					$$('.horapista').html(horasR[hora]);
					$$('.nreserva').html('Reserva del ' + fecha);
					$$('#cancel-res').hide();
					$$('#err-cancel').hide();
					comentariosReserva(fecha, hora, pistaSR);
					// llamará a la función para permitirle ver al usuario 
					// que ha reservado la pista el boton de cancelar la reserva
					// en otro caso si no lo fuese, no vería ningún botón
					usuarios_reserva(anyo,mes,dia,elemF,diferencia,fecha,hora);
				});
				// pistas ocupadas
				$$('li.incompleta').on('click', function(){
					Lungo.Router.section("pista-reservada");

					$$('.columns-res').show();
					pistaSR=$$(this).attr('data-name');
					$$('.npista').html(pistaSR);
					$$('.horapista').html(horasR[hora]);
					$$('.nreserva').html('Reserva del ' + fecha);
					$$('#cancel-res').hide();
					$$('#err-cancel').hide();
					
					comentariosReserva(fecha, hora, pistaSR);
					// llamará a la función para permitirle ver al usuario 
					// que ha reservado la pista el boton de cancelar la reserva
					// en otro caso si no lo fuese, no vería ningún botón
					usuarios_reserva(anyo,mes,dia,elemF,diferencia,fecha,hora);

				});

			}	
			var FyH = {fecha: fecha, hora: hora};
			var url = "http://www.grupogenter.es/app_reservas/pistas.php";
			$$.post(url, FyH, cargarPistas, "json"); 
		}				
	}
	var c = "1";
	var url = "http://www.grupogenter.es/app_reservas/cantidadPistas.php";
	$$.post(url, c, cantidadPistas, "json"); 
}


function acciones(){
	$$('#error_hora').hide();
	$$('#error_fecha').hide();
	$$('#pistas').show();			// para que no se multipliquen las listas de pistas
	$$('#pistas').empty();
	$$('#btn-reservar').hide();
	$$('#err-cancel').hide();
}


$$('#fecha_res').on('change', function(){
	fecha=$$('#fecha_res').val();
	hora=$$('#hora_res').val();	

	if(fecha){
		$$('#error_fecha').hide();
		if(hora!=0){
			acciones();
			var elemH = horasR[hora].split(':');
			var elemF = fecha.split('-');
			var diferencia=elemH[0]-horaA;
			horaSR=hora;
			fechaSR=fecha;
			// listará las pistas disponibles ocupadas o no
			listado_pistas(elemH,elemF,diferencia,hora,fecha);			
		} else {
			$$('#pistas').hide();
			$$('#error_hora').show();
		}
	} else {
		$$('#pistas').hide();
		$$('#error_fecha').show();
	}
});




$$('#hora_res').on('change', function(){
	fecha=$$('#fecha_res').val();
	hora=$$('#hora_res').val(); 	

	if(hora!=0){
		$$('#error_hora').hide();
		if(fecha){
			acciones();
			var elemH = horasR[hora].split(':');
			var elemF = fecha.split('-');
			var diferencia=elemH[0]-horaA;
			horaSR=hora;
			fechaSR=fecha;
			// listará las pistas disponibles ocupadas o no
			listado_pistas(elemH,elemF,diferencia,hora,fecha);
					
		} else {
			$$('#pistas').hide();
			$$('#error_fecha').show();
		}
	} else {
		$$('#pistas').hide();
		$$('#error_hora').show();
	}
});


$$('.treserva').on('change', function(){
		tipores=$$(this).val();
		if (tipores!=1){ $$('#invi3').hide();}
		else {$$('#invi3').show();}
		invitados=$$('.ireserva:checked').val();
});

$$('.ireserva').on('change', function(){
		tipores=$$('.treserva:checked').val();
		invitados=$$(this).val();			
});


function resetear_hora(){
	Lungo.Router.section("user");
	$$('#pistas li').hide();
	$$("#hora_res option[value='0']").attr('selected', 'selected');
	$$('#error_hora').show();
}

$$('#cancel').on('click', function(){
	Lungo.Notification.confirm({
	    icon: 'info',
	    title: 'Cancelar Reserva',
	    description: '¿Está seguro/a de que desea cancelar la reserva?',
	    accept: {
	        icon: 'checkmark',
	        label: 'Aceptar',
	        callback: function(){ 
		        var cancelar = function(ok){			
					if(ok==1){
						resetear_hora();			
					}
				}

			var info={user: userR[0], fecha: fechaSR, hora: horaSR, pista: pistaSR};
			var url = "http://www.grupogenter.es/app_reservas/cancelar_reserva.php";
			$$.post(url, info, cancelar, "json"); 
			}
	    },
	    cancel: {
	        icon: 'close',
	        label: 'Cancelar',
	        callback: function(){ 
	        	resetear_hora();	
	        }
	    }
	});

});



$$('#reservar').on('click', function() {

	coment=$$('#comentarios').val();
	if ( !($$('#comentarios').val()) ) {coment='Sin Comentarios';}
	console.log("comentarios " + coment)

	var realizarReserva = function(reservar){	
				if(reservar!=0){
					Lungo.Notification.success(
					    "Confirmacion",                  
					    "La Reserva ha sido aceptada",    
					    "check",                    
					    2                         
					);
					Lungo.Router.section("pista-reservada");
				} else {
					Lungo.Notification.error(
						"Error",                      
						"La pista está ya reservada",     
						"cancel",                     
						2                                
					);
					resetear_hora();	
				}				
			}
		var datosReserva = {user: userR[0], fecha: fechaSR, hora: horaSR, pista: pistaSR, tipoR: tipores, ninv: invitados, comentarios: coment};
		var url = "http://www.grupogenter.es/app_reservas/realizarReserva.php";
		$$.post(url, datosReserva, realizarReserva, "json"); 
});


// acciones de las cabeceras para volver a la anterior seccion 
// y resetear el valor de la hora
$$('#back-user').on('click', function(){	resetear_hora();	});
$$('#back-dat-user').on('click', function(){	resetear_hora();	});


// edicion del usuario, permitirá cambiar tanto email como telefono
$$('#guardar').on('click', function() {

	tuser=$$('#tlf').val();
	euser=$$('#email').val();

	if (tuser && euser){
		var editar = function(edicion){	
				if(edicion){
					Lungo.Notification.success(
						"Confirmacion",                  
						"Cambios realizados correctamente",    
						"check",                    
						2                         
					);
					$$('#tuser').html(tuser);	
					$$('#muser').html(euser);	
				}		
		}
		var datosEdicion = {user: userR[1], tuser: tuser, euser: euser};
		var url = "http://www.grupogenter.es/app_reservas/edicionUser.php";
		$$.post(url, datosEdicion, editar, "json"); 
	} else {
		Lungo.Notification.error(
			"Error",                      
			"Datos erróneos",     
			"cancel",                     
			2                                
		);
	}

});
