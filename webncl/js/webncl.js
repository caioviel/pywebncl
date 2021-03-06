/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Logger = {

	// Warnings
	WARN_INVALID_ATTR:						100,	// Atributo inválido
	WARN_INVALID_TAG:						101,	// Tag inválida
	WARN_INVALID_HEAD_STRUCTURE:			102,	// Estrutura do cabeçalho inválida
	WARN_INVALID_REGION_DIMENSIONS:			103,	// Dimensões de região inválidas
	WARN_DUPLICATED_ZINDEX:					104,	// zIndex duplicado
	WARN_INVALID_AREA:						105,	// Area invalida
	WARN_NOT_IMPLEMENTED_YET:				106,	// Recurso não implementado ainda
	WARN_MEDIA_NOT_FOUND:					107,	// Mídia não encontrada
	WARN_MEDIAPLAYER_NOT_FOUND:				108,	// Media Player não encontrado
	WARN_REGIONATTR_IMPORTBASE_NOTINTO_RB:  109,	// Atributo 'region' especificado em importeBase filho de um elemento que não é um regioBase
	
	// Errors
	ERR_MISSING_ATTR:						201,	// Atributo obrigatório faltando
	ERR_MISSING_ATTR_ONEOF:					202,	// Atributo obrigatório faltando (um desses)
	ERR_MISSING_ATTR_DEP:					203,	// Atributo dependente faltando
	ERR_TOO_MANY_ATTRS:						204,	// Excesso de atributos repetidos
	ERR_MISSING_TAG:						205,	// Tag obrigatória faltando (+,1)
	ERR_MISSING_TAG_ONEOF:					206,	// Tag obrigatória faltando (|+,|1)
	ERR_TOO_MANY_TAGS:						207,	// Excesso de tags repetidas (?,1)
	ERR_TOO_MANY_TAGS_ONEOF:				208,	// Excesso de tags (apenas uma permitida)
	ERR_INVALID_ATTR_VALUE:					209,	// Valor de atributo inválido
	ERR_INVALID_ID_REFERENCE:				210,	// Referência a um ID inválido
	ERR_DUPLICATED_ID:						211,	// ID duplicado
	ERR_INCOMPATIBLE_FILE_EXT:				212,	// Extensão de arquivo incompatível com o MIMETYPE
	ERR_INVALID_URI:						213,	// URI inválida
	ERR_DUPLICATED_ATTR:					214,	// Atributo duplicado
	ERR_DUPLICATED_ALIAS:					215,	// Alias duplicado
	ERR_INVALID_CONTEXT_REFERENCE:			216,	// Objeto referenciado em outro contexto
	ERR_MEDIAPLAYER_METHOD_NOTFOUND:		217,	// User defined media player lacks defining a method
	ERR_MEDIAPLAYER_NOPLAYER:				218,	// No player was defined for current mime type or file extension
    ERR_PARSER_LOADINGERROR:				219,    // Error while loading NCL file
	ERR_INVALID_ALIAS:						220,	// Invalid Alias
	ERR_DUPLICATED_SETTINGS_NODE:			221,	// Two or more settings node found
	
	MESSAGES: {
		100: "Atributo inválido",
		101: "Tag inválida",
		102: "Estrutura do cabeçalho inválida",
		103: "Dimensões de região inválidas",
		104: "zIndex duplicado",
		105: "Areaa invalida",
		106: "Recurso não implementado ainda",
		107: "Mídia não encontrada",
		108: "Media Player não encontrado",
		109: "Atributo 'region' especificado em um importBase que não descendente de um regionBase",
                
		201: "Atributo obrigatório faltando",
		202: "Atributo obrigatório faltando (um desses)",
		203: "Atributo dependente faltando",
		204: "Excesso de atributos repetidos",
		205: "Tag obrigatória faltando",
		206: "Tag obrigatória faltando (uma dessas)",
		207: "Excesso de tags repetidas",
		208: "Excesso de tags (apenas uma permitida)",
		209: "Valor de atributo inválido",
		210: "Referência a ID inválido",
		211: "ID duplicado",
		212: "Extensão de arquivo incompatível com o MIMETYPE",
		213: "URI inválida",
		214: "Atributo duplicado",
		215: "Alias duplicado",
		216: "Objeto referenciado em outro contexto",         
		217: "Método não encontrado no media player",
		218: "Nenhum player foi definido para este mime type/extensão",
		219: "Erro carregando arquivo",
		220: "Alias inválido!",
		221: "Mais de um nó de propriedades encontra."
	},
	
	abort: false,
	
	error: function (id, tag, params) {
		// Error
		console.error("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
		this.abort = true;
	},
	
	warning: function (id, tag, params) {
		// Warning
		console.warn("[" + id + "] " + this.MESSAGES[id] + "\n" + tag + ": " + params.join(","));
	}
	
};
/*Classe Controle:*/
function RemoteControl(player, divId, initialAreas) {
	this.player = player;
	this.divId = divId;	
	this.allAreas = ['powerEject', 'numbers', 'volumeChannel', 'interactive', 'colorful', 'multimedia'];
	
	
	if (initialAreas) {
		this.areas = {};
		for (index in initialAreas) {
			area = initialAreas[index];
			if ($.inArray(area, this.allAreas) >= 0) {
				this.areas[area] = true;
			} else {
				console.error("RemoteControl: There is no area called '" + area + "'.");
			}
		}
	} else {
		this.areas = {}
		for (index in this.allAreas) {
			this.areas[this.allAreas[index]] = true;
		}
	}
	
	this.createDivs();
	this.createSetAreas();	
	this.bindButtonFunctions();	
	this.listeners = []
}

RemoteControl.prototype.addListener = function(listener) {
	this.listeners.push(listener)
}

RemoteControl.prototype.removeListener = function(listener) {
	this.listeners.splice( $.inArray(listener, this.listeners), 1);
}

RemoteControl.prototype.bindButtonFunctions = function() {
	var imgButtons = ['Start', 'Stop', 'Pause', 'Eject', 'Power', 'Key_1', 'Key_2', 'Key_3', 'Key_4', 'Key_5', 
					'Key_6', 'Key_7', 'Key_8', 'Key_9', 'Key_Hash', 'Key_0', 'Key_Star', 'Volume_Up', 'Channel_Up', 
					'Volume_Down', 'Channel_Down', 'Menu', 'Mute', 'Help', 'Info','Guide', 'Exit', 'Back', 'Enter', 
					'Cursor_Up', 'Cursor_Down', 'Cursor_Left', 'Cursor_Right', 'Red', 'Green', 'Yellow', 'Blue', 
					'Rewind', 'Play', 'Forward', 'Pause', 'Record', 'Stop'];

	for(button in imgButtons){		
		eval("$('#Button' + imgButtons[button]).click($.proxy(function(){"+
				"this.functionButton('"+ imgButtons[button].toUpperCase() + "');" +		
				"},this));"
		);
	}
}



RemoteControl.prototype.createDivs = function() {
	document.getElementById(this.divId).innerHTML = 
		"<div id='areaSpace1'>\
		</div>\
		<div id='areaPowerEject'>\
		<div 	id='ButtonPower'>\
		</div>\
		<div 	id='ButtonEject'>\
		</div>\
		</div>\
		<div id='areaSpace2'>\
		</div>\
		<div id='areaNumbers'>\
		<div 	id='ButtonKey_1'>\
		</div>\
		<div 	id='ButtonKey_2'>\
		</div>\
		<div 	id='ButtonKey_3'>\
		</div>\
		<div 	id='ButtonKey_4'>\
		</div>\
		<div 	id='ButtonKey_5'>\
		</div>\
		<div 	id='ButtonKey_6'>\
		</div>\
		<div 	id='ButtonKey_7'>\
		</div>\
		<div 	id='ButtonKey_8'>\
		</div>\
		<div 	id='ButtonKey_9'>\
		</div>\
		<div 	id='ButtonKey_Hash'>\
		</div>\
		<div 	id='ButtonKey_0'>\
		</div>\
		<div 	id='ButtonKey_Star'>\
		</div>\
		</div>\
		<div id='areaSpace3'>\
		</div>\
		<div id='areaVolumeChannel'>\
		<div 	id='ButtonVolume_Up'>\
		</div>\
		<div 	id='ButtonVolume_Down'>\
		</div>\
		<div 	id='ButtonChannel_Up'>\
		</div>\
		<div 	id='ButtonChannel_Down'>\
		</div>\
		<div 	id='ButtonMenu'>\
		</div>\
		<div 	id='ButtonMute'>\
		</div>\
		<div 	id='ButtonHelp'>\
		</div>\
		</div>\
		<div id='areaSpace4'>\
		</div>\
		<div id='areaInteractive'>\
		<div 	id='ButtonCursor_Up'>\
		</div>\
		<div 	id='ButtonCursor_Down'>\
		</div>\
		<div 	id='ButtonCursor_Left'>\
		</div>\
		<div 	id='ButtonCursor_Right'>\
		</div>\
		<div 	id='ButtonEnter'>\
		</div>\
		<div 	id='ButtonInfo'>\
		</div>\
		<div 	id='ButtonGuide'>\
		</div>\
		<div 	id='ButtonBack'>\
		</div>\
		<div 	id='ButtonExit'>\
		</div>\
		</div>\
		<div id='areaSpace5'>\
		</div>\
		<div id='areaColorful'>\
		<div 	id='ButtonRed'>\
		</div>\
		<div 	id='ButtonGreen'>\
		</div>\
		<div 	id='ButtonYellow'>\
		</div>\
		<div 	id='ButtonBlue'>\
		</div>\
		</div>\
		<div id='areaSpace6'>\
		</div>\
		<div id='areaMultimedia'>\
		<div 	id='ButtonRewind'>\
		</div>\
		<div 	id='ButtonPlay'>\
		</div>\
		<div 	id='ButtonForward'>\
		</div>\
		<div 	id='ButtonRecord'>\
		</div>\
		<div 	id='ButtonPause'>\
		</div>\
		<div 	id='ButtonStop'>\
		</div>\
		</div>\
		<div id='areaSpace7'>\
		</div>\
		<div id='areaLogo'>\
		<div/>\
		</div>\
		<div id='areaSpace8'>\
		</div>";
		
	$('#areaSpace1').hide();
	$('#areaPowerEject').hide();
	$('#areaSpace2').hide();
	$('#areaNumbers').hide();
	$('#areaSpace3').hide();
	$('#areaVolumeChannel').hide();
	$('#areaSpace4').hide();
	$('#areaInteractive').hide();
	$('#areaSpace5').hide();
	$('#areaColorful').hide();
	$('#areaSpace6').hide();
	$('#areaMultimedia').hide();
	$('#areaSpace7').hide();
	$('#areaLogo').hide();
	$('#areaSpace8').hide();	
}

//Habilita as áreas pré-definidas pelo criador do controle:
RemoteControl.prototype.createSetAreas = function(){
	for (index in this.allAreas){			
		var name = 	this.allAreas[index];
		var capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
		//this[ 'setArea'+ capitalizedName ];

		eval("RemoteControl.prototype['setArea" + capitalizedName + "'] = function(value){\n"+
			//sinaliza a flag de controle da área
			"this.areas['" +name+ "'] = value;\n"+

			//a área sempre será visualizada juntamente com o seu espaçamento acima
			"if (value) {\n"+
			"$('#areaSpace" +(index+1)+ "').show();\n"+
			"$('#area" +capitalizedName+ "').show();\n"+
			"} else {\n"+
			"$('#areaSpace" +(index+1)+ "').hide();\n"+
			"$('#area" +capitalizedName+ "').hide();\n"+
			"}\n"+

			//o último espaçamento e os logos serão visíveis enquanto qualquer outra área for visível
			"if((this.areas.powerEject)||(this.areas.numbers)||(this.areas.volumeChannel)\n"+
					"||(this.areas.interactive)||(this.areas.colorful)||(this.areas.multimedia)){\n"+
				"$('#areaSpace7').show();\n"+
				"$('#areaLogo').show();\n"+
				"$('#areaSpace8').show();\n"+
			"}\n"+
			"else{\n"+
				"$('#areaSpace7').hide();\n"+
				"$('#areaLogo').hide();\n"+
				"$('#areaSpace8').hide();\n"+		
			"}\n"+
		"}");
		
		if (this.areas[name]) {
			this['setArea' + capitalizedName](true);
		}
	}
}

//Chamada da função específica de cada botão			
RemoteControl.prototype.functionButton = function(b){
	for (index in this.listeners) {
		this.listeners[index](b)
	}
	switch(b) {
	case 'PLAY':
		if (this.isPause) {
			this.player.resume();
		} else {
			this.player.start();
		}
		break;
	case 'STOP':
		this.player.stop();
		break;
	case 'PAUSE':
		this.player.pause();
		this.isPause = true;
		break;
	default:
		this.player.keyPress(b);
		break;
	}
	
}/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de Sao Carlos
 * Sao Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Classes Timer and TimerManager are used to create "pausable timers"
// that are going to be used to synchronize each context events
// How to use:
//    myTimers = new TimerManager();
//    myTimers.add (timeout1, callback1)
//    myTimers.add (timeout2, callback2);
//    myTimers.resumeAll();		//start then for the first time
//    myTimers.pauseAll();
//    myTimers.resumeAll();
//    ...
 
function Timer (t,callback,manager) {

	if (manager) this.manager = manager;
	this.callback = callback;
	this.timeLeft = t;
	this.startTime = null;
	this.id = null;
	
	//this.resume();
	
};

Timer.prototype.timeout = function() {
	if (this.manager) this.manager.remove(this);
	this.callback();
};

Timer.prototype.resume = function() {
	this.startTime = new Date();
	this.id = setTimeout($.proxy(function() {
		this.timeout();
	},this),this.timeLeft);
};

Timer.prototype.pause = function() {
	clearTimeout(this.id);
	this.timeLeft -= (new Date() - this.startTime);
};

Timer.prototype.stop = function() {
	clearTimeout(this.id);
};


/**
 * Class TimerManager
 **/

function TimerManager () {

	this.timers = [];
	
}

TimerManager.prototype.add = function(t,callback) {
	this.timers.push(new Timer(t,callback,this));
};

TimerManager.prototype.remove = function(timer) {
	this.timers.splice(this.timers.indexOf(timer),1);
};

TimerManager.prototype.pauseAll = function() {
	for (i in this.timers) {
		this.timers[i].pause();
	}
}

TimerManager.prototype.resumeAll = function() {
	for (i in this.timers) {
		this.timers[i].resume();
	}
}

TimerManager.prototype.stopAll = function() {
	for (i in this.timers) {
		this.timers[i].stop();
	}
	this.timers = [];
}
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function WebNclPlayer (nclSource, div, directory, mode) {

	if (directory && directory[directory.length-1] != '/') {
		directory += '/';
	}

	var patt=/[\/]*.+\//g;
	this.div = div;
       
	this.presentation = {
				
		 readyToPlay : false,
		 playRequested : false,
                                
        //Time limit used by events, can be changed by the user
		TIME_LIMIT: 1000,
		
//HACK_FOCUS (begin)
		settingsNode : undefined,
//HACK_FOCUS (end)
                
		playerId: ++WebNclPlayer.playerCount,
		playerDiv: div,
		getDivId: function (nodeId, type) {
			// ----- REFER -----
			var mediaId = this.parser.referenceMap.instReuse[nodeId] || nodeId;
			return "ncl" + this.playerId + (type||"") + "_" + mediaId;
			// -----------------
			// return "ncl" + this.playerId + (type||"") + "_" + nodeId;
		},
		path: directory || (nclSource && patt.exec(nclSource)[0]) || '',
                
		//Default media players
		//TODO: Future webncl versions should
		//inspect browser features and choose the
		//best players for the browser
		//MediaPlayers can be changed by the user
		mediaPlayers: {
		"text/htm" : 
			{
					defaultPlayer: Html5Player
			},
		"image" :
			{
					defaultPlayer: Html5Player
			},
		"image/png" : 
			{
					defaultPlayer: Html5Player
			},
		"image/jpeg" : 
			{
					defaultPlayer: Html5Player
			},
		"image/gif" : 
			{
					defaultPlayer: Html5Player
			},
		"audio":
			{
					defaultPlayer: Html5Player
			},
		"video" : 
			{
					defaultPlayer: Html5Player
					//Its possible to choose players for specific file formats
			},
		"video/x-flv": {defaultPlayer: FlowPlayer},
		"text/css" : undefined,                 //No player - Issue Debbuger.Warning
		"text/html" : 
			{
					defaultPlayer: Html5Player
			},
		"text/plain": 
			{
					defaultPlayer: Html5Player
			},
		"application/x-ginga-NCLua" : {defaultPlayer: LuaPlayer},
		"application/x-ginga-NCLet" : undefined,
		"application/x-ginga-settings" : {
					defaultPlayer: GingaSettingsPlayer
			},
		"text/xml" : undefined,
		"dummy": {defaultPlayer: Html5Player}

		},
		
		passiveMode : false,
		keyEvents : {}
	};
	
	if (mode && mode == "passiveMode") {
		this.presentation.passiveMode = passiveMode;
	}
	
	var a = this.presentation.playerId;
	this.presentation.bodyDiv = "wncl_body" + a;
	this.presentation.settingsDiv = "wncl_settings" + a;
	this.presentation.contextsDiv = "wncl_contexts" + a;
	this.presentation.loadingDiv = "wncl_loading" + a;
	this.presentation.playDiv = 'wncl_play'+a;
	this.presentation.endDiv = 'wncl_end'+a;
        
	/*
	 * Keys mapping declaration
	 * They can be redefined by the user
	 **/
	
	this.presentation.keys = {
		CURSOR_UP           :	38, 	/* arrow up */
		CURSOR_DOWN         : 	40,		/* arrow down */
		CURSOR_LEFT         :	37,		/* arrow left */
		CURSOR_RIGHT        :	39,		/* arrow right */
		ENTER               :	13,		/* enter */
		RED                 :   81,  	/* q */
		GREEN               :   87,		/* w */
		YELLOW              :   69,		/* e */
		BLUE                :   82,		/* r */
		KEY_0               :   96,		/* 0 */
		KEY_1               :   97,		/* 1 */
		KEY_2               :   98,		/* 2 */
		KEY_3               :   99,		/* 3 */
		KEY_4               :   100,	/* 4 */
		KEY_5               :   101,	/* 5 */
		KEY_6               :   102,	/* 6 */
		KEY_7               :   103,	/* 7 */
		KEY_8               :   104,	/* 8 */
		KEY_9               :   105,	/* 9 */

		BACK                :	90,		/* z */
		EXIT                :	88,		/* x */
		PLAY                :	67,		/* c */
		STOP                :	86,		/* v */
		PAUSE               :	66,		/* b */
		RECORD              :	78,		/* n */

		POWER               :	65,		/* a */
		REWIND              :	83,		/* s */
		EJECT               :	68,		/* d */
		MENU				:   77
	};
	
    this.presentation.reverseKeys = new Array(120);
    for (var key in this.presentation.keys)
    {
        this.presentation.reverseKeys[this.presentation.keys[key]] = key;
    }

	//Despite the key codes defined above, an array should be defined
	//with the codes that are going to be processed by the event handler
	//User can redefine this array to avoid player from processing some key events
	this.presentation.keys.allCodes = [13,37,38,39,40,81,87,69,82,96,97,98,99,100,101,102,103,104,105,90,88,67,86,66,78,65,83,68];

    //postEvent
    this.presentation.postEvent = $.proxy(this.postEvent,this); 


	this.presentation.isPlaying = false;
	this.presentation.isStopped = true;
	this.presentation.playingElem =[];
	this.presentation.pausedElem = [];
	this.presentation.notifyLink =$.proxy(this.nAction,this);
	this.presentation.lastMediaAborted = false;
	this.presentation.parser = new Parser(this.presentation.path);
	
	
	// Event Listeners
	this.presentation.eventTypes = ["input", "node", "settings", "presentation"]
	this.eventListeners = {}
	for (var index in this.presentation.eventTypes) {
		this.eventListeners[this.presentation.eventTypes[index]] = [];
	}
	this.presentation.notifyEvent = $.proxy(this.__notifyEvent, this);
	
	/*
    	Carrega o arquivo
	 */
	if (nclSource) {
		if (mode && mode == "codeAsParameter") {
			var url = document.URL.split('/');
			url = url[url.length-1];
			this.presentation.parser.loadString(nclSource, url, $.proxy(this.execute,this));
		} else {
			this.presentation.parser.loadFile(nclSource,$.proxy(this.execute,this));
		}
	} else {
		nclSource = document.URL.split('/');
		nclSource = nclSource[nclSource.length-1];
	    this.presentation.parser.loadFile(nclSource,$.proxy(this.execute,this),this.div);
	}
	
};

WebNclPlayer.prototype.setFocusIndex = function (focusIndex) {	
	if (this.presentation.settingsNode && focusIndex != undefined) {
		htmlPlayer = this.presentation.settingsNode.htmlPlayer;
		$(htmlPlayer).trigger('set', ['service.currentFocus', null, null, focusIndex]);
	} else { 
		this.inputManager.setCurrentFocus(focusIndex);
	}
};


WebNclPlayer.prototype.setPassiveMode = function (mode) {
	this.presentation.passiveMode = mode
};

WebNclPlayer.prototype.getPassiveMode = function() {
	return this.presentation.passiveMode;
};

WebNclPlayer.prototype.addListener = function (listenerFunc, eventTypesArray) {
	if (eventTypesArray != undefined) {
		for (var index in eventTypesArray) {
			var strType = (eventTypesArray[index]).toLowerCase();
			this.eventListeners[strType].push(listenerFunc);
		}
	}
};

WebNclPlayer.prototype.addKeyEventListener = function (listener) {
	this.addListener(listener, ['INPUT']);
};

WebNclPlayer.prototype.addPresentationEventListener = function(listener) {
	this.addListener(listener, ['PRESENTATION']);
};

WebNclPlayer.prototype.__notifyEvent = function(event) {
	var listenersList = this.eventListeners[event["type"]];
	for (var index in listenersList) {
		var listenerFunc  = listenersList[index];
		listenerFunc(event);
	}
	
};



// execute (chamada após o parse)
WebNclPlayer.prototype.execute = function (parser) {
	//imprime os tempos
	var p = this.presentation.parser;
	for(var x in p.parsers)
	{
		console.log(['[',this.div,']  ',x,':    LOAD: ',p.parsers[x].loadTime,'ms;   PARSE XML: ', p.parsers[x].xmlParse , 'ms;   PARSE: ' , p.parsers[x].parseTime ,  'ms'].join(''));
	}
	
	//
	var rb,i;
	this.presentation.ncl = parser.ncl;
	this.presentation.inputManager = new InputManager(this.presentation);
	this.presentation.systemSettings = new SystemSettings(this.presentation);
	
	var $playerDiv = $("#"+this.presentation.playerDiv);
	// cálculo da posição real de cada região
	for (rb in this.presentation.ncl.head.regionBase) {
		for (i in this.presentation.ncl.head.regionBase[rb].region) {
			var bounds = {
				left: 0,
				top: 0,
				width: parseInt($playerDiv.css("width").split("px")[0]),
				height: parseInt($playerDiv.css("height").split("px")[0])
			};
			this.fixRegionBounds(this.presentation.ncl.head.regionBase[rb].region[i],bounds);
		}
	}
        
	// torna a div selecionavel
	$playerDiv.attr('tabindex',this.presentation.playerId);

	// cria as divs de interface 
	$playerDiv
		.append($('<div></div>').attr({id:this.presentation.loadingDiv}).addClass('wncl_BlackDiv').hide().append($('<div></div>').addClass('wncl_loadingDiv')))
		.append($('<div></div>').attr({id:this.presentation.playDiv}).addClass('wncl_BlackDiv wncl_clickMe').append($('<div></div>').addClass('wncl_playDiv')))
		.append($('<div></div>').attr({id:this.presentation.endDiv}).addClass('wncl_BlackDiv wncl_clickMe').hide().append($('<div></div>').addClass('wncl_endDiv')));
        
	// cria as divs iniciais
	$playerDiv.append("<div id='" + this.presentation.settingsDiv + "'></div>");
	$playerDiv.append("<div id='" + this.presentation.contextsDiv + "'></div>");
        
	// cria o primeiro contexto (body)
	this.presentation.context = new ContextPlayer(this.presentation.ncl.body,this.presentation);

	// eventos para cada div de interface
	//start div
	$('#'+this.presentation.playDiv).on("click",$.proxy(function(){
		if (this.presentation.context.isStopped) {
			this.start();
		} else if (!this.presentation.context.isPlaying) {
			this.resume();
		}
	},this));
	
	//end div
	$('#'+this.presentation.endDiv).on("click",$.proxy(function(){
		this.start();
	},this));
	
	
	// inicia a apresentação
	this.presentation.readyToPlay = true;
	
	if (this.presentation.playRequested)
    {
		this.start();
    }
};

// fixRegionBounds
WebNclPlayer.prototype.fixRegionBounds = function (node, parentBounds) {

	var relativeBounds = {
		left: node.left || null,
		right: node.right || null,
		top: node.top || null,
		bottom: node.bottom || null,
		width: node.width || null,
		height: node.height || null
	};

	var absoluteBounds = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

	// Converte px em valor númerico
	for (i in relativeBounds) {
		if (relativeBounds[i] != null) {
			if (relativeBounds[i].split("%").length == 1)
            {
				relativeBounds[i] = parseInt(relativeBounds[i].split("px")[0]);
            }
		}
	}
	
	// Converte % em valor numérico
	var attrs, buffer;
	// left, right, width
	attrs = ["left","right","width"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 0) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.width*parseFloat(buffer[0])/100);
			}
		}
	}
	// top, bottom, height
	attrs = ["top","bottom","height"];
	for (i in attrs) {
		if (relativeBounds[attrs[i]]!=null && isNaN(relativeBounds[attrs[i]])) {
			buffer = relativeBounds[attrs[i]].split("%");
			if (buffer.length > 1) {
				relativeBounds[attrs[i]] = parseInt(parentBounds.height*parseInt(buffer[0])/100);
			}
		}
	}
	
	// Calcula left e width de acordo com os atributos left/right/width
	if (relativeBounds.left != null) {
		if (relativeBounds.right != null) {
			if (relativeBounds.width != null) {
				// left, right, width -> nothing
			} else {
				// left, right -> width calculado
				relativeBounds.width = parentBounds.width - relativeBounds.left - relativeBounds.right;
			}
		} else if (relativeBounds.width != null) {
			// left, width -> nothing
		} else {
			// left -> width herdado
			relativeBounds.width = parentBounds.width;
		}
	} else if (relativeBounds.width != null) {
		if (relativeBounds.right != null) {
			// right, width -> left calculado
			relativeBounds.left = parentBounds.width - relativeBounds.right - relativeBounds.width;
		} else {
			// width -> left zero
			relativeBounds.left = 0;
		}
	} else if (relativeBounds.right != null) {
		// right -> left 0, width calculado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width - relativeBounds.right;
	} else {
		// nada -> left 0, width herdado
		relativeBounds.left = 0;
		relativeBounds.width = parentBounds.width;
	}
	
	// Calcula top e bottom de acordo com os atributos top/bottom/height
	if (relativeBounds.top != null) {
		if (relativeBounds.bottom != null) {
			if (relativeBounds.height != null) {
				// top, bottom, height -> nothing
			} else {
				// top, bottom -> height calculado
				relativeBounds.height = parentBounds.height - relativeBounds.top - relativeBounds.bottom;
			}
		} else if (relativeBounds.height != null) {
			// top, height -> nothing
		} else {
			// top -> height herdado
			relativeBounds.height = parentBounds.height;
		}
	} else if (relativeBounds.height != null) {
		if (relativeBounds.bottom != null) {
			// bottom, height -> top calculado
			relativeBounds.top = parentBounds.height - relativeBounds.bottom - relativeBounds.height;
		} else {
			// height -> top zero
			relativeBounds.top = 0;
		}
	} else if (relativeBounds.bottom != null) {
		// bottom -> top 0, height calculado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height - relativeBounds.bottom;
	} else {
		// nada -> top 0, height herdado
		relativeBounds.top = 0;
		relativeBounds.height = parentBounds.height;
	}
	
	// Calcula os valores absolutos
	absoluteBounds.left = parentBounds.left + relativeBounds.left;
	absoluteBounds.top = parentBounds.top + relativeBounds.top;
	absoluteBounds.width = relativeBounds.width;
	absoluteBounds.height = relativeBounds.height;
	
	// Salva os valores calculados na própria região
	node.left = absoluteBounds.left + "px";
	node.top = absoluteBounds.top + "px";
	node.width = absoluteBounds.width + "px";
	node.height = absoluteBounds.height + "px";
	node.right = null;
	node.bottom = null;
	
	// Calcula as posições absolutas das regiões filhas
	for (i in node.region) {
		this.fixRegionBounds(node.region[i],absoluteBounds);
	}
	
};

/****** PLAYER CONTROL API *****/

// destroy
WebNclPlayer.prototype.destroy = function() {
	document.getElementById(this.div).outerHTML = '';
}

// start
WebNclPlayer.prototype.start = function() {
	if (this.presentation.readyToPlay) {
		this.presentation.context.start();
		this.notifyPresentationEvent('START');
	} else {
		this.presentation.playRequested = true;
	}
	
}

// pause
WebNclPlayer.prototype.pause = function() {
	this.presentation.context.pause();
	this.notifyPresentationEvent('PAUSE');
}

// resume
WebNclPlayer.prototype.resume = function() {
	this.presentation.context.resume();
	this.notifyPresentationEvent('RESUME');
}
        
// abort
WebNclPlayer.prototype.abort = function() {
	this.presentation.context.abort();
	this.notifyPresentationEvent('ABORT');
}

