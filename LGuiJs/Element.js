class Element{
	_id;
	static _elementList = [];
	_view = [];
	_callbackFrameLoop;

	ClassName;

	_center = {};
		
	_x;
	_y;
	_width;
	_height;

	_sx;
	_sy;
	_sWidth;
	_sHeight;

	_display;
	_image;
	_image_src;
	_background_color;

	_cursor;

	_is_mouse_over = false;
	_mouse_over_flag = false;
	_mouse_over_event = [];

	_is_mouse_out = false;
	_mouse_out_flag = true;
	_mouse_out_event = [];

	_is_click = false;
	_click_flag = false;
	_click_event = [];


	
	constructor(id, params = array(), callback){ 
		this.ClassName = "Element";
		this._id = id;
		this.setView(params["view"]);
		this._callbackFrameLoop = callback;
		Element._elementList[this._id] = this;

		if(params["view"] != undefined && params["z-index"] != undefined){
			params["view"].addElement(this, params["z-index"]);
		}

		this._display = (params["display"] != undefined) ? params["display"] : true;

	 	this._x = (params["x"] != undefined) ? params["x"] : 0;
	 	this._y = (params["y"] != undefined) ? params["y"] : 0;
		this._width = params["width"];
		this._height = params["height"];


	 	this._sx = (params["sx"] != undefined)? params["sx"] : this._x;
	 	this._sy = (params["sy"] != undefined)? params["sy"] : this._y;
	 	this._sWidth = params["swidth"];
	 	this._sHeight = params["sheight"]; 


		this._image = params["image"];
		this._image_src = params["image_src"];
		if(params["background-color"] != undefined && this.isColor(params["background-color"])) this._background_color = params["background-color"];
		
	}

	loadMedia(){
		if(this._image_src != undefined){
			this._image = new Image();
			this._image.src = this._image_src;

			if(this._width == undefined) this._width = this._image.width;
			if(this._height == undefined) this._height = this._image.height;
			if(this._sWidth == undefined) this._sWidth = this._image.width;
			if(this._sHeight == undefined) this._sHeight = this._image.height;
		}
		if(this._background_color != undefined){
			if(this._width == undefined) this._width = window.innerWidth;
			if(this._height == undefined) this._height = window.innerHeight;
			if(this._sWidth == undefined) this._sWidth = window.innerWidth;;
			if(this._sHeight == undefined) this._sHeight = window.innerHeight;
		}
	}

	frameLoop(){
		if(this._callbackFrameLoop != undefined) this._callbackFrameLoop(this);
		this.draw();
	}

	doInAllViews(callback){
		for(var i = 0; i < this._view.length; i++){
			if(this._view[i] != null && this._view[i]._LGuiJs != null){	
				var ctx = this._view[i]._LGuiJs._context;
				var gui = this._view[i]._LGuiJs;

				callback(this, ctx, gui);
			}
		}
	}

	doInAllPartners(callback){
		for(var i = 0; i < this._view.length; i++){
			if(this._view[i] != null && this._view[i]._LGuiJs != null){
				for(var j = 0; j < this._view[i]._elementList.length; j++){
					var element = this._view[i]._elementList[j].instance;

					if(element != this) callback(this, element);
				}
			}	
		}
	}
	
	doInGui(callback){
		this.doInAllViews(function(me,ctx, gui){
			callback(gui);
		});
		//Ejecutar callback en solo una vez por gui ?,
		//es probable que el elemento esté en mas de una vista
		// y que estas dos vistas compartan gui
	}


	draw(){

	}

	center(){
		if(this._x != undefined && this._y != undefined && this._width != undefined && this._height != undefined){
			this._center = {x: this._x + (this._width/2), y: this._y + (this._height/2)};
		}
		return this._center;
	}

	isColor(color){
		var result = false;
		var temp = document.createElement('div');
		temp.style.backgroundColor = color;
		result = temp.style.backgroundColor ? true : false;
		
		temp.remove();
		return result;
	}


	addEventListener(type, callback){
		if(type == "click"){
			this._click_event.push(callback);
		}
	}

	isMouseOver(){
		//BUG
		//1: al iniciar, sale del ultimo elemento de la vista -- OK
		//2: Entra al input, pese que está abajo de background en una modificacion
		//Significa que hace la transicion con cualquier elemento que encuentre, excepto los que no tienen 2d
		//3: Al realizar el primer movimiento, los elementos lanzan "is_mouse_out" -- OK
		var result = false;
		if(LGuiJs._mouse.position.x != undefined && LGuiJs._mouse.position.y){
			if((LGuiJs._mouse.position.x > this._x && LGuiJs._mouse.position.x < this._x + this._width) 
			&& (LGuiJs._mouse.position.y > this._y && LGuiJs._mouse.position.y < this._y + this._height)){
			
				if(!this._mouse_over_flag){
					console.log("Entro a: "+this._id);
					result = true;
					this._is_mouse_over = true;
					this._mouse_over_flag = true;

					this._is_mouse_out = false;
					this._mouse_out_flag = false;

					this.doInAllPartners(function(me, element){
						element._is_mouse_over = false;
						element._is_mouse_out = true;
					});
				}
				if(this._is_mouse_out && !this._mouse_out_flag){
					this._is_mouse_over = false;
					this._mouse_over_flag = true;
					this._mouse_out_flag = true;
					console.log("Salió de "+this._id);
				}
			}
			else{
				if(!this._mouse_out_flag){
					this._is_mouse_out = true;
					this._mouse_out_flag = true;
					console.log("Salió de "+this._id);
					this.doInAllPartners(function(me, element){
						element._mouse_over_flag = false;
						element._mouse_out_flag = true;
					});
				}
				this._is_mouse_over = false;
				this._mouse_over_flag = false;
			}
		}
		return result;
	}

	isClick(callback){
		var result = false;
		if(LGuiJs._mouse.click != undefined){
			if(LGuiJs._mouse.click.x > this._x && LGuiJs._mouse.click.x < this._x + this._width){
				if(LGuiJs._mouse.click.y > this._y && LGuiJs._mouse.click.y < this._y + this._height){
					if(!this._click_flag){
						result = true;
						this._is_click = true;
						this._click_flag = true;

						LGuiJs._mouse.last_click.x = LGuiJs._mouse.click.x;
						LGuiJs._mouse.last_click.y = LGuiJs._mouse.click.y;
					}
				}
				else{
					this._click_flag = false;
				}
			}
			else{
				this._click_flag = false;
			} 	
		}
		return result;
	}

	setView(view){
		if(view != undefined) this._view.push(view);
	}

	static getElement(name = ""){
		return Element._elementList[name];
	}
}

