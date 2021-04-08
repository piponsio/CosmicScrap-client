class Element{
	_id;
	static _elementList = [];
	_view = [];
	_callbackFrameLoop;
	_image;
	_cursor;
	_center = {};

	_is_mouse_over = false;

	_click_flag = false;
	_is_last_click = false;
	_click_event = [];


	ClassName;
	_display;
	_image_src;
	_background_color;
	
	_x;
	_y;
	_width;
	_height;

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
		this._width = params["width"];
		this._height = params["height"];
		this._image = params["image"];
		this._image_src = params["image_src"];
		if(params["background-color"] != undefined && this.isColor(params["background-color"])) this._background_color = params["background-color"];
		this._x = params["x"];
		this._y = params["y"];

		if(params["x"] != undefined) this._x = params["x"];
		else this._x = 0;
		if(params["y"] != undefined) this._y = params["y"];
		else this._y = 0;
	}

	setView(view){
		if(view != undefined) this._view.push(view);
	}

	loadMedia(){
		if(this._image_src != undefined){
			this._image = new Image();
			this._image.src = this._image_src;
		}
	}

	frameLoop(){
		if(this._callbackFrameLoop != undefined) this._callbackFrameLoop(this);
	}

	static getElement(name = ""){
		return Element._elementList[name];
	}

	doInAllViews(callback){
		for(var i = 0; i < this._view.length; i++){
			if(this._view[i] != null && this._view[i]._LGuiJs != null){	
				var ctx = this._view[i]._LGuiJs._context;
				callback(this, ctx, this._view[i]._LGuiJs);
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

	isMouseOver(){
		if(LGuiJs._mouse.position != undefined){	
			if(LGuiJs._mouse.position.x > this._x && LGuiJs._mouse.position.x < this._x + this._width){
				if(LGuiJs._mouse.position.y > this._y && LGuiJs._mouse.position.y < this._y + this._height){
					this._is_mouse_over = true;
				}
				else this._is_mouse_over = false;
			}
			else this._is_mouse_over = false;
			//if(callback != undefined) callback(this);
		}
		return this._isFocus;
	}

	isClick(callback){
		var result = false;
		if(LGuiJs._mouse.click != undefined){
			if(LGuiJs._mouse.click.x > this._x && LGuiJs._mouse.click.x < this._x + this._width){
				if(LGuiJs._mouse.click.y > this._y && LGuiJs._mouse.click.y < this._y + this._height){
					if(!this._click_flag){
						result = true;
						
						this._is_last_click = true;
						this._click_flag = true;

						LGuiJs._mouse.last_click.x = LGuiJs._mouse.click.x;
						LGuiJs._mouse.last_click.y = LGuiJs._mouse.click.y;
					}
				}
				else{
					this._click_flag = false;
					this._is_click = false;
				}
			}
			else{
				this._click_flag = false;
				this._is_click = false;
			} 
				
		}
		
		return result;
	}

	addEventListener(type, callback){
		if(type == "click"){
			this._click_event.push(callback);
		}
	}
}

class Background extends Element{
	constructor(id, params = array(), callback){
	 	super(id, params, callback);
		this.ClassName = "Background";
	}
	frameLoop(){
		super.frameLoop();
		this.doInAllViews(function(me, ctx){
			if(me._display){
				if(me._image != undefined){
					if(me._width == undefined) me._width = me._image.width;
					if(me._height == undefined) me._height = me._image.height;
					ctx.drawImage(me._image, me._x, me._y, me._width, me._height);
					ctx.save();
				}
				else if(me._background_color != undefined){
					ctx.save();
					ctx.fillStyle = me._background_color;
//					console.log()
					ctx.fillRect(me._x, me._y, me._width, me._height); 
					ctx.restore();
				}
			}
		});
	}
}

class Button extends Element{

	_sx;
	_sy;
	_sWidth;
	_sHeight;

	constructor(id, params = array(), callback){
	 	super(id, params, callback);
	 	this._sx = (params["sx"] != undefined)? params["sx"] : this._x;
	 	this._sy = (params["sy"] != undefined)? params["sy"] : this._y;
	 	this._sWidth = (params["swidth"] != undefined)? params["swidth"] : this._width;
	 	this._sHeight = (params["sheight"] != undefined)? params["sheight"] : this._height; 

		this.ClassName = "Button";
		this._cursor = "pointer";
	}
	frameLoop(){
		super.frameLoop();
		this.isMouseOver();
		
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
//					console.log()
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
	
	frameLoop(){
		super.frameLoop();
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

	frameLoop(){
		super.frameLoop();
		this.isMouseOver();
	
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
				

				if(me._is_last_click){
					text = me._text;
					me._background_color = "rgba(80,155,160,1)";
				}
				else{
					me._background_color = "white";
					me._last_time_added_key = (LGuiJs._last_key.time == undefined)? 0: LGuiJs._last_key.time;
				}

				if(text == undefined) text = "|";
			}


			if(LGuiJs._last_key.time != undefined && me._is_last_click && me._last_time_added_key < LGuiJs._last_key.time){

				
				if(me._text == undefined) me._text = "";

				//console.log(me._text);

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