// stop
WebNclPlayer.prototype.stop = function() {
	this.presentation.context.stop();
	this.presentation.playRequested = false;
	//$('#'+this.presentation.endDiv).show();
}

// triggerEvent
WebNclPlayer.prototype.triggerEvent = function (event,nodeId,nodeInterface) {
	$("#"+this.presentation.getDivId(nodeId)).trigger(event,[nodeInterface]);
};

// setProperty
WebNclPlayer.prototype.setProperty = function (nodeId,name,value) {
	$("#"+this.presentation.getDivId(nodeId)).trigger('set',[name,null,null,value]);
};

// keyPress
WebNclPlayer.prototype.keyPress = function (key) {
    if(this.presentation.keys[key])
	    this.presentation.inputManager.keyEvent(this.presentation.keys[key]);
    else
        this.presentation.inputManager.keyEvent(key);
};

// postEvent
WebNclPlayer.prototype.postEvent = function (event) {
	if (!event['class'] || event['class'] == 'ncl') {
		if (!event.type || event.type == 'presentation') {
			// presentation event
			if (event.component) {
				this.triggerEvent(event.action,event.component,event.area);
			} else {
				switch (event.action) {
					case 'start':this.start();break;
					case 'pause':this.pause();break;
					case 'resume':this.resume();break;
					case 'abort':this.abort();break;
					case 'stop':this.stop();break;
					case 'destroy':this.destroy();break;
				}
			}
		} else if (event.type == 'attribution' && event.action == 'start') {
			// attribution event
			this.setProperty(event.component,event.name,event.value);
		}
	} else if (event['class'] == 'key') {
		if (!event.type || event.type == 'press') {
			// key press
			this.keyPress(event.key);
		}
		/*
		else if (event.type == 'release')
		{
			// key release
			// nothing?
		}
		*/
	}
};

/******************************/

WebNclPlayer.prototype.triggerEvent = function (event,nodeId,nodeInterface) {
	$("#"+this.presentation.getDivId(nodeId)).trigger(event,[nodeInterface]);
};

/*Contexts Sync and Notify functions*/

WebNclPlayer.prototype.nSync = function(e,s)
{

}

WebNclPlayer.prototype.notifyPresentationEvent = function(_event) {
	this.__notifyEvent(
		{"type": 'presentation', 
		"event": _event});
}

WebNclPlayer.prototype.nAction = function(event)
{
	var  p = this.presentation;
	var playDiv = '#'+p.playDiv;
	var endDiv = '#'+p.endDiv;
	
	//no elements are playing
	if(p.playingElem.length === 0)
	{
		//no elements are paused
		if(p.pausedElem.length === 0)
		{
			//stop or abort
			p.isStopped = true;
			p.isPlaying = false;
			$(endDiv).show();
			this.notifyPresentationEvent('STOP');
	
		} else {
			//some are paused and no one is playing
			//pause
			p.isStopped = false;
			p.isPlaying = false;

			$(playDiv).show();		
		}
	}
	//some elements are playing
	else {
		
		if(!p.isPlaying)
		{
			$(playDiv).hide();
			$(endDiv).hide();	
			
			p.isStopped = false;
			p.isPlaying = true;
			
			/*
			  if(p.isStopped)
					//start
			  else
					//resume
			 
			 **/
		}
		
	}
	
}

WebNclPlayer.playerCount = 0;

$(document).ready(function() {

	var style = '';

	$("nclplayer").each(function() {
	
		// todo: other nclplayer tag attributes
		var src = $(this).attr("src");
		var id = $(this).attr("id");
		var autoplay = $(this).attr("autoplay");
		var dir = $(this).attr("baseDir");
		
		this.outerHTML = '<div id="'+id+'" class="nclPlayer_'+id+'"> </div>';
		
		style +=
			 '.nclPlayer_' + id + ' {'
			+'	position: relative;'
			+'	left: ' + ($(this).attr('left') || '0px') + ';'
			+'	top: ' + ($(this).attr('top') || '0px') + ';'
			+'	width: ' + ($(this).attr('width') || '854px') + ';'
			+'	height: ' + ($(this).attr('height') || '480px') + ';'
			+'}';

		webNclPlayers[id] = new WebNclPlayer(src,id,dir);
                
		if (autoplay) {
			webNclPlayers[id].start();   
		}
			
	});
	
	// TODO:
	// CSS3 property "object-position" is currently supported by Opera only.
	// Uncomment the 3 lines below to make it work for IE, Firefox, Chrome
	// and Safari when they release a version that supports it.
	// Note: check if the property names (their prefixes) are correct on these browsers!
	
	style +=
		 '.context, #contexts, #settings {'
		+'	display: none;'
		+'}'
		+'.player {'
		+'	position: absolute;'
		+'	left: 0px;'
		+'	top: 0px;'
		+'	overflow: hidden;'
		+'	display: inline;'
		+'	-o-object-position: 0 0;'		// Opera
		//+'	-moz-object-position: 0 0;'		// Firefox
		//+'	-webkit-object-position: 0 0;'	// Chrome/Safari
		//+'	object-position: 0 0;'			// IE
		+'}'
		+'.playerBkg {'
		+'	position: absolute;'
		+'	overflow: hidden;'
		+'	display: none;'
		+'}'
		+'.wncl_BlackDiv {'
		+'    position:absolute;'
		+'    width:100%;'
		+'    height:100%;'
		+'    z-index: 999;'
		+'    background-color:rgba(0,0,0,0.8);'
		+'}'
		+'.wncl_clickMe {'
		+'    cursor:pointer;'
		+'}'
		;
		
	$('<style>').text(style).appendTo('head');

});

webNclPlayers = {};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define a classe InputManager
 */

/**
 * Gerenciador de foco da aplicacao NCL. Trata os eventos do teclado e do mouse
 * Deve ser instanciada somente depois que o objeto presentation recebeu o objeto ncl
 * classes foram instanciadas
 * Tambem eh responsavel por tratar os eventos de tecla nao relacionados com o foco
 * @param {Object} presentation Estrutura que contem objetos 
 * 				   como InputManager, o proprio SystemSettings,
 * 				   entre outras configuracoes.
 * @constructor
 */
function InputManager(presentation) {

    this.presentation = presentation;

	var descriptors = presentation.ncl.head.descriptorBase.descriptor;
    var keyEventsObject = presentation.keyEvents;
	var focusIndexArray = [];
		
	for (var i in descriptors)
	{
		var currentDescriptor = descriptors[i];
		
		if(currentDescriptor.focusIndex)
		{
			focusIndexArray.push(currentDescriptor.focusIndex)

			this.descriptors[currentDescriptor.focusIndex] =
			{
				self: currentDescriptor,			//referencia para o descritor
				mediaArray: []						//array de medias
			}
			
		}
	}
		
	this.bindKeyDown();
};

//Mantem a informacao de qual objeto possui o foco atualmente
InputManager.prototype.currentFocusIndex = undefined;

//Mantem referencias para os descritores que possuem focusIndex
InputManager.prototype.descriptors = {};

//Mantem informacao dos descriptors com medias ativas
InputManager.prototype.focusIndexArray = [];

/*
    addMedia
 
 	Adiciona uma media a lista de medias de um descritor. Um descritor soh pode
 	receber foco se possui medias ativas. Ao invez do descriptor, deve ser passado
 	o seu focusIndex

  */
InputManager.prototype.addMedia = function(focusIndex, mediaId)
{
	if (focusIndex in this.descriptors)
	{
		var currentDescriptor = this.descriptors[focusIndex];
		
		if(currentDescriptor.mediaArray.indexOf(mediaId) == -1)
		{ 
			currentDescriptor.mediaArray.push(mediaId);
			this.bindMouseEvents(focusIndex, mediaId);
		}

		//if (! (focusIndex in this.focusIndexArray)) {
		if ($.inArray(focusIndex, this.focusIndexArray) == -1) {
			this.focusIndexArray.push(focusIndex);
		}
		
		if (this.currentFocusIndex == undefined) {
			this.__setCurrentFocus(focusIndex);		
		} else if (this.currentFocusIndex == focusIndex) {
			this.setMediaFocus(mediaId);
		}
		
	} else if (focusIndex) {
			this.descriptors[focusIndex] = {
			self: undefined,			//there is no really descriptor
			mediaArray: []				//array de medias
		}
		this.addMedia(focusIndex, mediaId);
	}
};

/*
 
 	removeMedia
 	
 	Remove uma media do array de medias de um descriptor
 	  Caso essa seja a ultima media o descriptor perde o seu foco
 	e currentFocusIndex eh setado com undefined
 
 */
InputManager.prototype.removeMedia = function(focusIndex, mediaId)
{
	if($.inArray(focusIndex, this.focusIndexArray) != -1)
	{
		var currentDescriptor = this.descriptors[focusIndex];
		var mediaIndex = currentDescriptor.mediaArray.indexOf(mediaId);
		
		if(mediaIndex != -1)
		{
			currentDescriptor.mediaArray.splice(mediaIndex,1);
			this.removeMediaFocus(mediaId);
			this.unbindMouseEvents(mediaId);
		}
		
		if(currentDescriptor.mediaArray.length == 0) {
			this.focusIndexArray.splice(this.focusIndexArray.indexOf(focusIndex),1);
		}
						
		if(focusIndex == this.currentFocusIndex) {
			if(this.focusIndexArray.length == 0) {
				this.__setCurrentFocus(undefined);
			} else {
				this.focusIndexArray.sort(this.sortFunction);					
				this.__setCurrentFocus(this.focusIndexArray[0])
			}
		}
	}	
};

/*
   Define o foco nas medias do descriptor com focusIndex
 * */

InputManager.prototype.__setCurrentFocus = function(focusIndex) {
	if (this.presentation.passiveMode === true) {
		return;
	}
	
	if (this.presentation.settingsNode && focusIndex != undefined) {
		htmlPlayer = this.presentation.settingsNode.htmlPlayer;
		$(htmlPlayer).trigger('set', ['service.currentFocus', null, null, focusIndex]);
	} else { 
		this.setCurrentFocus(focusIndex);
	}
};

InputManager.prototype.setCurrentKeyMaster = function(keyMaster) {
	this.keyMaster = keyMaster;
};

InputManager.prototype.getCurrentKeyMaster = function() {
	return this.keyMaster;
};

InputManager.prototype.setCurrentFocus = function(focusIndex)
{	
	//If Keymaster is defined, No action should be takken
	var keyMaster = this.getCurrentKeyMaster()
	if (keyMaster != undefined && keyMaster!= "") {
		return true;
	}

	//Verificamos em focusIndexArray pois um descritor soh pode receber foco
	//se tiver medias ativas
	if(focusIndex == undefined) {
		this.currentFocusIndex = undefined;
		
	} else	if(this.focusIndexArray.indexOf(focusIndex) != -1) {
		
		if(this.currentFocusIndex)
		{
			var oldDescriptor = this.descriptors[this.currentFocusIndex];
			for(var j in oldDescriptor.mediaArray)
			{
				var currentMedia = currentDescriptor.mediaArray[j];
				this.removeMediaFocus(currentMedia);
			}
		}
		
		currentDescriptor = this.descriptors[focusIndex];
		for(var j in currentDescriptor.mediaArray)
		{
			var currentMedia = currentDescriptor.mediaArray[j];
			this.setMediaFocus(currentMedia);
		}
		this.currentFocusIndex = focusIndex;
		
		this.presentation.notifyEvent(
				{ 'type' : 'input',
				  'event' : 'setFocus',
				  'focusIndex' : this.currentFocusIndex});
		
		return true;
	} 
	return false;
};

/*
   Retorna o descriptor que esta atualmente com o foco
 * */
InputManager.prototype.getCurrentFocus = function()
{
	return this.currentFocusIndex;
};

/*  setMediaFocus
 
 	Chama a funcao que define o foco em uma media
 * */
InputManager.prototype.setMediaFocus = function(mediaId)
{
	$(mediaId).trigger('focus');
};

/*  removeMediaFocus
 
 	Chama a funcao que retira o foco de uma media
 * */
InputManager.prototype.removeMediaFocus = function(mediaId)
{
	$(mediaId).trigger('blur');
};


/*
 	bindKeyDown
 	
 	Funcao que faz o bind do evento keydown
 * */
InputManager.prototype.bindKeyDown = function()
{
	$('#'+this.presentation.playerDiv).on('keydown', $.proxy(function(event){
	
		if(this.presentation.keys.allCodes.indexOf(event.which) != -1)
		{
			event.preventDefault();
			this.keyEvent(event.which);
		}

	},this));
};

/*
 	unbindKeyDown
 	
 	Funcao que faz o unbind do evento keydown
 * */	

InputManager.prototype.unbindKeyDown=  function()
{
	$(window).off('keydown');
};

InputManager.prototype.triggerKeyMaster = function(whichKey) {
	var enabledMedias = [];	
	var currentDescriptor = this.descriptors[this.keyMaster];
		
    for(var mediaIndex in currentDescriptor.mediaArray) {
    	var mediaId = currentDescriptor.mediaArray[mediaIndex];
        if(this.presentation.keyEvents[mediaId]) {
        	enabledMedias.push(mediaId);
        }
    }
    
    for (i in enabledMedias) {
    	var mediaId = enabledMedias[i];
    	var e = $.Event('selection.onSelection');
    	e.which = whichKey;
    	$(mediaId).trigger(e);
            
    }
};


/*
    keyEvent
    
    Trata eventos de teclas realizando a movimentacao entre os Descriptors
 * */

InputManager.prototype.keyEvent = function(keyCode)
{
	var keyName =  this.presentation.reverseKeys[keyCode];
	this.presentation.notifyEvent({
		  'event' : 'keyPress',
		  'keyCode' : keyName,
		  'type' : 'input'});
	
	if (this.keyMaster && this.keyMaster  != '') {
		this.triggerKeyMaster(keyCode);
	} else {
	    this.triggerKeyEvents(keyCode);
	
		if(this.currentFocusIndex)
		{
			currentDescriptor = this.descriptors[this.currentFocusIndex];
	                var Keys =  this.presentation.keys;
			switch (keyCode)
			{
	
				case Keys.CURSOR_UP:
					if(currentDescriptor.self && currentDescriptor.self.moveUp)
						this.__setCurrentFocus(currentDescriptor.self.moveUp.focusIndex)
	                
				break;		
				
				case Keys.CURSOR_DOWN:
					if(currentDescriptor.self && currentDescriptor.self.moveDown)
						this.__setCurrentFocus(currentDescriptor.self.moveDown.focusIndex)
	
	
				break;
				
				case Keys.CURSOR_LEFT:
					if(currentDescriptor.self && currentDescriptor.self.moveLeft)
						this.__setCurrentFocus(currentDescriptor.self.moveLeft.focusIndex)
						
				break;
				
				case Keys.CURSOR_RIGHT:
					if(currentDescriptor.self && currentDescriptor.self.moveRight)
						this.__setCurrentFocus(currentDescriptor.self.moveRight.focusIndex)
					
				break;					
				
				case Keys.ENTER:
					for(var i in currentDescriptor.mediaArray)
					{
						currentMedia = currentDescriptor.mediaArray[i];
						$(currentMedia).trigger('selection.onSelection');
					}
					
				break;
				
			}
		}
	
	}
};

/*
    bindMouseEvents
    
    Funcao que faz os binds dos evento click e mouseenter
 * */
InputManager.prototype.bindMouseEvents = function(focusIndex, mediaId)
{
    $(mediaId).css("cursor","pointer");
    
    $(mediaId).on('click', $.proxy(function(event){            
        if (event.which == 1)
            this.keyEvent(this.presentation.keys.ENTER);
    },this))
    
    $(mediaId).on('mouseover',{focusIndex: focusIndex}, $.proxy(function(event){
        this.__setCurrentFocus(event.data.focusIndex);
    },this))
};

/*
    unbindMouseevents
    
    Funcao que faz o unbind dos eventos click e mouseenter
 * */   

InputManager.prototype.unbindMouseEvents=  function(mediaId)
{
    $(mediaId).off('click');
    $(mediaId).off('mouseover');
    $(mediaId).css("cursor","default");
};

InputManager.prototype.enableKeys = function(mediaId)
{
    if(mediaId)
        if(mediaId in this.presentation.keyEvents)
            this.presentation.keyEvents[mediaId] = true;
};

InputManager.prototype.disableKeys = function(mediaId)
{
    if(mediaId)
        if(mediaId in this.presentation.keyEvents)
            this.presentation.keyEvents[mediaId] = false;
};


/**
 * The double for in this method is not a mistake.
 * It's necessary to determine the medias enabled to receive the key actions
 * before start trigging the events because events can add inconsistency 
 * to the used variables.
 */
InputManager.prototype.triggerKeyEvents = function(whichKey)
{
	var enabledMedias = [];
    for(var mediaId in this.presentation.keyEvents)
    {
        if(this.presentation.keyEvents[mediaId])
        {
        	enabledMedias.push(mediaId);
        }
    }
    
    for (i in enabledMedias) {
    	var mediaId = enabledMedias[i];
    	var e = $.Event('selection.onSelection');
    	e.which = whichKey;
    	$(mediaId).trigger(e);
            
    }
};


/*
 * Funcoes estaticas da classe InputManager
 */

/*
  Rotina de ordenacao utilizada no metodo array.sort()
 * */
InputManager.sortFunction=  function(a,b)
{
	a  = String(a).toLowerCase();
	b  = String(b).toLowerCase();
	
	if (a > b) return 1;
	if (a < b) return -1;
	return 0;
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define a classe Listener
 */


// TODO : Delay de eventos
// TODO : Tratar condicoes encadeadas

/**
 * Classe que representa um Link do NCL. A classe executa as acoes somente quando
 * todos as condicoes foram satisfeitas
 * CompoundCondition encadeado com outros compoundCondition nao sao aceitos
 * @constructor
 */
function Listener(listenerType, actionOperator, actionMap, flagMap, assessmentStatements, presentation, ctxsUsed)
{
	this.listenerType = listenerType;
	this.actionOperator = actionOperator;
	this.actionMap = actionMap;
	this.flagMap = flagMap;
	this.assessmentStatements = assessmentStatements;
	this.last = new Date();
	this.triggerBuffer = undefined;
	this.presentation = presentation;
	this.pendingActions = 0;
	this.contextsUsed = ctxsUsed;
	
	/*
	 * actionNamesArray
	 *     Array gerado com os nomes das acoes no actionMap. Sua utilizacao eh 
	 * necessaria para possibilitar encadeamento sequencial de acoes diferentes
	 * relacionadas a uma mesma condicao.
	 */
	this.actionNamesArray = new Array();
	for(actionName in actionMap)
	{
	    this.actionNamesArray.push(actionName)
	}
	
	this.actionMapSize = this.actionNamesArray.length;
};

/**
 *  notifyContexts()
 *		notify related contexts that it has finished
 *
 */
Listener.prototype.notifyContexts = function()
{
	for(var i in this.contextsUsed)
		this.contextsUsed[i].notifyLink(-1); 
}


/**
 *  notifyEvent(conditionName)
 * 		Funcao responsavel por tratar um evento quando uma condicao eh 
 *  satisfeita, decidindo se as acoes associadas devem ser disparadas ou se
 *  devem esperar que outra(s) condicao(oes) seja(m) satisfeita(s)
 * 
 *  TODO: conditions aninhados
 *  TODO: compoundStatement
 */
Listener.prototype.notifyEvent = function(conditionName)
{	
	switch(this.listenerType)
	{
		case Listener.listenerType.SIMPLE:
			if (this.__verifyAssessmentStatements())
				this.__executeActions();
			break;
			
		case Listener.listenerType.AND:
			if( (this.flagMap.length > 1) && 
				 ( (new Date().valueOf() - this.last.valueOf()) > this.presentation.TIME_LIMIT) ) {
				//Reseta todas as flags
				for(var index in this.flagMap)
					this.flagMap[index].flag = false;
				//Seta a flag do evento recebido
				this.flagMap.conditions[conditionName].flag = true;
				this.last = new Date();
			}
			else {
				//Seta a flag do evento recebido
				this.flagMap.conditions[conditionName].flag = true;
				var tempFlag = true;
				
				//Verifica se todas as flags estao setadas
				for (var index in this.flagMap.conditions)
				{
					if( ! (this.flagMap.conditions[index].flag))
					{
						tempFlag=false;
						break;
					}
				}
				//caso estejam, executa a acao
				if(tempFlag) 
				{
					//Limpa todas as flags
					for(var index in this.flagMap.conditions)
						this.flagMap.conditions[index].flag = false;
					this.last = 0;
					if (this.__verifyAssessmentStatements())
					   this.__executeActions();
				}
			}
			break;
		
		case Listener.listenerType.OR:
			if((new Date().valueOf() - this.last.valueOf()) > this.presentation.TIME_LIMIT)
			{
				this.last = new Date();
				this.__executeActions();
			}	
			break;
	}
	

};


/*  
 *  __verifyAsessmentStatements()
 *      Realiza os testes de comparacao presentes no vetor assessmentStatements
 * 
 *  Retorna:
 *      - false, se alguma condicao do vetor nao for satisfeita
 *      - true, se o vetor estiver vazio ou se todas as condicoes no vetor forem
 *  satisfeitas
 * 
 *  TODO: compoundStatement
 */
Listener.prototype.__verifyAssessmentStatements = function()
{

    for (var i in this.assessmentStatements)
    {
        var thisAssessment = this.assessmentStatements[i];
        var propertyValue = $(thisAssessment.bindComponent).data('property')[thisAssessment.bindInterface];
        switch(thisAssessment.operator)
        {
            case "eq":

                if(!(propertyValue == thisAssessment.value))
                    return false;
                break;
            
            case "ne":
                if(!(propertyValue != thisAssessment.value))
                    return false;
                break;
            
            case "lt":
                if(!(propertyValue < thisAssessment.value))
                    return false;
                break;
            
            case "lte":
                if(!(propertyValue <= thisAssessment.value))
                    return false;
                break;
            
            case "gt":
                if(!(propertyValue > thisAssessment.value))
                    return false;
                break;
            
            case "gte":
                if(!(propertyValue >= thisAssessment.value))
                    return false;
                break;
        }
    }

    return true;
};

/*	
 *  __executeActions()
 *  	Funcao responsavel por executar as acoes de um dado evento quando as 
 *  condicoes foram satisfeitas
 */
Listener.prototype.__executeActions = function()
{
	this.pendingActions = this.actionMapSize;
	
	for(var i in this.contextsUsed)
		this.contextsUsed[i].notifyLink(1); //new link happening
	
	if(this.actionOperator == 'seq')
		this.__executeActionsSeq([0]);
	else // if (this.actionOerator == 'par')
		this.__executeActionsPar();
};


/*	
 *  __executeActionsSeq(args)
 * 		Funcao auxiliar da funcao executeActions(). Responsavel por executar 
 *  acoes diferentes de um mesmo evento sequencialmente
 * 
 *  Argumentos
 *      args[0] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 */
Listener.prototype.__executeActionsSeq = function(args)
{
    var actionIndex = args[0];
    if(actionIndex < this.actionNamesArray.length)
    	this.__callTriggers([this.actionNamesArray[actionIndex],actionIndex]);
};


/*	
 *  __executeActionsPar()
 * 		Funcao auxiliar da funcao executeActions(). Responsavel por executar 
 *  acoes diferentes de um mesmo evento paralelamente
 */
Listener.prototype.__executeActionsPar = function()
{
	for (var actionName in this.actionMap)
		this.__callTriggers([actionName,-1]);
};




/*	
 *  __callTriggers(args)
 *  	Funcao responsavel por executar as multiplas instancias de uma acao de 
 *  um evento
 * 
 * Argumentos:
 *      args[0] = actionName: Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 *      
 */
Listener.prototype.__callTriggers = function(args)
{
    var actionName = args[0],
        actionIndex = args[1];
        
	if (this.actionMap[actionName].qualifier == 'seq')
		this.__callTriggersSeq([actionName,actionIndex, 0]);
	else // if (this.actionMap[actionName] == 'par')
		this.__callTriggersPar([actionName,actionIndex]);
};

/**
 *  __actionEnded(args)
 *		Callback function called when on action has been executed
 *	Args:
 *		args[0] = Another callback
 *		args[1] = Callback arguments
 */
Listener.prototype.__actionEnded = function(args)
{
	
	var actionName = args[1].splice(0,1);
	if(args[0])
		args[0](args[1]);
	
	this.pendingActions--;
	
	if(this.pendingActions == 0)
		this.notifyContexts();
}


/*	
 *  __callTriggersSeq(args)
 * 		Funcao auxiliar da funcao callTriggers(actionName). Responsavel por
 *  executar uma instancia de uma acao. Eh chamada repetidamente para eventos 
 *  de acoes sequenciais.
 *      
 *  Argumentos:
 *      args[0] = actionName:  Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 *      args[2] = triggerIndex: Indice da instancia na sequencia de chamadas 
 *          desta acao.
 */
Listener.prototype.__callTriggersSeq = function(args)
{
    var actionName = args[0], 
        actionIndex = args[1], 
        triggerIndex = args[2],
        bindsArray = this.actionMap[actionName].binds,
        target = bindsArray[triggerIndex];
        //console.log("__callTriggerSeq", actionName, actionIndex, triggerIndex, bindsArray, bindsArray.length);
    
    /*
     * Se o conjunto de diferentes acoes tem que ser executado de maneira sequencial
     */
    if(actionIndex >= 0)
    {
    	/*
    	    Se eh a primeira chamada, da primeira acao sequencial, entao esta acao
    	  vai para o triggerBuffer (triggerArray) 
    	 * */
        if(triggerIndex == 0 && actionIndex == 0)
        {
        	//Se alem de ser o primeiro, eh o ultimo daquela acao
        	if (triggerIndex == bindsArray.length - 1)
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__actionEnded,this) ,[$.proxy(this.__executeActionsSeq,this), [actionName,actionIndex+1]], target.value]]);
            else
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        }
        /*
            Se nao for o primeiro triggerIndex ou nao for a primeira acao
            verifica se o triggerIndex nao eh o ultimo
            (pois o ultimo tem que chamar a funcao que inicia a proxima acao no seu callback)
         * */
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        /*
            Caso seja o ultimo triggerIndex
            (quando nao eh a primeira)
          
         */
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__actionEnded,this) ,[$.proxy(this.__executeActionsSeq,this), [actionName,actionIndex+1]], target.value]);
    }
    else
    {
    	//caso seja o primeiro
        if(triggerIndex == 0)
        {
        	//caso tambem seja o ultimo
        	if (triggerIndex == bindsArray.length - 1)
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__actionEnded,this), [null,[actionName,null]], target.value]]);            
            else
            	this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]]);
        }
        else if (triggerIndex < bindsArray.length - 1)
            $(target.bindComponent).trigger(actionName,[target.bindInterface,  $.proxy(this.__callTriggersSeq,this), [actionName,actionIndex,triggerIndex+1], target.value]);
        else
            $(target.bindComponent).trigger(actionName,[target.bindInterface, $.proxy(this.__actionEnded,this), [null,[actionName,null]], target.value]);
    }
};


/**
 *  __parTriggerEnded(args)
 *     This function waits for each parallel trigger to ensure all were executed.
 *  Args:
 *     args[0] = Action name
 *     args[1] = Action index
 *
 */

Listener.prototype.__parTriggerEnded = function(args)
{

	var actionIndex = args[1];
	var actionMapElement = this.actionMap[args[0]];
	
	actionMapElement.pendingAcks--;
	
	//if this action was finished
	if(actionMapElement.pendingAcks ==0)
	{
		//one pending action
		this.pendingActions--;
		if(this.pendingActions ==0)
		{
			this.notifyContexts();
		}
		else
		{
			//verifies if this par action that just finished needs
			//to execute another action
			if(actionIndex >= 0)
				this.__executeActionsSeq([actionIndex+1]);
		}
	}
	
	
}


/**	
 *  __callTriggersPar(args)
 * 		Funcao auxiliar da funcao callTriggers(actionName). Responsavel por
 *  executar diferentes instancias de uma mesma acao paralelamente
 *      
 *  Argumentos:
 *      args[0] = actionName:  Nome da acao
 *      args[1] = actionIndex: Indice do nome da acao no vetor actionNamesArray.
 *          Seu valor eh -1 quando a execucao de diferentes acoes eh paralela
 */
Listener.prototype.__callTriggersPar = function(args)
{
    var actionName = args[0], 
        actionIndex = args[1],
        actionMapElement = this.actionMap[actionName],
        target;
        
	actionMapElement.pendingAcks = actionMapElement.binds.length;
		
    for (var targetIndex in actionMapElement.binds)
    {
        target = actionMapElement.binds[targetIndex];
        
        //se for paralela / primeira acao paralela
		if(actionIndex <= 0)
			this.triggerBuffer.push([target.bindComponent, actionName, [target.bindInterface, $.proxy(this.__parTriggerEnded,this), [actionName,actionIndex], target.value]]);
		//se for sequencial (mas nao for a ultima, entao pode executar direto)
		else
			$(target.bindComponent).trigger(actionName,[target.bindInterface, $.proxy(this.__parTriggerEnded,this), [actionName,actionIndex], target.value]);

	}

};


Listener.listenerType = {
						"SIMPLE": 0,
						"AND" : 1,
						"OR" : 2
						}

/*
      Formato do flagMap
      -------------------
	  flagMap['onBegin'] = {
	  	 bindComponent: "",
	  	 bindInterface: null,
	  	 eventType: "",
	  	 flag: false
	  	
	   }
	   
	   
	   assessmentStatements = [
	   {
	       bindComponent,
	       bindInterface,
	       operator,
	       value
	   }
	   ]

 
	actionMap['start'] =
	{
		binds: [ 
		{
		    bindComponent:
		    bindInterface:
		    value:
		}
		],
		qualifier: "par"
	}
	
	
 * 
 * */
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define a classe SystemSettings
 */

