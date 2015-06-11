// ==UserScript==
// @name        Naruho.do Plus +
// @namespace   Zeyth
// @description Agrega funciones adicionales a Naruho.do
// @include     http://naruho.do/*
// @version     1.0.0
// @require		https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require		https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js
// @require		https://greasyfork.org/scripts/5233-jquery-cookie-plugin/code/jQuery_Cookie_Plugin.js?version=18550
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @author		Zeyth
// @contact		http://naruho.do/zeyth \\ http://github.com/Zeyth
// ==/UserScript==

console.log('Naruho.do Plus + Starto Nya!');

// { Valores por defecto, pueden cambiarlos directamente o por medio del panel de control, los valores del panel de control tienen prioridad. 
	
	var zrefresh = 5000;	//Frecuencia en la que se repiten los script de auto actualizar
							//En milisegundos, tiempo por defecto 5000 que es igual a 5 segundos
							//No es recomendado bajarlo a menos de 1000 (1 segundo)
	
	var znotif = 'http://zeyth.net46.net/ndoplus/Notification.wav';			//Sonido que se escuchará al recibir una notificación
																			//Sólo se aceptan los formatos WAV y MP3
							
	var zfeed = 'http://zeyth.net46.net/ndoplus/Feed.wav';					//Sonido que se escuchará al recibir un comentario nuevo en un feed
																			//Sólo se aceptan los formatos WAV y MP3
	
// } /Valores por defecto


// { Declaramos variables globales
	
	var ztitle = document.title;			//Título de la página
	var zurl = window.location.pathname;	//Localización de la página
	var zlogged = true;						//Iniciada sesión

	if($('#user_actions li.register').length) {
		zlogged = false;					//Sin iniciar sesión
	}

	var $version = '1.0.0/Illya';			//Versión del script
	
// } /Variables Globales


