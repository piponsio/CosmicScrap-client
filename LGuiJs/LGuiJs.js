class LGuiJs{
	_canvas;
	_context;
	_width;
	_height;
	_fps = 60;

	static _instances = [];
	_interval;
	_dis_rclick = false;

	static _keyboard = [];
	static _last_key = {};
	static _mouse = {
		click: {x: undefined, y: undefined},
		last_click: {x: undefined, y: undefined},
		position: {x: undefined, y:undefined}
	};

	_ping = "??";

	_view = null;

	constructor(id, view, callback, width = window.innerWidth, height = window.innerHeight){
		this._id = id;
		this._view = view;
		this._view._LGuiJs = this;

		if(callback != undefined) callback(this);

		LGuiJs._instances[id] = this;

		this._canvas = document.getElementById(id);
		this._canvas.width = width;
		this._canvas.height = height;
		
		this._context = this._canvas.getContext('2d');

  		this.keyboardEvents();
  		this.mouseEvents();

  		this.loadMedia(function(){
			for(var key in View._viewList){
				View.getView(key).loadMedia();
			}
  		});

		var body = document.getElementsByTagName("BODY")[0];
		body.style.margin = 0;
		body.style.overflow = "hidden";
	}

	keyboardEvents(){ 
		document.addEventListener("keydown",function(e){
			var key;

			if(e.key.length == 1 ){
				LGuiJs._keyboard[e.key.charCodeAt(0)] = true;
				key = e.key
			}
			else{
				if(e.key == "Backspace") key = e.key; 
			}

			if(key != undefined) LGuiJs._last_key = {char: key, time: Date.now()};
		});
		document.addEventListener("keyup",function(e){
			var key = e.key;
			if(key.length == 1 ){
				LGuiJs._keyboard[key.charCodeAt(0)] = false;	
			}
			else{

			}
		});
	}

	mouseEvents(){
		if(this._dis_rclick){
			window.addEventListener('contextmenu', function(e) {e.preventDefault();});
		}
		this._canvas.addEventListener("mousedown", function(e){
			LGuiJs._mouse.click.button = e.which;
			LGuiJs._mouse.click.x = e.offsetX;
			LGuiJs._mouse.click.y = e.offsetY;
		});
		this._canvas.addEventListener("mousemove", function(e){
			LGuiJs._mouse.position.x = e.clientX;
			LGuiJs._mouse.position.y = e.clientY;
		});
	}

	static frameLoop(){
		for(var key in LGuiJs._instances){
			if(LGuiJs._instances[key]._view != null){
				LGuiJs._instances[key]._view.frameLoop();
			}
		}
		//Cambiar para mostrar solo la vista activa ?
	}

  	loadMedia(callback) {
  		callback();
		var Gui = this;
		var startInterval = function(a){
			a._interval = window.setInterval(LGuiJs.frameLoop, 1000 / a._fps);
		}
		
		window.onload = function(){
			startInterval(Gui);
		};
	}

	setView(view){
		this._view._LGuiJs = null;
		this._view = view;
		this._view._LGuiJs = this;
	}
	
	static getGui(Gui){
		return LGuiJs._instances[Gui];
	}

	httpRequest(method, url, callback){
		var http = httpRequest.start(method, url);
		http.onReady(callback, this);
	}

	getPing(){
		var result = (this._ping != undefined) ? this._ping : "??";
		return result;
	}
}

class httpRequest{
	_http;
	_method;
//	_url;
//	_callback;
	_last_data_send;
	_ms;
	static start(method, url){
		var instance = new httpRequest();
		instance._method = method;
		instance._http = new XMLHttpRequest();
		instance._http.open(method, url);
		instance._last_data_send = Date.now();
	//	instance._callback;
		instance._http.send();
		return instance;
	}
	onReady(callback, gui){
		var http_request = this;
		var aux = function(a){
				a._ms = Date.now() - a._last_data_send;
				gui._ping = a._ms;
				callback(a._http);
		}
		this._http.onreadystatechange = function(){
			aux(http_request);
		};
	}
	constructor(){ //Private ??

	}
}

console.log("LazySoft GUI for JavasScript");