/**
 * Classe que mantem as configuracoes gerais do NCl sendo tocado.
 * Deve ser instanciada somente depois que o InputManager e outras
 * classes foram instanciadas
 * @param {Object} presentation Estrutura que contem objetos 
 * 							    como InputManager, o proprio SystemSettings,
 * 				 			    entre outras configuracoes.
 * @constructor
 */
function SystemSettings(presentation)
{
	this.presentation = presentation;
	//Propriedades que nao precisam de funcoes de get e set
	this.settings = {
		'default.focusBorderColor' 		 : 'blue',
		'default.selBorderColor'   		 : 'yellow',
		'default.focusBorderWidth'		 : 2,
		'default.focusBorderTransparency': 0
	}
	
	//Mapa das funcoes de set de algumas propriedadees
	this.setMap=	{
		'service.currentFocus': 
			$.proxy(presentation.inputManager.setCurrentFocus,presentation.inputManager),
		'service.currentKeyMaster': 
			$.proxy(presentation.inputManager.setCurrentKeyMaster,presentation.inputManager)
	}
	
	//Mapa das funcoes de get de algumas propriedades
	//(devem ser as mesmas que possuem funcao de set)
	this.getMap= {
		'service.currentFocus': 
			$.proxy(presentation.inputManager.getCurrentFocus,presentation.inputManager),
		'service.currentKeyMaster': 
			$.proxy(presentation.inputManager.getCurrentKeyMaster,presentation.inputManager)
	}
	
};


/**
 *  Funcao que define uma propriedade de sistema
 *  @param {String} property Propriedade de sistema
 *  @param {String} value    Valor a ser definido
 *  @return {boolean} Verdadeiro caso a propriedade modificada eh uma
 * 					  propriedade de sistema
 * 
 */
SystemSettings.prototype.setPropertyValue = function(property, value) {	
    if(property in this.settings) {
    	this.settings[property] = value;
    } else if(property in this.setMap) {
    	this.setMap[property](value);
    } else {
    	return false;
    }
    return true;
	
};


/**
 *  Funcao utilizada para retornar uma propridade de sistema
 *  @param {String} property Propriedade de sistema que deseja-se definer
 *  @return {Boolean} Valor da propriedade de sistema.
 * 					  Caso ela nao exista retorna vazio
 * 
 */
SystemSettings.prototype.getPropertyValue = function(property) {
	if(property in this.settings) {
    	return this.settings[property];
    } else if(property in this.setMap) {
    	return this.getMap[property]();
    } else {
    	return undefined;
    }
	
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.isNotArray = [
	"ncl","head","body","importedDocumentBase","ruleBase","transitionBase","descriptorBase",
	"connectorBase","defaultDescriptor","valueAssessment","defaultComponent"
];

Parser.nclStructureMap = {
	"area": {
		attrs: {
			reference_target: ["id"],
			required: ["id"],
			optional: ["coords","begin","end","beginText","endText","beginPosition","endPosition","first","last","label","clip"]
		},
		content: {}
	},
	"assessmentStatement": {
		attrs: {
			required: ["comparator"]
		},
		content: {
			custom: ["attributeAssessment","valueAssessment"],
			validate: function (count,errors) {
				var c1 = count["attributeAssessment"];
				var c2 = count["valueAssessment"];
				if (c1 == 0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG,
						params: ["attributeAssessment"]
					});
				}
				if (c1 < 2 && c2 == 0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["attributeAssessment","valueAssessment"]
					});
				}
				if (c1 == 2 && c2 > 0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["attributeAssessment","valueAssessment"]
					});
				}
				if (c1 > 2) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["attributeAssessment"]
					});
				}
				if (c2 > 1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["valueAssessment"]
					});
				}
			}
		}
	},
	"attributeAssessment": {
		attrs: {
			required: ["role","eventType","attributeType"],
			optional: ["key","offset"]
		},
		content: {}
	},
	"bind": {
		attrs: {
			reference_source: [
				[["descriptor"],["descriptor"]],
				[["component"],["context","media"]]//,
			//	[["interface"],["port","area","property"]]
			],
			required: ["role","component"],
			optional: ["interface","descriptor"]
		},
		content: {
			star: ["bindParam"]
		}
	},
	"bindParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"bindRule": {
		attrs: {
			reference_source: [
				[["constituent"],["media"]],
				[["rule"],["rule"]]
			],
			required: ["constituent","rule"]
		},
		content: {}
	},
	"body": {
		attrs: {
			reference_target: ["id"],
			optional: ["id"]
		},
		content: {
			star: ["port","property","media","context","switch","link"]
		}
	},
	"causalConnector": {
		attrs: {
			reference_target: ["id"],
			required: ["id"]
		},
		content: {
			star: ["connectorParam"],
			custom: ["simpleCondition","compoundCondition","simpleAction","compoundAction"],
			validate: function (count,errors) {
				// Condições
				if (count["simpleCondition"]==0 && count["compoundCondition"]==0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["simpleCondition","compoundCondition"]
					});
				} else if (count["simpleCondition"]>0 && count["compoundCondition"]>0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["simpleCondition","compoundCondition"]
					});
				} else if (count["simpleCondition"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["simpleCondition"]
					});
				} else if (count["compoundCondition"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["compoundCondition"]
					});
				}
				// Ações
				if (count["simpleAction"]==0 && count["compoundAction"]==0) {
					errors.push({
						code: Logger.ERR_MISSING_TAG_ONEOF,
						params: ["simpleAction","compoundAction"]
					});
				} else if (count["simpleAction"]>0 && count["compoundAction"]>0) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS_ONEOF,
						params: ["simpleAction","compoundAction"]
					});
				} else if (count["simpleAction"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["simpleAction"]
					});
				} else if (count["compoundAction"]>1) {
					errors.push({
						code: Logger.ERR_TOO_MANY_TAGS,
						params: ["compoundAction"]
					});
				}
			}
		}
	},
	"compositeRule": {
		attrs: {
			required: ["id","operator"]
		},
		content: {
			plusOneOf: ["rule","compositeRule"]
		}
	},
	"compoundAction": {
		attrs: {
			required: ["operator"],
			optional: ["delay"]
		},
		content: {
			plusOneOf: ["simpleAction","compoundAction"]
		}
	},
	"compoundCondition": {
		attrs: {
			required: ["operator"],
			optional: ["delay"]
		},
		content: {
			plusOneOf: ["simpleCondition","compoundCondition"],
			star: ["assessmentStatement","compoundStatement"]
		}
	},
	"compoundStatement": {
		attrs: {
			required: ["operator"],
			optional: ["isNegated"]
		},
		content: {
			plusOneOf: ["assessmentStatement","compoundStatement"]
		}
	},
	"connectorBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			star: ["importBase","causalConnector"]
		}
	},
	"connectorParam": {
		attrs: {
			reference_target: ["name"],
			ref_group: true,
			required: ["name"],
			optional: ["type"]
		},
		content: {}
	},
	"context": {
		attrs: {
			reference_source: [[["refer"],["body","context"]]],
			reference_target: ["id"],
			required: ["id"],
			optional: ["refer"]
		},
		content: {
			star: ["port","property","media","context","switch","link"]
		}
	},
	"defaultComponent": {
		attrs: {
			reference_source: [[["component"],["context","media"]]],
			required: ["component"]
		},
		content: {}
	},
	"defaultDescriptor": {
		attrs: {
			reference_source: [[["descriptor"],["descriptor"]]],
			required: ["descriptor"]
		},
		content: {}
	},
	"descriptor": {
		attrs: {
			reference_source: [
				[["region"],["region"]],
				[["moveLeft","moveRight","moveUp","moveDown"],["focusIndex"]],
				[["transIn","transOut"],["transition"]]
			],
			reference_target: ["id","focusIndex"],
			required: ["id"],
			optional: [
			"player","explicitDur","region","freeze","moveLeft","moveRight","moveUp","moveDown","focusIndex","focusBorderColor",
			"focusBorderWidth","focusBorderTransparency","focusSrc","focusSelSrc","selBorderColor","transIn","transOut"
		]
		},
		content: {
			star: ["descriptorParam"]
		}
	},
	"descriptorBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","descriptor","descriptorSwitch"]
		}
	},
	"descriptorParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"descriptorSwitch": {
		attrs: {
			required: ["id"]
		},
		content: {
			optional: ["defaultDescriptor"],
			star: ["bindRule","descriptor"]
		}
	},
	"head": {
		attrs: {},
		content: {
			optional: ["importedDocumentBase","ruleBase","transitionBase","descriptorBase","connectorBase"],
			star: ["regionBase","meta","metadata"]
		}
	},
	"importBase": {
		attrs: {
			reference_source: [[["region"],["region"]]],
			required: ["alias","documentURI"],
			optional: ["region","baseId"]
		},
		content: {}
	},
	"importedDocumentBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plus: ["importNCL"]
		}
	},
	"importNCL": {
		attrs: {
			required: ["alias","documentURI"]
		},
		content: {}
	},
	"link": {
		attrs: {
			reference_source: [[["xconnector"],["causalConnector"]]],
			required: ["xconnector"],
			optional: ["id"]
		},
		content: {
			plus: ["bind"],
			star: ["linkParam"]
		}
	},
	"linkParam": {
		attrs: {
			required: ["name","value"]
		},
		content: {}
	},
	"mapping": {
		attrs: {
			reference_source: [
				[["component"],["context","media"]]//,
			//	[["interface"],["port","area","property"]]
			],
			required: ["component"],
			optional: ["interface"]
		},
		content: {}
	},
	"media": {
		attrs: {
			reference_source: [
				[["refer"],["media"]],
				[["descriptor"],["descriptor"]]
			],
			reference_target: ["id"],
			required: ["id"],
			optional: ["instance","descriptor"],
			oneOf: ["type","src","refer"]
		},
		content: {
			star: ["area","property"]
		}
	},
	"meta": {
		attrs: {
			required: ["name","content"]
		},
		content: {}
	},
	"metadata": {
		attrs: {},
		content: {}
	},
	"ncl": {
		attrs: {
			optional: ["id","title","xmlns"]
		},
		content: {
			optional: ["head","body"]
		}
	},
	"port": {
		attrs: {
			reference_source: [
				[["component"],["context","media"]]//,
			//	[["nodeInterface"],["port","area","property"]]
			],
			reference_target: ["id"],
			required: ["id","component"],
			optional: ["interface"]
		},
		content: {}
	},
	"property": {
		attrs: {
			reference_target: ["name"],
			ref_group: true,
			required: ["name"],
			optional: ["value"]
		},
		content: {}
	},
	"region": {
		attrs: {
			reference_target: ["id"],
			required: ["id"],
			optional: ["title","left","right","top","bottom","height","width","zIndex"]
		},
		content: {
			star: ["region"]
		}
	},
	"regionBase": {
		attrs: {
			reference_target: ["id"],
			optional: ["id","device"]
		},
		content: {
			plusOneOf: ["importBase","region"]
		}
	},
	"rule": {
		attrs: {
			reference_source: [[["var"],["property"]]],
			required: ["id","var","comparator","value"]
		},
		content: {}
	},
	"ruleBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","rule","compositeRule"]
		}
	},
	"simpleAction": {
		attrs: {
			required: ["role"],
			optional: ["delay","eventType","actionType","value","min","max","qualifier","repeat","repeatDelay","duration","by"]
		},
		content: {}
	},
	"simpleCondition": {
		attrs: {
			required: ["role"],
			optional: ["delay","eventType","key","transition","min","max","qualifier"]
		},
		content: {}
	},
	"switch": {
		attrs: {
			reference_source: [[["refer"],["switch"]]],
			reference_target: ["id"],
			required: ["id"],
			optional: ["refer"]
		},
		content: {
			optional: ["defaultComponent"]
		}
	},
	"switchPort": {
		attrs: {
			required: ["id"]
		},
		content: {
			plus: ["mapping"]
		}
	},
	"transition": {
		attrs: {
			ref_multiple: true,
			reference_target: ["id"],
			required: ["id","type"],
			optional: ["subtype","dur","startProgress","endProgress","direction","fadeColor","horRepeat","vertRepeat","borderWidth","borderColor"]
		},
		content: {}
	},
	"transitionBase": {
		attrs: {
			optional: ["id"]
		},
		content: {
			plusOneOf: ["importBase","transition"]
		}
	},
	"valueAssessment": {
		attrs: {
			required: ["value"]
		},
		content: {}
	}
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Parser (path,alias) {

	this.referenceMap =  new ReferenceMap(this);
	this.uniqueTable = {};
	this.path = path;
	this.alias = alias;
	this.url = '';
	this.ncl = undefined;
	this.parsers = {
		/*
		 alias#url: {
			loadTime: 0,
		    xmlParse: 0,
			parseTime: 0,
		    parser: new Parser(),
		 }
		 
		 */
	}
	
	this.__callback = undefined;
	this.loading = false;

	
};

Parser.prototype.loadFile = function(url,parseCallback,div) {
	if(this.loading)
		return false;
	
	this.loading = true;
	this.url = url;
	this.parsers[url] = {
		parser: this, 
		loadTime: 0,
		parseTime : 0,
		xmlParse : 0
	};
	this.info = this.parsers[url];
	this.__callback = parseCallback;
	
	this.__load(url,$.proxy(this.parse,this),div);
	
	return true;
}

Parser.prototype.loadString = function(nclCode, url, parseCallback) {
	if(this.loading)
		return false;
	
	this.loading = true;
	this.url = url;
	this.parsers[url] = {
		parser: this, 
		loadTime: 0,
		parseTime : 0,
		xmlParse : 0
	};
	this.info = this.parsers[url];
	this.__callback = parseCallback;
	
	this.info.loadTime = 0;
	this.info.parseTime = new Date();
	var xmlData = $($.parseXML(nclCode));
	this.info.parseTime = new Date() - this.info.parseTime;
	this.parse(xmlData);
	
	return true;
}



//__load
Parser.prototype.__load = function(url, callback, div)
{
	var datatype = div ? 'text' : 'xml';
	this.info.loadTime = new Date();

	$.ajax({
		type: "GET",
		url: url,
		context: {times: this.info,
				   callback: callback,
				   div: div},
		dataType: datatype,
		success: function (data) {
			var tm = this.times;
			tm.loadTime = new Date() - tm.loadTime;
			tm.xmlParse = new Date();
			var d = div ? $($.parseXML(data)).find("#"+this.div)[0] : data;
			tm.xmlParse = new Date() - tm.xmlParse;
			this.callback(d);
		},
		error: function(jqXHR,textStatus, errorThrown)
		{
			var tm = this.times;
			tm.loadTime = new Date() - tm.loadTime;
			Logger.error('PARSER','XML',[textStatus,errorThrown]);
		}
	});	
}

Parser.prototype.parse = function (data) {
	if(!this.loading)
		return;
	
	var i = this.info;
	i.parseTime = new Date();	
	this.ncl = this.createNode(data);

	
	if(!this.uniqueTable['aliasList'])
	{
	
		this.referenceMap.createReferences();
		i.parseTime = new Date() - i.parseTime;
		
		if(this.__callback)
			this.__callback(this);

		this.loading = false;		
	} else {
		//start importing ncls
		i.parseTime = new Date() - i.parseTime;
		this.importNcl();
	}
	//this.importNcl(nclstruct.importList,0);
	

};

Parser.prototype.importNcl = function(lastParser)
{
	if(lastParser)
		for(var k in lastParser.parsers)
			this.parsers[[lastParser.alias,'#',k].join('')] = lastParser.parsers[k];

	var i = this.uniqueTable['aliasList'].splice(0,1);
	if(i.length > 0)
	{
		i[0].parser.loadFile(this.path + i[0].url, $.proxy(this.importNcl,this));
	} else {
		var x = new Date(),f,o;
		
		//create references
		this.referenceMap.createReferences();
		
		//process regionBase importation
		if (this.importBaseList) {
			o = this.importBaseList.length;
		} else {
			o = 0;
		}
		
		for (f =0; f < o; f++)
		{
			var importBaseInfo = this.importBaseList[f];
			var ibiObj = importBaseInfo.obj;

			if(ibiObj.__parent._type === 'regionBase' && ibiObj.baseId)
			{//consider 'baseId' attribute (other methods of importation
			 //will import all regionBases)
				var rBase;
				if((rBase = importBaseInfo.parser.referenceMap.map[ibiObj.baseId]) && rBase.target)
				{
					
					rBase = rBase.target.obj;
					ibiObj.baseId = rBase;						//x reference
					rBase._alias = ibiObj.alias;				//
					
					if(rBase.region)	//regions exist to be imported
					{
						if(ibiObj.region)
						{
							if(!ibiObj.region.region)
								ibiObj.region.region  = [];
							
							$.merge(ibiObj.region.region,rBase.region);
						} else {
							this.ncl.head.regionBase.push(rBase);
						}						
					}

					
				} else {
					Logger.error(Logger.ERR_INVALID_ID_REFERENCE,[ibiObj.alias,'#',ibiObj.baseId].join(''),['importBase']);
					return;
				}
			} else {
				if(ibiObj.region)
				{
					//merge
					var l,u,v;
					v = importBaseInfo.parser.ncl.head.regionBase;
					u = v.length;
					if(!ibiObj.region.region)
						ibiObj.region.region  = [];
					for(l = 0; l < u; l++)
					{
						$.merge(ibiObj.region.region,v[l].region);
					}
				} else {
					if(importBaseInfo.parser.ncl.head.regionBase)
						$.merge(this.ncl.head.regionBase,importBaseInfo.parser.ncl.head.regionBase);
				}
			}
		}
		
		x = new Date() - x;
		this.info.parseTime += x;
		this.loading = false;
		if(this.__callback)
			this.__callback(this);
	}
}

Parser.prototype.createNode = function (parent, tagName, parentNode, tree) {
	tagName = tagName || "ncl";
	var data = $(parent).find(tagName==="ncl"?"ncl":"> "+tagName);
	if (data.length===0) return false;
	var nodes = [];
	// attributes
	var attrs = Parser.nclStructureMap[tagName].attrs;
	attrs.required || (attrs.required=[]);
	attrs.optional || (attrs.optional=[]);
	attrs.oneOf || (attrs.oneOf=[]);
	var allAttrs = [].concat(attrs.required,attrs.optional,attrs.oneOf);
	// content
	var content = Parser.nclStructureMap[tagName].content;
	content.optional || (content.optional=[]);
	content.one || (content.one=[]);
	content.plus || (content.plus=[]);
	content.plusOneOf || (content.plusOneOf=[]);
	content.star || (content.star=[]);
	content.custom || (content.custom=[]);
	var allTags = [].concat(content.optional,content.one,content.plus,content.plusOneOf,content.star,content.custom);
	// cria o objeto
	var parser = this;
	$(data).each(function() {
		var node = {
			"_type": tagName
		};
		for (i in allAttrs) {
			node[allAttrs[i]] = $(this).attr(allAttrs[i]);
		}
		var newTree = tree + ">" + tagName;
		if (node.id) {
			newTree += "#" + node.id;
		}
		parser.parseAttributes(this,node,parentNode);
		parser.parseContent(this,node);
		for (i in allTags) {
			node[allTags[i]] = parser.createNode(this,allTags[i],node,newTree);
		}
		nodes.push(node);
		if (tagName === "ncl") {
			parser.parseNCL(node,tagName,parentNode,tree);
		} else {
			// TODO check why tagName[0] is undefined
			if (tagName[0]){
				parser["parse"+tagName[0].toUpperCase()+tagName.slice(1,tagName.length)](node,tagName,parentNode,tree);
			}
		}
	});
	return ($.inArray(tagName,Parser.isNotArray)===-1 ? nodes : nodes[0]);
};