// { CSS

	// { Panel de Control CSS

		$('HEAD').append('<style type="text/css"> \
			/* Panel de Control */ \
			\
			#ndoplus #plusicon { \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDgvMDUvMTQEmqxtAAADHElEQVRIia2Vz6ocRRTGf+dPVXfPDImR5BpxcUGUQFaK6NKNrxAXeQYXPoKgoht3bn0B8RkEcSWIygXBEAgKwhUSco1Ec+/MdFe5qDNjXM1ApqG6h5qif/195ztVwh7X8W0+TFe4LgLmINoGBsszfr/3BR/teofsWtC/hLzxKb8sXuWGpAAZmIFkOPuek29v89qu9/iuBWpgGfEEVf8PIbXf+1y7QQ6LF5DZcbOrjjAuoU4gApIOBBJtqkTBDXSA4QjKCpaPDqhIBMRBta3WBAqkDN0RPJkfCIS2r9YE3jUrrU1jwOz6gUACWN8gFpDNUARLAHU36MV3EO8R66Me0vBuLWEXDxHtIHlT0ZQIHYriDJfWvP151fNTGFdQRigT1BpfOQKVKjff54OX3+U961qCPIN24B1iSZA5zOby3ETxjNKTyCQMRRF6+vWS8S8QzjlnzaoWKiMVqBjC3S+nzzxdZj7OuEYCH4C+gXQAGSqqUKlcIpPJGIYhCIIhVMaUkasGdPQ8Yg0IHc3SSqF7nrmrgylYakO7Vnjp2vyAsKAnkRCMjAC6hSnEU3CEnszERKGgCAVDUhE3a5bpEJZ5U2YOGWHBsLXKwzCLV9s2Lq12AD0dF1zEiooA3gmuDh5biaWwLrdULcjYFuJRfg0YkTsJi5qyRGXFGqVQI9Zq4B42aYpeye3PHqMn4yiGk7Y6HAv7EkIJNRKwGlXczAgVNcElOt086qSb+DqGY3FvVtn2rk8FQqOPCoWEklAK//WXAn72M/fSgm+sDwtzG93lkTQ8hgRv3jx+q7CeKUYO6zYVMNLjn+7f+aFGkaYlLJ8UammaAB7+WH7deR7duIXc+ura3avMX0k4ujWxJe437p98LA+e/Tz6+5SwzzEyKfYHCWt0m7dnBBUharGJdoqcAZTQdQCQC5GyTVtuFBVaxva7dh8TgSiAUYEpZgubffNgoAlQJlYo+amOh30OiD1BYwWl1ImCU6hMlG1wCyvWhwHJ1BoRChNrWtIk9oZ9jdsDdPod9c7Xf35y9Po/V0xVGoIq0rL3x8nFg31A/wIEqMGblyE4LQAAAABJRU5ErkJggg=="); \
			background-position:center; \
			background-repeat:no-repeat; \
			height:25px; \
			width:25px; \
			position:absolute !important; \
			top:15px; \
			left:15px; \
			} \
			\
			#ndoplus:hover { \
			background-color:#992118; \
			} \
			\
			#ndoplus.plusON { \
			background:#992118; \
			} \
			\
			#ndopanel { \
			display:none; \
			background:#992118; \
			border:1px solid #741913; \
			border-left:none; \
			width:248px; \
			padding-bottom:15px; \
			z-index:2; \
			position:relative; \
			top:55px; \
			font-family:Segoe UI, Arial; \
			color:white; \
			font-size:15px; \
			} \
			\
			#ndopanel:before { \
			content: ""; \
			background:#992118; \
			display:block; \
			height:1px; \
			width:56px; \
			position:absolute; \
			top:-1px; \
			} \
			\
			#ndopanel li { \
			display:block; \
			float:none !important; \
			transition: all 0.4s; \
			height:24px !important; \
			line-height:20px; \
			padding:0 6px 0 11px; \
			position:relative; \
			} \
			\
			#ndopanel li:hover { \
			background:#BA331B; \
			} \
			\
			#plusconfig { \
			font-size:12px; \
			position:absolute; \
			bottom:5px; \
			right:6px; \
			padding:2px 5px 2px 5px; \
			transition: all 0.4s; \
			z-index:1; \
			} \
			\
			#plusconfig:hover { \
			background:#BA331B; \
			} \
			\
			#plusversion { \
			font-size:10px; \
			font-family:Arial; \
			color:#999999; \
			position:relative; \
			bottom:-9px; \
			left:0px; \
			padding-left:11px; \
			z-index:0; \
			} \
			\
			/* /Panel */ \
		</style>');

	// } /Panel CSS

	// { Toggle CSS

		$('HEAD').append('<style type="text/css"> \
			.toggle-slide { \
			overflow: hidden; \
			cursor: pointer; \
			-webkit-user-select: none; \
			-moz-user-select: none; \
			-ms-user-select: none; \
			user-select: none; \
			direction: ltr; \
			} \
			.toggle-slide .toggle-on, \
			.toggle-slide .toggle-off, \
			.toggle-slide .toggle-blob { \
			float: left; \
			} \
			.toggle-slide .toggle-blob { \
			position: relative; \
			z-index: 99; \
			cursor: hand; \
			cursor: -webkit-grab; \
			cursor: -moz-grab; \
			cursor: grab; \
			}  \
			\
			/* Toggles Jquery */ \
			\
			.toggle-modern { \
			background:#949494 !important; \
			position:absolute !important; \
			top:3px !important; \
			right:6px; \
			} \
			\
			.toggle-inner { \
			width:120px !important; \
			\
			} \
			\
			.toggle-blob { \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNi8xMC8xNSkcPiQAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAG0lEQVQokWNkYGD4z0ACYCJF8aiGUQ2jGlABAKw1ASNPfTO2AAAAAElFTkSuQmCC"); \
			background-repeat:no-repeat; \
			background-position:center; \
			} \
			\
			.toggle-on { \
			width:44px !important; \
			background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMTAvMTUpHD4kAAAAW0lEQVRIiWNctmzZf4ZBCJgG2gG4AAuMERkZOZDuwAAsyBylWUoD5Q4MMGijctRhpIJRh5EKRh1GKhh1GKlg1GGkApS68l7avYFyBwaAO2z58uUD6Q4MMGijEgA4qgkduGCLHQAAAABJRU5ErkJggg=="); \
			background-position:left; \
			background-repeat:no-repeat; \
			} \
			\
			.toggle-off { \
			background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMTAvMTUpHD4kAAAAUklEQVRIie3VIRLAQAhD0Wxnb8t5uAIck6q2qiJqI/IU8g8IVlUNBF2nA/6smZHaWHcDAHZmHk75RMQ7y57SYSyHsRzGchjLYSzdJ/4MamRPeQMkMBPuh2T8KAAAAABJRU5ErkJggg=="); \
			background-position:right; \
			background-repeat:no-repeat; \
			} \
			\
			.toggle-off .active { \
			background:red !important; \
			border:0 !important; \
			} \
			\
			/* /Toggles */ \
		</style>');

	// } /Toggle CSS

	// { Bit.ly Links CSS

		$('HEAD').append('<style type="text/css"> \
			/* Bit.ly Links */ \
			a.plus { \
			display:inline-block !important; \
			height:18px !important; \
			padding:0 40px 0px 6px !important; \
			font-size:13px !important; \
			font-weight:normal !important; \
			text-decoration:none !important; \
			color:#ffffff !important; \
			line-height:18px !important; \
			background-color:#787878; \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAMAAAAJ4/xdAAAAA3NCSVQICAjb4U/gAAAAP1BMVEV4eHicnJzp6emZmZm4uLjMzMz///+oqKj6+vrh4eG3t7empqbs7Oy9vb2srKyfn5/r6+u7u7urq6v7+/unp6cBs505AAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNi8wOC8xNdHIP3sAAABRSURBVCiRxc67EoAgEENREIk8VND//1jrbJjBStOc5s7OOvdiYbI/knrdCiURCd3CSYphRTXILwu8QsmOU6HEoyjmSt4GUNJwKPbd8b5MpnsAqSkHvZk+N8EAAAAASUVORK5CYII="); \
			background-position:right !important; \
			background-repeat:no-repeat !important; \
			} \
			\
			a.plus.zimg, a.plus.zlink { \
			transition: all 0.2s linear; \
			} \
			\
			a.plus.zimg{ \
			background-color:#4EB040; \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAMAAAAJ4/xdAAAAA3NCSVQICAjb4U/gAAAAh1BMVEVOsECn4oiE1ln1/PHP776J2GDu+eiV3HDa88605pqQ2mn9/vyx5Zbj9tmG11yd3nu96aaN2WWb3niU22/R8MH5/ffp+OGh4ICF1lr///+O2Wap4ovf9NPU8cTx+uuS22zl9tyH116/6qn2/POP2miL2WC2553T8MP7/fmr442z5Zf///+R2mqA+XsxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNi8wOC8xNdHIP3sAAACVSURBVCiRxdDLDoIwEIVhONKiDlILohzwhhhNjO//fI7GlTbB6MJ/Mckk32LaKPogDPQHYlxunAOOrrxvbdu8kYxlRnpYWmBCbR4ml5xKphzX9bKqQ6Rfr9hbHGhCtzzIRpKRtUgIiEgRIjG5UHLiDtmZLkQakViJkW2azsLE79kpQVHpi5LXc9FpOp+bv371uz+SwW6zvw1JzgpiAgAAAABJRU5ErkJggg==") !important; \
			margin-right:23px !important; \
			} \
			\
			a.plus.zimg:hover { \
			background-color:#439537; \
			box-shadow:0px 0px 3px 0px #4EB040; \
			} \
			\
			a.plus.zlink { \
			background-color:#4C69BD; \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAMAAAAJ4/xdAAAAA3NCSVQICAjb4U/gAAAAolBMVEVMab2JteJxpdzp8frK3fKmx+l3qd77/f7j7fi50+6fwueBr+Dx9vvZ5/ZypdyVvOWwzezC2fDQ4fP3+v3u9PvA1+96q97///90p92PuOODseHb6Paty+v2+f1yp92ixOiGsuGMtuPe6vd4qt7U4/Tr8vrN4PPG2/HB1/Dz9/zl7/l0qd2zz+x8rN+RueR4qd7///+VveXB1+/5+/3z+f13qd2LPPyfAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNi8wOC8xNdHIP3sAAACvSURBVCiRvZHBDoIwEAVxUVlbaVXABxGjiFUxKCf//9cscLAHI150LpM0k2a79bwvoAH+nkiiUio1lXSTlqZT6iYFJDHudLxaWS69Fu4t2CkgoWhGvFEtrU6Bm5hxhrNpkBEbIURJ7Gvtr9wkmSc8wgRpykEcxwVxEEWo3URjWytUhojD7qCVQOkkU2BPBzsmMdu3rDst8XD3UtnRcmjqnxL2yt+vTr34xQd8TgZ5ArvkD2NvtbL8AAAAAElFTkSuQmCC"); \
			} \
			\
			a.plus.zlink:hover { \
			background-color:#3C55A2; \
			box-shadow:0px 0px 3px 0px #4C69BD; \
			} \
			\
			a.plus.zerror { \
			background-color:#D1341F; \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAMAAAAJ4/xdAAAAA3NCSVQICAjb4U/gAAAAflBMVEXRNB/0mqPqRVf+8/TsVGX61dnvcH74w8n3tr386Ovwd4T////tX27yiZTqRlj+9/juZHP5ys/rSlz98PH3usD73N/+9vf0n6jrT2D++frsWGjuaHfqSFr72Nvweof0nafvcoD3uL/sVmb96+3tYXD/8/X/+/v/+fn98fP3ub8HdX/4AAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNi8wOC8xNdHIP3sAAACBSURBVCiRxY/bCoMwEER1rdZ2FE3SWyzaqv3/b3SlCT5sQB8E52E4DIeFjaINoZUcpPwGrvq1sFDeuBEZoPMslYrnEqfUOJbKeeS5t/SBY6F80fCsKoqh/yyUxLZ4XHNLTzgWSq4UkqxEcR8dh56ej1+AzHNA0Zqr0QtLJZjdlNVM/MkJ7JqdQ1gAAAAASUVORK5CYII="); \
			} \
			\
			a.plus.zerror:hover { \
			background-color:#B12E1B; \
			box-shadow:0px 0px 3px 0px #D1341F; \
			} \
			\
			/* /Bit.ly Links */ \
			\
		</style>');

	// { /Bit.ly Links CSS

	// { Tooltip
		$('HEAD').append('<style type="text/css"> \
			/* Tooltip */ \
			.ui-tooltip { \
			padding:5px 5px 5px 10px; \
			position:absolute; \
			z-index:9999; \
			box-shadow: 0 0 5px #aaa; \
			width:300px !important; \
			background:rgba(251,247,170,0.9) !important; \
			color:#9C6D43 !important; \
			border-radius:0 !important; \
			font-family:Segoe UI, Arial !important; \
			} \
			\
			.ui-tooltip small { \
			display:block !important; \
			border-top:1px dashed #9C6D43 !important; \
			margin-top:3px !important; \
			} \
			\
			body .ui-tooltip { border:3px double #F8E372 !important; } \
			 \
			.ui-helper-hidden-accessible { \
			display:none !important;  \
			}  \
			/* /Tooltip */ \
		</style>');
	// { /Tooltip

