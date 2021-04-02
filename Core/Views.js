class View{
	_LGuiJs = null;

	_id;
	_elementList = [];
	//_elementTextCursor = [];
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
		for(var i = 0; i < this._elementList.length; i++) {
			this._elementList[i].instance.loadMedia();
		}
	}

	frameLoop(){
//		console.log("FrameLoop de View: "+this._id);
//		console.log(this._elementList.length + " Elementos");
		if(this._LGuiJs != null){
//			console.log(this._LGuiJs);
			for(var i = 0; i < this._elementList.length; i++){
				this._cursor.text = this._cursor.text || (this._elementList[i].instance._cursor == "text" && this._elementList[i].instance._isFocus);
				this._cursor.pointer = this._cursor.pointer || (this._elementList[i].instance._cursor == "pointer" && this._elementList[i].instance._isFocus);
				
				this._elementList[i].instance.frameLoop();
			}
	//		console.log(this._cursor.pointer);
			if(this._cursor.text){
				if(this._LGuiJs != null) this._LGuiJs._canvas.style.cursor = "text";
				this._cursor.text = false;
			}
			else if(this._cursor.pointer){
				if(this._LGuiJs != null) this._LGuiJs._canvas.style.cursor = "pointer";
				this._cursor.pointer = false;
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
			element._view.push(this);
		}
	}
}