Parser.prototype.parseAttributes = function (nodeXml, nodeObj,parentNode) {
	var attrObj = $(nodeXml).get(0).attributes;
	var nodeType = nodeObj["_type"];
	var attrs = Parser.nclStructureMap[nodeType].attrs;
	var attr,i;
	var foundAttrs = [];
	for ( i=0; i<attrObj.length; i++) {
		foundAttrs.push(attrObj.item(i).name);
	}
	// # (source)
	for ( i in attrs.reference_source) {
		for (attr in attrs.reference_source[i][0]) {
			if ($(nodeXml).attr(attrs.reference_source[i][0][attr])) {
				this.referenceMap.addSource(nodeObj,attrs.reference_source[i][0][attr],attrs.reference_source[i][1]);
			}
		}
	}
	// # (target)
	for ( attr in attrs.reference_target) {
		if ($(nodeXml).attr(attrs.reference_target[attr])) {
			var type = attrs.reference_target[attr]==="focusIndex" ? "focusIndex" : nodeType;
			if (!this.referenceMap.addTarget(nodeObj,$(nodeXml).attr(attrs.reference_target[attr]),parentNode,type)) {
				Logger.error(Logger.ERR_DUPLICATED_ID,nodeType,[attrs.reference_target[attr],$(nodeXml).attr(attrs.reference_target[attr]),$(nodeXml).parent().attr("id")]);
			}
		}
	}
	// !
	for (attr in attrs.required) {
		var index = $.inArray(attrs.required[attr],foundAttrs); 
		if (index == -1) {
			Logger.error(Logger.ERR_MISSING_ATTR,nodeType,[attrs.required[attr]]);
		} else {
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.required[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// ?
	for (attr in attrs.optional) {
		var index = $.inArray(attrs.optional[attr],foundAttrs); 
		if (index != -1) {
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.optional[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.required[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	// !1
	var oneFound = attrs.oneOf.length==0;
	for (attr in attrs.oneOf) {
		var index = $.inArray(attrs.oneOf[attr],foundAttrs);
		if (index != -1) {
			oneFound = true;
			foundAttrs[index] = 0;
			while (index = $.inArray(attrs.oneOf[attr],foundAttrs) != -1) {
				Logger.error(Logger.ERR_TOO_MANY_ATTRS,nodeType,[attrs.oneOf[attr]]);
				foundAttrs[index] = 0;
			}
		}
	}
	if (!oneFound) {
		Logger.error(Logger.ERR_MISSING_ATTR_ONEOF,nodeType,attrs.oneOf);
	}
	// Atributos inválidos
	for (attr in foundAttrs) {
		if (foundAttrs[attr] != 0) {
			Logger.warning(Logger.WARN_INVALID_ATTR,nodeType,[foundAttrs[attr]]);
		}
	}
};
	
Parser.prototype.parseContent = function (nodeXml,nodeObj) {
	var nodeType = nodeObj["_type"];
	var tags = Parser.nclStructureMap[nodeType].content;
	var tagCount = [];
	var validTags = [];
	validTags = validTags.concat(tags.one,tags.optional,tags.plus,tags.plusOneOf,tags.star,tags.custom);
	for (var tag in validTags) {
		tagCount[validTags[tag]] = 0;
	}
	$(nodeXml).find("> *").each(function() {
		var tagName = $(this).get(0).tagName;
		if (tagCount[tagName]) {
			tagCount[tagName]++;
		} else {
			tagCount[tagName] = 1;
		}
	});
	// ?
	for (var tag in tags.optional) {
		if (tagCount[tags.optional[tag]] > 1) {
			Logger.error(Logger.ERR_TOO_MANY_TAGS,nodeType,[tags.optional[tag]]);
		}
		tagCount[tags.optional[tag]] = 0;
	}
	// 1
	for (var tag in tags.one) {
		if (tagCount[tags.one[tag]] > 1) {
			Logger.error(Logger.ERR_TOO_MANY_TAGS,nodeType,[tags.one[tag]]);
		}
		if (tagCount[tags.one[tag]] == 0) {
			Logger.error(Logger.ERR_MISSING_TAG,nodeType,[tags.one[tag]]);
		}
		tagCount[tags.one[tag]] = 0;
	}
	// +
	for (var tag in tags.plus) {
		if (tagCount[tags.plus[tag]] == 0) {
			Logger.error(Logger.ERR_MISSING_TAG,nodeType,[tags.plus[tag]]);
		}
		tagCount[tags.plus[tag]] = 0;
	}
	// |+
	var atLeastOne = tags.plusOneOf.length==0;
	for (var tag in tags.plusOneOf) {
		if (tagCount[tags.plusOneOf[tag]] > 0) {
			atLeastOne = true;
		}
		tagCount[tags.plusOneOf[tag]] = 0;
	}
	if (!atLeastOne) {
		Logger.error(Logger.ERR_MISSING_TAG_ONEOF,nodeType,tags.plusOneOf);
	}
	// *
	for (var tag in tags.star) {
		tagCount[tags.star[tag]] = 0;
	}
	// custom
	if (tags.custom.length > 0) {
		var errors;
		tags.validate(tagCount,errors=[]);
		for (var err in errors) {
			Logger.error(errors[err].code,nodeType,errors[err].params);
		}
		for (var tag in tags.custom) {
			tagCount[tags.custom[tag]] = 0;
		}			
	}
	// Tags inválidas
	for (var tag in tagCount) {
		if (tagCount[tag] > 0) {
			Logger.warning(Logger.WARN_INVALID_TAG,nodeType,[tag]);
		}
	}
};


/**
 * Class ReferenceMap
 *
 */

function ReferenceMap(parser)
{
		// Tabela de IDs que podem ser referenciados por outros objetos
		this.map= {};
		// ----- REFER -----
		this.instReuse = [];
		// -----------------	
		this.parser = parser;
}

ReferenceMap.prototype.addSource = function (obj,attr,type) {
	var rid = obj[attr];
	// TODO
	// - salvar todos os sources e todos os targets e, no final do parse, ligar as referências
	// - resolver o problema do transition (id1;id2;...)
	if (!this.map[rid]) {
		this.map[rid] = {
			sources: []
		};
	}

	this.map[rid].sources.push({
		obj: obj,
		attr: attr,
		type: type
	});
	
	if(rid.indexOf('#') !== -1)
	{
		//if alias was defined
		var t = rid.split('#');
		if(!this.map[rid].target)
		{
			this.map[rid].target = 
			{
				alias: t[0],
				id: t[1],
				obj: undefined,//ref,
				type: undefined,//refType,
				parents: []
			}
		}
	}
	
};

ReferenceMap.prototype.addTarget= function (ref,id,parent,refType) {
	var pid = parent.id;
	var newTarget = false;
	if (this.map[id]) {
		if (this.map[id].target) {
			if (refType==="property" || refType==="connectorParam") {
				// não pode repetir no mesmo pai
				if (this.map[id].target.parents[pid]) {
					return false;
				}
			} else {
				// não pode repetir nunca
				return false;
			}
		} else {
			newTarget = true;
		}
	} else {
		this.map[id] = {
			sources: []
		};
		newTarget = true;
	}
	if (newTarget) {
		this.map[id].target = {
			obj: ref,
			type: refType,
			parents: [],
			ptype: parent._type
		};
	}
	this.map[id].target.parents[pid] = true;
	return true;
};


ReferenceMap.prototype.pop= function (id) {
	return (this.map[id] ? this.map[id].target : false);
};
		
ReferenceMap.prototype.createReferences= function () {
	for (var id in this.map) {
		for (var i in this.map[id].sources) {
			var src = this.map[id].sources[i];
			var tg = this.map[id].target;
			if(tg && tg.alias)
			{
				var a = this.parser.uniqueTable.alias;
				if(a && a[tg.alias])
				{
					var o = a[tg.alias].parser.referenceMap.map[tg.id];
					if(a[tg.alias].allBases || a[tg.alias][o.target.ptype])
					if(o)
					{
						tg.obj = o.target.obj;
						tg.type = o.target.type;
						tg.ptype = o.target.ptype;
					}
				} else {
					Logger.error(ERR_INVALID_ALIAS,tg.alias,[src.attr,src.obj[src.attr],src.type]);
				}
			}
			if (tg && tg.obj && $.inArray(this.map[id].target.type,src.type)!=-1) {
				// --- REFER ---
				if (src.attr=="refer") {
					if (src.obj._type=="media") {
						// TODO: é só DESCRIPTOR, SRC e TYPE que "herdam" do refer?
						// (area, property, ... ?)
						src.obj.descriptor = this.map[id].target.obj.descriptor;
						src.obj.src = this.map[id].target.obj.src;
						src.obj.type = this.map[id].target.obj.type;
						if (src.obj.instance!="new") {
							// instSame ou gradSame
							this.instReuse[src.obj.id] = id;
						}
					} else if (src.obj._type=="context") {
						// TODO
					}
				} else {
				// -------------
					src.obj[src.attr] = this.map[id].target.obj;
				}
			} else {
				Logger.error(Logger.ERR_INVALID_ID_REFERENCE,src.type,[src.attr,src.obj[src.attr],src.type]);
			}
		}
	}
}/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

ContextPlayer.prototype = new Player();

function ContextPlayer (node, p) {

	this.timerManager = new TimerManager();
	
	this.handlers = {};
	this.node = node;
	this.media = {};
	this.context = {};
	this.port = {};
    this.presentation = p.presentation || p;
    this.parentContext = p;
	this.pendingLinks = 0;

        
	//this.synchronizedPlayers = [];
	//this.loadingPlayers = 0;
        
    this.syncElem = [];
    this.syncReadyElem = [];
        
	
	//this list of paused elements is used when the context receives a pause
	this.pausedElemList = [];
	this.playingElem = [];
	this.pausedElem = [];
	this.lastMediaAborted = false;
	
	this.isCreated = false;

	

	if (node.id) {
		this.htmlPlayer = this.presentation.getDivId(node.id);
	} else {
		this.htmlPlayer = this.presentation.bodyDiv;
		//else: error
	}
	//if(this.body)
		$("#"+this.presentation.contextsDiv).append("<div class='context' id='"+this.htmlPlayer+"'></div>");
	//else
	//	$(this.parentContext.htmlPlayer).append("<div class='context' id='"+this.htmlPlayer+"'></div>");
	
	this.data = $(this.htmlPlayer).data();
	
	this.htmlPlayer = "#" + this.htmlPlayer;
	$(this.htmlPlayer).data("player",this);
	$(this.htmlPlayer).data("property",[]);
	this.bindEvents();
	
}

//ContextPlayer specific constants
ContextPlayer.prototype.eventType = {
	"onBegin": "presentation",
	"onEnd": "presentation",
	"onAbort": "presentation",
	"onPause": "presentation",
	"onResume": "presentation",
	"onSelection": "selection",
	"onBeginAttribution": "attribution",
	"onEndAttribution": "attribution"
};

//== Synchronization Functions Start ==

/*ContextPlayer.prototype.syncPlayer = function (mediaPlayer) {
	this.synchronizedPlayers.push(mediaPlayer.popcornPlayer);
	this.loadingPlayers++;
};

ContextPlayer.prototype.notify = function (mediaPlayer) {
	if (mediaPlayer) {
		if (mediaPlayer.popcornPlayer.readyState() >= 2) {
			this.notify();
		} else {
			$(mediaPlayer.htmlPlayer).one("canplaythrough",$.proxy(function() {
				this.notify();
			},this));
		}
	} else {
		if (--this.loadingPlayers == 0) {
			for (i in this.synchronizedPlayers) {
				this.synchronizedPlayers[i].play();
			}
		}
	}
};
*/
//== Synchronization Functions End ==

//notifyLink
//n = -1 //event listener ended
//n = 1  //event listener started
ContextPlayer.prototype.notifyLink = function(n)
{
	if(n === -1 || n === 1)
		this.pendingLinks += n;
	
	if(this.pendingLinks == 0)
	{
		if(this.playingElem.length === 0)
		{
			//no elements are paused
			if(this.pausedElem.length === 0)
			{
				//stop or abort
				this.isStopped = true;
				this.isPlaying = false;
				this.timerManager.stopAll();
				if(!this.lastMediaAborted)
					this.trigger("presentation.onEnd");
				else
					this.trigger("presentation.onAbort");
				
			} else {
				//some are paused and no is playing

				//pause
				this.isStopped = false;
				this.isPlaying = false;
				this.timerManager.pauseAll();
				this.trigger("presentation.onPause");
			}


		}
		//some elements are playing
		else {

			//not playing
			if(!this.isPlaying)
			{

				this.isStopped = false;
				this.isPlaying = true;	
				this.timerManager.resumeAll();
				
				if(this.isStopped)
					this.trigger("presentation.onBegin");
				else //was paused
					this.trigger("presentation.onResume");

			}
			
		}
	}
}

// sync
// e -> element (media or context)
// s -> state
ContextPlayer.prototype.nSync = function(e,s)
{
	
}

// create
ContextPlayer.prototype.create = function () {
	
	if (!this.isCreated) {
		this.isCreated = true;
		for (i in this.node.media) {
			this.media[this.node.media[i].id] = new MediaPlayer(this.node.media[i],this);
		}
		for (i in this.node.context) {
			this.context[this.node.context[i].id] = new ContextPlayer(this.node.context[i],this);
		}
		for (i in this.node.port) {
			this.port[this.node.port[i].id] = this.node.port[i];
		}
		for (i in this.node.property) {
			this.setProperty(this.node.property[i].name,this.node.property[i].value);
		}
		//bind links
		this.bindLinks();
	}
	return this;
};

// portAction
ContextPlayer.prototype.portAction = function(port,action)
{
	switch (port.component._type) {
		case "context": {
			// component = context -> nodeInterface = port
			if (!this.context[port.component.id]) {
				Logger.error(Logger.ERR_INVALID_CONTEXT_REFERENCE,"port",["context",port.id,"component",port.component.id]);
			} else
			{
				if (port['interface']) {
					var nodeInterface = port['interface'];
					this.context[port.component.id].create();
					if (!this.context[port.component.id].port[nodeInterface]) {
						Logger.error(Logger.ERR_INVALID_CONTEXT_REFERENCE,"port",[port.id,"interface",nodeInterface]);
					} else {
						this.context[port.component.id][action](nodeInterface);
					}
				} else {
					this.context[port.component.id][action]();
				}
			}
			break;
		}
		case "media": {
			// component = media -> nodeInterface = area, property
			nodeInterface = port["interface"];

			if (nodeInterface) {
				this.media[port.component.id][action](nodeInterface);
			} else {
				this.media[port.component.id][action]();
			}

			break;
		}
	}	
}

// start
ContextPlayer.prototype.start = function (nodeInterface) {
	if (!this.isCreated) {
		this.create();
	}	

	//if a interface is defined
	this.notifyEvent('start', nodeInterface);
	if(nodeInterface)
	{
		this.portAction(this.port[nodeInterface],'start');		
	} else {
		//if this context is stopped
		if (this.isStopped) {
			//start all ports
			for (i in this.port) {
				this.portAction(this.port[i],'start');
			}
			
		}
	}

}

// stop
ContextPlayer.prototype.stop = function (nodeInterface) {
	this.notifyEvent('stop', nodeInterface);
	if(nodeInterface)
	{
		this.portAction(this.port[nodeInterface],'stop');
	} else {

		//if it is not stopped (playing or stopped)
		if (!this.isStopped) {
			
			this.pausedElem=[];
			this.pausedElemList=[];
			this.playingElem=[];			
			
			for (i in this.context) {
				this.context[i].stop();
			}	
			for (i in this.media) {
				this.media[i].stop();
			}			
		
		}

	}
};

// pause
ContextPlayer.prototype.pause = function (nodeInterface) {
	if (this.isPlaying) {
		this.notifyEvent('pause', nodeInterface);
		if(!nodeInterface)
		{

			//save them for future context resume
			this.pausedElemList = this.playingElem;
			this.playingElem = [];

			//pause all playing objects
			for (var i in this.pausedElemList)
			{
				this.pausedElemList[i].pause();
			}
			
		} else {
			this.portAction(this.port[nodeInterface],'pause');
		}
	} 
	else if (nodeInterface) {
		//guess this case will never happen
		//but its treated here as its possible
		//and lua player might be able to treat the event
		this.portAction(this.port[nodeInterface],'pause');
	}
};

// resume
ContextPlayer.prototype.resume = function (nodeInterface) {
	
	this.notifyEvent('resume', nodeInterface);
	if(nodeInterface)
	{
		this.portAction(this.port[nodeInterface],'resume');
	} else {

		//if context is paused
		if (!this.isPlaying && !this.isStopped) {

			var list;

			//player was paused because of call to ContextPlayer.pause
			if(this.pausedElemList.length > 0)
			{
				//only resume medias paused that request
				list = this.pausedElemList;
				this.pausedElemList=[];
			} else { //player paused because all medias inside were paused
				//so resume all paused medias
				list = this.pausedElem;
			}

			for(var i in list)
				list[i].resume();

		} 

	}

};

// abort
ContextPlayer.prototype.abort = function (nodeInterface) {
	
	this.notifyEvent('abort', nodeInterface);
	if(!nodeInterface)
	{
		this.pausedMediaList = [];
		this.pausedContextList = [];

		for (i in this.context) {
			this.context[i].abort();
		}	
		for (i in this.media) {
			this.media[i].abort();
		}

	} else {
		this.portAction(this.port[nodeInterface],'abort');
	}

};

// isVariable
ContextPlayer.isVariable = function (str) {
	return str.substring(0,1)=='$';
};

// createLocalParamMap
ContextPlayer.createLocalParamMap = function (bindParam) {
	var map = {};
	for (i in bindParam) {
		currentBindParam = bindParam[i];
		map['$'+currentBindParam.name] = currentBindParam.value;
	}
	return map;
};

// executeTriggerArray
// triggerArray[i][0] = bindComponent
// triggerArray[i][1] = actionName
// triggerArray[i][2] = parâmetros do trigger
ContextPlayer.executeTriggerArray = function (triggerArray) {
	var currentTrigger;
	while ((currentTrigger = triggerArray.shift()) != undefined) {
		$(currentTrigger[0]).trigger(currentTrigger[1],currentTrigger[2]);
	}
};

/*  Cria os handlers e listeners dos links do ncl
 * 
 * TODO(danilo): Mandar delays para a Listener
 * TODO(danilo): Tratar compoundConditions encadeados
 * TODO(danilo): Tratar argumento key do onSelection
 *  
 */
ContextPlayer.prototype.bindLinks = function()
{
	var ports = this.node.port;
	var links = this.node.link;
	var handlers = this.handlers;
	
	/*
	  Faz o bind das portas
	 * */
	for (var i in ports)
	{
		var currentPort = ports[i];
		var interfaceDefined = currentPort['interface'] || undefined;

		//if(currentPort.component._type == 'media' && interfaceDefined)
		//{
			/*
			 	 TODO: encadear eventos de atribuicao quando a nodeInterface da media esta definida
				 attribution.onBeginAttribution
				 attribution.onEndAttribution
			 */
			//console.warn("Eventos de atribuicao para propriedades referenciadas por portas nao foi implementado");
	
			
		//} else {
			
			//Caso contrario (componente eh contexto) ou a nodeInterface nao esta definida
			var currentComponentElement  = "#"+this.presentation.getDivId(currentPort.component.id);
			var interfaceId = currentPort.id;

			for(var j in this.eventType)
			{
				var eventType = this.eventType[j];
				if(eventType != 'attribution')
				{
					var eventName = [eventType,j].join('.');
					
					/*
					  Ouve o evento instanciado pelo elemento
					  e lanca o mesmo evento soh que instanciado pelo contexto
					*/
					$(currentComponentElement).on(eventName, 
					{
						contextElement : this.htmlPlayer,
						interfaceId : interfaceId,
						eventName: eventName,
						portInterface: currentPort["interface"]
					},
					function(e, nclInterface)
					{
							if (nclInterface == e.data.portInterface) {
								var evento = $.Event(e.data.eventName);
								evento.which = e.which;
								$(e.data.contextElement).trigger(evento,[e.data.interfaceId])
							}
			
					});
							
				}
			}
			
		//}
		
	}
	
	/*
	 Faz o bind dos links
	 * */
	for (var i in links)
	{
		//causalConnector
		var link = links[i];
	    var linkConnector = link.xconnector;
	    var actionMap = new Object();
	    var flagMap = new Object();
	    flagMap.lenght = 0;
	    flagMap.conditions = {};
	    var lType = 0;
	    var aOperator= 'par';

		//Verifica os tipos de condicoes
		var conditions = linkConnector.simpleCondition;
		var assessmentsStatements = [];
		var connectorParam = new Object();
		var assessmentsMap = new Object();
		var assessmentsArray = new Array();
		
		/*
		   Cada parametro do link eh associado a um valor padrao vazio
		 * */			
		if(linkConnector.connectorParam)
		{
			for ( var i in linkConnector.connectorParam)
			{
				var currentConnectorParam = linkConnector.connectorParam[i];
				//Inicializa o parametro do link vazio
				connectorParam['$'+currentConnectorParam.name] = '';
				//TODO: Verificar se o valor eh mesmo vazio
			}	
		}
		
		
		/*
		 
			assessmentsMap['role'] =
			{
				bindComponent: (Component)
				bindInterface: 	(Component nodeInterface)
				operator:  (eq, etc.. )
				value: ,
				variable: verdadeiro se o valor eh uma variavel
			}

		 */
		
		if (linkConnector.compoundCondition)
		{
			//Tipo do listener
			conditions = linkConnector.compoundCondition[0].simpleCondition;

			/*
			   Pode ocorrer de um compoundCondition conter apenas um simpleCondition
			(quando ele contem tambem um assessmentStatement). 
			*/
			//if(conditions.length > 1)
				lType = Listener.listenerType[linkConnector.compoundCondition[0].operator.toUpperCase()];
			
			//Verifica se assessmentStatements (só ocorre no compoundCondition)
			//Para cada assessmentStatement
			for (var i in linkConnector.compoundCondition[0].assessmentStatement)
			{
				var currentAssessmentStatement =  linkConnector.compoundCondition[0].assessmentStatement[i];
				//Para cada attributeAssessment
				for (var j in currentAssessmentStatement.attributeAssessment)
				{
					var currentAttributeAssessment = currentAssessmentStatement.attributeAssessment[j];
					
					//Por enquanto aceitamos apenas eventos do tipo attribution
					if(currentAttributeAssessment.eventType == 'attribution')
						if (!currentAttributeAssessment.attributeType || currentAttributeAssessment.attributeType == 'nodeProperty')
						{
							assessmentsMap[currentAttributeAssessment.role] = {
								bindComponent: '',
								bindInterface: '',
								operator: currentAssessmentStatement.comparator,
								value: currentAssessmentStatement.valueAssessment.value,
								variable: ContextPlayer.isVariable(currentAssessmentStatement.valueAssessment.value)
								
							}
							
					} else {
						console.warn('Eventos de tipos diferentes de attribution nao foram implementados para elementos do tipo AttributeAssessment');
					}			
				}
			}
		}
		
		
		//Cria o assessmentsArray que eh passado para o listener
		for(var j in assessmentsMap)
			assessmentsArray.push(assessmentsMap[j]);
		
		
		
		//Inicializa o flagMap de acordo com a estrutura do conector
		for (var i in conditions)
		{

            var currentCondition = conditions[i];
			var conditionUseVariable = false;
			var conditionDefaultValue = '';
			var conditionUseKey = false;


			if (currentCondition.role === 'onSelection')
			{
				if(currentCondition.key)
				{
					if (ContextPlayer.isVariable(currentCondition.key))
					 	conditionUseVariable = true;
						
					conditionDefaultValue = currentCondition.key;
					conditionUseKey = true;
				}
			} 

			flagMap.conditions[currentCondition.role] = {
				bindComponent: "",
				bindInterface: null,
				eventType: this.eventType[currentCondition.role],
				flag: false,
				keyUseVariable : conditionUseVariable,
				keyDefaultValue: conditionDefaultValue,
				useKey : conditionUseKey
			}
			flagMap.lenght++;

		}
		
		

        //obtem um array das acoes
	    var actions = linkConnector.simpleAction;
	    if(linkConnector.compoundAction)
	    {
	    	//Add just for compatibility issues with some ncls
	    	if (linkConnector.compoundAction[0].operator) {
	    		aOperator = linkConnector.compoundAction[0].operator.toLowerCase();
	    	} else {
	    		aOperator = 'seq';
	    	}
	    	actions = linkConnector.compoundAction[0].simpleAction; 
	    }

		//inicializa o actionMap de acordo com a estrutura do conector
	    for (var i in actions)
	    {

			currentAction = actions[i];
			
	    	// Se a acao eh de atribuicao entao possui um valor de envio
	    	if  (currentAction.role == 'set')
	    	{

		    	var actionUseVariable = false;
		    	var actionDefaultValue = '';
		    
		    	//verifica se o atributo value esta definido
		    	if(currentAction.value)
		    	{
		    	 //caso esteja definido e seja do tipo variavel

		    	 if (ContextPlayer.isVariable(currentAction.value))
				  	actionUseVariable = true;


					// O valor do actionDefaultValue eh dado pelo parametro
					// value da acao, mesmo que este seja o nome de um parametro linkParam
 				    actionDefaultValue = currentAction.value; 					
				}
				
				//o action map para eventos de atribuicao sao um pouco diferentes
				actionMap[currentAction.role]= {
		    		binds: new Array(),
		    		qualifier: actions[i].qualifier,
		    		actionUseVariable: actionUseVariable,
		    		actionDefaultValue: actionDefaultValue,
					pendingAcks: 0
	    		}

	    	} else {
		
	    		actionMap[currentAction.role]= {
					binds: new Array(),
					qualifier: actions[i].qualifier
	    		}
	    		
	    	}
	    	 
	    }

		var contextsUsed = [this];

		//Como o tipo de listener e o tipo de action (operator) ja estao definidos,posso criar o listener
		var listener = new Listener(lType,aOperator,actionMap,flagMap,assessmentsArray,this.presentation,contextsUsed);
		/*
		 * Note que o flagMap e o actionMap ainda nao estao completos
		 * entranto, como o objeto listener referencia os objetos que 
		 * ele recebe no construtor estaremos modificando o interior
		 * do listener ao modificar as nossas variaveis locais
		 * actionMap e flagMap
		 */

        
        /*
            Todo o codigo abaixo eh de exclusividade do link
            O codigo acima eh o mesmo para conectores iguais
         * */
        
        /* Preenche o mapa de parametros 
		   com os valores globais (isto eh, os valores
		   	definidos pelos elementos linkParam)
		 * */
		if(link.linkParam)
		{
			for (var i in link.linkParam)
			{
				currentLinkParam = link.linkParam[i];
				connectorParam['$' + currentLinkParam.name] = currentLinkParam.value;
			}
		}
		
        
        //percorre todos os binds do link		
		for (var i in link.bind)
		{
			
			var currentBind = link.bind[i];
			
			var currentBindComponent = currentBind.component.id;
			var currentBindComponentSelector = "#"+this.presentation.getDivId(currentBindComponent);
			var currentInterface = currentBind['interface'];

			//Se o bind eh do tipo de acao
			if(actionMap[currentBind.role])
			{
			  var actionValue = null;
			  var currentAction = actionMap[currentBind.role];
			  
			  //verifica se a acao eh do tipo de atribuicao
			  if(currentBind.role == 'set')
			  {
			  	//Se esta acao utiliza parametro de link 
			  	if(currentAction.actionUseVariable)
			  	{
			  		//obtem as variveis locais do bind atual
			  		localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
			  			
			  	    //obtem atraves das variaveis o valor do action value
			  	    actionValue = localParamMap[currentAction.actionDefaultValue] ? localParamMap[currentAction.actionDefaultValue] : connectorParam[currentAction.actionDefaultValue];
			  	} else
			  	    //caso nao use variavel entao possui um valor padrao
			  		actionValue = currentAction.actionDefaultValue;	
			  	
			  }
			  
			  if(this.context[currentBindComponent] && currentInterface)
				  contextsUsed.push(this.context[currentBindComponent]);
				
			  currentAction.binds.push(
			  	{
			  		bindComponent: currentBindComponentSelector,
			  		bindInterface: currentInterface,
			  		value: actionValue
			  	}
			  	);
			  	
			  
			  
			//Se o bind for do tipo de condicao (attributeAssessment)
			} else if (flagMap.conditions[currentBind.role]){
			   var currentFlag = flagMap.conditions[currentBind.role];
			   //associa o component no flagMap do listener para este link				   			   
			   currentFlag.bindComponent = currentBindComponentSelector;
			   currentFlag.bindInterface = currentInterface;
			   
			   var hinterface = currentInterface ? 'i'+currentInterface: 'none'; 			   		
			   
			   

			   var componentDivId = currentBindComponentSelector;
			   var eventType = this.eventType[currentBind.role];
			   var eventName = currentBind.role;
			   var bindName = [eventType,eventName].join('.');
			   var handlerName =  [currentBindComponent,bindName].join('.');
				
			   var triggerArrayName = bindName+'.triggerArray';
			   
			   //TODO: Melhorar sistema que trata 'key' do onSelection
			   //Se o key deste condition provem de uma variavel 
			   if(currentFlag.useKey)
			   {
			   	 var localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
			   	 currentFlag.keyDefaultValue =  localParamMap[currentFlag.keyDefaultValue] || connectorParam[currentFlag.keyDefaultValue];	
				 var tempKey = currentFlag.keyDefaultValue
				 if ($.isNumeric(tempKey)) 
				 {
					 tempKey = 'KEY_' + tempKey;
				 }
			   	 if (tempKey in this.presentation.keys)
				 {
					currentFlag.keyDefaultValue = this.presentation.keys[tempKey];
				 }
				 
				 var port = 'undefined';
				 var triggerMedia = componentDivId;
				 
				 //Caso o componente seja um contexto e possua uma interface (uma porta para uma media)
				 //Deve-se usar a media para realizar o trigger da ação de teclas
				 //TODO: usei um loop para encontrar a porta, deve existir uma solução melhor
				 if (currentBind.component._type == "context" && currentInterface) {
				 	for (var i in currentBind.component.port) {
				 		currentPort = currentBind.component.port[i]
				 		portId = currentBind.component.port[i].id;
				 		if (portId == currentInterface) {
				 			port = currentPort;
				 			break;
				 		}
				 	}
				 	triggerMedia = "#"+this.presentation.getDivId(port.component.id);
				 }
				 
				 this.presentation.keyEvents[triggerMedia] = false;
			   }


			   //Caso um handler ainda nao foi criado para este link
			   if(!handlers[ handlerName ])
			   {
			     
			      // Cria o handler e salva essa informacao no handlers map
			      handlers[ handlerName ] = true;
			      
			      // Cria o buffer de triggers caso o mesmo nao exista
			      if(!$(componentDivId).data(triggerArrayName))
			      	$(componentDivId).data(triggerArrayName,[]);
			      
	 
	 			  // Cria uma array vazia para os listeners
	 			  if(!$(componentDivId).data(bindName))
	 			   	  $(componentDivId).data(bindName,[]);

				  // Instancia o handler para eventos do tipo 'eventType.eventName'
				  $(componentDivId).on(bindName,
				  	{
				  		componentDivId: componentDivId,
				  		bindName: bindName,
				  		eventName: eventName,
				  		triggerArrayName : triggerArrayName
				  	},
					function(e, nclInterface, callback)
					{
						var cdata = $(e.data.componentDivId).data(e.data.bindName);
						for(var listener in cdata)
						{
							var clistener = cdata[listener];
							var flag = clistener.flagMap.conditions[e.data.eventName]
							if(nclInterface == flag.bindInterface)
								// For selection conditions we need to check the key
								// This code maybe redundant
								if(e.type == 'selection' && flag.useKey) {
									if (flag.useKey) {
										if (e.which && flag.keyDefaultValue == e.which) {
											clistener.notifyEvent(e.data.eventName);
										}
									}
								} else {
									clistener.notifyEvent(e.data.eventName);
								}

						}
						ContextPlayer.executeTriggerArray($(e.data.componentDivId).data(e.data.triggerArrayName))

						//this callback is called  when is sure that that are pending events
						if(callback)
							callback();
					}	
				  	
				  );

        
			   } 
			   
			   //Obtem o triggerArray do evento e coloca no listener
			   listener.triggerBuffer = $(componentDivId).data(triggerArrayName);
			   //Adiciona um listener ao objeto
	    	   $(componentDivId).data(bindName).push(listener);
			      
			   
			} else {
			  //attributeAssessment
			   currentAssessment = assessmentsMap[currentBind.role];
			   currentAssessment.bindComponent = currentBindComponentSelector;
			   currentAssessment.bindInterface = currentInterface;
			   
			   //Trata os parametros do link
			   //Se o value deste attributeAssessment provem de uma variavel 
			   if(currentAssessment.variable)
			   {
			   	 localParamMap = ContextPlayer.createLocalParamMap(currentBind.bindParam);
		/*1*/    currentAssessment.value = localParamMap[currentAssessment.value] ? localParamMap[currentAssessment.value] : connectorParam[currentAssessment.value];		
			   }
			   /* 
			    * As variáveis definidas via linkParam tem o identificaro (dentro do dicionário connectorParam) sem o '$'.
			    * No if-inline (1), é procurado no connectorParam por currentAssessment.value, que o $ no nome da variável.
			    * Na minha correção, eu fiz o linkParam adquirir o $ quando ele é criado lá em cima.
			    * Nâo sei se está minha correção vai acarretar outros bugs, se for, podem reverté-la.
			    * 
			    * Sugestão: sempre utilizar $ nos nomes das variáveis.
			    * 
			    * */
			   
			}
		}
		
			
	}	

};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define FlowPlayer class. [WIP]
 */

/**
 * Default player for video/flv.
 * This is a Work in Progress. All players are still handled by MediaPlayer.js
 * @constructor
 */
function FlowPlayer(p) {
    this.p = p;
    this.htmlPlayer = "#" + p.id;
    this.flowPlayer = undefined;
    
	p.createElement("<div class='player' id='" + p.id + "'></div>");	


};

/**
 * Called when the player needs to unload its sources
 * (Precedes calls to unload, excepting the first call)
 */
FlowPlayer.prototype.unload = function()
{
	     //erases older content
        $(this.htmlPlayer).empty();   
}

/**
 * Called when the player need to load (or reload) it sources 
 * After the first time it's called, MediaPlayer.js will precede
 * every call to load() with a call to unload() 
 * 
 */
FlowPlayer.prototype.load = function(source)
{
	console.log (this.p)

      this.flowPlayer = $f(this.p.id, "http://releases.flowplayer.org/swf/flowplayer-3.2.12.swf", {
    	  clip: { autoPlay: false, autoBuffering: true, url: source, scaling: 'scale'},
    	  play: {replayLabel: null, label: null, opacity: 0 },
    	  canvas: { background: '#000000', backgroundGradient: 'none'},
    	  plugins: {controls: null}
      });
  
      //$(this.htmlPlayer).append("<script language='JavaScript'> $f('" + p.id + "', 'http://releases.flowplayer.org/swf/flowplayer-3.2.12.swf','" + source + "'); </script>");
        
}

/**
 * This function should be called to set function calls based on
 * the video progress in time 
 */
FlowPlayer.prototype.exec = function(time,callback)
{	
	//This function can be called more than
	//once with the times 'begin' and 'end'.
	//This way, the handler for these times
	//must set a new event listener for each
	//call
	//As documented bellow:
	//http://flowplayer.org/documentation/api/index.html#events
	//the calls onStart and onFinish works 
	//the way we need
	
	if (time=='begin'){
		this.flowPlayer.onStart(callback);
	}
	else if (time == 'end'){
		this.flowPlayer.onFinish(callback);
	}
	else{
		this.flowPlayer.onCuepoint(time,callback);

	}
}

/**
 * Start
 */
FlowPlayer.prototype.start =  function()
{
    this.flowPlayer.play();
    console.log(this.flowPlayer);
}

/**
 * Stop
 */
FlowPlayer.prototype.stop = function()
{
	this.flowPlayer.stop();
}

/**
 * Pause
 */
FlowPlayer.prototype.pause = function()
{
	this.flowPlayer.pause();
}

/**
 * Resume
 */
FlowPlayer.prototype.resume = function()
{
    this.flowPlayer.resume();
}


/**
 * Abort
 */
FlowPlayer.prototype.abort = function()
{
    this.stop();
}


/**
 * Seek
 */
FlowPlayer.prototype.seek = function(newTime)
{
    this.flowPlayer.seek(newTime);
    this.flowPlayer.pause();
}



/**
 * SeekAndPLay
 */
FlowPlayer.prototype.seekAndPlay = function(newTime)
{
    this.flowPlayer.seek(newTime);
    this.flowPlayer.resume();
}
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define GingaSettingsPlayer class. [WIP]
 */

/**
 * Player used for handle system properties node.
 * @constructor
 */
function GingaSettingsPlayer(p) {
    this.p = p;
    this.htmlPlayer = "#" + p.id;
    this.flowPlayer = undefined;
    console.log('GingaSettingsPlayer', p);
    
	p.createElement("<div class='player' id='" + p.id + "'></div>");	
	
	p.onChangeProperty = {};
	p.onChangeProperty.defaultAction = Player.propertyAction.OVERRIDE;
	p.onChangeProperty.propertyMap = {};
};

/**
 * setProperty
 */
GingaSettingsPlayer.prototype.setProperty = function(name, value) {
	this.p.systemSettings.presentation.notifyEvent({
		"type" : "settings",
		"event" : "set",
		"property" : name,
		"value" : value});
	
	switch(name) {
		case "service.currentFocus":
		case "service.currentKeyMaster":
		case "default.focusBorderColor":
		case "default.selBorderColor":
		case "default.focusBorderWidth":
		case "default.focusBorderTransparency": 
			this.p.systemSettings.setPropertyValue(name,value);
		default:
	}
	
	$(this.htmlPlayer).trigger("attribution.onEndAttribution",[name]);
}
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview Define Html5Player class. [WIP]
 */

/**
 * Default player for video, image, text/plain, text/html and text/htm.
 * @constructor
 */
function Html5Player(p) {
    this.p = p;
    this.popcornPlayer = undefined;
    this.htmlPlayer = "#" + p.id;
	this.loadTries = 1;

	// flags and callbacks for explicitDur treatment
	this.duration = undefined;
	this.durationBind = undefined;
	this.durationBinded = false;
	this.durationMap = {};
	this.endCallbacks = [];

	// property map
    p.onChangeProperty.propertyMap =
	{
		'soundLevel': Player.propertyAction.OVERLOAD,
		'fit': Player.propertyAction.OVERLOAD
	};
    // overloading we don't need to trigger onEndAttribution event
	
	// creates the media
    switch (p.source.type.split("/")[0]) {
		case "video": 
			// type = video/*
			p.createElement("<video class='player' id='" + p.id + "'></video>");
			document.getElementById(this.p.id).addEventListener('error',$.proxy(this.mediaNotFound,this),true);
			break;
		
		case "audio": 
			// type = audio/*
			p.createElement("<audio class='player' id='" + p.id+ "'></audio>");
			document.getElementById(this.p.id).addEventListener('error',$.proxy(this.mediaNotFound,this),true);
			break;
		
		case "image": 
			// type = image/*
			p.createElement("<img class='player' id='" + p.id + "'></img>");
			$(this.htmlPlayer).error($.proxy(this.mediaNotFound,this));
			break;
		
		case "application": 
			switch (p.source.type) {
				case "application/x-ginga-settings":
					// type = application/x-ginga-settings
					 p.createElement("<div class='player' id='" + p.id + "'></div>");
					break;
				case "application/x-ginga-NCLua":
					// type = application/x-ginga-NCLua
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "application/x-ginga-NCLet":
					// type = application/x-ginga-NCLet
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "application/x-ginga-time":
					// type = application/x-ginga-time
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
			}
			break;
		
		case "text": 
			switch (p.source.type) {
				case "text/plain":
				case "text/html":
					// type = text/plain, text/html
					p.createElement("<div class='player' id='" + p.id + "'></div>");
					break;
				case "text/css":
					// type = text/css
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
				case "text/xml":
					// type = text/xml
					Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"media",[p.source.type]);
					break;
			}
		break;
		
		case "dummy": {
			p.createElement("<img class='player' id='" + p.id + "'></img>");
			$(this.htmlPlayer).error($.proxy(this.mediaNotFound,this));
			break;	
		}
	}

	// creates the popcorn player
	if (p.checkType(["video","audio"]))
	{
		do {	
			this.popcornPlayer = new Popcorn(this.htmlPlayer);
		} while (!this.popcornPlayer);
	} else if(p.checkType(["image","text","dummy"])){
		do {
			Popcorn.player("baseplayer");
			this.popcornPlayer = new Popcorn.baseplayer(this.htmlPlayer);
		} while (!this.popcornPlayer);
	}

	/***** Areas *****/
	
	this.playing = false;
	this.playingArea = undefined;
	this.anchors = [];
	
	for (i in p.area) {
	
		var id = p.area[i].id;
		this.anchors[id] = p.area[i];
		
		// anchor type flags
		this.anchors[id].temporal = p.area[i].begin || p.area[i].end || p.area[i].first || p.area[i].last ? true : false;
		this.anchors[id].textual = p.area[i].beginText || p.area[i].endText || p.area[i].beginPosition || p.area[i].endPosition ? true : false;
		this.anchors[id].spatial = p.area[i].coords ? true : false;

		// temporal anchors
		if (this.anchors[id].temporal) {
			eval("this.exec(this.anchors[id].beginTime,$.proxy(function() {"+
				"$(this.htmlPlayer).trigger('presentation.onBegin',['"+id+"']);"+
			"},this));");
			eval("this.exec(this.anchors[id].endTime,$.proxy(function() {"+
				"this.stopArea('" + id + "');"+
			"},this));");
		}
		
		// spatial anchors
		if (this.anchors[id].spatial && !this.anchors[id]._ignore) {
			var coords = this.anchors[id].coords.split(',');
			// makes it ready to evaluate when the media starts, because
			// width and height are still undefined here
			for (i in coords) {
				var coord = coords[i].split('%');
				if (coord.length > 1) {
					coords[i] = 'Math.round(parseInt($(this.htmlPlayer).css("' + (i%2?'height':'width') + '").split("px")[0]) * ' + parseFloat(coord[0])/100 + ')';
				}
			}
			this.anchors[id].calculatedCoords = coords;
			// 'coords' is only supported by images
			if (!this.p.checkType(['image'])) {
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,'area',['coords',p.source.type]);
			}
		}
		
	}
	
	// When the media ends, we need to set every area to stopped
	this.exec('end',$.proxy(function() {
		for (i in this.anchors) {
			if (this.anchors[i].temporal)
				this.stopArea(i);
		}
	},this));

	/*****************/

    //p.enableKeyEvents();

	
}

//Html5Player.prototype.keyEventHandler = function(e)
//{
//   console.log(this.htmlPlayer,e.key,e);
//}

Html5Player.prototype.stopArea = function (nodeInterface) {
	if (this.anchors[nodeInterface].started) {
		this.anchors[nodeInterface].started = false;
		$(this.htmlPlayer).trigger('stop',[nodeInterface]);
	} else {
		$(this.htmlPlayer).trigger('presentation.onEnd',[nodeInterface]);
	}
}

/**
 * Called when the player needs to unload its sources
 * (Precedes calls to load, excepting the first call)
 */
Html5Player.prototype.unload = function()
{
	//erases older content
	$(this.htmlPlayer).empty();
};

/**
 * Callback for error events (media not found)
 */
 Html5Player.prototype.mediaNotFound = function() {
	this.loadTries--;
	if (this.loadTries <= 0) {
		Logger.warning(Logger.WARN_MEDIA_NOT_FOUND,this.p.id,[this.p.source.url]);
	}
};
 
/**
 * Called when the player need to load (or reload) it sources 
 * After the first time it's called, MediaPlayer.js will precede
 * every call to load() with a call to unload() 
 * 
 */
Html5Player.prototype.load = function (source) {
	
	this.p.source.url = source;
	this.loadTries = 1;
	
	// load a new content based on file type
	var type = this.p.source.type.split("/")[0];
	switch (type) {
	
		case "video":
		case "audio":
			// type = video/*, audio/*
			var ext = source.split('.');
			if (ext.length > 1) {
				// it has a file extension, so we should try other extensions
				ext = ext[ext.length-1];
				var filename = source.substr(0,source.lastIndexOf('.'));
				var exts = type=='video' ? ['webm','mp4','ogg'] : ['mp3','ogg'];
				// sorts the array so that the real file extension (ext) is moved to the first position
				exts.sort(function(a,b) {
					return b==ext;
				});
				this.loadTries = exts.length;
				for (i in exts) {
					$(this.htmlPlayer).append('<source type="'+type+'/'+exts[i]+'" src="'+filename+'.'+exts[i]+'"></source>');
				}
			} else {
				// no file extension, it could be an url, for example
				$(this.htmlPlayer).append('<source type="'+this.p.source.type+'" src="'+source+'"></source>');
			}
			break;
			
		case "image":
			// type = image/*
			$(this.htmlPlayer).attr("src",source);
			break;
		
		case "application":
			// type = application/*
			// não faz nada
            break;
		
		case "text":
			if (this.p.checkType(["text/plain","text/html"])) {
				// type = text/plain, text/html
				$.ajax({
					type: "GET",
					url: source,
					dataType: "text",
					success: $.proxy(function (data) {
						this.textData = data;
						this.loadTextData();
					},this),
					error: $.proxy(this.mediaNotFound,this)
				});
			}// else {
				// TODO
			//}
			break;
		
	}
    
};

/**
 * This function should be called to set function calls based on
 * the video progress in time 
 */
Html5Player.prototype.exec = function(time,callback)
{
	//This function can be called more than
	//once with the times 'begin' and 'end'.
	//This way, the handlbinder for these times
	//must set a new event listener for each
	//call
	
    //if popcornPlayer is defined then player type is in the list ['video','audio','image','text']
    if(this.popcornPlayer) {
		if (time == 'begin') {
			$(this.htmlPlayer).on('play',callback);
		} else if (time == 'end') {
			this.endCallbacks.push(callback);
			$(this.htmlPlayer).on('ended',callback);
		} else {
			this.popcornPlayer.cue(time,callback);
		}
	}
};

/**
 * Start
 */
Html5Player.prototype.start =  function (nodeInterface)
{
	var alreadyPlaying = false;
	
	/***** Areas *****/
	
	if (this.playingArea) {
		this.anchors[this.playingArea].started = false;
	}
	
	if (nodeInterface) {
	
		// temporal anchors
		if (this.anchors[nodeInterface].temporal) {
			this.anchors[nodeInterface].started = true;
			this.playingArea = nodeInterface;
			var t = this.anchors[nodeInterface].beginTime;
			if (t != 'begin' && !(t > this.getDuration()))
				this.seekAndPlay(t);
			else {
				if (t != 'begin') {
					Logger.warning(Logger.WARN_INVALID_AREA,'area',['begin','end']);
				}
				if (this.playing) {
					this.seek(0);
					alreadyPlaying = true;
				}
			}
		}
		
		// textual anchors
		if (this.anchors[nodeInterface].textual && this.p.checkType(['text'])) {
			this.textualAnchor = this.anchors[nodeInterface];
			if (this.textData) {
				this.loadTextData();
			}
		}
		
		// spatial anchors
		if (this.anchors[nodeInterface].spatial && !this.anchors[nodeInterface]._ignore && this.p.checkType(['image'])) {
			var clip = 'rect(' +
				eval(this.anchors[nodeInterface].calculatedCoords[1]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[2]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[3]) + 'px,' +
				eval(this.anchors[nodeInterface].calculatedCoords[0]) + 'px)';
			$(this.htmlPlayer).css('clip',clip);
		}
		
	} else {
		// no anchor defined
		this.playingArea = undefined;
		if (this.playing) {
			alreadyPlaying = true;
		}
	}
	
	// restores full text if no textual anchor defined
	if ((!nodeInterface || !this.anchors[nodeInterface].textual) && this.p.checkType(['text'])) {
		this.textualAnchor = undefined;
	}
	
	// restores full image if no spatial anchor defined
	if ((!nodeInterface || !this.anchors[nodeInterface].spatial) && this.p.checkType(['image'])) {
		$(this.htmlPlayer).css('clip','auto');
	}
	
	/*****************/
	
	// if it wasn't playing yet, do it
   if (!alreadyPlaying && this.popcornPlayer) {
		this.popcornPlayer.play();
		if (this.durationBind && !this.durationBinded && this.p.checkType(['image','text'])) {
			// Bind the explicitDur callback again
			eval(this.durationBind);
		}
    }
	
};

/**
 * Stop
 */
Html5Player.prototype.stop = function()
{
	this.playing = false;
    if (this.popcornPlayer) {
		this.popcornPlayer.pause(0);
    }
	if (this.p.checkType(['image','text'])) {
		this.durationBinded = false;
	}
	$(this.htmlPlayer).css('clip','auto');
};

/**
 * Pause
 */
Html5Player.prototype.pause = function()
{
	this.playing = false;
    if (this.popcornPlayer) {
		this.popcornPlayer.pause();
    }
};

/**
 * Resume
 */
Html5Player.prototype.resume = function()
{
	this.playing = true;
    if (this.popcornPlayer) {
		this.popcornPlayer.play();
    }
};




/**
 * Abort
 */
Html5Player.prototype.abort = function()
{
    this.stop();
};


/**
 * Seek
 */
Html5Player.prototype.seek = function(newTime)
{
    if (this.popcornPlayer) {
		try {
			this.popcornPlayer.currentTime(newTime);
		} catch(e) {
			eval("$(this.htmlPlayer).one('loadedmetadata',$.proxy(function() {"+
				"this.popcornPlayer.currentTime("+newTime+");"+
			"},this));");
		}
	}
};



/**
 * SeekAndPlay
 */
Html5Player.prototype.seekAndPlay = function(newTime)
{
    if (this.p.checkType(["video","audio"])) {
		try {
			this.popcornPlayer.currentTime(newTime);
		} catch(e) {
			eval("$(this.htmlPlayer).one('loadedmetadata',$.proxy(function() {"+
				"this.popcornPlayer.currentTime("+newTime+");"+
			"},this));");
		}
		$(this.htmlPlayer).one("seeked",$.proxy(function() {
			this.popcornPlayer.play();
		},this));
	} else if(this.p.checkType(["image","text"])) {
		this.popcornPlayer.currentTime(newTime);
	}
};


/**
 * setProperty
 */

Html5Player.prototype.stopCallback = function (t) {
	if (this.duration == t) {
		var i;
		for (i in this.endCallbacks) {
			this.endCallbacks[i]();
		}
	}
};

Html5Player.prototype.setProperty = function(name,value) {
    switch(name)
    {
		case 'explicitDur':
			this.duration = value;
			if (!this.durationMap[value]) {
				this.durationMap[value] = true;
				// For some reason, our baseplayer's cue method seems to work only once.
				// Every time it starts again, this callback needs to be binded again.
				this.durationBind = 'this.exec(' + value + ',$.proxy(function() {'+
				'this.stopCallback(' + value + ');'+
				'},this));';
				eval(this.durationBind);
				this.durationBinded = true;
			}
		break;

		case 'soundLevel':
			if (this.p.checkType(["video","audio"])) {
				this.popcornPlayer.volume(value);
			}       
		break;

		case "fontColor": 
				$(this.htmlPlayer).css("color",value);
				break;

		case "fontFamily": 
				$(this.htmlPlayer).css("font-family",value);
				break;

		case "fontStyle": 
				$(this.htmlPlayer).css("font-style",value);
				break;

		case "fontSize": 
				$(this.htmlPlayer).css("font-size",value);
				break;

		case "fontVariant": 
				$(this.htmlPlayer).css("font-variant",value);
				break;

		case "fontWeight": 
				$(this.htmlPlayer).css("font-weight",value);
				break;

		case "style": 
				// TODO: url de um arquivo css
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
				break;



		case 'fit':
			if (value=='meetBest') {
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
			}									
			var fit = {
				fill: 'fill',
				hidden: 'none',
				meet: 'contain',
				meetBest: 'scaleDown',
				slice: 'cover'
			};
	
			// TODO:
			// CSS3 property "object-fit" is currently supported by Opera only.
			// Uncomment the 3 lines below to make it work for IE, Firefox, Chrome
			// and Safari when they release a version that supports it.
			// Also, the CSS3 value 'scaleDown' ('meetBest' on NCL) for the 'fit' property is not supported yet.
			// Note: check if the property names (their prefixes) are correct on these browsers!
			console.log("Property 'fit' works only on Opera 10.6+");
	
			$(this.htmlPlayer).css('-o-object-fit',fit[value]);			// Opera
			//$(this.htmlPlayer).css('-webkit-object-fit',fit[value]);	// Chrome/Safari
			//$(this.htmlPlayer).css('-moz-object-fit',fit[value]);		// Firefox
			//$(this.htmlPlayer).css('object-fit',fit[value]);			// IE
		break;

    }
	
};

/**
 * getDuration
 */
Html5Player.prototype.getDuration = function() {
	if (this.duration && this.popcornPlayer.duration)
		return Math.min(this.duration,this.popcornPlayer.duration());
	else
		return this.duration || this.popcornPlayer.duration();
}

/**
 * loadTextData
 */
Html5Player.prototype.loadTextData = function() {
	var beginText='', endText='', beginPosition='', endPosition='';
	if (this.textualAnchor) {
		beginText = this.textualAnchor.beginText || '';
		endText = this.textualAnchor.endText || '';
		beginPosition = this.textualAnchor.beginPosition || 1;
		endPosition = this.textualAnchor.endPosition || 1;
	}
	var data = this.textData;

	if (beginText) {
		var bdata = data;
		data = data.split(beginText);
		if (data.length > beginPosition) {
			data = beginText + data.slice(beginPosition).join(beginText);
		} else {
			data = bdata;
			Logger.warning(Logger.WARN_INVALID_AREA,'area',['beginText','beginPosition']);
		}
	}
	
	if (endText) {
		var edata = data;
		data = data.split(endText);
		endPosition -= this.textData.split(endText).length - data.length;
		if (data.length > endPosition && endPosition > 0) {
			data = data.slice(0,endPosition).join(endText) + endText;
		} else {
			data = edata;
			Logger.warning(Logger.WARN_INVALID_AREA,'area',['endText','endPosition']);
		}
	}
	
	if (data) {
		if (this.p.checkType(['text/plain']) ) {
			$(this.htmlPlayer).append(data.replace(/\n/g,'<br/>'));
		} else {
			$(this.htmlPlayer).append(data);
		}
	}
}
/*
* Lince - Laboratory for Innovation on Computing and Engineering
* UFSCar - Universidade Federal de São Carlos
* São Carlos - SP, Brazil
* <http://lince.dc.ufscar.br>
* <http://webncl.org>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @fileoverview Define LuaPlayer class. [WIP]
 */

/**
 * Default player for video/flv. This is a Work in Progress. All players are
 * still handled by MediaPlayer.js
 *
 * @constructor
 */
function LuaPlayer(p) {

	this.p = p;
	this.htmlPlayer = "#" + p.id;
	this.luajscode = undefined;
	this.persitent = new libPersistent(false);
	this.http = new libHttp();
	this.canvas_objects = [];
	this.events = new libEvents(this);
    
    //instance of broker controller
	this.broker = new libBroker(this);
    
	this.id = 0;
	this.arrayUsers = [];
	this.isHandlingEvent = false;
	p.createElement("<div class='player' id='" + p.id + "'></div>");
	
	this.isRunning = false;
	this.p.onChangeProperty = {};
	this.p.onChangeProperty.defaultAction = Player.propertyAction.OVERRIDE;
  	this.p.onChangeProperty.propertyMap = {}
  	this.p.onChangeProperty.propertyMap['width'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['height'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['left'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['right'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['bottom'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['top'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['title'] = Player.propertyAction.IGNORE;
  	this.p.onChangeProperty.propertyMap['zIndex'] = Player.propertyAction.IGNORE;
  	
  	//path to load images correctly in .lua files
  	this.pathlua = '';
  		
	var tbl = document.createElement('table');
	tbl.setAttribute('id', 'myTable');
	tbl.setAttribute('class', 'panel');
	var tblBody = document.createElement('tbody');
	tbl.appendChild(tblBody);
	$('#content').append(tbl);
    p.enableKeyEvents();
    

	
	
};

/**
 * Called when the player needs to unload its sources (Precedes calls to unload,
 * excepting the first call)
 */
LuaPlayer.prototype.unload = function() {
	// erases older content
	$(this.htmlPlayer).empty();
}
/**
 * Called when the player need to load (or reload) it sources After the first
 * time it's called, MediaPlayer.js will precede every call to load() with a
 * call to unload()
 *
 */
LuaPlayer.prototype.load = function(source) {
	
	var breakPath = source.split('/');
	this.pathLua = "";
	for (i = 0; i < breakPath.length-1; i++) {
		this.pathLua = this.pathLua + breakPath[i] + '/'
	}
	
	$.ajax({
		type : "GET",
		url : source,
		dataType : "text",
		async : false,
		success : $.proxy(function(data) {
			data = 'canvas = libCanvas.init();\n' + data;
			this.luajscode = lua_load(data);
			

		}, this),
		error : function() {
			console.log('error to load file');
		}
	});

	this.bindlibs();

}
/**
 * This function should be called to set function calls based on the video
 * progress in time
 */
LuaPlayer.prototype.exec = function(time, callback) {
	//console.log('exec lua: ' + time);
}
/**
 * Start
 */
LuaPlayer.prototype.start = function(nodeInterface) {
	console.log('LuaPlayer.prototype.start', nodeInterface, this.isRunning);
	
	if (this.isRunning === false) {
		this.isRunning = true;
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'start';
		this.eventQueue(evt, true);

		lua_call(this.luajscode);

		if (this.events.handlers) {
			this.callHandlers();
		}
	}
	
	if (nodeInterface != undefined) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'start';
		evt.str['label'] = nodeInterface;
		this.eventQueue(evt);
	}

	
}
/**
 * Stop
 */
LuaPlayer.prototype.stop = function() {
	console.log('LuaPlayer.prototype.stop', this.isRunning);
	this.isRunning = false;

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'stop';
		this.eventQueue(evt);
	}
}
/**
 * Pause
 */
LuaPlayer.prototype.pause = function() {
	console.log('LuaPlayer.prototype.pause');

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'pause';
		this.eventQueue(evt);
	}
}
/**
 * Resume
 */
LuaPlayer.prototype.resume = function() {
	console.log('LuaPlayer.prototype.resume');

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'resume';
		this.eventQueue(evt);
	}
}
/**
 * Abort
 */
LuaPlayer.prototype.abort = function() {
	console.log('LuaPlayer.prototype.abort', this.isRunning);
	this.isRunning = false;

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'presentation';
		evt.str['action'] = 'abort';
		this.eventQueue(evt);
	}
}
/**
 * Seek
 */
LuaPlayer.prototype.seek = function(newTime) {
	
	this.eventQueue(evt);
}
/**
 * SeekAndPLay
 */
LuaPlayer.prototype.seekAndPlay = function(newTime) {

}

LuaPlayer.prototype.keyEventHandler = function(kevent){
	
	if(this.events.handlers){
		var evt = lua_newtable();
		evt.str['class'] = 'key';
		evt.str['type'] = kevent.type;
        evt.str['key']  = kevent.key.split('KEY_')[1] || kevent.key;
		this.eventQueue(evt);
	}	
	
}

LuaPlayer.prototype.setProperty = function(name, value) {
	console.log('LuaPlayer.prototype.setProperty', name, value)

	if (this.events.handlers) {
		var evt = lua_newtable();
		evt.str['class'] = 'ncl';
		evt.str['type'] = 'attribution';
		evt.str['action'] = 'start';
		evt.str['name'] = name;
		evt.str['value'] = value;
		this.eventQueue(evt);
	}
}



LuaPlayer.prototype.bindlibs = function() {

	lua_libs["libCanvas"] = {
		'variable' : {
			id : this.id,
			p : this.p,
			canvas_objects : this.canvas_objects,
			pathLua : this.pathLua
		}
	};

	lua_libs["libCanvas"]["init"] = $.proxy(function() {

		
		
		
		try {
			var canvas = document.createElement("canvas");
			canvas.id = "mycanvas_" + this.variable.id;
			canvas.width = this.variable.p.getProperty('width').split('px')[0];
			canvas.height = this.variable.p.getProperty('height').split('px')[0];
			$('#' + this.variable.p.id).append(canvas);

			var ctx = canvas.getContext("2d");

			var object = new libCanvas(ctx);
			
			this.variable.canvas_objects[this.variable.id] = object;

		} catch(err) {

			console.warn('region has to be defined');
		}

		

		var luaObject = lua_newtable();
		luaObject.str['id'] = this.variable.id; 


		

		luaObject.str['new'] = $.proxy(function(self, attr0, attr1) {

			var url;
			var w, h;

			if (attr1 === undefined) {
				url = attr0;

				objCanvas = this.variable.canvas_objects[self.str['id']];
				
				newObject = objCanvas.newImage(this.variable.pathLua + url);
				this.variable.id = this.variable.id + 1;
				this.variable.canvas_objects[this.variable.id] = newObject;
				var newLuaObjet = $.extend(true, {}, self);
				newLuaObjet.str['id'] = this.variable.id;

				return [newLuaObjet];

			} else {
				w = attr0;
				h = attr1;

				objCanvas = this.variable.canvas_objects[self.str['id']];
				newObject = objCanvas.newCanvas(w, h);
				this.variable.id = this.variable.id + 1;
				var newLuaObjet = $.extend(true, {}, self);

				newLuaObjet.str['id'] = this.variable.id;
				this.variable.canvas_objects[this.variable.id] = newObject;
				return [newLuaObjet];
			}

		}, this);

		luaObject.str['attrSize'] = $.proxy(function(self) {
			
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return [0,0];
			}
			
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			return objCanvas.attrSize();
		}, this);

		luaObject.str['attrColor'] = $.proxy(function(self, r, g, b, a) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(r === undefined & g === undefined & b === undefined & a === undefined)
				return [objCanvas.getColor()];
			
			else
				objCanvas.attrColor(r, g, b, a);

		}, this);

		luaObject.str['drawLine'] = $.proxy(function(self, x1, y1, x2, y2) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawLine(x1, y1, x2, y2);
		}, this);

		luaObject.str['drawRect'] = $.proxy(function(self, mode, x, y, w, h) {
			
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawRect(mode, x, y, w, h);
		}, this);

		luaObject.str['drawText'] = $.proxy(function(self, x, y, text) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.drawText(x, y, text);
		}, this);

		luaObject.str['measureText'] = $.proxy(function(self, text) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return [0,0];
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			return objCanvas.measureTextLua(text);
		}, this);

		luaObject.str['attrFont'] = $.proxy(function(self, face, size, style) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(face === undefined & size === undefined & style === undefined)
				return [objCanvas.getFont()];
			
			else
				objCanvas.attrText(face, size, style);
		}, this);

		luaObject.str['attrCrop'] = $.proxy(function(self, x, y, w, h) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(x === undefined & y === undefined & w === undefined & h === undefined)
				return [objCanvas.getCrop()];
			else
				objCanvas.attrCrop(x, y, w, h);
			
		}, this);

		luaObject.str['compose'] = $.proxy(function(self, x, y, img) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			var objImg = this.variable.canvas_objects[img.str['id']];
			objCanvas.compose(x, y, objImg); 			
			
		}, this);
		
		luaObject.str['flush'] = $.proxy(function(self) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			objCanvas.flush();
		}, this);
		

		luaObject.str['attrClip'] = $.proxy(function(self, x, y, w, h) {
			if (this.variable.canvas_objects.length == 0) {
				console.warn('This lua has no canvas.');
				return;
			}
			var objCanvas = this.variable.canvas_objects[self.str['id']];
			if(x === undefined & y === undefined & w === undefined & h === undefined)
				return [objCanvas.getClip()];
			else
				objCanvas.attrClip(x, y, w, h);
		}, this);
		
		return [luaObject];
				
	}, lua_libs["libCanvas"]);

	lua_libs["persistent"] = {
		"set" : $.proxy(function(prefix, key, value) {
			this.persitent.storeField(prefix, key, value);

		}, this),

		"get" : $.proxy(function(key) {
			return [this.persitent.recoverField(key)];
		}, this)
		
	};

	lua_libs["event"] = {
		"post" : $.proxy(function(mode,evnt) {
			this.events.post(mode,evnt);
		}, this),
		"register" : $.proxy(function(handler) {
			this.events.register(handler);
		}, this),
		"unregister" : $.proxy(function(handler) {
			this.events.unregister(handler);
		}, this),
		"timer" : $.proxy(function(timeout, fct) {
			this.events.timer(timeout, fct);
		}, this),
		"uptime" : $.proxy(function() {
			return [this.events.uptime()];
		}, this)
	}
	
	lua_libs["http"] = {
		"request" : $.proxy(function(param){
			return [this.http.request(param)];
		}, this)
	}

	lua_libs["broker"] = {
		"init" : $.proxy(function(strURI, fnOptCallback) {
			this.broker.init(strURI, fnOptCallback);
		},this),
		"post" : $.proxy(function(strDestination, strMessage) {
			this.broker.post(strDestination, strMessage);
		},this),
		"register" : $.proxy(function(strDestination, fnHandler) {
			this.broker.register(strDestination, fnHandler);
		},this),
		"unregister" : $.proxy(function(strDestination) {
			this.broker.unregister(strDestination);
		},this)
	}

}
//

