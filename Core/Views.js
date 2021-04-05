class View{
	_LGuiJs = null;

	_id;
	_elementList = [];
	_controller = null;
	_cursor = {
		text: false,
		pointer: false
	}
	static _viewList = [];


	constructor(id = "", callback){
	this._id = id;
		callback(this);
		//Agregar callback a frameloop ?
		View._viewList[id] = this;
	}


	loadMedia(){
		for(var i = 0; i < this._elementList.length; i++) this._elementList[i].instance.loadMedia();
	}

	frameLoop(){
		if(this._LGuiJs != null){

			for(var i = this._elementList.length-1; i >= 0; i--){
				if(this._elementList[i].instance.isClick()){
					for(var j = 0; j < this._elementList[i].instance._click_event.length; j++){
						this._elementList[i].instance._click_event[j].apply(this, [this._elementList[i].instance]);
					}
					for(var j = 0; j < this._elementList.length; j++){
						if(this._elementList[j] != this._elementList[i]) this._elementList[j].instance._is_last_click = false;
					}
					LGuiJs._mouse.click.x = undefined;
					LGuiJs._mouse.click.y = undefined;
					i = -1;
				}
			}
		
			//Crear metodo para disparar los eventos, todos deberían ser parecidos


			for(var i = 0; i < this._elementList.length; i++){
				this._cursor.text = this._cursor.text || (this._elementList[i].instance._cursor == "text" && this._elementList[i].instance._isFocus);
				this._cursor.pointer = this._cursor.pointer || (this._elementList[i].instance._cursor == "pointer" && this._elementList[i].instance._isFocus);
				
				this._elementList[i].instance.frameLoop();
			}
			if(this._cursor.text){
				if(this._LGuiJs != null) this._LGuiJs._canvas.style.cursor = "text";
				this._cursor.text = false;
			}
			else if(this._cursor.pointer){
				if(this._LGuiJs != null) this._LGuiJs._canvas.style.cursor = "pointer";
				this._cursor.pointer = false;
				//Hacer funcion para cada tipo de cursor
			}
			else this._LGuiJs._canvas.style.cursor = "default";	
		}
		
	}

	static getView(name = ""){
		return View._viewList[name];
	}

	static getViews(){
		return View._viewList;
	}

	getController(){
		return this._controller;
	}

	addElement(element, index){
		if(element != undefined){
			this._elementList.push({"instance": element, "z-index": index});
			this._elementList.sort((a,b) => (a["z-index"] > b["z-index"]) ? (1) : (-1) );
			element.setView(this);
		}
	}
}