class Background extends Element{

	constructor(id, params = array(), callback){
	 	super(id, params, callback);
		this.ClassName = "Background";
	}

	draw(){
		this.doInAllViews(function(me, ctx){
			if(me._display){
				if(me._image != undefined){
					if(me._width == undefined) me._width = me._image.width;
					if(me._height == undefined) me._height = me._image.height;
					ctx.drawImage(me._image, me._sx, me._sy, me._sWidth, me._sHeight, me._x, me._y, me._width, me._height);	
					ctx.save();
				}
				else if(me._background_color != undefined){
					ctx.save();
					ctx.fillStyle = me._background_color;
					ctx.fillRect(me._x, me._y, me._width, me._height); 
					ctx.restore();
				}
			}
		});
	}
}

class Button extends Element{

	constructor(id, params = array(), callback){
	 	super(id, params, callback);

		this.ClassName = "Button";
		this._cursor = "pointer";
	}

	draw(){
		this.doInAllViews(function(me, ctx){
			if(me._display){
				if(me._image != undefined){
					if(me._width == undefined) me._width = me._image.width;
					if(me._height == undefined) me._height = me._image.height;
					ctx.drawImage(me._image, me._sx, me._sy, me._sWidth, me._sHeight, me._x, me._y, me._width, me._height);					
					ctx.save();
				}
				else if(me._background_color != undefined){
					ctx.save();
					ctx.fillStyle = me._background_color;
					ctx.fillRect(me._x, me._y, me._width, me._height); 
					ctx.restore();
				}
			}
		});
	}
}

class Text extends Element{
	_default_text;
	_text;
	_text_color;
	_font;
	_size;
	_text_align;
	_value;

	constructor(id, params = array(), callback){
	 	super(id, params, callback);
		this.ClassName = "Text";

	 	this._default_text = params["default-text"];
	 	if(this._default_text == undefined) this._default_text = "";
	 	this._text = params["text"];
	 	this._value = params["value"];
	 	if(this._value == undefined) this._value = this._text;
	 	this._text_color = params["text-color"];
	 	this._font = params["font"];
	 	this._size = params["size"];
	 	this._text_align = params["text-align"];
	}

	draw(){
		if(this._text != undefined && this.ClassName == "Text") this.drawText(this._x, this._y, this._text_align, this._text);	
	}

	setText(text){
		this._text = text;
	}

	drawText(x, y, align, text){
		this.doInAllViews(function(me, ctx){
			ctx.save();
			ctx.font = me._size + "px " + me._font;
			ctx.fillStyle = me._text_color;
			ctx.textAlign = align;
			ctx.fillText(text, x, y); 
			ctx.restore();
		});
	}

	getValue(){
		var result = (this._value != undefined) ? this._value : ""; 
		return result;
	}
}