LuaPlayer.prototype.callHandlers = function() {
	
	if (this.isHandlingEvent) {
		return;
	} else {
		this.isHandlingEvent = true;
		var evnt = this.arrayUsers.splice(0, 1);
		while (evnt.length >= 1) {

			for ( i = 0; i < this.events.handlers.length; i++) {
				if (this.events.handlers[i] === undefined) {

				} else {

					var obj = {
						handler : this.events.handlers[i],
						evnt : evnt[0]

					};

					setTimeout($.proxy(function() {
						this.handler(this.evnt);
					}, obj), 0);

				}
			}
			
			evnt = this.arrayUsers.splice(0, 1);
		}
		this.isHandlingEvent = false;

	}

}



LuaPlayer.prototype.eventQueue = function(evt, notcallhandlers){
	
	this.arrayUsers.push(evt);
	
	if (notcallhandlers == undefined) {
		this.callHandlers();
	}
	
	
}

//Functions to console lua
lua_core["print"] = function () {
  try {
  	
    console.log.apply(console, arguments);
    addCell(Array.prototype.slice.call(arguments));
    
   
  } catch (e) {
    // do nothing
  }
  return [];
};


function addCell(info){
	var tbl = document.getElementById('myTable');
	var row = tbl.insertRow(-1);
	var cell = row.insertCell(0);
	cell.innerHTML = info;
}

/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// TODO: Tratar sincronizacao das imagens e dos textos
//

MediaPlayer.prototype = new Player();

function MediaPlayer (node, parentContext) {

	this.region = "";
	this.type = "";
	this.htmlPlayerBkg = ""; 
    this.player = undefined;
    this.playerName = undefined;
    this.playerSettings = undefined;
	this.transIn = [];
	this.transOut = [];
	this.isVisible = true;
	this.isFocused = false;
    this.userKeyEvents = false;
	this.explicitDur = undefined;
	this.opacity = 1;	
	this.node = node;
	this.presentation = parentContext.presentation;
	this.parentContext = parentContext;
    this.divId =  this.presentation.getDivId(node.id);
	this.create(node);

}

//Class specific constants

MediaPlayer.prototype.colorValues = {
	'white': "255,255,255",
	'black': "0,0,0",
	'silver': "192,192,192",
	'gray': "128,128,128",
	'red': "255,0,0",
	'maroon': "128,0,0",
	'fuchsia': "255,0,255",
	'purple': "128,0,128",
	'lime': "0,255,0",
	'green': "0,128,0",
	'yellow': "255,255,0",
	'olive': "128,128,0",
	'blue': "0,0,255",
	'navy': "0,0,128",
	'aqua': "0,255,255",
	'teal': "0,128,128"
};

MediaPlayer.prototype.mediaTypes = {
	'htm': "text/htm",	'html': "text/html",	'txt': "text/plain",	'css': "text/css",	'xml': "text/xml",	'bmp': "image",	'png': "image",
	'gif': "image",		'jpg': "image",			'jpeg': "image",			'wav': "audio",		'mp3': "audio",		'mp2': "audio",	'mp4': "video",
	'mpg4': "video",		'mpeg': "video",			'mpg': "video",			'webm': "video",	'ogg': "audio"	, 'ogv': "video", 'flv': "video/x-flv", 
	'lua': "application/x-ginga-NCLua",		'class': "application/x-ginga-NCLet",		'jar': "application/x-ginga-NCLet"		
};



// checkType
MediaPlayer.prototype.checkType = function (typeList) {
	var thisType = this.type.split("/");
	for (var i in typeList) {
		var type = typeList[i].split("/");
		if (type[0]==thisType[0]) {
			if (!type[1] || (thisType[1] && type[1]==thisType[1])) {
				return true;
			}
		}
	}
	return false;
};

// createElement
// (used by user defined players to create their own html)
MediaPlayer.prototype.createElement = function(htmlText)
{
    $(this.htmlPlayerBkg).append(htmlText);
}

