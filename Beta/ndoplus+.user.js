// ==UserScript==
// @name        Naruho.do Plus +
// @namespace   Zeyth
// @description Agrega funciones adicionales a Naruho.do
// @include     https://naruho.do/*
// @version     1.1.1
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
	
	window['zrefresh'] = 10000;	//Frecuencia en la que se repiten los script de auto actualizar
								//En milisegundos, tiempo por defecto 10000 que es igual a 10 segundos
								//No puede ser menos de 2000 (2 segundos)
	
	window['znotif'] = 'http://zeyth.totalh.net/ndoplus/Notification.wav';		//Sonido que se escuchará al recibir una notificación
																				//Sólo se aceptan los formatos WAV y MP3
							
	window['zfeed'] = 'http://zeyth.totalh.net/ndoplus/Feed.wav';				//Sonido que se escuchará al recibir un comentario nuevo en un feed
																				//Sólo se aceptan los formatos WAV y MP3

	window['soundON'] = 1;														//Sonido Encendido 1 / Apagado 2

	window['zvolume'] = 0.5;													//Volumen de las notificaciones, número entre 0.0 y 1.0
																				//1.0 = 100% volumen, 0.5 = 50%, 0.1 = 10%

	window['plusvideos'] = 0;													//Remover Youtube Videos, 1 = ON, 0 = OFF
	window['plusmedia'] = 0;													//Remover Imágenes pie de Feed, 1 = ON, 0 = OFF
	
// } /Valores por defecto

// { Valores personalizados del panel de control

	//Sí no hay configuración personalizada, usar default.
	function setConfig($opt) {
		window[$opt] = GM_getValue($opt) ? GM_getValue($opt) : window[$opt];
	}

	setConfig('zrefresh');
	setConfig('znotif');
	setConfig('zfeed');
	setConfig('soundON');
	setConfig('zvolume');
	setConfig('plusvideos');
	setConfig('plusmedia');

	//Verificamos que zrefresh no sea menor que 2 segundos
	if(zrefresh < 2000) {
		zrefresh = 5000;
	}

// } /Personalizados


// { Declaramos variables globales
	
	var otitle = document.title;								//Título de la página
	var ztitle = otitle.split(' ')[0] + ' - Naruho.do +';		//Título Activo
	var xtitle = otitle.split(' ')[0] + ' - Naruho.do';			//Título Inactivo
	var zurl = window.location.pathname;						//Localización de la página
	var zlogged = true;											//Iniciada sesión

	if($('#user_actions li.register').length) {
		zlogged = false;										//Sin iniciar sesión
	}

	var $version = '1.1.1/Illya';								//Versión del script
	var $changelog = ' - Ahora se ocultan las imágenes al pie de página sólo si hay una imagen en el feed.';

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
			\
			/* Configuración Extra */ \
			\
			#plusextra { \
			padding:5px 8px 4px 12px; \
			font-size:12px; \
			} \
			\
			#plusextra span { \
			background:#FF4400; \
			display:inline-block; \
			margin-right:2px; \
			padding:0 4px 0 4px; \
			margin-top:1px; \
			transition: all 0.3s; \
			} \
			\
			#plusextra span:hover { \
			background:#FE8A0C; \
			} \
			\
			#plusextra #plusreset { \
			background:#8B0000; \
			margin-top:5px; \
			padding:2px 6px; \
			width:45px; \
			transition: all 0.4s; \
			} \
			\
			#plusextra #plusreset:hover { \
			background:#cc0000; \
			} \
			\
			/* /Extra */ \
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
			.comments a.plus { \
			line-height:16px !important; \
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
			/* Notification */ \
			#pnum { \
			font-family:Arial; \
			font-size:13px; \
			color:#FEFEFE; \
			font-weight:bold; \
			position:absolute; \
			bottom:2px; \
			right:6px; \
			} \
		</style>');
		
	// { /Tooltip

	// { Main Feeds
		$('HEAD').append('<style type="text/css"> \
		#plusfront { \
		display:block; \
		position:relative; \
		background-color:#5977F0; \
		background-position:left; \
		background-repeat:no-repeat; \
		background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8wNi8xNZdgQ/wAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA1ElEQVRYhe3WoQrCUBTG8e86GajDC6uuuGS1it1gMOojCK7ZzSu+hWDwRay+wNKigoPVqVnBcNgnXsb59x1+3DO414wW1yccrPVvwLcUJk1h0hQmTWHSaDAbGNYoACTY5RTifAgxm/iMcQAcXqVhXeI2MChK3nuAdmJMFODwKtt1Po4jD5tlB9Oxj35gME/uyPKKAqt1YlleYbsvKZDPKKu8FQ/GmLec/ccUJk1h0poJiyMPu3UPw4EHADimFsmqS4HRLnF2zVzlL1OYNIVJU5g0Z2Ev+FUiDR1Wu8kAAAAASUVORK5CYII="); \
		margin-left:86px; \
		margin-bottom:8px; \
		margin-top:-5px; \
		border:1px solid #284FEC; \
		box-shadow:2px 2px 2px #999999; \
		padding:8px 10px 8px 48px; \
		font-family:Verdana, Tahoma, Arial; \
		font-size:13px; \
		color:white; \
		cursor:pointer !important; \
		} \
		.plusnewf .date:after { \
		content:"+"; \
		font-size:15px; \
		margin-left:5px; \
		color:#FF5C00; \
		color:#666666; \
		} \
		</style>');
	// } /Main Feeds

	// { Resize IMG
		$('HEAD').append('<style type="text/css"> \
		.message .center2 img { \
			width:auto; \
			height:200px; \
		} \
		.message .plushasimg + div { \
			display:none; \
		} \
		</style>');
	// } /Resize IMG

	// { Expander Imágenes
		$('HEAD').append('<style type="text/css"> \
			.expz { \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8xMi8xNSVi/RsAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAcUlEQVQ4jdWSsQ2AMAwEL4hB6KBgnBSMQ8EwGYiCbT4FFAlCJBIuwnd+Wyf7ZSRhoc6E8k+QJC/p+AwCZmC0AFXJDNTfDUke2BJruPwsJ+fc9AoCdiAk9cKZUXiYzTYo9VdVvH97YZuBihnVqr3TzEARt1YipDIjJn4AAAAASUVORK5CYII="); \
			background-position:center; \
			background-repeat:no-repeat; \
			display:inline-block !important;  \
			height:18px !important; \
			width:18px !important; \
			padding:0 !important; \
			line-height:18px; \
			margin-left:-22px; \
			font-size:13px !important; \
			transition: all 0.4s !important; \
			background-color:#FD773E; \
			cursor:pointer !important; \
			} \
			\
			.expz:hover { \
			background-color:#FFA33C; \
			} \
			\
			.comments .expz { \
			line-height:16px !important; \
			} \
			\
			.expz span { \
			visibility:hidden; \
			} \
			\
			.minz { \
			background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8xMi8xNSVi/RsAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAANUlEQVQ4jWNgGAWjgHLAiE3w////CQwMDAo49DxgZGRcQJTp////P/AfNzhAhoNHwSggCgAAwZkkZOL3abYAAAAASUVORK5CYII="); \
			background-color:#FF463C; \
			color:#222222; \
			} \
			\
			.minz:hover { \
			background-color:#FF0000; \
			} \
			\
			.plusexp { \
			height:auto; \
			width:auto; \
			max-width:670px !important; \
			margin-top:2px; \
			} \
			\
		</style>');
	// } /Expandir Imágenes

