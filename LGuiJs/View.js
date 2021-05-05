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
				var instance = this._elementList[i].instance;
			
				if(instance.isClick()){
			
				}

				if(instance.isMouseOver()){
					this._cursor.text = this._cursor.text || (instance._cursor == "text" && instance._is_mouse_over);
					this._cursor.pointer = this._cursor.pointer || (instance._cursor == "pointer" && instance._is_mouse_over);
				}

				this._elementList[this._elementList.length-1-i].instance.frameLoop();
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
			else{
				if(this._LGuiJs != null) this._LGuiJs._canvas.style.cursor = "default";	
			}	
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