// enableKeyEvents
// This function should be used when 
MediaPlayer.prototype.enableKeyEvents = function( s )
{
    if(s === undefined || s)
    {
        var a = false;
        if(this.isPlaying)
            a = true;
        this.presentation.keyEvents[this.htmlPlayer] = a;


        if(!this.userKeyEvents)
        {
            this.userKeyEvents = true;
            $(this.htmlPlayer).on('selection.onSelection.user',
            {
                mplayer : this 
            },
            function(e)
            {

                //key was pressed
                if(e.which)
                {

                   var m = e.data.mplayer;

                   var evt = {
                        'class': 'key',
                        'type': 'press',
                        'key': m.presentation.reverseKeys[e.which]
                   };

                   m.player.keyEventHandler(evt); 
    
                }

                
            });
        }
    } else {
        delete this.presentation.keyEvents[this.htmlPlayer];
        $(this.htmlPlayer).off('selection.onSelection.user');
        this.userKeyEvents = false;
    }
}



// create
MediaPlayer.prototype.create = function (node) {
	// Cria as transições
	if (node.descriptor) {
		this.transIn = node.descriptor.transIn;
		this.transOut = node.descriptor.transOut;
		
		//Seta o valor de expliticDur
		this.explicitDur = node.descriptor.explicitDur;
	}
	// Verifica o tipo da mídia
	if (node.type) {
		this.type = node.type;
	} else {
		if (node.src) {
			var buffer = node.src.split(".");
			this.type = this.mediaTypes[buffer[buffer.length-1]];
		} else {
			this.type = "dummy";
		}
		
	}
	// Cria os IDs (região e mídia)
	this.htmlPlayer = "#" + this.divId;
	this.htmlPlayerBkg = "#" + this.presentation.getDivId(node.id,"bkg");
	if (this.type === 'application/x-ginga-settings') {
		this.region = "#" + this.presentation.settingsDiv;
	} else {
		this.region = "#" + this.presentation.playerDiv;
	}
	
//HACK_FOCUS (begin)
	if (this.type == 'application/x-ginga-settings') {
		if (this.presentation.settingsNode) {
			Logger.error(Logger.ERR_DUPLICATED_SETTINGS_NODE,'Settings Node',[node.id]);
			return;
		} else {
			this.presentation.settingsNode = this;
		}
	}
//HACK_FOCUS (end)

	// ----- REFER -----	
	if (node.refer && (node.instance!="new")) {
		return;
	} else {
		// -----------------
		// Creates media background div

		$(this.region).append("<div class='playerBkg' id='" + this.presentation.getDivId(node.id,"bkg") + "'></div>");

		// Creates media player

		this.playerSettings = {
			source: {
				type: this.type,
				url: this.presentation.path + node.src
			},
			onChangeProperty: {
				defaultAction: Player.propertyAction.IGNORE, //IGNORE,OVERRIDE,OVERLOAD
				//propertyMap has higher priority than defaultAction                                    
				propertyMap: {
					//'property': IGNORE,OVERRIDE,OVERLOAD
				}
				//when overrided, user should trigger onEndAttribution
				//using postEvent
			},
			id : this.divId,
			parentId: this.presentation.getDivId(node.id,"bkg"),
			createElement: $.proxy(this.createElement,this),
			checkType: $.proxy(this.checkType,this),
			getProperty: $.proxy(this.getProperty,this),
			setProperty: $.proxy(this.setProperty,this),
			postEvent: this.presentation.postEvent,
			systemSettings: this.presentation.systemSettings,
			enableKeyEvents: $.proxy(this.enableKeyEvents,this),
			area: node.area
		};
		
		var playerClass;
		var mediaPlayers = this.presentation.mediaPlayers;
		
		/*I'm assuming a precedence order for player definition: 
		 * descriptor < descriptorParam < media.property
		 */
		var playerName = undefined;
		if (node.descriptor && node.descriptor.player) {
			playerName = node.descriptor.player;
			
			for (i in node.descriptor.descriptorParam) {
				var descParam = node.descriptor.descriptorParam[i];
				if (descParam.name == 'player') {
					playerName = descParam.value;
					break;
				}
			}
		}
		for (i in node.property) {
			var property = node.property[i];
			if (property.name == 'player') {
				playerName = property.value;
				break;
			}
		}
		
		if (playerName) {
			if (eval('typeof '+ playerName)=='function' && eval('typeof '+playerName+'.prototype')=='object') {
				playerClass = eval(playerName);
			} else {
				Logger.error(Logger.WARN_MEDIAPLAYER_NOT_FOUND,'Descriptor Player',[playerName]);
				this.player = {};
			}
		}
		
		if (!playerClass && mediaPlayers[this.type]) {
			playerClass = mediaPlayers[this.type][node._ext] || mediaPlayers[this.type].defaultPlayer;
		}
		
		if (playerClass) {
			this.player = new playerClass(this.playerSettings);
			this.playerName = playerClass.name;
			// Creates templates for every method the players do not implement
			var methods = 'load unload exec start stop pause resume abort seek seekAndPlay setProperty getDuration keyEventHandler'.split(' ');
			for (var i in methods) {
				if (!this.player[methods[i]]) {
					this.player[methods[i]] = $.proxy(function() {
						Logger.warning(Logger.ERR_MEDIAPLAYER_METHOD_NOTFOUND,this.playerName,[this.fname]);
					}, {playerName: this.playerName, fname: methods[i]});
				}
			}
		} else {
			Logger.error(Logger.ERR_MEDIAPLAYER_NOPLAYER,this.type,[]);
			this.player = {};
		}

		$(this.htmlPlayerBkg).css("display","none");

		this.load(node.src);

		this.data = $(this.htmlPlayer).data();

		//if player supports area
		if(this.player.exec)
		{
			//onEnd trigger
			this.player.exec('end',$.proxy(function() {

				if (!this.player.playingArea) {
					this.stop();
				} else {
					$(this.htmlPlayer).trigger('presentation.onEnd');
					this.player.playingArea = undefined;
				}
			},this));
		}
	// ---- REFER ----
	}
	// ---------------

	// Cria as propriedades
	$(this.htmlPlayer).data("property",[]);
	if (node.descriptor) {
		if (node.descriptor.explicitDur)
			this.setProperty("explicitDur",node.descriptor.explicitDur);
		if (node.descriptor.region) {
			// Propriedades da tag <region> (atributos)
			this.setProperty("zIndex",node.descriptor.region.zIndex);
			this.setProperty("width",node.descriptor.region.width);
			this.setProperty("height",node.descriptor.region.height);
			this.setProperty("bottom",node.descriptor.region.bottom);
			this.setProperty("top",node.descriptor.region.top);
			this.setProperty("right",node.descriptor.region.right);
			this.setProperty("left",node.descriptor.region.left);
			this.setProperty("title",node.descriptor.region.title);
		}
		for (i in node.descriptor.descriptorParam) {
			// Propriedades da tag <descriptor> (descriptorParam)
			this.setProperty(node.descriptor.descriptorParam[i].name,node.descriptor.descriptorParam[i].value);
		}
	}
	
	/* --- Property tags (under <media>) treatment --- */

	var boundsProperties = [];
	for(i in node.property)
	{
		if(node.property[i].value){
			switch(node.property[i].name){ 
				case "bounds":
				case "top":
				case "left":
				case "bottom":
				case "right": 
				case "height":
				case "width": {
					//save in boundProperties for later use
					boundsProperties.push({
						name: node.property[i].name, 
						value: node.property[i].value
					});
					break;
				}
				default:
					//set other properties
					this.setProperty(node.property[i].name,node.property[i].value);
			}
		}
		
	}
	// if there is at least one bound property, there is a lot of work to do
	if(boundsProperties.length > 0) {
		
		// Preparing to recalculate positions and size due to the presence of property tags of these type.
		
		// Create structures to pass as arguments to the fixRegionBounds function
		var parentBounds = {
			left: 0,
			top: 0,
			width: parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]),
			height: parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0])
		};
		var regionBounds = {
			left: null,
			right: null,
			top: null,
			bottom: null,
			width: null,
			height: null
		};
		
		// Set initial values as found on region and region._parent
		if(this.node.descriptor && this.node.descriptor.region) {
				parentBounds.left = (this.node.descriptor.region._parent.left) ? parseInt(this.node.descriptor.region._parent.left.split("px")[0]) : 0;
				parentBounds.top = (this.node.descriptor.region._parent.top) ? parseInt(this.node.descriptor.region._parent.top.split("px")[0]) : 0;				
				parentBounds.width = (this.node.descriptor.region._parent.width) ? parseInt(this.node.descriptor.region._parent.width.split("px")[0]) : parseInt($("#"+this.presentation.playerDiv).css("width").split("px")[0]);
				parentBounds.height = (this.node.descriptor.region._parent.height) ? parseInt(this.node.descriptor.region._parent.height.split("px")[0]) : parseInt($("#"+this.presentation.playerDiv).css("height").split("px")[0]);		
				
				// In this case, the region is already fixed, so we should get the relative value for left and top as initial values, so we can fix the bounds again
				regionBounds.left = (this.node.descriptor.region.left.split("px")[0] - parentBounds.left).toString();
				regionBounds.top = (this.node.descriptor.region.top.split("px")[0] - parentBounds.top).toString();
				regionBounds.width = this.node.descriptor.region.width,
				regionBounds.height = this.node.descriptor.region.height
				
		}
		// Overwrite the regionBounds structure with values found in the property tags
		for (i in boundsProperties) {
			var name = boundsProperties[i].name;
			var value = boundsProperties[i].value;
			switch(name){ 
				case "bounds": {
					var bounds = value.split(",");
					regionBounds.left = bounds[0];
					regionBounds.top = bounds[1];
					regionBounds.width = bounds[2];
					regionBounds.height = bounds[3];
					break;
				}
				case "top":
				case "left":
				case "bottom":
				case "right": 
				case "height":
				case "width": {
					regionBounds[name] = value;
					break;
				}
			}
		}
		// Call the same function that is called in the begining for checking region attributes
		WebNclPlayer.prototype.fixRegionBounds(regionBounds,parentBounds);
		
		// Finally, call the setProperty function for each property
		for(name in regionBounds)
		{
			value=regionBounds[name];
			if(value && value!=null){
				this.setProperty(name, value);
			}
		}
	
	}
	/* ----------------------------------------------- */
	
	// when the media ends, MediaPlayer.stop() needs to be called
	this.player.exec('end',$.proxy(function() {
		if (!this.player.playingArea) {
			this.stop();
		} else {
			$(this.htmlPlayer).trigger('presentation.onEnd');
			this.player.playingArea = undefined;
		}
	},this));
	
	// Bind events
	this.bindEvents();
	// Saves the media player using jQuery data function
	$(this.htmlPlayer).data("player",this);
};

// load
MediaPlayer.prototype.load = function (source) {

	// Recalculates the url based on presentation path
	source = this.presentation.path + source;

	this.player.unload(source);
	this.player.load(source);

};

// focus
MediaPlayer.prototype.focus = function () {
	if (!this.isFocused) {
		this.isFocused = true;
		if (this.node.descriptor) {
			var borderWidth = parseInt(this.node.descriptor.focusBorderWidth || this.presentation.systemSettings.getPropertyValue("default.focusBorderWidth"));
			if (borderWidth > 0) {
				var color = this.node.descriptor.focusBorderColor || this.presentation.systemSettings.getPropertyValue("default.focusBorderColor");
				var alpha = 1 - parseInt(this.node.descriptor.focusBorderTransparency || 0);
				var rgbColor = this.colorValues[color] || color;
				var border = borderWidth + "px solid rgba(" + rgbColor + "," + alpha + ")";
				$(this.htmlPlayerBkg).css("left","-="+borderWidth);
				$(this.htmlPlayerBkg).css("top","-="+borderWidth);
				$(this.htmlPlayerBkg).css("border",border);
			} else if (borderWidth < 0) {
				// TODO
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"border",[borderWidth]);
			}
			if (this.node.descriptor && this.node.descriptor.focusSrc) {
				this.load(this.node.descriptor.focusSrc);
			}
		}
	}
};

// blur
MediaPlayer.prototype.blur = function () {
	this.isFocused = false;
	$(this.htmlPlayerBkg).css("left",$(this.htmlPlayer).data("property").left);
	$(this.htmlPlayerBkg).css("top",$(this.htmlPlayer).data("property").top);
	$(this.htmlPlayerBkg).css("width",$(this.htmlPlayer).data("property").width);
	$(this.htmlPlayerBkg).css("height",$(this.htmlPlayer).data("property").height);
	$(this.htmlPlayerBkg).css("border","none");
	if (this.node.descriptor && this.node.descriptor.focusSrc) {
		this.load(this.node.src);
	}
};

// selection
MediaPlayer.prototype.selection = function () {
	if (this.node.descriptor) {
		var callback;
		var color = this.node.descriptor.selBorderColor || this.presentation.systemSettings.getPropertyValue("default.selBorderColor");
		$(this.htmlPlayer).css("border-color",color);
		callback = "var p=$('"+this.htmlPlayer+"').data('player'); if (p.isFocused) p.focus(); else p.blur();"
		if (this.node.descriptor.focusSelSrc) {
			this.load(this.node.descriptor.focusSelSrc);
			if (!this.node.descriptor.focusSrc) {
				callback += "$('"+this.htmlPlayer+"').data('player').load('"+this.node.src+"');";
			}
		}
		setTimeout(callback,200);
	}
};

// applyTransition
MediaPlayer.prototype.applyTransition = function (transition, flagInOut) {
	var duration = transition.dur ? parseFloat(transition.dur.split("s")[0])*1000 : 1000;
	var cssBegin={}, cssEnd={}, target="";
	switch (transition.type) {
		case "fade": {
			// fade
			transition.subtype = transition.subtype || "crossfade";
			target = this.htmlPlayer;
			cssBegin.opacity = transition.startProgress || 0;
			cssEnd.opacity = transition.endProgress || 1;
			if (transition.subtype=="fadeToColor" || transition.subtype=="fadeFromColor") {
				$(this.htmlPlayerBkg).css("background-color",transition.fadeColor||"black");
				if (transition.subtype=="fadeToColor") {
					flagInOut = "out";
				} else {
					flagInOut = "in";
				}
			}
			if (flagInOut=="out") {
				var aux = cssBegin.opacity;
				cssBegin.opacity = cssEnd.opacity;
				cssEnd.opacity = aux;
			}
			this.opacity = cssEnd.opacity;
			break;
		}
		case "barWipe": {
			// barWipe
			transition.subtype = transition.subtype || "leftToRight";
			target = this.htmlPlayerBkg;
			var reverse = (transition.direction=="reverse"?1:0) + (flagInOut=="out"?1:0) == 1;
			switch (transition.subtype) {
				case "leftToRight": {
					cssBegin.width = "0px";
					cssEnd.width = $(this.htmlPlayer).css("width");
					if (reverse) {
						cssBegin.left = (parseInt($(this.htmlPlayer).css("left").split("px")[0]) + parseInt($(this.htmlPlayer).css("width").split("px")[0])) + "px";
						cssEnd.left = $(this.htmlPlayer).css("left");
					}
					break;
				}
				case "topToBottom": {
					cssBegin.height = "0px";
					cssEnd.height = $(this.htmlPlayer).css("height");
					if (reverse) {
						cssBegin.top = (parseInt($(this.htmlPlayer).css("top").split("px")[0]) + parseInt($(this.htmlPlayer).css("height").split("px")[0])) + "px";
						cssEnd.top = $(this.htmlPlayer).css("top");
					}
					break;
				}
			}
			if (flagInOut=="out") {
				var aux;
				for (i in cssBegin) {
					aux = cssBegin[i];
					cssBegin[i] = cssEnd[i];
					cssEnd[i] = aux;
				}
			}
			break;
		}
		case "irisWipe": {
			// irisWipe
			transition.subtype = transition.subtype || "rectangle";
			target = this.htmlPlayerBkg;
			if (transition.subtype == "rectangle") {
				var left = parseInt($(this.htmlPlayer).css("left").split("px")[0]);
				var top = parseInt($(this.htmlPlayer).css("top").split("px")[0]);
				var width = parseInt($(this.htmlPlayer).css("width").split("px")[0]);
				var height = parseInt($(this.htmlPlayer).css("height").split("px")[0]);
				cssBegin.width = "0px";
				cssBegin.height = "0px";
				cssBegin.left = (left+(width/2)) + "px";
				cssBegin.top = (top+(height/2)) + "px";
				cssEnd.width = width + "px";
				cssEnd.height = height + "px";
				cssEnd.left = left + "px";
				cssEnd.top = top + "px";
				if (flagInOut=="out") {
					var aux;
					for (i in cssBegin) {
						aux = cssBegin[i];
						cssBegin[i] = cssEnd[i];
						cssEnd[i] = aux;
					}
				}
			} else {
				// diamond
				// TODO
				Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type,transition.subtype]);
			}
			break;
		}
		case "snakeWipe":
		case "clockWipe": {
			// snakeWipe, clockWipe
			// TODO
			Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"transition",[transition.type]);
			break;
		}
	}
	$(target).css(cssBegin);
	$(target).animate(cssEnd,duration);
	$(target).dequeue();
}

// show
MediaPlayer.prototype.show = function () {
	if (this.isVisible) {
		// TODO: múltiplas transições (transIn e transOut podem receber vários IDs separados por ponto e vírgula)
		// (retirar a gambiarra abaixo, que foi feita para transformar uma transição em um vetor com uma transição)
		if (this.transIn && this.transIn._type) this.transIn = [this.transIn];
		if (this.transOut && this.transOut._type) this.transOut = [this.transOut];
		// ---
		for (i in this.transIn) {
			this.applyTransition(this.transIn[i],"in");
		}
		$(this.htmlPlayerBkg).css("display","inline");
		$(this.htmlPlayer).css("opacity",this.opacity);
	}
};

// hide
MediaPlayer.prototype.hide = function () {
	for (i in this.transOut) {
		this.applyTransition(this.transOut[i],"out");
	}
	$(this.htmlPlayerBkg).css("display","none");
};

// start
MediaPlayer.prototype.start = function (nodeInterface) {

	// TODO:
	// This is a quick fix to make the getDuration method and the area interval tests work,
	// since they can only be called when the 'loadedmetadata' event is triggered.
	// Note that it works only with a Html5Player playing videos.
	// As soon as the synchronization issue is solved, this code should be removed!
	// --- quick fix begins here
	if (this.playerName == 'Html5Player' && this.player.p.checkType(['video'])) {
		if (!this.ready) {
			if (this.player.popcornPlayer.readyState() < 1) {
				this.nodeInterface = nodeInterface;
				this.ready = true;
				this.player.popcornPlayer.on('loadedmetadata',$.proxy(function() {
					this.start();
				},this));
				return;
			}
		} else {
			nodeInterface = this.nodeInterface;
			this.ready = false;
		}
	}
	// --- quick fix ends here
	this.player.start(nodeInterface);
	
	if (this.isStopped) {		
        this.presentation.inputManager.enableKeys(this.htmlPlayer);
        if (this.focusIndex) {
        	this.presentation.inputManager.addMedia(this.focusIndex,this.htmlPlayer);
        } else if(this.node.descriptor && this.node.descriptor.focusIndex){
			this.presentation.inputManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = true;
		this.isStopped = false;
		this.show();
	}
	this.notifyEvent("start", nodeInterface);
	this.trigger("presentation.onBegin",[nodeInterface]);
	
};

// stop
MediaPlayer.prototype.stop = function (nodeInterface) {
	
	this.presentation.notifyEvent("stop", nodeInterface);
	
	if (!this.isStopped) {
        this.presentation.inputManager.disableKeys(this.htmlPlayer);
        if (this.focusIndex) {
        	this.presentation.inputManager.removeMedia(this.focusIndex,this.htmlPlayer);
        } else if(this.node.descriptor && this.node.descriptor.focusIndex){
			this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
		this.player.stop();
		//notify parentContext of its action

		this.notifyEvent("stop", nodeInterface);
		this.trigger("presentation.onEnd",[nodeInterface]);

	}
};

// pause
MediaPlayer.prototype.pause = function (nodeInterface) {
	
	if (this.isPlaying) {
		this.isPlaying = false;
		this.isStopped = false;
		this.presentation.inputManager.disableKeys(this.htmlPlayer);
		this.player.pause()
		//notify parentContext of its action
		
		this.notifyEvent("pause", nodeInterface);
		this.trigger("presentation.onPause",[nodeInterface]);

	}
};

// resume
MediaPlayer.prototype.resume = function (nodeInterface) {
	
	if (!this.isStopped && !this.isPlaying) {
		this.isPlaying = true;
		this.isStopped = false;
		this.presentation.inputManager.enableKeys(this.htmlPlayer);
		this.player.resume();        
		//notify parentContext of its action
		
		this.notifyEvent("resume", nodeInterface);
		this.trigger("presentation.onResume",[nodeInterface]);

	}
};

// abort
MediaPlayer.prototype.abort = function (nodeInterface) {
		
	if (!this.isStopped) {
		this.presentation.inputManager.disableKeys(this.htmlPlayer);
        if (this.focusIndex) {
        	this.presentation.inputManager.removeMedia(this.focusIndex,this.htmlPlayer);
        } else if(this.node.descriptor && this.node.descriptor.focusIndex){
			this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
		}
		this.isPlaying = false;
		this.isStopped = true;
		this.hide();
        this.player.abort();
        
        this.notifyEvent("abort", nodeInterface);
		this.trigger("presentation.onAbort",[nodeInterface]);

	}
};

// seek
MediaPlayer.prototype.seek = function (newTime) {
	this.player.seek(newTime);
};

// seekAndPlay
MediaPlayer.prototype.seekAndPlay = function (newTime) {
	this.player.seekAndPlay(newTime);
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Player () {

	this.create = function() {};
	this.start = function() {};
	this.stop = function() {};
	this.pause = function() {};
	this.resume = function() {};
	this.abort = function() {};
	this.seekAndPlay = function() {};
	this.selection = function() {};
	this.data = undefined;
	this.htmlPlayer = "";
	this.isPlaying = false;
	this.isStopped = true;
	this.focusIndex = undefined

}


// constants
Player.propertyAction =
{
    IGNORE:0,
    OVERRIDE:1,
    OVERLOAD:2
};

// notify new action
// args should be an array
Player.prototype.trigger = function(event,args)
{
	//control parent context lists
	var b;
	switch(event)
	{
		case 'presentation.onBegin':
		case 'presentation.onResume':		
			if ($.inArray(this,this.parentContext.playingElem) < 0) {
				this.parentContext.playingElem.push(this);
			}
			
			b = $.inArray(this,this.parentContext.pausedElem);
			if(b > -1)
				this.parentContext.pausedElem.splice(b,1);	
		break;

		case 'presentation.onPause':
			this.parentContext.pausedElem.push(this);
						
			b = $.inArray(this,this.parentContext.playingElem);
			if(b > -1)
				this.parentContext.playingElem.splice(b,1);		
		break;


		case 'presentation.onEnd':
		case 'presentation.onAbort':
			b = $.inArray(this,this.parentContext.playingElem);
			if(b > -1)
				this.parentContext.playingElem.splice(b,1);	
			else
			{
				b = $.inArray(this,this.parentContext.pausedElem);
				if(b > -1)
					this.parentContext.pausedElem.splice(b,1);					
			}
			

		break;

	}
	 
	if(event === 'presentation.onAbort')
		this.parentContext.lastMediaAborted = true;
	else
		this.parentContext.lastMediaAborted = false;
	
	var callback = false;

	//if there is an event handler defined for this player than no callbacks are necessary
	/*if(this.data[event])
	{
		//if this player is a port than ports triggers are processed before
		//context inner links. This way attaching it only here will be enough
		callback = true;
		args.push($.proxy(this.__ecallback,this));
	}*/
	
	$(this.htmlPlayer).trigger(event,args);
	
	
	//if no events are being raised
	if(!callback)
		this.parentContext.notifyLink(0, event);
	
}

// callback used  for function above
Player.prototype.__ecallback = function(event)
{
	this.parentContext.notifyLink(0, event);
}

// bindEvents
Player.prototype.bindEvents = function () {
	$(this.htmlPlayer).on("start",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.data.player.start(nodeInterface);
			if (callback) {
				callback(args);
			}

		}
		
	});
	
	$(this.htmlPlayer).on("stop",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.data.player.stop(nodeInterface);
			if (callback) {
				callback(args);
			}

		}
		
	});
	$(this.htmlPlayer).on("pause",{
			player : this
		},function(event,nodeInterface,callback,args) {
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.pause(nodeInterface);
				if (callback) {
					callback(args);
				}				
			}

		
	});
	$(this.htmlPlayer).on("resume",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.resume(nodeInterface);
				if (callback) {
					callback(args);
				}

			}
		
	});
	
	$(this.htmlPlayer).on("abort",{
			player : this
		},function(event,nodeInterface,callback,args) {
		
			//if not triggered by jQuery
			if(!event.originalEvent)
			{
				event.data.player.abort(nodeInterface);
				if (callback) {
					callback(args);
				}

			}
		
	});
	$(this.htmlPlayer).on("set",
	{
		player: this
	},
	function(event,nodeInterface,callback,args,value) {
		//if not triggered by jQuery
		if(!event.originalEvent)
		{
			event.stopPropagation();
			var player = event.data.player;
			switch(nodeInterface){
				// On dynamic repositioning, the % value for position is calculated based on the media's current dimension.
					// (top/bottom values are calculated based on the current height value and left/right values are calculated based on the current width value).
				case "top":
				case "bottom":
				case "height": 
						value = player.calculatePercentageValue("height", value);
						player.setProperty(nodeInterface,value);
						break;

				case "left":
				case "right": 
				case "width": 
						value = player.calculatePercentageValue("width", value);
						player.setProperty(nodeInterface,value);
						break;

				case "bounds": 
						var bounds = value.split(",");
						player.setProperty("left", player.calculatePercentageValue("width",bounds[0]));
						player.setProperty("top", player.calculatePercentageValue("height",bounds[1]));
						player.setProperty("width", player.calculatePercentageValue("width",bounds[2]));
						player.setProperty("height", player.calculatePercentageValue("height",bounds[3]));
						break;

				default: 
						player.setProperty(nodeInterface,value);
			}
			if (callback) {
				callback(args);
			}
		}
	});
	
	$(this.htmlPlayer).on("focus",
	{ player : this},
	function(e) {
//		if(this == e.target)
			e.data.player.focus();
	});
	
	$(this.htmlPlayer).on("blur",
	{ player : this},
	function(e) {
//		if(this == e.target)		
			e.data.player.blur();
	});
	$(this.htmlPlayer).on("selection.onSelection",
	{ player : this},
	function(e) {
//		if(this == e.target)		
			e.data.player.selection();
	});

};

// function to get the current value of a property from css and to return its absolute value, given a % value.
Player.prototype.calculatePercentageValue = function(propertyName, value){
	var buffer = value.toString().split("%");
	if (buffer.length > 1) {
			var currentValue = $(this.htmlPlayerBkg).css(propertyName);
			value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
	}
	return value;
};

// getProperty
Player.prototype.getProperty = function(name)
{
	//tries to get a system property
	var v = this.presentation.systemSettings.getPropertyValue(name);

	if(v)
	{
		return v;
	} else {
		var p = $(this.htmlPlayer).data("property");
		
		//can return undefined
		return p[name];
	}

};

Player.prototype.notifyEvent = function (event, nodeInterface) {
	this.presentation.notifyEvent(
			{"type" : "node",
			 "nodeId" : this.node.id,
			 "event" : event,
			 "interfaceId" : nodeInterface});
}