// } /CSS


// { Definimos funciones generales

	// { Localización

		var location = (function() {
			if(zurl.match(/\/message\/[0-9]+$/)) {
				return {
					"where": "feed",
					"url": zurl
				};
			}
			else if(zurl === '/') {
				return {
					"where": "main",
					"url": '/hashtag/empty'
				};
			}
			else {
				return {
					"where": "all",
					"url": '/hashtag/empty'
				};
			}
		})();

	// } /Localización

	// { Control Panel

		function controlpanel() {

			console.log('Control Panel');

			//Revisamos que exista la barra de usuario
			if($('#user_actions').length) {
				//Icono del Panel de Control
				$('#user_actions > ul > li.items').prepend('\
					<div id="ndoplus" class="icon"> \
						<div id="plusicon" style="display:none;"></div> \
						<div id="ndopanel"></div> \
					</div>');

				//Opciones
				$('#ndopanel').html('\
					<ul>\
						<li id="pnot">Actualizar Notificaciones <div class="toggle toggle-modern"></div></li> \
						<li id="pfeed">Actualizar Feeds <div class="toggle toggle-modern"></div></li> \
						<li id="pport">Actualizar Portada <div class="toggle toggle-modern"></div></li> \
						<li id="pbitly">Expandir Links <div class="toggle toggle-modern"></div></li> \
						<li id="pimg">Redimensionar Imágenes <div class="toggle toggle-modern"></div></li> \
					</ul>\
					<div id="plusconfig">Configuración Adicional</div> \
					<div id="plusversion"></div> \
					<div id="plussecret" style="display:none;"></div> \
				');

				//Version LeL
				$('#plusversion').html($version);
				$('#plusversion').attr('title','<center><b style="font-size:13px;">Illyasviel von Einzbern Edition</b><br/></center><img src="http://i.imgur.com/MY0yuZI.png" style="margin-top:3px;"/><br/><center><i>Loli Powa!</i></center>');

				//Interruptores

				$('.toggle').toggles({
					drag: true, // allow dragging the toggle between positions
					click: false, // allow clicking on the toggle
					text: {
					on: ' ', // text for the ON position
					off: ' ' // and off
				},
					on: true, // is the toggle ON on init
					animate: 250, // animation time
					checkbox: null, // the checkbox to toggle (for use in forms)
					clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
					width: 50, // width used if not set in css
					height: 18, // height if not set in css
					type: 'compact' // if this is set to 'select' then the select style toggle will be used
				});

				//Ejecutar al cambiar el interruptor
				$('.toggle').on('toggle', function (e, active) {
					var $script = $(this).parent()[0].id;
					if (active) {
						console.log('Activo');
						GM_deleteValue($script);
						switch ($script) {
							case "pnot":
							update();
							break;
							case "pbitly":
							stalker(); bitly();
							break;
							default:
						}

					} else {
						console.log('Inactivo');
						GM_setValue($script,'OFF');
					}

				});

				//Cargar Configuración Actual
				var $scripts = $('#ndopanel li').toArray();

				$.each($scripts, function(index,script) {

					var $script = this.id;
					var $option = $('#' + this.id + ' .toggle').data('toggles');

					if(GM_getValue($script)) {
						$option.toggle(false, false, true);	// (Estado,NoAnimar,NoEvento) Estado puede ser true, false o 'toggles'
					}

				});	

				//Activar / Desactivar opción al dar click en el nombre
				$('#ndopanel li').click(function(e) {

					var $toggle = $('#' + this.id + ' .toggle');
					var $option = $toggle.data('toggles');

					//Cambiar estado del switch
					$option.toggle();

				});

				//Descripción de las opciones
				$('#pnot')[0].title = 'El contador de notificaciones se actualizará automáticamente cuando recibas un nuevo comentario, mensaje o solicitud de amistad.';
				$('#pfeed')[0].title = 'Carga automáticamente las nuevas respuestas en los feeds.<small>Sólo funciona en su dirección única, se puede llegar a ella dando click en la hora del feed [hace x tiempo] o por las notificaciones, ejemplo:<br/><b>http://naruho.do/zeyth/message/5293</b></small>';
				$('#pport')[0].title = 'Carga automática o manualmente los nuevos feeds en la portada.<small>La opción <b>manual</b> agrega un cuadro de notificación debajo de publicar un comentario.</small>';
				$('#pbitly')[0].title = 'Expande los enlaces <b>bit.ly</b> a su url original y los categoriza como WEB o IMAGEN.';
				$('#pimg')[0].title = 'Permite cambiar el tamaño de las imágenes con el mouse.<small>- Click izquierdo a la imagen y sostenerlo mientras se mueve el cursor hacia alguna dirección para cambiar su tamaño [izquierda encojer, derecha agrandar]</small><small>- Click derecho para regresarla a su tamaño original.</small><small>- Doble click para hacer que la imagen se vea completa en la pantalla [click derecho a la imagen para salir]</small>';

				//Tooltip
				$('#ndopanel').tooltip({
					content: function() {
						return $(this).attr('title');
					},
					position: {
						my: "left+100% top-4", at: "left-65 top"
					}
				});

				//Abrir menú cuando damos click
				$('#ndoplus').click(function(e) {
					$(this).toggleClass('plusON');
					$("#ndopanel").toggle('drop', { direction: 'left'}, 400);
					$('#user_actions').find('.ua-box').hide();	//Ocultar cuadro de notificaciones si está abierto.
					e.stopPropagation();
				});

				//Evitar que se cierre el menú al dar click en una opción
				$("#ndopanel").click(function(e){
					e.stopPropagation();
				});

				//Cerrar menu al clickear en cualquier otra parte de la página
				$(document).click(function(){
					$("#ndopanel").hide('drop', { direction: 'left'}, 400);
					$('#ndoplus').removeClass('plusON');
					$('.ui-tooltip').remove();	//Cerrar tooltip también.
				});

			}
		}

	// } /Panel de Control

	// { Función para revisar si el link es una imágen

		function checkimage(url,callback) {
			var img = new Image();
			img.src = url;
			img.onload = function () { callback('True') };
			img.onerror = function () { callback('False') };
			img = null;
		}

	// } /Revisar Imágen
		
	// { Función para saber si la pestaña está activa \\ @Denys Séguret - http://stackoverflow.com/a/19519701
		
		var vis = (function() {
			var stateKey, eventKey, keys = {
				hidden: "visibilitychange",
				webkitHidden: "webkitvisibilitychange",
				mozHidden: "mozvisibilitychange",
				msHidden: "msvisibilitychange"
			};
			for (stateKey in keys) {
				if (stateKey in document) {
					eventKey = keys[stateKey];
					break;
				}
			}
			return function(c) {
				if (c) document.addEventListener(eventKey, c);
				return !document[stateKey];
			}
		})();
		
		var nvisible = vis();	//Regresa el estado actual de la pestaña true : false
		
		//Ejecuta una función al pasar a segundo plano la pestaña y viceversa
		vis(function(){
			document.title = vis() ? '[Visible] / ' + ztitle : '[No Visible] / '  + ztitle;
		});							//Activa 	:	No Activa
									//Se ejecuta por primera vez al pasar a inactiva y nuevamente al pasar a activa.
		
	// { /Activa

	// { Jquery Toggles v3.1.5 \\ @ https://github.com/simontabor/jquery-toggles / http://simontabor.com/labs/toggles

		(function(h){function l(f){var k=h.Toggles=function(b,a){if("boolean"===typeof a&&b.data("toggles"))b.data("toggles").toggle(a);else{for(var c="on drag click width height animate easing type checkbox".split(" "),e={},d=0;d<c.length;d++){var g=b.data("toggle-"+c[d]);"undefined"!==typeof g&&(e[c[d]]=g)}a=this.b=f.extend({drag:!0,click:!0,text:{on:"ON",off:"OFF"},on:!1,animate:250,easing:"swing",checkbox:null,clicker:null,width:50,height:20,type:"compact",event:"toggle"},a||{},e);this.c=b;b.data("toggles",
		this);this.h="select"===a.type;this.l=f(a.checkbox);a.clicker&&(this.n=f(a.clicker));this.m();this.k();this.active=!a.on;this.toggle(a.on,!0,!0)}};k.prototype.m=function(){function b(a){return f('<div class="toggle-'+a+'">')}var a=this.c.height(),c=this.c.width();a||this.c.height(a=this.b.height);c||this.c.width(c=this.b.width);this.g=a;this.i=c;this.a={f:b("slide"),e:b("inner"),on:b("on"),off:b("off"),d:b("blob")};var e=a/2,d=c-e,g=this.h;this.a.on.css({height:a,width:d,textIndent:g?"":-e,lineHeight:a+
		"px"}).html(this.b.text.on);this.a.off.css({height:a,width:d,marginLeft:g?"":-e,textIndent:g?"":e,lineHeight:a+"px"}).html(this.b.text.off);this.a.d.css({height:a,width:a,marginLeft:-e});this.a.e.css({width:2*c-a,marginLeft:g||this.active?0:-c+a});this.h&&(this.a.f.addClass("toggle-select"),this.c.css("width",2*d),this.a.d.hide());this.a.e.append(this.a.on,this.a.d,this.a.off);this.a.f.html(this.a.e);this.c.html(this.a.f)};k.prototype.k=function(){function b(b){b.target===a.a.d[0]&&a.b.drag||a.toggle()}
		var a=this;if(a.b.click&&(!a.b.clicker||!a.b.clicker.has(a.c).length))a.c.on("click",b);if(a.b.clicker)a.b.clicker.on("click",b);a.b.drag&&!a.h&&a.j()};k.prototype.j=function(){function b(b){a.c.off("mousemove");a.a.f.off("mouseleave");a.a.d.off("mouseup");!c&&a.b.click&&"mouseleave"!==b.type?a.toggle():(a.active?c<-e:c>e)?a.toggle():a.a.e.stop().animate({marginLeft:a.active?0:-a.i+a.g},a.b.animate/2)}var a=this,c,e=(a.i-a.g)/4,d=-a.i+a.g;a.a.d.on("mousedown",function(e){c=0;a.a.d.off("mouseup");
		a.a.f.off("mouseleave");var f=e.pageX;a.c.on("mousemove",a.a.d,function(b){c=b.pageX-f;a.active?(b=c,0<c&&(b=0),c<d&&(b=d)):(b=c+d,0>c&&(b=d),c>-d&&(b=0));a.a.e.css("margin-left",b)});a.a.d.on("mouseup",b);a.a.f.on("mouseleave",b)})};k.prototype.toggle=function(b,a,c){this.active!==b&&(b=this.active=!this.active,this.c.data("toggle-active",b),this.a.off.toggleClass("active",!b),this.a.on.toggleClass("active",b),this.l.prop("checked",b),c||this.c.trigger(this.b.event,b),this.h||(c=b?0:-38,
		this.a.e.stop().animate({marginLeft:c},a?0:this.b.animate)))};f.fn.toggles=function(b){return this.each(function(){new k(f(this),b)})}}"function"===typeof define&&define.amd?define(["jquery"],l):l(h.jQuery||h.Zepto||h.ender||h.$||$)})(this);

	// } /Jquery Toggles
	
