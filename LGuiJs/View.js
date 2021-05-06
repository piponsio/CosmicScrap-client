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
					this._LGuiJs._canvas.style.cursor = instance._cursor;
				}

				this._elementList[this._elementList.length-1-i].instance.frameLoop();
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