// setProperty
Player.prototype.setProperty = function (name, value, ignoreEvents) {
	
	this.presentation.notifyEvent({
		"type" : "node",
		"event" : "set",
		"nodeId" : this.node.id,
		"property" : name,
		"value" : value});
    
	if (!ignoreEvents) {
		// TODO: verify events
		$(this.htmlPlayer).trigger("attribution.onBeginAttribution",[name]);
	}

    //save property data
	var property = $(this.htmlPlayer).data("property");
	property[name] = value ? value : "";
	$(this.htmlPlayer).data("property",property);

	if (!ignoreEvents) {
		//handle user defined player
		var p = this.playerSettings.onChangeProperty || undefined;
		var p_action = Player.propertyAction.IGNORE;
		if(p)
			p_action = (p.propertyMap[name] != undefined) ? p.propertyMap[name] : p.defaultAction;

		//if media player does not override default property set function (or if media
		//player doesn't define information related to property 'name')
			
		//as Player.propertyAction.IGNORE = 0
		//its ok to test p_action
	}

	if(!p_action || p_action == Player.propertyAction.OVERLOAD) {
            
		if (value != null) {

			switch (name) {
					// POSITION/DIMENSION

					case "top":
					case "left":
					case "bottom":
					case "right": 
						var buffer=value.toString().split("%");
						if (buffer.length > 1)
							console.warn("Warning: Percentage position value was passed to 'setProperty' function. The value is being ignored.");
						else{
							if(name=="right")
								$(this.htmlPlayerBkg).css("left","auto");
							if(name=="bottom")
								$(this.htmlPlayerBkg).css("top","auto");									
							$(this.htmlPlayerBkg).css(name,value);
						}
						break;
					
					case "height":
					case "width": 
						var buffer = value.toString().split("%");
						if (buffer.length > 1) {
								console.warn("Warning: Percentage size value being calculated in 'setProperty' function.");
								var currentValue = $(this.htmlPlayerBkg).css(name);
								value = parseInt(parseInt(currentValue)*parseFloat(buffer[0])/100);
						}
						$(this.htmlPlayer).css(name,value);
						$(this.htmlPlayerBkg).css(name,value);
						break;
					
					case "zIndex": 
						$(this.htmlPlayer).css("z-index",value)
						$(this.htmlPlayerBkg).css("z-index",value)
						break;
					
					// FocusIndex 
					case "focusIndex":
						this.focusIndex = value;
						break;
					

					// SOUND

					case "soundLevel":
						var buffer = value.split("%");
							if (buffer.length > 1) {
								value = buffer[0] / 100;
							}

						break;
					
					case "balanceLevel":
					case "bassLevel":
					case "trebleLevel": 
						var buffer = value.split("%");
						if (buffer.length > 1) {
								value = buffer[0] / 100;
						}
						// TODO (0.0-1.0)
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
						break;
					
					// VISIBILITY

					case "background": 
						$(this.htmlPlayerBkg).css("background-color",value);
						break;
					
					case "transparency": 
						var buffer = value.split("%");
						if (buffer.length > 1) {
								value = parseInt(buffer[0]) / 100;
						} else {
								value = parseFloat(buffer[0]);
						}
						this.opacity = 1 - value;
						$(this.htmlPlayer).css("opacity",this.opacity);
						break;

					case "visible": 
						this.isVisible = value==="true"?true:false;

						if (this.isVisible) {
								if(this.node.descriptor){
										this.presentation.inputManager.addMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
								}
								$(this.htmlPlayerBkg).css("display","inline");
						} else {
								if(this.node.descriptor){
										this.presentation.inputManager.removeMedia(this.node.descriptor.focusIndex,this.htmlPlayer);
								}
								$(this.htmlPlayerBkg).css("display","none");
						}
						break;
					
					case "scroll": 
						// TODO: ver norma (p.44)
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"setProperty",[name]);
						break;

					case "explicitDur": 
						if (!p_action)
							this.player.setProperty(name,value);
						break;
					
					case "baseDeviceRegion":
					case "deviceClass":
					case "plan":
					//case "player": //Not possible to change player during presentation yet
					case "playerLife":		// keep/close
					case "reusePlayer": 	// true/false
						// TODO
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
						break;					

					// TRANSITION

					case "transInBorderColor":
					case "transInBorderWidth":
					case "transInDirection":
					case "transInDur":
					case "transInEndProgress":
					case "transInFadeColor":
					case "transInHorRepeat":
					case "transInStartProgress":
					case "transInSubtype":
					case "transInType":
					case "transInVertRepeat":
					case "transBorderColor":
					case "transOutBorderWidth":
					case "transOutDirection":
					case "transOutDur":
					case "transOutEndProgress":
					case "transOutFadeColor":
					case "transOutHorRepeat":
					case "transOutType":
					case "transOutStartProgress":
					case "transOutSubtype":
					case "transOutVertRepeat":
						// TODO
						Logger.warning(Logger.WARN_NOT_IMPLEMENTED_YET,"property",[name]);
						break;
					

					// SETTINGS

					/*case "service.currentFocus":
					case "default.focusBorderColor":
					case "default.selBorderColor":
					case "default.focusBorderWidth":
					case "default.focusBorderTransparency": 
						if (this.checkType(["application"])) {
							this.presentation.systemSettings.setPropertyValue(name,value);
						}
					break;*/
				
			}


			if (!ignoreEvents) {
			
				//user defined 
				if (p_action == Player.propertyAction.OVERLOAD) {
					this.player.setProperty(name,value);
				}
			
				//onEndAttribution is triggered automatically 
				$(this.htmlPlayer).trigger("attribution.onEndAttribution",[name]);
			}
			
		}
	} else if (!ignoreEvents) {
			//override case
			this.player.setProperty(name,value);
	}
        
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseArea = function (obj,tag,parent,tree) {

	// begin, end
	
	attrs = ["begin","end"]; 
	values = ["(número real)s","HH:MM:SS"];
	patt1 = /^(\d+|\d*\.\d+)s$/;
	patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
	// 'attrs' array is used to parse both 'begin' and 'end' in a loop, since they are very similar:
	// 1. validates 'begin' and 'end' properties
	// 2. creates 'beginTime' and 'endTime' properties, which are used by MediaPlayer
	for (i in attrs) {
		var attr = attrs[i];
		obj[attr+'Time'] = ''; // beginTime and endTime
		if (obj[attr] != null) {
			// format: 0=invalid, 1='real number', 2='HH:MM:SS'
			var format = patt1.test(obj[attr]) ? 1 : (patt2.test(obj[attr]) ? 2 : 0);
			if (format == 0) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,obj[attr],values]);
				obj[attr+'Time'] = attr;
			} else {
				if (format == 1) {
					// removes the 's' from the end of the string
					obj[attr+'Time'] = parseFloat(obj[attr].split('s')[0]);
				} else {
					// calculates the number of seconds from the 'HH:MM:SS' format
					var arr = obj[attr].split(':');
					var h = parseFloat(arr[0]);
					var m = parseFloat(arr[1]);
					var s = parseFloat(arr[2]);
					if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
						Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,obj[attr],values]);
						obj[attr+'Time'] = attr;
					} else {
						obj[attr+'Time'] = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
					}
				}
			}
		} else {
			// beginTime='begin' means that the area has no 'begin' property, so the area starts at the beginning of the media
			// endTime='end' means that the area has no 'end' property, so the area ends at the end of the media
			obj[attr+'Time'] = attr;
		}
	}
	// if begin>=end, the area is considered the whole media
	if (obj.begin!=null && obj.end!=null && obj.beginTime>=obj.endTime) {
		Logger.warning(Logger.WARN_INVALID_AREA,tag,["begin","end"]);
		obj.beginTime = 'begin';
		obj.endTime = 'end';
	}
	
	// first, last, beginPosition, endPosition
	
	values = ["(número inteiro)"];
	patt = /^\d+$/;
	if (obj.first!=null && !patt.test(obj.first)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["first",obj.first,values]);
	}
	if (obj.last!=null && !patt.test(obj.last)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["last",obj.last,values]);
	}
	if (obj.beginPosition!=null && !patt.test(obj.beginPosition)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["beginPosition",obj.beginPosition,values]);
	}
	if (obj.endPosition!=null && !patt.test(obj.endPosition)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["endPosition",obj.endPosition,values]);
	}
	
	// coords
	
	values = ["(valor,valor,valor,valor)"];
	patt1 = /^\d+\s*(px)?$/;
	patt2 = /^(\.\d+|(\d|\d\d)(\.\d+)?|100(\.0+)?)%$/;
	if (obj.coords) {
		var coords = obj.coords.split(',');
		var valid = true;
		if (coords.length == 4) {
			for (i in coords) {
				coords[i] = $.trim(coords[i]);
				if (patt1.test(coords[i])) {
					coords[i] = $.trim(coords[i].split('px')[0]);
				} else if (!patt2.test(coords[i])) {
					valid = false;
				}
			}
		} else {
			valid = false;
		}
		if (valid) {
			obj.coords = coords.join(',');
		} else {
			obj._ignore = true;
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["coords",obj.coords,values]);
		}
	}
	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseAssessmentStatement = function (obj,tag,parent,tree) {
	// comparator
	values = ["eq","ne","gt","lt","gte","lte"];
	if (obj.comparator!=null && jQuery.inArray(obj.comparator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["comparator",obj.comparator,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseAttributeAssessment = function (obj,tag,parent,tree) {
	// role
	if (obj.role!=null) {
		var connectorID = tree.split("causalConnector#")[1].split(">")[0];
		if (!this.uniqueTable["id#"+connectorID]) {
			this.uniqueTable["id#"+connectorID] = [];
		}
		if (this.uniqueTable["id#"+connectorID][obj.role]) {
			if (!this.uniqueTable["id#"+connectorID][obj.role].duplicated) {
				this.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
				Logger.error(Logger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
			}
		} else {
			this.uniqueTable["id#"+connectorID][obj.role] = {
				duplicated: false
			};
		}
	}
	// eventType
	values = ["selection","presentation","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"VARIAVEL","0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^([0-9A-Z]|\*|\$[A-Za-z_][0-9A-Za-z_]*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)$/;
	if (obj.key==null) {
		if (obj.eventType=="selection") {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["key"]);
		}
	} else if (!patt.test(obj.key)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
	}
	// attributeType
	switch (obj.eventType) {
		case "selection": {
			values = ["occurences","state"];
			break;
		}
		case "presentation": {
			values = ["occurences","state","repetitions"];
			break;
		}
		case "attribution": {
			values = ["occurences","state","repetitions","nodeProperty"];
			break;
		}
	}
	if (obj.attributeType!=null && jQuery.inArray(obj.attributeType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["attributeType",obj.attributeType,values]);
	}
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseBind = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseBindParam = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseBindRule = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseBody = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseCausalConnector = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseCompositeRule = function (obj,tag,parent,tree) {
	// operator
	values = ["and","or"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseCompoundAction = function (obj,tag,parent,tree) {
	// operator
	values = ["par","seq"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseCompoundCondition = function (obj,tag,parent,tree) {
	// operator
	values = ["and","or"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}
	// delay
	values = ["(número real positivo)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.delay!=null && !patt.test(obj.delay)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["delay",obj.delay,values]);
	}
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseCompoundStatement = function (obj,tag,parent,tree) {
	// operator
	values = ["or","and"];
	if (obj.operator!=null && jQuery.inArray(obj.operator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["operator",obj.operator,values]);
	}
	// isNegated
	values = ["true","false"];
	if (obj.isNegated!=null && jQuery.inArray(obj.isNegated,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["isNegated",obj.isNegated,values]);
	}
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseConnectorBase = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseConnectorParam = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseContext = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDefaultComponent = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDefaultDescriptor = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDescriptorBase = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDescriptor = function (obj,tag,parent,tree) {
	// explicitDur
	values = ["(número real)s","HH:MM:SS"];
	patt1 = /^(\d+|\d*\.\d+)s$/;
	patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
	if (obj.explicitDur != null) {
		// format: 0=invalid, 1='real number', 2='HH:MM:SS'
		var format = patt1.test(obj.explicitDur) ? 1 : (patt2.test(obj.explicitDur) ? 2 : 0);
		if (format == 0) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
		} else {
			if (format == 1) {
				// removes the 's' from the end of the string
				obj.explicitDur = parseFloat(obj.explicitDur.split('s')[0]);
			} else {
				// calculates the number of seconds from the 'HH:MM:SS' format
				var arr = obj.explicitDur.split(':');
				var h = parseFloat(arr[0]);
				var m = parseFloat(arr[1]);
				var s = parseFloat(arr[2]);
				if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["explicitDur",obj.explicitDur,values]);
				} else {
					obj.explicitDur = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
				}
			}
		}
	}
	
	// freeze
	values = ["true","false"];
	if (obj.freeze!=null && jQuery.inArray(obj.freeze,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["freeze",obj.freeze,values]);
	}
	// focusBorderColor, selBorderColor
	attrs = ["focusBorderColor","selBorderColor"];
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	for (var i in attrs) {
		attr = attrs[i];
		value = obj[attr];
		patt = /^\d+,\d+,\d+$/;
		if (value != null) {
			if (jQuery.inArray(value,values)==-1 &&
					!patt.test(value)) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	// focusBorderWidth
	values = ["(número inteiro)"];
	patt = /^-?\d+$/;
	if (obj.focusBorderWidth!=null && !patt.test(obj.focusBorderWidth)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderWidth",obj.focusBorderWidth,values]);
	}
	// focusBorderTransparency
	values = ["(número real entre 0 e 1)","(número real entre 0 e 100)%"];
	patt = /^((0?\.\d+|1(\.0+)?)|(\d?\d?\.\d+|100(\.0+)?)%)$/;
	if (obj.focusBorderTransparency!=null && !patt.test(obj.focusBorderTransparency)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["focusBorderTransparency",obj.focusBorderTransparency,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDescriptorParam = function (obj,tag,parent,tree) {
	// explicitDur
	if (obj.name == 'explicitDur') {
		values = ["(número real)s","HH:MM:SS"];
		patt1 = /^(\d+|\d*\.\d+)s$/;
		patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
		// format: 0=invalid, 1='real number', 2='HH:MM:SS'
		var format = patt1.test(obj.value) ? 1 : (patt2.test(obj.value) ? 2 : 0);
		if (format == 0) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
		} else {
			if (format == 1) {
				// removes the 's' from the end of the string
				obj.value = parseFloat(obj.value.split('s')[0]);
			} else {
				// calculates the number of seconds from the 'HH:MM:SS' format
				var arr = obj.value.split(':');
				var h = parseFloat(arr[0]);
				var m = parseFloat(arr[1]);
				var s = parseFloat(arr[2]);
				if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
				} else {
					obj.value = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
				}
			}
		}
	}
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseDescriptorSwitch = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseHead = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseImportBase = function (obj,tag,parent,tree) {
	// alias
	if (!this.uniqueTable["alias"]) {
		this.uniqueTable["alias"] = {};
		this.uniqueTable["aliasList"] = [];
	}
	
	if (this.uniqueTable["alias"][obj.alias]) {
		if (!this.uniqueTable["alias"][obj.alias].duplicated) {
			this.uniqueTable["alias"][obj.alias].duplicated = true;
			Logger.error(Logger.ERR_DUPLICATED_ALIAS,"importBase",[obj.alias]);
		}
	} else {
		var url = obj.documentURI;
		obj.__parent = parent;
		
		this.uniqueTable["alias"][obj.alias] = {
			duplicated: false,
			url : url,
			//(imported flag can be implemented later for
			//dinamic importing. Eg.: importing only when needed)
			//imported: false,

			//by what base this element is acessible
			allBases: false,
			obj: obj
		};

		var p = this.uniqueTable[this.path+url];
		if(!p)
		{
			p = new Parser(this.path,obj.alias);
			this.uniqueTable[this.path+url] = p;
			this.uniqueTable['aliasList'].push(this.uniqueTable["alias"][obj.alias]);
		} else {
			p.alias += '-'+obj.alias;
		}

		var d =  this.uniqueTable["alias"][obj.alias];
		d.parser = p;
		
		d[parent._type] =true;
		if(parent._type === 'descriptorBase')
		{
			d['regionBase']= true;
			d['transitionBase']= true;
			d['ruleBase']= true;
		}
		
		if(d['regionBase'])
		{
			if(!this.importBaseList)
				this.importBaseList = [];
			
			this.importBaseList.push(d);
		}
		
	}	

	//base
	if(parent._type !== 'regionBase' && obj.base)
		Logger.warn(WARN_REGIONATTR_IMPORTBASE_NOTINTO_RB,obj.alias,[obj.parent._type,obj.documentURI]);

};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseImportedDocumentBase = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseImportNCL = function (obj,tag,parent,tree) {
	// alias
	if (!this.uniqueTable["alias"]) {
		this.uniqueTable["alias"] = {};
		this.uniqueTable["aliasList"] = [];
	}
	if (this.uniqueTable["alias"][obj.alias]) {
		if (!this.uniqueTable["alias"][obj.alias].duplicated) {
			this.uniqueTable["alias"][obj.alias].duplicated = true;
			Logger.error(Logger.ERR_DUPLICATED_ALIAS,"importNCL",[obj.alias]);
		}
	} else {
		this.uniqueTable["alias"][obj.alias] = {
			duplicated: false,
			url : obj.documentURI,
			parser : new Parser(this.path,obj.alias),
			allBases : true,
			obj: obj
		};
		this.uniqueTable['aliasList'].push(this.uniqueTable["alias"][obj.alias]);
		
		if(!this.importBaseList)
			this.importBaseList = [];
			
		this.importBaseList.push(this.uniqueTable["alias"][obj.alias]);
	}	
	
	//new information
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseLink = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseLinkParam = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseMapping = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseMedia = function (obj,tag,parent,tree) {
	// instance
	values = ["new","instSame","gradSame"];
	if (obj.instance!=null && jQuery.inArray(obj.instance,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["instance",obj.instance,values]);
	}
	// type
	if (obj.type!=null) {
		obj.type = obj.type.toLowerCase();
	}
	// _ext
	var ext = obj.src ? obj.src.split('.') : [];
	var type = obj.type ? obj.type.split('/') : [];
	if (ext.length > 1) {
		obj._ext = ext[ext.length-1];
	} else if (type.length > 1) {
		obj._ext = type[type.length-1];
	} else {
		obj._ext = undefined;
	}
	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseMetadata = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseMeta = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseNCL = function (obj,tag,parent,tree) {
	// xmlns
	values = [
		"http://www.ncl.org.br/NCL3.0/EDTVProfile",
		"http://www.ncl.org.br/NCL3.0/BDTVProfile",
		"http://www.ncl.org.br/NCL3.0/CausalConnectorProfile"
	];
	if (obj.xmlns!=null && jQuery.inArray(obj.xmlns,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["xmlns",obj.xmlns,values]);
	}
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parsePort = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseProperty = function (obj,tag,parent,tree) {
	// explicitDur
	if (obj.name == 'explicitDur') {
		values = ["(número real)s","HH:MM:SS"];
		patt1 = /^(\d+|\d*\.\d+)s$/;
		patt2 = /^\d+:\d+:\d+(\.\d+)?$/;
		// format: 0=invalid, 1='real number', 2='HH:MM:SS', 4=''
		var format;
		
		// get rid of whitespaces
		obj.value = obj.value.replace(/\s/g, '');

		if (obj.value.length == 0)
			format = 4;
		else
			format = patt1.test(obj.value) ? 1 : (patt2.test(obj.value) ? 2 : 0);

		if (format == 0) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
		} else {
			switch(format)
			{
				case 1:
					// removes the 's' from the end of the string
					obj.value = parseFloat(obj.value.split('s')[0]);
				break;

				case 2:
					 // calculates the number of seconds from the 'HH:MM:SS' format
					var arr = obj.value.split(':');
					var h = parseFloat(arr[0]);
					var m = parseFloat(arr[1]);
					var s = parseFloat(arr[2]);
					if (m>=60 || s>=60) { // ncl handbook also says that hours must be in [0,23] interval, but it's not necessary
						Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["value",obj.value,values]);
					} else {
						obj.value = parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s);
					}
				break;

			}

		}
	}
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseRegionBase = function (obj,tag,parent,tree) {
	// device
	values = ["systemScreen(i)","systemAudio(i)"];
	patt = /^systemScreen\(\d+\)$|^systemAudio\(\d+\)$/;
	if (obj.device!=null && !patt.test(obj.device)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["device",obj.device,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseRegion = function (obj,tag,parent,tree) {
	obj._parent = parent;
	// left, right, top, bottom, height, width
	attrs = ["left","right","top","bottom","height","width"];
	values = ["(número inteiro)","(número inteiro)px","(número real)%"];
	for (var i in attrs) {
		attr = attrs[i]
		value = obj[attr];
		if (value != null) {
			patt = /^(\d+|\d*\.\d+)px$|^(\d+|\d*\.\d+)%$|^(\d+|\d*\.\d+)$/;
			if (!patt.test(value)) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,[attr,value,values]);
			}
		}
	}
	if (obj.left && obj.right && obj.width) {
		// TODO: verificar a soma de dimens�es relativas (%)
		if (isFinite(obj.left) && isFinite(obj.right) && isFinite(obj.width) && isFinite(parent.width)) {
			var soma = parseInt(obj.left) + parseInt(obj.right) + parseInt(obj.width);
			if (soma!=parent.width) {
				Logger.warning(Logger.WARN_INVALID_REGION_DIMENSIONS,"region",[["left","right","width"],soma,parent.width]);
			}
		}
	}
	if (obj.top && obj.bottom && obj.height) {
		// TODO: verificar a soma de dimens�es relativas (%)
		if (isFinite(obj.top) && isFinite(obj.bottom) && isFinite(obj.height) && isFinite(parent.height)) {
			var soma = parseInt(obj.top) + parseInt(obj.bottom) + parseInt(obj.height);
			if (soma!=parent.height) {
				Logger.warning(Logger.WARN_INVALID_REGION_DIMENSIONS,"region",[["top","bottom","height"],soma,parent.height]);
			}
		}
	}
	// zIndex
	values = ["número inteiro entre 0 e 255"];
	patt = /^\d+$/;
	if (obj.zIndex!=null && (!patt.test(obj.zIndex) || obj.zIndex<0 || obj.zIndex>255)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["zIndex",obj.zIndex,values]);
	} else {
		if (!this.uniqueTable["zIndex"]) {
			this.uniqueTable["zIndex"] = [];
		}
		if (this.uniqueTable["zIndex"][obj.zIndex]) {
			if (!this.uniqueTable["zIndex"][obj.zIndex].duplicated) {
				this.uniqueTable["zIndex"][obj.zIndex].duplicated = true;
				Logger.warning(Logger.WARN_DUPLICATED_ZINDEX,"region",[obj.zIndex]);
			}
		} else {
			this.uniqueTable["zIndex"][obj.zIndex] = {
				id: obj.id,
				duplicated: false
			};
		}
	}

	//(can be usefull one day ;] )
	//parent regionBase
	//if(parent.type === 'regionBase')
	//	obj._regionBase = parent;
	//else
	//	obj._regionBase = parent._regionBase || undefined;

		
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseRuleBase = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseRule = function (obj,tag,parent,tree) {
	// comparator
	values = ["eq","ne","gt","lt","gte","lte"];
	if (obj.comparator!=null && jQuery.inArray(obj.comparator,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["comparator",obj.comparator,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseSimpleAction = function (obj,tag,parent,tree) {
	// role
	values = ["start","stop","abort","pause","resume","set"];
	if (obj.role!=null && jQuery.inArray(obj.role,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
	}
	if (obj.role!=null) {
		if (jQuery.inArray(obj.role,values)==-1) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
		} else {
			var connectorID = tree.split("causalConnector#")[1].split(">")[0];
			if (!this.uniqueTable["id#"+connectorID]) {
				this.uniqueTable["id#"+connectorID] = [];
			}
			if (this.uniqueTable["id#"+connectorID][obj.role]) {
				if (!this.uniqueTable["id#"+connectorID][obj.role].duplicated) {
					this.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
					Logger.error(Logger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
				}
			} else {
				this.uniqueTable["id#"+connectorID][obj.role] = {
					duplicated: false
				};
			}
		}
	}
	// actionType
	values = ["start","stop","abort","pause","resume"];
	if (obj.actionType!=null && jQuery.inArray(obj.actionType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["actionType",obj.actionType,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// value
	if (obj.value==null) {
		if (obj.eventType=="attribution" || obj.role=="set") {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["value"]);
		}
	}
	// min
	values = ["(número inteiro entre 1 e max)"];
	patt = /^\d+$/;
	if (obj.min!=null) {
		if (!patt.test(obj.min)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
		} else {
			if (parseInt(obj.min)<1 || (obj.max!=null && obj.max!="unbounded" && parseInt(obj.max)<parseInt(obj.min))) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
			}
		}
	}
	// max
	values = ["(número inteiro maior ou igual a min)","unbounded"];
	patt = /^(\d+|unbounded)$/;
	if (obj.max!=null) {
		if (!patt.test(obj.max)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
		} else {
			if (obj.max!="unbounded") {
				if (parseInt(obj.max)<1 || (obj.min!=null && parseInt(obj.max)<parseInt(obj.min))) {
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
				}
			}
		}
	}
	// qualifier
	values = ["par","seq"];
	if (obj.qualifier==null) {
		if (obj.min!=null && parseInt(obj.min)>1) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		} else if (obj.max!=null && (obj.max=="unbounded" || parseInt(obj.max)>1)) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		}
	} else if (jQuery.inArray(obj.qualifier,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
	// repeat
	values = ["(número inteiro positivo)"];
	patt = /^\d+$/;
	if (obj.repeat!=null && !patt.test(obj.repeat)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["repeat",obj.repeat,values]);
	}
	// duration
	values = ["(número real positivo)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.duration!=null && !patt.test(obj.duration)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["duration",obj.duration,values]);
	}
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseSimpleCondition = function (obj,tag,parent,tree) {
	// role
	values = ["onBegin","onEnd","onAbort","onPause","onResume","onSelection","onBeginAttribution","onEndAttribution"];
	if (obj.role!=null && jQuery.inArray(obj.role,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
	}
	if (obj.role!=null) {
		if (jQuery.inArray(obj.role,values)==-1) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["role",obj.role,values]);
		} else {
			var connectorID = tree.split("causalConnector#")[1].split(">")[0];
			if (!this.uniqueTable["id#"+connectorID]) {
				this.uniqueTable["id#"+connectorID] = [];
			}
			if (this.uniqueTable["id#"+connectorID][obj.role]) {
				if (!this.uniqueTable["id#"+connectorID][obj.role].duplicated) {
					this.uniqueTable["id#"+connectorID][obj.role].duplicated = true;
					Logger.error(Logger.ERR_DUPLICATED_ATTR,"role",[obj.role,connectorID,["simpleAction","simpleCondition","attributeAssessment"]]);
				}
			} else {
				this.uniqueTable["id#"+connectorID][obj.role] = {
					duplicated: false
				};
			}
		}
	}
	// transition
	values = ["starts","stops","pauses","resumes","aborts"];
	if (obj.transition!=null && jQuery.inArray(obj.transition,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["transition",obj.transition,values]);
	}
	// eventType
	values = ["presentation","selection","attribution"];
	if (obj.eventType!=null && jQuery.inArray(obj.eventType,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["eventType",obj.eventType,values]);
	}
	// key
	values = [
		"VARIAVEL","0-9","A-Z","*","#","MENU","INFO","GUIDE","CURSOR_DOWN","CURSOR_LEFT","CURSOR_RIGHT",
		"CURSOR_UP","CHANNEL_DOWN","CHANNEL_UP","VOLUME_DOWN","VOLUME_UP","ENTER","RED","GREEN",
		"YELLOW","BLUE","BACK","EXIT","POWER","REWIND","STOP","EJECT","PLAY","RECORD","PAUSE"
	];
	patt = /^([0-9A-Z]|\*|\$[A-Za-z_][0-9A-Za-z_]*|#|MENU|INFO|GUIDE|CURSOR_DOWN|CURSOR_LEFT|CURSOR_RIGHT|CURSOR_UP|CHANNEL_DOWN|CHANNEL_UP|VOLUME_DOWN|VOLUME_UP|ENTER|RED|GREEN|YELLOW|BLUE|BACK|EXIT|POWER|REWIND|STOP|EJECT|PLAY|RECORD|PAUSE)$/;
	if (obj.key!=null && !patt.test(obj.key)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["key",obj.key,values]);
	}
	// min
	values = ["(n�mero inteiro entre 1 e max)"];
	patt = /^\d+$/;
	if (obj.min!=null) {
		if (!patt.test(obj.min)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
		} else {
			if (parseInt(obj.min)<1 || (obj.max!=null && obj.max!="unbounded" && parseInt(obj.max)<parseInt(obj.min))) {
				Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["min",obj.min,values]);
			}
		}
	}
	// max
	values = ["(n�mero inteiro maior ou igual a min)","unbounded"];
	patt = /^(\d+|unbounded)$/;
	if (obj.max!=null) {
		if (!patt.test(obj.max)) {
			Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
		} else {
			if (obj.max!="unbounded") {
				if (parseInt(obj.max)<1 || (obj.min!=null && parseInt(obj.max)<parseInt(obj.min))) {
					Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["max",obj.max,values]);
				}
			}
		}
	}
	// qualifier
	values = ["and","or"];
	if (obj.qualifier==null) {
		if (obj.min!=null && parseInt(obj.min)>1) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		} else if (obj.max!=null && (obj.max=="unbounded" || parseInt(obj.max)>1)) {
			Logger.error(Logger.ERR_MISSING_ATTR,tag,["qualifier"]);
		}
	} else if (jQuery.inArray(obj.qualifier,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["qualifier",obj.qualifier,values]);
	}
};
/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseSwitch = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseSwitchPort = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseTransitionBase = function (obj,tag,parent,tree) {
	// nada
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseTransition = function (obj,tag,parent,tree) {
	// type
	values = ["barWipe","irisWipe","clockWipe","snakeWipe","fade"];
	if (obj.type!=null && jQuery.inArray(obj.type,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["type",obj.type,values]);
	}
	// dur
	values = ["(número real positivo)s"];
	patt = /^(\d+|\d*\.\d+)s$/;
	if (obj.dur!=null && !patt.test(obj.dur)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["dur",obj.dur,values]);
	}
	// startProgress, endProgress
	values = ["(número real entre 0 e 1)"];
	patt = /^(0*\.\d+|1\.0)$/;
	if (obj.startProgress!=null && !patt.test(obj.startProgress)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["startProgress",obj.startProgress,values]);
	}
	if (obj.endProgress!=null && !patt.test(obj.endProgress)) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["endProgress",obj.endProgress,values]);
	}
	// direction
	values = ["forward","reverse"];
	if (obj.direction!=null && jQuery.inArray(obj.direction,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["direction",obj.direction,values]);
	}
	// fadeColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal"
	];
	if (obj.fadeColor!=null && jQuery.inArray(obj.fadeColor,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["fadeColor",obj.fadeColor,values]);
	}
	// horRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.horRepeat!=null && patt.test(obj.horRepeat,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["horRepeat",obj.horRepeat,values]);
	}
	// vertRepeat
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.vertRepeat!=null && patt.test(obj.vertRepeat,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["vertRepeat",obj.vertRepeat,values]);
	}
	// borderWidth
	values = ["(número inteiro não negativo)"];
	patt = /^\d+$/;
	if (obj.borderWidth!=null && patt.test(obj.borderWidth,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["borderWidth",obj.borderWidth,values]);
	}
	// borderColor
	values = [
		"white","black","silver","gray","red","maroon","fuchsia","purple","lime",
		"green","yellow","olive","blue","navy","aqua","teal","blend"
	];
	if (obj.borderColor!=null && jQuery.inArray(obj.borderColor,values)==-1) {
		Logger.error(Logger.ERR_INVALID_ATTR_VALUE,tag,["borderColor",obj.borderColor,values]);
	}	
};/*
 * Lince - Laboratory for Innovation on Computing and Engineering
 * UFSCar - Universidade Federal de São Carlos
 * São Carlos - SP, Brazil
 * <http://lince.dc.ufscar.br>
 * <http://webncl.org>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Parser.prototype.parseValueAssessment = function (obj,tag,parent,tree) {
	// nada
};function libBroker(luaplayer){
  
   this.amq = org.activemq.Amq;
   this.luaHandler = '';
};

libBroker.prototype.init = function(strURI, fnOptCallback){
	console.log('libBroker.init()');
    //optional callback when receiving first polling answer
    if (fnOptCallback === undefined) fnOptCallback = function(){};
    //initialize activemq object
	this.amq.init({ 
        uri                         : strURI,                   //Broker
        logging                     : false,                    //Debug log
        timeout                     : 60,                       //Connection timeout (s)
        pollDelay                   : 500,                      //Polling interval (ms)
        clientId                    : (new Date).getTime(),     //Client unique identification
        sessionInitializedCallback  : function(){               //First 'GET' received
            //First polling message received
            fnOptCallback();
        }
    });
}

libBroker.prototype.fnHandler = function(param) {
	this.luaHandler(param.textContent);	
}

libBroker.prototype.register = function(strDestination, handler){
	console.log('libBroker.register()');
	
	this.luaHandler = handler;
    
   //Add listener to handle received messages
   this.amq.addListener( 
        "hdlBroker"+strDestination, //Handler name
        strDestination,             //Destination Topic
        $.proxy(function(param) {
        	this.luaHandler(param.textContent);
        }, this)                   
    );
}

libBroker.prototype.unregister = function(strDestination){
	console.log('libBroker.unregister()');
    
    //Remove listener
    this.amq.removeListener( 
        "hdlBroker"+strDestination, 
        strDestination 
    );
}

libBroker.prototype.post = function(strDestination, strMessage){
	console.log('libBroker.post()')
    
    //send message to activemq using destination uri
	this.amq.sendMessage(
        strDestination,         //Destination string like 'topic://TOPICNAME'
        strMessage              //Message
    );
}
function libCanvas(ctx) {

	this.iniCropX = 0;
	this.iniCropY = 0;
	this.endCropX = ctx.canvas.width;
	this.endCropY = ctx.canvas.height;

	this.ctx2 = ctx;
	this.width = ctx.canvas.width;
	this.height = ctx.canvas.height;
	
	var canvas = document.createElement("canvas");
	canvas.id = "canvasCopy";
	canvas.width = ctx.canvas.width;
	canvas.height = ctx.canvas.height;
	
	this.ctx = canvas.getContext("2d");
	
	this.x = 0;
	this.y = 0;
	this.initX = 0;
	this.initY = 0;
	this.sizeX = ctx.canvas.width;
	this.sizeY = ctx.canvas.height;
	this.endX = ctx.canvas.width;
	this.endY = ctx.canvas.height;
	
	this.color = [];
	this.color[0] = 0;
	this.color[1] = 0;
	this.color[2] = 0;
	this.color[3] = 1;
	
	this.attrFont = [];
	

};

libCanvas.prototype.attrSize = function() {
	
	return [this.width, this.height];

}

libCanvas.prototype.newCanvas = function(width, height) {
	
	newObject.setData(width, height);
	return newObject;
}


libCanvas.prototype.newImage = function(caminho) {
	
	var img = new Image();
	img.src = caminho;
	if (!img.complete){
		console.log('Please press F5');
	}
	
	newObject = new libCanvas(this.ctx);
	newObject.isSon = true;
	newObject.setData(img.width, img.height);
	newObject.image_path(img, 0, 0, img.width, img.height);
	return newObject;

}


libCanvas.prototype.image_path = function(img, x, y, w, h) {

	this.initX = this.x + x;
	this.initY = this.y + y;

	if (this.initX + w > this.x + this.sizeX || this.initY + h > this.y + this.sizeY)

		console.log("Image exceeds the dimentions limited by canvas");
	else{
		this.ctx.drawImage(img, this.initX, this.initY, w, h);
		
	}
}

libCanvas.prototype.setData = function(x, y) {
	
	this.width = x;
	this.height = y;
	this.endCropX = x;
	this.endCropY = y;
	
}

libCanvas.prototype.getColor = function(){
		
	return [this.color[0], this.color[1], this.color[2], this.color[3]];
	
}

libCanvas.prototype.attrColor = function(r, g, b, a) {

	if (b === undefined && a === undefined) {

		if (g === undefined) {
			g = 1;
		}
		
		switch(r) {

			case 'lime' :
				this.ctx.fillStyle = "rgba(0,255,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,255,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 255;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'white':
				this.ctx.fillStyle = "rgba(255,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,255," + g + ")";
				this.color[0] = 255;
				this.color[1] = 255;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'aqua':
				this.ctx.fillStyle = "rgba(0,255,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,255,255," + g + ")";
				this.color[0] = 0;
				this.color[1] = 255;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'yellow':
				this.ctx.fillStyle = "rgba(255,255,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,255,0," + g + ")";
				this.color[0] = 255;
				this.color[1] = 255;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'red':
				this.ctx.fillStyle = "rgba(255,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,0," + g + ")";
				this.color[0] = 255;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'fuchsia':
				this.ctx.fillStyle = "rgba(255,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(255,0,255," + g + ")";
				this.color[0] = 255;
				this.color[1] = 0;
				this.color[2] = 255;
				this.color[3] = g;
				break;

			case 'purple':
				this.ctx.fillStyle = "rgba(128,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,128," + g + ")";
				this.color[0] = 128;
				this.color[1] = 0;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'maroon':
				this.ctx.fillStyle = "rgba(128,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,0,0," + g + ")";
				this.color[0] = 128;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'blue':
				this.ctx.fillStyle = "rgba(0,0,255," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,255," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 255;
				this.color[3] = g;

				break;

			case 'navy':
				this.ctx.fillStyle = "rgba(0,0,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,128," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'teal':
				this.ctx.fillStyle = "rgba(0,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,128," + g + ")";
				this.color[0] = 0;
				this.color[1] = 128;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'green':
				this.ctx.fillStyle = "rgba(0,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,128,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 128;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'olive':
				this.ctx.fillStyle = "rgba(128,128,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,0," + g + ")";
				this.color[0] = 128;
				this.color[1] = 128;
				this.color[2] = 0;
				this.color[3] = g;
				break;

			case 'silver':
				this.ctx.fillStyle = "rgba(192,192,192," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(192,192,192," + g + ")";
				this.color[0] = 192;
				this.color[1] = 192;
				this.color[2] = 192;
				this.color[3] = g;
				break;

			case 'gray':
				this.ctx.fillStyle = "rgba(128,128,128," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(128,128,128," + g + ")";
				this.color[0] = 128;
				this.color[1] = 128;
				this.color[2] = 128;
				this.color[3] = g;
				break;

			case 'black':
				this.ctx.fillStyle = "rgba(0,0,0," + g + ")";
				this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = "rgba(0,0,0," + g + ")";
				this.color[0] = 0;
				this.color[1] = 0;
				this.color[2] = 0;
				this.color[3] = g;
				break;

		}

	}

	else {

		this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		this.ctx.lineWidth = "2";
		this.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		this.color[0] = r;
		this.color[1] = g;
		this.color[2] = b;
		this.color[3] = a;
	}

}

libCanvas.prototype.attrClip = function(x, y, w, h) {

	this.x = x;
	this.y = y;
	this.sizeX = w;
	this.sizeY = h;

	this.ctx.lineWidth = "1";
	this.ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);

}

libCanvas.prototype.getClip = function(){
	
	return [this.x, this.y, this.sizeX, this.sizeY];
	
}


libCanvas.prototype.iniVerifClip = function(x1, y1, x2, y2) {

	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = this.x + x2;
	this.endY = this.y + y2;
	var verifica = true;

	if (this.endX > this.sizeX + this.x)
		this.endX = this.sizeX + this.x;

	if (this.endY > this.sizeY + this.y)
		this.endY = this.sizeY + this.y;

	if (this.initX > this.sizeX + this.x)
		this.initX = this.sizeX + this.x;

	if (this.initY > this.sizeY + this.y)
		this.initY = this.sizeY + this.y;

	if (this.initX >= this.sizeX + this.x && this.endX > this.sizeX + this.x || this.initY >= this.sizeY + this.y && this.endY >= this.sizeY + this.y) {
		verifica = false;

	}

	return verifica;
}

libCanvas.prototype.iniVerifClip2 = function(x1, y1, x2, y2) {

	this.initX = this.x + x1;
	this.initY = this.y + y1;
	this.endX = x2;
	this.endY = y2;
	var verifica = true;
	var sub = 0;
	
	if (this.initX + this.endX > this.x + this.sizeX) {
		sub = (this.initX + this.endX) - (this.x + this.sizeX);
		this.endX = this.endX - sub;
	}

	if (this.initY + this.endY > this.y + this.sizeY) {
		sub = (this.initY + this.endY) - (this.y + this.sizeY);
		this.endY = this.endY - sub;
	}

	if (this.initX >= this.sizeX + this.x || this.initY >= this.sizeY + this.y) {
		verifica = false;
	}

	return verifica;
}

libCanvas.prototype.drawLine = function(x1, y1, x2, y2) {

	verifica = this.iniVerifClip(x1, y1, x2, y2);

	if (verifica) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.initX, this.initY);
		this.ctx.lineTo(this.endX, this.endY);

		this.ctx.stroke();
		this.ctx.save();

	} else {
		console.log("Coordinates out of area selected to draw")
	}

}

libCanvas.prototype.drawRect = function(mode, x1, y1, x2, y2) {

	var verifica = this.iniVerifClip2(x1, y1, x2, y2);

	if (verifica) {
		if (mode == "fill") {
			this.ctx.fillRect(this.initX, this.initY, this.endX, this.endY);
		} else if (mode == "frame") {
			this.ctx.strokeRect(this.initX, this.initY, this.endX, this.endY);
		} else {
			console.log("mode doesn't exists - Please choise 'fill' or 'frame'");

		}
	} else {
		console.log("Coordinates out of area selected to draw")
	}

}

libCanvas.prototype.getFont = function(){
	
	return [this.attrFont[0], this.attrFont[1], this.attrFont[2]];
}

libCanvas.prototype.attrText = function(face, size, style) {
	
	var blank = " ";

	if (style === undefined)
		style = "normal";
		
	this.attrFont[0] = face;
	this.attrFont[1] = size;
	this.attrFont[2] = style;
	this.ctx.font = style + blank + size + blank +  face;	
	
}

libCanvas.prototype.drawText = function(x, y, text) {

	dimension = this.measureTextLua(text);

	width = dimension[0];
	height = dimension[1];

	this.initX = this.x + x;
	this.initY = this.y + y + height;
	
	this.ctx.fillText(text, this.initX, this.initY);

}

libCanvas.prototype.measureTextLua = function(text) {

	var textWidth = this.ctx.measureText(text);

	height = parseInt(this.attrFont[1]);

	return [textWidth.width, height];
}

libCanvas.prototype.getContext = function(){
	
	return this.ctx;
}

libCanvas.prototype.getCrop = function(){
	return [this.iniCropX, this.iniCropY, this.endCropX, this.endCropY];
}

libCanvas.prototype.attrCrop = function(x, y, w, h) {
	
	this.iniCropX = x;
	this.iniCropY = y;
	this.endCropX = x+w;
	this.endCropY = y+h;
	
	if(this.endCropX + this.iniCropX> this.width)
		this.endCropX = this.endCropX - x;
		
	if(this.endCropY + this.iniCropY> this.height)
		this.endCropY = this.endCropY - y;
	
}


libCanvas.prototype.compose = function(x, y, img) {

	var context = img.getContext();
	var imageData = context.getImageData(img.iniCropX, img.iniCropY, img.endCropX, img.endCropY);
	this.ctx.putImageData(imageData, x, y);
	
}

libCanvas.prototype.flush = function() {

	var dimension = this.attrSize();
	var imageData = this.ctx.getImageData(0,0,dimension[0],dimension[1]);
	this.ctx2.putImageData(imageData, 0,0);
}



function libEvents(luaplayer){
	this.luaplayer = luaplayer;
	this.player = luaplayer.p;
	this.handlers = [];
	this.handlers[0] = undefined;
	this.counter = 0;
	tmp = this.player.id;
	this.nodeId = tmp.substring(tmp.indexOf('_')+1);
	var d = new Date();
	this.t = d.getTime();
	
};

libEvents.prototype.register = function(fct){
	
	this.handlers[this.counter] = fct;
	this.counter = this.counter + 1;
}

libEvents.prototype.unregister = function(fct){
	
	this.handlers[this.counter] = undefined;
	if(!this.counter)
		this.counter = this.counter - 1;
}

libEvents.prototype.post = function(attr0, attr1){
	
	var out;
	var evt;
	if(attr0 === 'in'){
		evt = attr1;
		out = false;
	} else if(attr1 == undefined){
		evt = attr0;
		out = false;
	}
	if(attr0 == 'out'){
		evt = attr1;
		out = true;
	}
	
	if(!out){
		if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);
	} else if (evt.str['class'] == 'ncl') {
		var json = undefined;
		if (evt.str['type'] == 'presentation') {
			
			if (evt.str['label'] != undefined) {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					'component' : this.nodeId,
					'area' : evt.str['label']

				};

			} else {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					'component' : this.nodeId
				};
			}
		} else if (evt.str['type'] == 'attribution') {
			if (evt.str['action'] == 'stop') {
				$('#' + this.player.id).trigger("attribution.onEndAttribution", [evt.str['name']]);
			}

			json = {
				'class' : 'ncl',
				'type' : evt.str['type'],
				'action' : evt.str['action'],
				'component' : this.nodeId,
				'name' : evt.str['name'],
				'value' : evt.str['value']
			};
		}
		
		this.player.postEvent(json);
	} else if (evt.str['class'] == 'user') {
		this.luaplayer.eventQueue(evt);

	}
	}
	
	if(out){
		if (evt.str['class'] == 'key') {
		this.player.postEvent(evt.str);
	} else if (evt.str['class'] == 'ncl') {
		var json = undefined;
		if (evt.str['type'] == 'presentation') {
			
			if (evt.str['label'] != undefined) {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					
					'area' : evt.str['label']

				};

			} else {
				json = {
					'class' : 'ncl',
					'type' : evt.str['type'],
					'action' : evt.str['action'],
					
				};
			}
		} else if (evt.str['type'] == 'attribution') {
			if (evt.str['action'] == 'stop') {
				$('#' + this.player.id).trigger("attribution.onEndAttribution", [evt.str['name']]);
			}

			json = {
				'class' : 'ncl',
				'type' : evt.str['type'],
				'action' : evt.str['action'],
				
				'name' : evt.str['name'],
				'value' : evt.str['value']
			};
		}
		
		this.player.postEvent(json);
	} 
	}
	
}


libEvents.prototype.timer = function(timeout, fct){
	setTimeout(fct, timeout);
}

libEvents.prototype.uptime = function(){
	
	var d = new Date();
	return(d.getTime() - this.t); 
}

function libHttp(){
		
};

libHttp.prototype.request = function(attr0){
	var req = attr0;
	var data = req.str['data'] || '';	
	
	
	if (data != undefined || data != '') {
		data = data.str;
	}
		
	var http_response = '';

	var result = $.ajax({
		type : req.str['type'],
		url : req.str['url'],
		dataType : req.str['dataType'],
		data: data,
		async : false,
		});
	
	return [result.responseText];
}
function libPersistent(readOnly){
	this.readOnly=readOnly;
};

libPersistent.prototype.changeMode = function(readOnly){
	this.readOnly = readOnly;
	
}

libPersistent.prototype.storeField = function(prefix, key, value){
	
	if (this.readOnly){
		console.log('error');
	}
	
	else{
		if(prefix == "settings" && typeof(value) == 'number'){
			console.log('error');
		}
		else{
			var storageKey = "webncl." + prefix+ "." + key;
			localStorage.setItem(storageKey, value);	
		}	
	}
}


libPersistent.prototype.clear = function(){
	
	localStorage.clear();
}

libPersistent.prototype.recoverField = function(key){
	
	key = "webncl." + key;
	
	var content = localStorage.getItem(key);
	return content;
}


// @depends PxLoader.js
/**
 * PxLoader plugin to load images
 */

function PxLoaderFont(alias, url, tags, priority) {
    var self = this,
        loader = null;

	this.alias = alias;
	this.url= url;
    this.tags = tags;
    this.priority = priority;



    var onLoad = function() {

    };

    var onError = function() {

    };


    this.start = function(pxLoader) {
        
        loader = pxLoader;

     	var styleCss = "@font-face{" + 
		"font-family: '"+ this.alias + "';" + 
		"src: url('"+ this.url +"');}";
	
		$('<style>').text(styleCss).appendTo('head');
		
		var result = $.ajax({
		type : "GET",
		url : this.url,
		async : false,
		});
		
		
		$('body').append('<div class = "font_' + this.alias + '"  style="visibility:hidden"><h1>.</h1><div></div>');
		
		var h1 = ".font_" + this.alias + " { font-family: '" + this.alias + "'; }";
		$('<style>').text(h1).appendTo('head');
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
		loader.onLoad(self);
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {

    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };


}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addFont = function(alias, url, tags, priority) {
    var imageLoader = new PxLoaderFont(alias, url, tags, priority);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};// @depends PxLoader.js
/**
 * PxLoader plugin to load images
 */

function PxLoaderImage(url, tags, priority) {
    var self = this,
        loader = null;

    this.img = new Image();
    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.img.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an image is in the cache.
        self.bind('load', onLoad);
        self.bind('readystatechange', onReadyStateChange);
        self.bind('error', onError);

        self.img.src = url;
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.img.complete) {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.img.complete) {
            loader.onLoad(self);
        } else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.img.addEventListener) {
            self.img.addEventListener(eventName, eventHandler, false);
        } else if (self.img.attachEvent) {
            self.img.attachEvent('on' + eventName, eventHandler);
        }
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.img.removeEventListener) {
            self.img.removeEventListener(eventName, eventHandler, false);
        } else if (self.img.detachEvent) {
            self.img.detachEvent('on' + eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addImage = function(url, tags, priority) {
    var imageLoader = new PxLoaderImage(url, tags, priority);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};/**
 * PixelLab Resource Loader
 * Loads resources while providing progress updates.
 */

function PxLoader(settings) {

    // merge settings with defaults
    settings = settings || {};

    // how frequently we poll resources for progress
    if (settings.statusInterval == null) {
        settings.statusInterval = 5000; // every 5 seconds by default
    }

    // delay before logging since last progress change
    if (settings.loggingDelay == null) {
        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
    }

    // stop waiting if no progress has been made in the moving time window
    if (settings.noProgressTimeout == null) {
        settings.noProgressTimeout = Infinity; // do not stop waiting by default
    }

    var entries = [],
        // holds resources to be loaded with their status
        progressListeners = [],
        timeStarted, progressChanged = +new Date;

    /**
     * The status of a resource
     * @enum {number}
     */
    var ResourceState = {
        QUEUED: 0,
        WAITING: 1,
        LOADED: 2,
        ERROR: 3,
        TIMEOUT: 4
    };

    // places non-array values into an array.
    var ensureArray = function(val) {
        if (val == null) {
            return [];
        }

        if (Array.isArray(val)) {
            return val;
        }

        return [val];
    };

    // add an entry to the list of resources to be loaded
    this.add = function(resource) {

        // ensure tags are in an object
        resource.tags = new PxLoaderTags(resource.tags);

        // ensure priority is set
        if (resource.priority == null) {
            resource.priority = Infinity;
        }

        entries.push({
            resource: resource,
            status: ResourceState.QUEUED
        });
    };

    this.addProgressListener = function(callback, tags) {
        progressListeners.push({
            callback: callback,
            tags: new PxLoaderTags(tags)
        });
    };

    this.addCompletionListener = function(callback, tags) {
        progressListeners.push({
            tags: new PxLoaderTags(tags),
            callback: function(e) {
                if (e.completedCount === e.totalCount) {
                    callback();
                }
            }
        });
    };

    // creates a comparison function for resources
    var getResourceSort = function(orderedTags) {

        // helper to get the top tag's order for a resource
        orderedTags = ensureArray(orderedTags);
        var getTagOrder = function(entry) {
            var resource = entry.resource,
                bestIndex = Infinity;
            for (var i = 0; i < resource.tags.length; i++) {
                for (var j = 0; j < Math.min(orderedTags.length, bestIndex); j++) {
                    if (resource.tags[i] == orderedTags[j] && j < bestIndex) {
                        bestIndex = j;
                        if (bestIndex === 0) break;
                    }
                    if (bestIndex === 0) break;
                }
            }
            return bestIndex;
        };
        return function(a, b) {
            // check tag order first
            var aOrder = getTagOrder(a),
                bOrder = getTagOrder(b);
            if (aOrder < bOrder) return -1;
            if (aOrder > bOrder) return 1;

            // now check priority
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        }
    };

    this.start = function(orderedTags) {
        timeStarted = +new Date;

        // first order the resources
        var compareResources = getResourceSort(orderedTags);
        entries.sort(compareResources);

        // trigger requests for each resource
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            entry.status = ResourceState.WAITING;
            entry.resource.start(this);
        }

        // do an initial status check soon since items may be loaded from the cache
        setTimeout(statusCheck, 100);
    };

    var statusCheck = function() {
        var checkAgain = false,
            noProgressTime = (+new Date) - progressChanged,
            timedOut = (noProgressTime >= settings.noProgressTimeout),
            shouldLog = (noProgressTime >= settings.loggingDelay);

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (entry.status !== ResourceState.WAITING) {
                continue;
            }

            // see if the resource has loaded
            if (entry.resource.checkStatus) {
                entry.resource.checkStatus();
            }

            // if still waiting, mark as timed out or make sure we check again
            if (entry.status === ResourceState.WAITING) {
                if (timedOut) {
                    entry.resource.onTimeout();
                } else {
                    checkAgain = true;
                }
            }
        }

        // log any resources that are still pending
        if (shouldLog && checkAgain) {
            log();
        }

        if (checkAgain) {
            setTimeout(statusCheck, settings.statusInterval);
        }
    };

    this.isBusy = function() {
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
                return true;
            }
        }
        return false;
    };

    var onProgress = function(resource, statusType) {
        // find the entry for the resource
        var entry = null;
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].resource === resource) {
                entry = entries[i];
                break;
            }
        }

        // we have already updated the status of the resource
        if (entry == null || entry.status !== ResourceState.WAITING) {
            return;
        }
        entry.status = statusType;
        progressChanged = +new Date;

        var numResourceTags = resource.tags.length;

        // fire callbacks for interested listeners
        for (var i = 0, numListeners = progressListeners.length; i < numListeners; i++) {
            var listener = progressListeners[i],
                shouldCall;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                shouldCall = true;
            } else {
                // listener only wants to hear about certain tags
                shouldCall = resource.tags.contains(listener.tags);
            }

            if (shouldCall) {
                sendProgress(entry, listener);
            }
        }
    };

    this.onLoad = function(resource) {
        onProgress(resource, ResourceState.LOADED);
    };
    this.onError = function(resource) {
        onProgress(resource, ResourceState.ERROR);
    };
    this.onTimeout = function(resource) {
        onProgress(resource, ResourceState.TIMEOUT);
    };

    // sends a progress report to a listener
    var sendProgress = function(updatedEntry, listener) {
        // find stats for all the resources the caller is interested in
        var completed = 0,
            total = 0;
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i],
                includeResource = false;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                includeResource = true;
            } else {
                includeResource = entry.resource.tags.contains(listener.tags);
            }

            if (includeResource) {
                total++;
                if (entry.status === ResourceState.LOADED || entry.status === ResourceState.ERROR || entry.status === ResourceState.TIMEOUT) {
                    completed++;
                }
            }
        }

        listener.callback({
            // info about the resource that changed
            resource: updatedEntry.resource,

            // should we expose StatusType instead?
            loaded: (updatedEntry.status === ResourceState.LOADED),
            error: (updatedEntry.status === ResourceState.ERROR),
            timeout: (updatedEntry.status === ResourceState.TIMEOUT),

            // updated stats for all resources
            completedCount: completed,
            totalCount: total
        });
    };

    // prints the status of each resource to the console
    var log = this.log = function(showAll) {
        if (!window.console) {
            return;
        }

        var elapsedSeconds = Math.round((+new Date - timeStarted) / 1000);
        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (!showAll && entry.status !== ResourceState.WAITING) {
                continue;
            }

            var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
            switch(entry.status) {
                case ResourceState.QUEUED:
                    message += ' (Not Started)';
                    break;
                case ResourceState.WAITING:
                    message += ' (Waiting)';
                    break;
                case ResourceState.LOADED:
                    message += ' (Loaded)';
                    break;
                case ResourceState.ERROR:
                    message += ' (Error)';
                    break;
                case ResourceState.TIMEOUT:
                    message += ' (Timeout)';
                    break;
            }

            if (entry.resource.tags.length > 0) {
                message += ' Tags: [' + entry.resource.tags.join(',') + ']';
            }

            window.console.log(message);
        }
    };
}