// } /Funciones Generales

// { Funciones Específicas

	// { Expandir bit.ly Links

		function bitly() {

			if(!GM_getValue('pbitly')) {
				//Array que contiene todos los links externos.
				var zlink = $('a[rel="nofollow"][target="_blank"]:not([class^="plus"])').toArray();

				$.each(zlink, function(index,link) {

					var $link = this;			//Referimos al link actual.
					$($link).addClass('plus');	//Agregamos nueva clase

					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: 'https://api-ssl.bitly.com/v3/expand?access_token=0d24189b58200b509140af5edffc0c89be378743&shortUrl=' + link,
						async: true,
						cache: true,
						timeout: 10000,
					})
					.done(function(json,status) {

						var url = json.data.expand[0].long_url;	//Link Real
						var url2 = url;							//Link a Mostrar

						//Si el link es muy largo, lo cortamos.
						var llength = url.length;
						if (llength > 70) {
							url2 = url.substring(0,30) + '...' + url.slice(-31);
						}

						$link.href=url;
						$link.innerHTML=url2;

						//Revisar si es imagen o link
						checkimage(url, function(isimage) {

						    if (isimage === "True") {

								$($link).addClass('zimg');	//Es Imágen

							}
							else {

								$($link).addClass('zlink');	//Es Página Web

							}
						});

					})
					.error(function(data,status,error) {
						console.log(data,status,error);
						$($link).addClass('zerror');	//Error
					});
				});
			}

		}

	// } /Expandir Links

	// { Buscar Cambios en el DOM

		function stalker() {
			//Elemento a observar
			var node = document.querySelector("#long_feeds");

			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {

					var entry = {
						added: mutation.addedNodes
					};

					//La variable 'entry.added' regresa un Nodelist, tomamos el id del primer elemento
					var id = ((entry.added.item(1)||{}).id)||false;

					//Si existe, buscamos links nuevamente.
					if(id) {
						console.log('Nuevos Feeds Cargados');
						bitly();
						$('iframe').remove(); //Quitar
					}

				});
			});

			//Configuración
			observer.observe(node, {
				attributes: false,
				childList: true,
				characterData: false,
				characterDataOldValue: false,
				subtree: true
			});
		}

	// } /Cambios DOM

	// { Actualizar Notificaciones

		function update() {

			if(!GM_getValue('pnot')) {
				//Dónde estamos
				
				console.log(location.url);
				//Cargamos una sección ligera
				console.log('Notificaciones');
				$.ajax({
					dataType: 'html',
					url: '/hashtag/empty',
					cache: false,
					timeout: 4000,
				})
				.done(function(data,status) {
					//console.log('Success');
					//console.log(data);
					//console.log(status);
					console.log(this.url);
				})
				.error(function(data,status,error) {
					console.log(data,status,error);
				})
				.always(function(data,status) {
					//console.log('Always');
				});

			}
		}

	// } /Notificaciones

	// { Actualizar Feeds
	// } /Feeds

	// { Actualizar Feeds Principales
	// } /Feeds Principales

// } /Específicas


// { Ejecutamos funciones

	$(document).ready(
		console.log('Ejecutar Funciones.'),
		controlpanel(),
		//Brinca
		$('#plusicon').toggle('bounce'),
		$('iframe').remove(),  //Quitar
		stalker(),bitly(),
		update(),
		console.log('Ejecutadas todas las funciones.')
	);
	
// { /Ejecutar

console.log('Naruho.do Plus + End');
