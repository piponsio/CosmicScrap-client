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
		click: {x_: undefined, y: undefined},
		last_click: {x: undefined, y: undefined},
		focus: {x: undefined, y:undefined}
	};

	_ping = 0;

	_view = null;

	constructor(id, view, callback, width = window.innerWidth, height = window.innerHeight){
		this._id = id;
		this._view = view;
		this._view._LGuiJs = this;

		if(callback != undefined) callback(this);

		//console.log("CONSTRUCTOR DE GUI");
		//LGuiJs._instances.set(id, this);
		LGuiJs._instances[id] = this;
		//if(this._fps == undefined) this._fps = 60;
		//console.log("FPs: " + this._fps);

		this._canvas = document.getElementById(id);
		this._canvas.width = width;
		this._canvas.height = height;
		
		this._context = this._canvas.getContext('2d');
		//console.log(view);
		//this._view = View.getView(view);

  		this.keyboardEvents();
  		this.mouseEvents();

  		this.loadMedia(function(){
  		//	console.log("callback de loadMedia de LGuiJS");
			
			//console.log(View.getViews());
			//console.log(View.getViews()["Home"]);
//			for(var key in View.getViews()){
			for(var key in View._viewList){
			//	console.log(View.getView(key)._id);
				View.getView(key).loadMedia();
			}
  			//if(View.getViews() != undefined) View.getViews().forEach(function(value){ value.loadMedia();});
		
  			//for(var i = 0; i < View.getViews().length; i++) Views.getViews()[i].loadMedia();
  		});

		var body = document.getElementsByTagName("BODY")[0];
		body.style.margin = 0;
		body.style.overflow = "hidden";
	}

	keyboardEvents(){ 
		document.addEventListener("keydown",function(e){

			var key;
			//if(LGuiJs._keyboard[e.keyCode] != true) LGuiJs._keyboard_press.push(e.keyCode);
//			str.charCodeAt(0)
			if(e.key.length == 1 ){
				LGuiJs._keyboard[e.key.charCodeAt(0)] = true;
				key = e.key
			}
			else{
				if(e.key == "Backspace") key = e.key; 
			}

			//console.log(key);

			/*
			LGuiJs._keyboard[e.keyCode] = true;
			console.log(e.key.length);
			*/
			if(key != undefined) LGuiJs._last_key = {char: key, time: Date.now()};
		//	console.log(LGuiJs._last_key);
		});
		document.addEventListener("keyup",function(e){
			var key = e.key;
			//if(LGuiJs._keyboard[e.keyCode] != true) LGuiJs._keyboard_press.push(e.keyCode);
//			str.charCodeAt(0)
			if(key.length == 1 ){
				LGuiJs._keyboard[key.charCodeAt(0)] = false;	
			}
			else{

			}
			//LGuiJs._keyboard[e.keyCode] = false;
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
			LGuiJs._mouse.focus.x = e.clientX;
			LGuiJs._mouse.focus.y = e.clientY;
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
		var startInterval = function(a){
			a._interval = window.setInterval(LGuiJs.frameLoop, 1000 / 60);
			//interval undefined
//			a._interval = window.setInterval(LGuiJs.frameLoop, 1000 / a._fps);
		}
		window.onload = function(){
			startInterval(this);
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
		http.onReady(callback);
		this._ping = http._ms;
	}
}

class httpRequest{
	_http;
	_method;
	_url;
	_callback;
	_last_data_send;
	_ms;
	static start(method, url){
		var instance = new httpRequest();
		instance._http = new XMLHttpRequest();
		instance._http.open(method, url);
		instance._last_data_send = Date.now();
		instance._callback;
		instance._http.send();
		return instance;
	}
	onReady(callback){
		this._http.onreadystatechange = function(){
			this._ms = Date.now() - this._last_data_send;
	//			callback(instance._http, instance._ms);
			callback(this);
		}
		return instance;
	}

	constructor(){ //Private ??

	}
	/*
	constructor(method, url){
		this._http = new XMLHttpRequest();
		this._http.open(method, url);
		this._last_data_send = Date.now();
		this._http.send();
	}
	*/
	onReady(){

	}

}

console.log("LazySoft GUI for JavasScript");


/*
class Limport{
	static _imports = new Map();

	static setStatusImport(url, bool){
		Limport._imports.set(url, bool);
	}
	static simpleImport(url) {
	    var script = document.createElement("script");
   		script.src = url;
	    script.type = 'text/javascript';

    	document.querySelector("head").appendChild(script);
    	Limport.setStatusImport(url, false);
	    script.onreadystatechange = Limport.setStatusImport(url, true);
	    script.onload = Limport.setStatusImport(url, true);
	}

	static import(callback){
		callback();
	//	console.log("Dentro de importAll()");

		var start = Date.now();
		var importDone = false;
		while(!importDone && (Date.now() - start) < 5000){
			var temp = true;
			
			for (let [key, value] of Limport._imports){
				temp = temp && value;
				if(temp == false){
					importDone = false;
					break;
				}
			}
			if(temp) importDone = true;
		}
		if(importDone) console.log("Importacion finalizada");
		if(importDone) console.log("Importacion Erronea");
		console.log("Tiempo: " + (Date.now() - start));

	}
}

Limport.import(function(){	
		Limport.simpleImport("./LGuiJs/Core/Controllers.js");
		Limport.simpleImport("./LGuiJs/Core/Views.js");
		Limport.simpleImport("./LGuiJs/Core/Elements.js");
		Limport.simpleImport("./LGuiJs/Controllers.js");
		Limport.simpleImport("./LGuiJs/Views.js");
		Limport.simpleImport("./LGuiJs/Elements.js");
});


*/