// Tag object to handle tag intersection; once created not meant to be changed
// Performance rationale: http://jsperf.com/lists-indexof-vs-in-operator/3

function PxLoaderTags(values) {

    this.array = [];
    this.object = {};
    this.value = null; // single value
    this.length = 0;

    if (values !== null && values !== undefined) {
        if (Array.isArray(values)) {
            this.array = values;
        } else if (typeof values === 'object') {
            for (var key in values) {
                this.array.push(key);
            }
        } else {
            this.array.push(values);
            this.value = values;
        }

        this.length = this.array.length;

        // convert array values to object with truthy values, used by contains function below
        for (var i = 0; i < this.length; i++) {
            this.object[this.array[i]] = true;
        }
    }

    // compare this object with another; return true if they share at least one value
    this.contains = function(other) {
        if (this.length === 0 || other.length === 0) {
            return false;
        } else if (this.length === 1 && this.value !== null) {
            if (other.length === 1) {
                return this.value === other.value;
            } else {
                return other.object.hasOwnProperty(this.value);
            }
        } else if (other.length < this.length) {
            return other.contains(this); // better to loop through the smaller object
        } else {
            for (var key in this.object) {
                if (other.object[key]) {
                    return true;
                }
            }
            return false;
        }
    }
}

// shims to ensure we have newer Array utility methods
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}
// @depends PxLoader.js
/**
 * PxLoader plugin to load sound using SoundManager2
 */

function PxLoaderSound(id, url, tags, priority) {
    var self = this,
        loader = null;

    this.tags = tags;
    this.priority = priority;
    this.sound = soundManager['createSound']({
        'id': id,
        'url': url,
        'autoLoad': false,
        'onload': function() {
            loader.onLoad(self);
        },

        // HTML5-only event: Fires when a browser has chosen to stop downloading.
        // "The user agent is intentionally not currently fetching media data,
        // but does not have the entire media resource downloaded."
        'onsuspend': function() {
            loader.onTimeout(self);
        },

        // Fires at a regular interval when a sound is loading and new data
        // has been received.
        'whileloading': function() {
            var bytesLoaded = this['bytesLoaded'],
                bytesTotal = this['bytesTotal'];

            // TODO: provide percentage complete updates to loader?
            // see if we have loaded the file
            if (bytesLoaded > 0 && (bytesLoaded === bytesTotal)) {
                loader.onLoad(self);
            }
        }
    });

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // On iOS, soundManager2 uses a global audio object so we can't
        // preload multiple sounds. We'll have to hope they load quickly
        // when we need to play them. Unfortunately, SM2 doesn't expose
        // a property to indicate its using a global object. For now we'll
        // use the same test they do: only when on an iDevice
        var iDevice = navigator.userAgent.match(/(ipad|iphone|ipod)/i);
        if (iDevice) {
            loader.onTimeout(self);
        } else {
            this.sound['load']();
        }
    };

    this.checkStatus = function() {
        switch(self.sound['readyState']) {
            case 0:
                // uninitialised
                break;
            case 1:
                // loading
                break;
            case 2:
                // failed/error
                loader.onError(self);
                break;
            case 3:
                // loaded/success
                loader.onLoad(self);
                break;
        }
    };

    this.onTimeout = function() {
        loader.onTimeout(self);
    };

    this.getName = function() {
        return url;
    }
}

// add a convenience method to PxLoader for adding a sound
PxLoader.prototype.addSound = function(id, url, tags, priority) {
    var soundLoader = new PxLoaderSound(id, url, tags, priority);
    this.add(soundLoader);
    return soundLoader.sound;
};// @depends PxLoader.js
/**
 * PxLoader plugin to load video elements
 */

function PxLoaderVideo(url, tags, priority) {
    var self = this;
    var loader = null;

    try {
        this.vid = new Video();
    } catch(e) {
        this.vid = document.createElement('video');
    }

    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.vid.readyState != 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('canplaythrough', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an video is in the cache.
        self.bind('load', onLoad);
        self.bind('canplaythrough', onReadyStateChange);
        self.bind('error', onError);

        self.vid.src = url;
    };

    // called by PxLoader to check status of video (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.vid.readyState != 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.vid.readyState != 4) {
            loader.onLoad(self);
        } else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.vid.addEventListener) {
            self.vid.addEventListener(eventName, eventHandler, false);
        } else if (self.vid.attachEvent) {
            self.vid.attachEvent('on' + eventName, eventHandler);
        }
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.vid.removeEventListener) {
            self.vid.removeEventListener(eventName, eventHandler, false);
        } else if (self.vid.detachEvent) {
            self.vid.detachEvent('on' + eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addVideo = function(url, tags, priority) {
    var videoLoader = new PxLoaderVideo(url, tags, priority);
    this.add(videoLoader);

    // return the vid element to the caller
    return videoLoader.vid;
};