class Input extends Text{
	_type;
	_radius;
	_margin_top = 0;
	_margin_right = 0;
	_margin_bottom = 0;
	_margin_left = 0;
	_border_color;
	_border_size;
	_cursor;

	_last_time_added_key = 0;
	
	constructor(id, params = array(), callback){
	 	super(id, params, callback);
		this.ClassName = "Input";
	 	this._type = params["type"];
	 	this._radius = params["radius"];
	 	this._border_color = params["border-color"];
	 	this._border_size = params["border-size"];
	 	if(this._type == "text") this._cursor = "text";
	 	if(this._type == "password") this._cursor = "text";
	 	if(this._type == "button") this._cursor = "pointer";

	 	this._cursor = (this._cursor != undefined) ? this._cursor : "text"; 
	 	if(params["margin"] != undefined){
		 	this._margin_top = params["margin"];
		 	this._margin_right = params["margin"];
		 	this._margin_bottom = params["margin"];
		 	this._margin_left = params["margin"];
	 	}
	 	else{
		 	this._margin_top = params["margin_top"];
		 	this._margin_right = params["margin_right"];
		 	this._margin_bottom = params["margin_bottom"];
		 	this._margin_left = params["margin_left"];
	 	}
	}

	draw(){
			this.doInAllViews(function(me, ctx){
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(me._x, me._y + me._radius);
			ctx.lineTo(me._x, me._y + me._height - me._radius);
			ctx.quadraticCurveTo(me._x, me._y + me._height, me._x + me._radius, me._y + me._height);
			ctx.lineTo(me._x + me._width - me._radius, me._y + me._height);
			ctx.quadraticCurveTo(me._x + me._width, me._y + me._height, me._x + me._width, me._y + me._height - me._radius);
			ctx.lineTo(me._x + me._width, me._y  + me._radius);
			ctx.quadraticCurveTo(me._x + me._width, me._y , me._x + me._width - me._radius, me._y );
			ctx.lineTo(me._x + me._radius, me._y );
			ctx.quadraticCurveTo(me._x, me._y, me._x, me._y + me._radius);

			ctx.fillStyle = me._background_color;
			ctx.fill();

			ctx.strokeStyle = me._border_color;
			ctx.lineWidth = me._border_size;
			ctx.stroke();


			var text;
			if(me._type == "button"){
				text = me._default_text;
			}
			else if(me._type == "text" || me._type == "password"){
				if(me._text == undefined) text = me._default_text;
				else text = me._text;
				
				if(me._is_click){
					text = me._text;
					me._background_color = "rgba(80,155,160,1)";
				}
				else{
					me._background_color = "white";
					me._last_time_added_key = (LGuiJs._last_key.time == undefined)? 0: LGuiJs._last_key.time;
				}

				if(text == undefined) text = "|";
			}

			if(LGuiJs._last_key.time != undefined && me._is_click && me._last_time_added_key < LGuiJs._last_key.time){

				
				if(me._text == undefined) me._text = "";

				if(me._type == "password"){
					if(me._value == undefined) me._value = "";
					if(LGuiJs._last_key.char == "Backspace"){
						me._text = me._text.substring(0, me._text.length-1);
						me._value = me._value.substring(0, me._value.length-1);
					}
					else{
						me._text += "*";
						me._value += LGuiJs._last_key.char;
					}
				}
				else if(me._type == "text"){
					if(LGuiJs._last_key.char == "Backspace") me._text = me._text.substring(0, me._text.length-1); 
					else me._text += LGuiJs._last_key.char;
					me._value = me._text;
				}
				else if(me._type == "button"){
					text = me._text;
				}
				

				me._last_time_added_key = LGuiJs._last_key.time;
					//parpadear barrita??
					// Ultimo agregar barrita??
					// limitar exceso de texto
					//poner asteriscos en pass
					//agregar borrar y flechas ?
				me._stack_key_flag = false;	
				
			}
			if(me._text_align === "center") me.drawText(me.center().x, (me.center().y + (me._size/4)), me._text_align, text, text);
			if(me._text_align === "left") me.drawText(me._x + me._margin_left + me._border_size, me.center().y, me._text_align, text);
			if(me._text_align === "right") me.drawText(me._x + me._width - me._margin_right - me._border_size, me.center().y, me._text_align, text);

			ctx.restore();
		});
	}
}

/*
class Container extends Element{
	_child = [];
	constructor(id, params = array(), callback){
	 	super(id, params, callback);

//		this.ClassName = "Button";
//		this._cursor = "pointer";
	}
	frameLoop(){
		super.frameLoop();
		
		for(var i = 0; i < this._child.length; i++){
			this._child[i].frameLoop();
		}
	}
}
*/