// } /CSS


// { Definimos funciones

	// { Localización

		var $location = (function() {
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

		//Títulos localización
		if($location.where === 'main') {
			ztitle = 'Naruho.do +';
			xtitle = 'Naruho.do'
		}

	// } /Localización

	// { Reverse Array
		$.fn.reverse = [].reverse;
	// } /Reverse

	// { Control Panel

		function controlpanel() {

			//Revisamos que exista la barra de usuario
			if($('#user_actions').length && zlogged) {
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
					<div id="plusextra" style="display:none;"></div> \
					<div id="plusversion"></div> \
				');

				//Version LeL
				$('#plusversion').html($version);
				$('#plusversion').attr('title','<center><b style="font-size:13px;">Illyasviel von Einzbern Edition</b><br/></center><img src="http://i.imgur.com/MY0yuZI.png" style="margin-top:3px;"/><br/><center><i>Loli Powa!</i></center>');

				//Configuración extra
				$('#plusextra').html('Actualizar<br/><span id="zrefresh">Frecuencia Notificaciones</span><br/>Audio<br/><span id="soundON">Sonido</span><span id="zvolume">Volumen</span><span id="znotif">Notificación</span><span id="zfeed">Feeds</span><br/>Diseño<br/><span id="plusvideos">Remover Videos</span><span id="plusmedia" style="display:none;">Remover Imágenes</span><div id="plusreset">Reiniciar</div>');

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

						GM_deleteValue($script);
						switch ($script) {
							case "pnot":
							update(1);
							break;
							case "pfeed":
							update(2);
							break;
							case "pport":
							update(2);
							break;
							case "pbitly":
							bitly();
							break;
							case "pimg":
							resimg();
							break;
							default:
						}

					} else {

						GM_setValue($script,'OFF');
					}

				});

				//Cargar Configuración Actual
				var $scripts = $('#ndopanel li').toArray();

				$.each($scripts, function(index,script) {

					var $script = this.id;
					var $option = $('#' + $script + ' .toggle').data('toggles');

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
				$('#pnot')[0].title = 'El contador de notificaciones se actualizará automáticamente cuando recibas un nuevo comentario.';
				$('#pfeed')[0].title = 'Carga automáticamente las nuevas respuestas en los feeds.<small>Sólo funciona en su dirección única, se puede llegar a ella dando click en la hora del feed [hace x tiempo] o por las notificaciones:<br/><img src="http://i.imgur.com/Ovxw0Gm.png" style="margin-top:2px;"/></small>';
				$('#pport')[0].title = 'Agrega una notificación debajo del cuadro Publicar, compartir... cuando se publica un nuevo feed en la pagina página principal de feeds.';
				$('#pbitly')[0].title = 'Expande los enlaces <b>bit.ly</b> a su url original y los categoriza como WEB o IMAGEN.';
				$('#pimg')[0].title = 'Permite cambiar el tamaño de las imágenes con el mouse.<small>- Click izquierdo a la imagen y sostenerlo mientras se mueve el cursor hacia alguna dirección para cambiar su tamaño [izquierda encojer, derecha agrandar]</small><small>- Click derecho para regresarla a su tamaño original.</small>';

				//Descripción opciones extras
				$('#zrefresh')[0].title = 'Cantidad de tiempo en la que se ejecutarán los scripts de actualizar.';
				$('#soundON')[0].title = 'Encender / Apagar las alertas de sonido.';
				$('#zvolume')[0].title = 'Volumen de las alertas de sonido.';
				$('#znotif')[0].title = 'Dirección del archivo de audio que se escuchará cada que se reciba una nueva notificación.';
				$('#zfeed')[0].title = 'Dirección del archivo de audio que se escuchará cada que haya una nueva respuesta en un feed.';
				$('#plusreset')[0].title = 'Regresa Naruho.do Plus + a su estado inicial, eliminando toda configuración, cookies y demás.';
				$('#plusvideos')[0].title = 'Remueve los videos de Youtube de los feeds.';
				$('#plusmedia')[0].title = 'Remueve el cuadro de imágenes al pie de cada feed, así como las alertas de contenido no apropiado.';

				//Alt opciones extras
				$('#zrefresh')[0].alt = 'Esta es la principal carga del script, si hay problemas de rendimiento, intenten incrementar el tiempo.\n\nTiempo en segundos, por defecto: 10 segundos.\nNo menos de 2 segundos.';
				$('#soundON')[0].alt = 'Encendido = 1\nApagado = 2';
				$('#zvolume')[0].alt = 'Debe ser un número con decimal entre 0.1 y 1.0, por defecto: 0.5\n\n1.0 = Máximo Volumen, 0.1 = 10% Volumen.';
				$('#znotif')[0].alt = 'Debe ser una dirección completa, por defecto: http://zeyth.totalh.net/ndoplus/Notification.wav\n\nSólo formatos WAV ó MP3.';
				$('#zfeed')[0].alt = 'Debe ser una dirección completa, por defecto: http://zeyth.totalh.net/ndoplus/Feed.wav\n\nSólo formatos WAV ó MP3.';
				$('#plusvideos')[0].alt = 'Remueve los videos de Youtube de los feeds, por defecto: 0 / OFF.\n 1 = ON, 0 = OFF.';
				$('#plusmedia')[0].alt = 'Remueve el cuadro de imágenes al pie de cada feed, así como las alertas de contenido no apropiado, por defecto: 0 / OFF.\n1 = ON, 0 = OFF.';

				//Tooltip Switches
				$('#ndopanel li, #ndopanel #plusversion').tooltip({
					content: function() {
						return $(this).attr('title');
					},
					position: {
						my: "left+100% top-4", at: "left-65 top"
					}
				});

				//Tooltip Extraconfig
				$('#plusextra span, #plusextra #plusreset').tooltip({
					content: function() {
						return $(this).attr('title');
					},
					position: {
						my: "center top", at: "center bottom+5"
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

				//Expandir configuraciones extras
				$("#plusconfig").click(function(){
					$('#plusextra').toggle('blind');
				});

				//Reset Naruho.do Plus+
				$('#plusreset').click(function(){
					if (confirm('Todas las configuraciones serán eliminadas.')) {
						//Detenemos todo
						clearTimeout(updatetime);
						clearTimeout(backtabtime);
						clearTimeout(activetime);
						clearTimeout(cnowtime);

						//Eliminamos todas las GM_Values
						//Scripts
						GM_deleteValue('pnot');
						GM_deleteValue('pfeed');
						GM_deleteValue('pport');
						GM_deleteValue('pbitly');
						GM_deleteValue('pimg');

						//Configuración extra
						GM_deleteValue('zrefresh');
						GM_deleteValue('znotif');
						GM_deleteValue('zfeed');
						GM_deleteValue('soundON');
						GM_deleteValue('zvolume');
						GM_deleteValue('plusvideos');
						GM_deleteValue('plusmedia');

						//Eliminamos las Cookies
						$.each($.cookie(), function (name, value) {
							if (/^ndoplus./.test(name)) {
								$.removeCookie(name, { path: '/' });
							}
						});
						$.removeCookie('plus.active', { path: '/' });

						alert('Naruho.do Plus + ha sido reiniciado, por favor recarga la página.');
					}
				});

				//Expandir configuraciones extras
				$("#plusextra span").click(function(){
					var $id = this.id;
					var $cfg = window[$id];

					if($id === 'zrefresh') {
						$cfg = window[$id] / 1000;
					}

					var $input = prompt(this.alt, $cfg);

					if($input) {

						if($id === 'zrefresh') {
							$input = parseInt($input);

							if($input > 2) {
								$input = $input * 1000;

								//Guardamos Configuración
								GM_setValue('zrefresh', $input);

								//Actualizamos Variable Actual
								window[$id] = $input;

							}

						}

						else if($id === 'soundON') {
							$input = parseInt($input);

							if($input === 1 || $input === 2) {

								//Guardamos Configuración
								GM_setValue('soundON',$input);

								//Actualizamos Variable Actual
								window[$id] = $input;

							}
						}

						else if($id === 'zvolume') {
							$input = parseFloat($input);

							if($input >= 0.1 && $input <= 1.0) {
								//Guardamos Configuración
								GM_setValue('zvolume', $input);

								//Actualizamos Variable Actual
								window[$id] = $input;

								//Cambiamos Volumenes Actuales
								notsound.volume = $input;
								feedsound.volume = $input;
							}
						}

						else if($id === 'znotif') {
							
							//Guardamos Configuración
							GM_setValue('znotif', $input);

							//Actualizamos Variable Actual
							window[$id] = $input;

							//Cambiamos la url del audio
							notsound.src = znotif;
							
						}

						else if($id === 'zfeed') {
							
							//Guardamos Configuración
							GM_setValue('zfeed', $input);

							//Actualizamos Variable Actual
							window[$id] = $input;

							//Cambiamos la url del audio
							feedsound.src = zfeed;
							
						}

						else if($id === 'plusvideos') {
							$input = parseInt($input);

							if($input === 1) {
								//Guardamos Configuración
								GM_setValue('plusvideos',$input);

								//Actualizamos Variable Actual
								window[$id] = $input;

							}

							else if($input === 0) {
								GM_deleteValue('plusvideos');
								window[$id] = $input;
							}

						}

						else if($id === 'plusmedia') {
							$input = parseInt($input);

							if($input === 1) {
								//Guardamos Configuración
								GM_setValue('plusmedia',$input);

								//Actualizamos Variable Actual
								window[$id] = $input;
							}
							
							else if($input === 0) {
								GM_deleteValue('plusmedia');
								window[$id] = $input;
							}

						}

					}

				});

				//Cerrar menu al clickear en cualquier otra parte de la página
				$(document).click(function(){
					$("#ndopanel").hide('drop', { direction: 'left'}, 400);
					$('#ndoplus').removeClass('plusON');
					$('.ui-tooltip').remove();	//Cerrar tooltip también.
				});

				//Brinca!
				$('#plusicon').toggle('bounce');

			}
		}

	// } /Panel de Control

	// { Función para revisar si el link es una imagen

		function checkimage(url,callback) {
			if (!/user\/logout/.test(url)) {
				var img = new Image();
				img.src = url;
				img.onload = function () { callback('True') };
				img.onerror = function () { callback('False') };
				img = null;
			}
			else {
				return callback('False');
			}
		}

	// } /Revisar Imagen


	// { Jquery Toggles v3.1.5 \\ @ https://github.com/simontabor/jquery-toggles / http://simontabor.com/labs/toggles

		(function(h){function l(f){var k=h.Toggles=function(b,a){if("boolean"===typeof a&&b.data("toggles"))b.data("toggles").toggle(a);else{for(var c="on drag click width height animate easing type checkbox".split(" "),e={},d=0;d<c.length;d++){var g=b.data("toggle-"+c[d]);"undefined"!==typeof g&&(e[c[d]]=g)}a=this.b=f.extend({drag:!0,click:!0,text:{on:"ON",off:"OFF"},on:!1,animate:250,easing:"swing",checkbox:null,clicker:null,width:50,height:20,type:"compact",event:"toggle"},a||{},e);this.c=b;b.data("toggles",
		this);this.h="select"===a.type;this.l=f(a.checkbox);a.clicker&&(this.n=f(a.clicker));this.m();this.k();this.active=!a.on;this.toggle(a.on,!0,!0)}};k.prototype.m=function(){function b(a){return f('<div class="toggle-'+a+'">')}var a=this.c.height(),c=this.c.width();a||this.c.height(a=this.b.height);c||this.c.width(c=this.b.width);this.g=a;this.i=c;this.a={f:b("slide"),e:b("inner"),on:b("on"),off:b("off"),d:b("blob")};var e=a/2,d=c-e,g=this.h;this.a.on.css({height:a,width:d,textIndent:g?"":-e,lineHeight:a+
		"px"}).html(this.b.text.on);this.a.off.css({height:a,width:d,marginLeft:g?"":-e,textIndent:g?"":e,lineHeight:a+"px"}).html(this.b.text.off);this.a.d.css({height:a,width:a,marginLeft:-e});this.a.e.css({width:2*c-a,marginLeft:g||this.active?0:-c+a});this.h&&(this.a.f.addClass("toggle-select"),this.c.css("width",2*d),this.a.d.hide());this.a.e.append(this.a.on,this.a.d,this.a.off);this.a.f.html(this.a.e);this.c.html(this.a.f)};k.prototype.k=function(){function b(b){b.target===a.a.d[0]&&a.b.drag||a.toggle()}
		var a=this;if(a.b.click&&(!a.b.clicker||!a.b.clicker.has(a.c).length))a.c.on("click",b);if(a.b.clicker)a.b.clicker.on("click",b);a.b.drag&&!a.h&&a.j()};k.prototype.j=function(){function b(b){a.c.off("mousemove");a.a.f.off("mouseleave");a.a.d.off("mouseup");!c&&a.b.click&&"mouseleave"!==b.type?a.toggle():(a.active?c<-e:c>e)?a.toggle():a.a.e.stop().animate({marginLeft:a.active?0:-a.i+a.g},a.b.animate/2)}var a=this,c,e=(a.i-a.g)/4,d=-a.i+a.g;a.a.d.on("mousedown",function(e){c=0;a.a.d.off("mouseup");
		a.a.f.off("mouseleave");var f=e.pageX;a.c.on("mousemove",a.a.d,function(b){c=b.pageX-f;a.active?(b=c,0<c&&(b=0),c<d&&(b=d)):(b=c+d,0>c&&(b=d),c>-d&&(b=0));a.a.e.css("margin-left",b)});a.a.d.on("mouseup",b);a.a.f.on("mouseleave",b)})};k.prototype.toggle=function(b,a,c){this.active!==b&&(b=this.active=!this.active,this.c.data("toggle-active",b),this.a.off.toggleClass("active",!b),this.a.on.toggleClass("active",b),this.l.prop("checked",b),c||this.c.trigger(this.b.event,b),this.h||(c=b?0:-38,
		this.a.e.stop().animate({marginLeft:c},a?0:this.b.animate)))};f.fn.toggles=function(b){return this.each(function(){new k(f(this),b)})}}"function"===typeof define&&define.amd?define(["jquery"],l):l(h.jQuery||h.Zepto||h.ender||h.$||$)})(this);

	// } /Jquery Toggles


	// { Alertas

		//Creamos Contenedores
		var notsound = document.createElement('audio');
		var feedsound = document.createElement('audio');

		//Dirección del Audio
		notsound.src = znotif;
		feedsound.src = zfeed;

		//Precargamos
		notsound.preload = 'auto';
		feedsound.preload = 'auto';

		//Volumen para evitar reventar oídos
		notsound.volume = 0.5;
		feedsound.volume = 0.5;

		//Play Function
		function playSound(z) {

			if (z === 'not' && soundON === 1) {
				notsound.play();	//Notificación
			}

			else if (z === 'feed' && soundON === 1) {
				feedsound.play();	//Feed
			}

		}


	// } /Alertas
	

	// { Cambiar Título

		function switchtitle(title, newtitle) {
			if (document.title == title) {
				document.title = newtitle;
			}
			else {
				document.title = title;
			}
		}

	// } /Título

	// { Expandir bit.ly Links

		function bitly() {

			if(!GM_getValue('pbitly')) {
				//Array que contiene todos los links externos.
				var zlink = $('a[rel="nofollow"][target="_blank"]:not([class^="plus"])').toArray();

				$.each(zlink, function(index,link) {

					if(link.href !== window.location.href) {
						var $link = this;			//Referimos al link actual.
						$($link).addClass('plus');	//Agregamos nueva clase

						$.ajax({
							type: 'GET',
							dataType: 'json',
							url: 'https://api-ssl.bitly.com/v3/expand?access_token=0d24189b58200b509140af5edffc0c89be378743&shortUrl=' + link.href,
							async: true,
							cache: true,
							timeout: 15000,
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

									$($link).addClass('zimg');	//Es Imagen
									$($link).after('<span class="expz"><span>+-</span></span>');
									$(link).parent().addClass('plushasimg');

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
					}
				});
			}

		}

		//Expandir Imágenes
		$('#long_feeds').on('click', 'span.expz', function() {
			//Qué clickeamos
			$this = $(this);

			//Sí no se ha expandido la imagen
			if(!$this.next('div.expimg, div.ui-effects-wrapper').length) {

				//Minimizar
				$(this).toggleClass('minz');

				//Link de la imagen
				var $href = $this.prev('a')[0].href;

				//Creamos un contenedor y colocamos la imagen.
				$('<div class="expimg" style="display:none;"><a href="' + $href + '" target="_blank"><img src="' + $href + '" class="plusexp"/></a></div>').insertAfter($this).show('blind');

				//Script de redimensionar
				resimg();

			}

			else {
				//Expandir
				$(this).toggleClass('minz');
				//Mostrar la imagen.
				$(this).next('div.expimg').toggle('blind');
			}
			
		});

	// } /Expandir Links


	//{ Transición de pestañas

		var $now = 0;	//Default timestamp
		var $oldnot = 0;
		var $newnot = 0;
		if(zlogged){
			$oldnot = parseInt($('#notification .ndo-notify')[0].title.split(' ')[1]);	//Notificaciones
		}
		var backtabtime, cnowtime, activetime, isactivetime, titletime, updatetime;		//Variables de intervalos

		// { Creamos una cookie con la hora actual

		function cnow() {

			//Removemos Cookie Vieja si existe
			if($now > 0) {
				$.removeCookie('ndoplus.' + $now, { path: '/' });
			}

			//Tomamos la hora actual
			$now = $.now();

			//Adelantamos el reloj 60 segundos
			var date = new Date();
			date.setTime(date.getTime() + (60 * 1000));

			//Creamos una cookie
			$.cookie('ndoplus.' + $now, 1, { path: '/', expires: date });

			//Renovamos si la ventana sigue activa
			clearTimeout(cnowtime);
			cnowtime = setTimeout(cnow,58000);

		}

		//Ejecutar
		cnow();

		// } /Cookie Hora Actual

		// { Leer Cookies y regresar las nuestras

		function getcookies(){
			var $cookies = [];
			$.each($.cookie(), function (name, value) {
				if (/^ndoplus./.test(name)) {
					$cookies.push(parseInt(name.split('.')[1]));
				}
			});
			$cookies.sort(function(a, b){return b-a});	//Acomodar de mayor a menor
			return $cookies;
		}

		// } /Leer Cookies

		// { Funcion para definir si una pestaña es Activa o Inactiva creando una cookie

		function active() {
			var date = new Date();
			date.setTime(date.getTime() + (60 * 1000));
			$.cookie('plus.active', $now, { path: '/', expires: date });
			clearTimeout(activetime);
			activetime = setTimeout(active,58000);
		}

		// } /Activa, Inactiva

		// { Función para saber si la ventana actual es la activa o más reciente

		function isactive() {

			var $thisone = $('#wrapper.ndoplus').length;
			var $active = $.cookie('plus.active') ? parseInt($.cookie('plus.active')) : 0;

			if ($thisone) {
				//Esta es la pestaña activa
				return true;
			}

			else if (!$active) {

				var $currentcookies = getcookies();

				if($currentcookies[0] === $now) {
					//Esta es la pestaña más actual
					document.title = ztitle;
					clearTimeout(activetime);
					clearTimeout(cnowtime);
					clearTimeout(backtabtime);
					cnow();
					active();
					backtab();
					return true;
				}

			}

			else {

				//Hay otra pestaña activa

				if($now === $active && vis() === true) {
					//Pero esta es más actual
					document.title = ztitle;
					restart();
					return true;
				}

				else if($now === $active && vis() === false) {
					//Esta es la pestaña más actual pero está minimizada
					document.title = ztitle;
					clearTimeout(activetime);
					clearTimeout(cnowtime);
					clearTimeout(backtabtime);
					cnow();
					active();
					backtab();
					return true;
				}

				//Esto jamás deberia ocurrir, pero nunca se sabe así que...
				else if ($now > $active && vis() === true) {
					//Ejecutar todo
					//Pestaña actual es más reciente que la activa y está enfocada
					document.title = ztitle;
					clearTimeout(activetime);
					clearTimeout(cnowtime);
					clearTimeout(backtabtime);
					restart();
					return true;
				}

				document.title = xtitle;

				return false;
			}

			return false;
		}

		// } /Reciente o activa


		// { Función para saber si la pestaña está activa \\ @Denys Séguret
		
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

			if(vis() === true) {
				//Pestaña Activada
				restart();
				document.title = ztitle;
			}
			else {
				document.title = xtitle;
				backtab();
				setTimeout(isactive,200);		
				clearTimeout(isactivetime);	
				isactivetime = setTimeout(isactive,3000);
			}

		});							
		
		// } /Activa


		//Si la pestaña está activa, agrega una clase adicional a #wrapper
		function nowactive() {
			$('#wrapper').addClass('ndoplus');
		}

		//Si está inactiva, remueve la clase
		function inactive() {
			$('#wrapper').removeClass('ndoplus');
		}


		// { Pestaña en Background

		function backtab() {

			//Eliminamos los otros timers
			clearTimeout(activetime);
			clearTimeout(cnowtime);

			//Removemos clase
			inactive();

			//Adelantamos el reloj 60 segundos
			var date = new Date();
			date.setTime(date.getTime() + (60 * 1000));

			//Actualizamos la cookie con la hora actual
			$.cookie('ndoplus.' + $now, 1, { path: '/', expires: date });

			//Renovamos Función
			clearTimeout(backtabtime);
			backtabtime = setTimeout(backtab,58000);

		}

		// } /Background


		// { Ejecutar todo si la ventana está activa

		function restart() {

			//Eliminamos todos los contadores
			clearTimeout(backtabtime);
			clearTimeout(isactivetime);
			clearInterval(titletime);

			//Los volvemos a iniciar
			nowactive();
			cnow();
			active();

			//Ejecutamos el script de notificaciones
			update(2);

		}

		// } /Ejecutar


		//Ejecutar por defecto si la pestaña está activa
		if(nvisible === true) {
			nowactive();
			active();
			//Cambiamos el título para facilitar saber si el script está activo.
			document.title = ztitle;
		}
		//Inactiva por defecto
		else {
			document.title = xtitle;
			isactive();
			backtab();
		}


	//} /Transición



	// { Buscar Cambios en el DOM

		function stalker() {

			//Elemento a observar
			var node = document.querySelector("#long_feeds") ? document.querySelector("#long_feeds") : false;

			if (node) {
				//Elemento a observar
				var node = document.querySelector("#long_feeds");

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {

						var entry = {
							added: mutation.addedNodes
						};

						//La variable 'entry.added' regresa un Nodelist, tomamos el id del primer elemento
						var id = ((entry.added.item(0)||{}).id)||false;

						//Si existe, buscamos links nuevamente.
						if(id) {
							//Nuevos feeds cargados

							$.when(bitly()).then(function() {
								resimg();
							});

							if(plusvideos) {
								$('.message iframe').remove(); //Remover Youtube Videos
							}

							if(plusmedia) {
								removeimage();
							}
							
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
		}

	// } /Cambios DOM



	// Sincronizar Ajax Calls

	//Pasamos las 3 ajax call por medio de funciones.

	// { Notificaciones
		function notifications() {
			if(!GM_getValue('pnot') && zlogged) {
				
				//No duplicar request en feeds
				if(!GM_getValue('pfeed') && $location.where === 'feed') {
					return false;
				}

				return $.ajax({
							dataType: 'html',
							url: '/hashtag/empty',
							cache: false,
							timeout: zrefresh - 500,
						});
			}
			else {
				return false;
			}
		}
	// { /Notificaciones

	// { Feeds
		function feeds() {
			if(!GM_getValue('pfeed') && $location.where === 'feed') {
				return $.ajax({
							dataType: 'html',
							url: $location.url,
							cache: false,
							timeout: zrefresh - 500,
						});
			}
			else {
				return false;
			}
		}
	// { /Feeds

	// { Portada
		function front() {
			if(!GM_getValue('pport') && $location.where === 'main' && zlogged) {
				return $.ajax({
							dataType: 'json',
							url: '/feeds/9999999999',
							cache: false,
							timeout: zrefresh - 500,
						});
			}
			else {
				return false;
			}
		}
	// } /Portada

	//Creamos un contenedor para las notificaciones
	$('#notification').append('<span id="pnum" style=""></span>');

	// { Actualizar

		function update($mode) {
			clearTimeout(updatetime);
			var $state = isactive();

			if(!GM_getValue('pnot') || !GM_getValue('pfeed') || !GM_getValue('pport')) {

				//La pestaña se acaba de abrir
				if ($mode === 1) {

					//Si hay notificaciones las mostramos
					if($oldnot) {

						//Volvemos colorida la notificación
						$('#notification').addClass('new');

						//Cambiamos el título
						document.title =  $oldnot + ' / ' + ztitle;

						//Escondemos contenedor, agregamos el número
						$('#pnum').effect('drop', {direction:'up'}, 250, function () {
							this.innerHTML = $oldnot;
						});

						//Mostramos el contador.
						$('#pnum').toggle('bounce', { times: 3 }, 'slow');

					}

					//Revisamos en cierto tiempo si hay nuevas notificaciones
					clearTimeout(updatetime);
					updatetime = setTimeout(function(){update(2);},zrefresh);
				}

				//$Modo 2, Revisando las notificaciones futuras.
				else if ($mode === 2 && $state === true) {
					// Ejecutamos las ajax calls simultáneamente
					$.when(
						notifications(),
						feeds(),
						front()	// Sé que puedo ahorrarme este request para las funciones actuales del script
								// Pero "creo" que lo requeriré para funciones futuras, y por si alguien sólo activa portada sin notificaciones o feeds.
					)
					.done(function(noti,feed,front) {

						var $notcont, $notsound, $newfeed, $oldfeed, $lastoldfeed, $lastnewfeed, $newfront, $oldfront;

						// { Notificaciones

							//Script Activo ?
							if(!GM_getValue('pnot') && zlogged) {	//Notificaciones

								//Si estamos en un feed y el script de feeds está ON, usamos el mismo request de actualizar feeds
								if ($location.where === 'feed' && !GM_getValue('pfeed')) {
									$notcont = $(feed[0]).find('#user_actions .items');
								}
								else {
									$notcont = $(noti[0]).find('#user_actions .items');
								}

								//Debug
								//$('#notification .ndo-notify')[0].title = 'Notifications 0';

								//Tomamos las notificaciones actuales
								$oldnot = parseInt($('#notification .ndo-notify')[0].title.split(' ')[1]);

								//Un vistazo al futuro
								$newnot = parseInt($notcont.find('#notification .ndo-notify')[0].title.split(' ')[1]);


								//Comparamos los valores
								if ($oldnot !== $newnot) {	//Los valores son distintos.

									//Si las notificaciones actuales son menores a las futuras || Actuales son mayor que nuevas, pero nuevas no son 0
									if($oldnot < $newnot || $oldnot > $newnot && $newnot !== 0) {

										//Cambiamos los valores
										$('#notification .ndo-notify')[0].title = $notcont.find('#notification .ndo-notify')[0].title;
										
										//Volvemos colorida la notificación
										$('#notification').addClass('new');

										//Cambiamos el título
										//var $title = '[' + $newnot + '] ' + ztitle;
										var $title = $newnot + ' / ' + ztitle;

										//titletime = setInterval(function(){switchtitle($title, '[' + $newnot + '] ' + 'Nueva Notificación!')}, 800);

										//Si la página está minimizada, intercambiamos el título
										if(vis() === false) {
											clearInterval(titletime);
											document.title = $title;
											titletime = setInterval(function(){switchtitle($title, $newnot + ' / ' + 'Nueva Notificación +')}, 900);
										}
										else {
											document.title = $title;
										}

										//Escondemos contenedor, agregamos el número
										$('#pnum').effect('drop', {direction:'up'}, 250, function () {
											this.innerHTML = $newnot;
										});

										//Hacemos ruido con la alerta
										if($location.where === 'feed') {
											playSound('feed');
										}
										else {
											playSound('not');
										}
										
										$notsound = 1;


										//Mostramos el contador
										$('#pnum').toggle('bounce', { times: 3 }, 'slow');

									}
									//Si las notificaciones actuales son mayores a las nuevas y las nuevas son 0
									else if ($oldnot > $newnot && $newnot === 0) {

										//Remover clase new a #notification
										$('#notification').removeClass('new');

										//Cambiamos el contador oculto
										$('#notification .ndo-notify')[0].title = $notcont.find('#notification .ndo-notify')[0].title;

										//Escondemos nuestro contador
										$('#pnum').hide('fade').promise().done(function() {$('#pnum').html('');});

										//Regresamos al título original
											document.title = ztitle;

									}

								}
								else {
									//Mismo valor, no hay necesidad de hacer nada
									//Se puede omitir todo este ELSE, pero me gusta escribir comentarios.
									//Lel
								}

							}

						// } /Notificaciones


						// { Feeds

							if(!GM_getValue('pfeed') && $location.where === 'feed') {
								
								//Feeds Actuales
								$oldfeed = $('#long_feeds .comments ul li');

								//Mensaje más reciente
								if($oldfeed.length) {
									$lastoldfeed = parseInt($oldfeed.last()[0].id.split('-')[2]);
								}

								//Feeds Futuros
								$newfeed = $(feed[0]).find('#long_feeds .comments ul li');

								//Mensaje más reciente
								if($newfeed.length) {
									$lastnewfeed = parseInt($newfeed.last()[0].id.split('-')[2]);
								}


								//No hay respuestas actuales y sí futuras || La última respuesta actual es más reciente que la futura
								if(!$oldfeed.length && $newfeed.length > 0 || $lastoldfeed > $lastnewfeed) {

									//Ocultamos los nuevos feeds
									$newfeed.hide();

									//Los colocamos en la página actual
									$('#long_feeds .comments ul').html($newfeed);

									//Si la página está minimizada, intercambiamos el título
									if(vis() === false) {
										clearInterval(titletime);
										document.title = 'Nueva Respuesta +';
										titletime = setInterval(function(){switchtitle(ztitle, 'Nueva Respuesta +')}, 900);
									}

									//Sonido
									if (!$notsound)	playSound('feed');

									//Y los mostramos
									$newfeed.show('blind');									

									//Rebind Functions
									location.assign('javascript:ndo.events.feeds($(\'.comments\'));void(0)');
									
								}

								//Existen feeds actuales y respuestas nuevas
								else if($lastoldfeed < $lastnewfeed) {

									//Agarramos sólo los nuevos mensajes
									$newfeed = $newfeed.filter('#ndo-comment-' + $lastoldfeed).nextAll();

									//Los escondemos
									$newfeed.hide();

									//Colocamos nueva clase
									$newfeed.addClass('plusnewf');

									//Colocamos en la página actual
									$('#long_feeds .comments ul').append($newfeed);

									//Si la página está minimizada, intercambiamos el título
									if(vis() === false) {
										clearInterval(titletime);
										document.title = 'Nueva Respuesta +';
										titletime = setInterval(function(){switchtitle(ztitle, 'Nueva Respuesta +')}, 900);
									}

									//Sonido
									if (!$notsound)	playSound('feed');

									//Y los mostramos
									$newfeed.show('blind');

									//Rebind Functions
									location.assign('javascript:ndo.events.feeds($(\'.comments\'));void(0)');

								}

								//Pasó todas las verificaciones anteriores y la cantidad de mensajes aún es diferente
								else if($oldfeed.length < $newfeed.length && $newfeed.length !== 0) {
									//Para que esto ocurra alguien debe borrar un mensaje
									//Ó el usuario debe comentar en un feed al mismo tiempo que otra persona
									//Es difícil saber que sucedió, así que reemplazamos todo.

									//Reemplazamos los mensajes
									$('#long_feeds .comments ul').html($newfeed);						

									//Rebind Functions
									location.assign('javascript:ndo.events.feeds($(\'.comments\'));void(0)');

								}

								//Los mensajes son los mismos
								else {

									//Actualizamos la hora de los feeds ya que no tenemos nada mejor que hacer
									var $oldfeed = $oldfeed.find('.date');
									var $newfeed = $newfeed.find('.date');

									$.map($oldfeed, function(v,id) {
										$(v).replaceWith($newfeed[id]);
									});

								}

							}

						// } /Feeds


						// { Portada

							if($location.where === 'main' && zlogged && !GM_getValue('pport')) {
								
								//Mensajes Futuros
								$newfront = $('<div/>');
								$newfront.html(front[0].html);

								//ID Mensaje Actual
								var $lastfront = $('#long_feeds div').first()[0].id;
								var $lastfrontint = parseInt($lastfront.split('-')[2]);

								//ID Mensaje Futuro
								var $lastnew = parseInt($newfront.find('div').first()[0].id.split('-')[2]);

								//Feed más reciente
								if($lastfrontint < $lastnew) {

									//Tomamos todos los feeds nuevos
									$newfront = $newfront.find('#' + $lastfront).prevAll();

									//Invertimos el Array ya que prevAll lo regresa alrevez
									$newfront.reverse();

									//Los contamos
									var $nnew = $newfront.length;
									var $nfeed = [' nuevo feed','cargarlo.'];

									if($nnew > 1) {
										$nfeed = [' nuevos feeds','cargarlos.'];
									}

									if(!$('#plusfront').length) {
										$('#board').prepend('<span id="plusfront" style="display:none;"></span>');
									}

									$('#plusfront').html('<span class="plusfalert"></span>Hay <b>' + $nnew + $nfeed[0] + '</b>, click para ' + $nfeed[1]).off('click').show('bounce', { times: 2 }, 300).click(function() {
										//Removemos Función para Evitar Duplicados
										$('#plusfront').off('click');

										//Contamos los mensajes actuales
										var $frontnow = $('#long_feeds > div').length;

										//Si son 30 o más
										if($frontnow > 29) {
											//Removemos la misma cantidad de mensajes actuales que los que agregaremos
											$('#long_feeds > div').slice(-$nnew).remove();
										}
										
										//Escondemos los Nuevos Feeds
										$newfront.hide();

										//Los Cargamos a la Página
										$('#long_feeds').prepend($newfront);


										//Y los mostramos
										$newfront.show('slide', {direction: 'left'}, 500).promise().done(function() {
											//Escondemos la Alerta
											$('#plusfront').hide('fade', {}, 400);
										});

										//Rebind Functions
										location.assign('javascript:ndo.events.feeds($(\'#long_feeds\'));void(0)');

									});

								}


							}
							
						// } /Portada

						//Liberamos algunas variables ya que no confio en JQuery
						noti = null; feed = null; front = null; $oldfeed = null; $newfeed = null;

					})
					.then(function() {	//Success
						updatetime = setTimeout(function(){update(2);},zrefresh);
					}, function() {		//Error
						updatetime = setTimeout(function(){update(2);},200);
					});
				}

				else {
					updatetime = setTimeout(function(){update(2);},zrefresh);
				}
			}

		}

	// } /Actualizar

	// { Resize Imágenes

		// @Kabaka & MajorVictory87 \\ https://greasyfork.org/en/scripts/4269-drag-to-resize-image

		// Find all img elements on the page and feed them to makeImageZoomable().
		// Also, record the image's original width in imageData[] in case the user
		// wants to restore size later.

		var imageData = Array();
		 
		function findAllImages() {
			var imgs = $('img:not(".plusimg")');
			//var imgs = document.getElementsByTagName('img');

			imgs.addClass('plusimg');

			for (i = 0; i < imgs.length; i++) {

				// We will populate this as the user interacts with the image, if they
				// do at all.
				imageData[imgs[i]] = {
					zindex: imgs[i].style.zIndex,
					width: imgs[i].style.width,
					height: imgs[i].style.height,
					position: imgs[i].style.position,
					resized: 0,
					resizable: true
				};

				makeImageZoomable(imgs[i]);
			}

		}


		/*
		 * Calculate the drag size for the event. This is taken directly from
		 * honestbleeps's Reddit Enhancement Suite.
		 *
		 * @param e mousedown or mousemove event.
		 * @return Size for image resizing.
		 */
		function getDragSize(e) {
			return (p = Math.pow)(p(e.clientX - (rc = e.target.getBoundingClientRect()).left, 2) + p(e.clientY - rc.top, 2), .5);
		}


		/*
		 * Get the viewport's vertical size. This should work in most browsers. We'll
		 * use this when making images fit the screen by height.
		 *
		 * @return Viewport size.
		 */
		function getHeight() {
			return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		}


		function makeImageZoomable(imgTag) {
			DragData = {};

			imgTag.addEventListener('mousedown', function(e) {
				if (e.ctrlKey != 0)
					return true;

				/*
				 * This is so we can support the command key on Mac. The combination of OS
				 * and browser changes how the key is passed to JavaScript. So we're just
				 * going to catch all of them. This means we'll also be catching meta keys
				 * for other systems. Oh well! Patches are welcome.
				 */
				if (e.metaKey != null) // Can be on some platforms
					if (e.metaKey != 0)
						return true;


				if (e.button == 0) {
					DragData.width = e.target.width;
					DragData.delta = getDragSize(e);
					DragData.dragging = true;

					e.preventDefault();
				}

			}, true);

			imgTag.addEventListener('contextmenu', function(e) {
				//Right Click
				if (imageData[e.target].resized != 0) {
					imageData[e.target].resized = 0;
					e.target.style.zIndex = imageData[e.target].zIndex;
					e.target.style.maxWidth = e.target.style.width = imageData[e.target].width;
					e.target.style.maxHeight = e.target.style.height = imageData[e.target].height;
					e.target.style.position = imageData[e.target].position;

					// Prevent the context menu from actually appearing.
					e.preventDefault();
					e.returnValue = false;
					e.stopPropagation();
					return false;
				}
				return true;

			}, true);

			imgTag.addEventListener('mousemove', function(e) {


				if (DragData.dragging) {

					clingdelta = Math.abs(DragData.delta - getDragSize(e));

					if (clingdelta > 5) {

						var prevwidth = parseInt(e.target.style.width.replace('px', ''));

						e.target.style.maxWidth = e.target.style.width = Math.floor(((getDragSize(e)) * DragData.width / DragData.delta)) + "px";
						e.target.style.maxHeight = '';
						e.target.style.height = 'auto';
						e.target.style.zIndex = 1000; // Make sure the image is on top.

						if (e.target.style.position == '') {
							e.target.style.position = 'relative';
						}

						imageData[e.target].resized = (prevwidth - parseInt(e.target.style.width.replace('px', '')));
					}
				}
			}, false);

			imgTag.addEventListener('mouseout', function(e) {

				if (DragData.dragging) {
					DragData.dragging = false;
					e.preventDefault();
					return false;
				}

				return true;

			}, true);

			imgTag.addEventListener('mouseup', function(e) {

				if (DragData.dragging) {
					DragData.dragging = false;
					e.preventDefault();
					return false;
				}

				return true;

			}, true);

			imgTag.addEventListener('click', function(e) {
				if (e.ctrlKey != 0)
					return true;

				if (e.metaKey != null && e.metaKey != 0) // Can be on some platforms
					return true;

				if (!isNaN(imageData[e.target].resized) && imageData[e.target].resized != 0) {
						e.preventDefault();
						e.stopPropagation();
					return false;
				}

				return true;
			}, true);

		}

		function resimg() {

			/*
			 * Set up events for the given img element to make it zoomable via
			 * drag to zoom. Most of this is taken directly from honestbleeps's
			 * Reddit Enhancement Suite. Event functions are currently written
			 * inline. For readability, I may move them. But the code is small
			 * enough that I don't yet care.
			 *
			 * @param imgTag Image element.
			 */
			if(!GM_getValue('pimg')) {
				
				findAllImages();

			}

		}

		document.addEventListener('dragstart', function() {
			return false
		}, false);


	// } /Resize Imágenes

	// { Remover Cosas

		function removeimage() {
			var $himgs = $('.message .center.zoom');
			var $mimg = $himgs.prev('.media-not-displayed');

			if($himgs.length) {

				//Quitamos la alerta de atras
				if($mimg.length) {
					$mimg.remove();
				}

				//Y el cuadro de imágenes
				$himgs.remove();

			}
		}

		//Youtube
		if(plusvideos) {
			$('.message iframe').remove();
		}

		//Recuadro de Imágenes y Alerta de Contenido
		if(plusmedia) {
			removeimage();
		}

	// } /Remover

// } /Funciones


// { Ejecutamos funciones

	$(document).ready(
		//Ejecutar todas las funciones
		controlpanel(),
		stalker(),
		bitly(),
		resimg(),
		update(1)

	);
	
	//Unloads
	$( window ).unload(function() {
		//$.removeCookie('plus.active', { path: '/' });
		var $active = $.cookie('plus.active') ? parseInt($.cookie('plus.active')) : 0;

		if($active === $now) {
			$.removeCookie('plus.active', { path: '/' });
		}

		$.removeCookie('ndoplus.' + $now, { path: '/' });
	});

	window.onbeforeunload = function(e) {
		//$.removeCookie('plus.active', { path: '/' });
		var $active = $.cookie('plus.active') ? parseInt($.cookie('plus.active')) : 0;

		if($active === $now) {
			$.removeCookie('plus.active', { path: '/' });
		}

		$.removeCookie('ndoplus.' + $now, { path: '/' });
	};
	
// { /Ejecutar

console.log('Naruho.do Plus + End');
