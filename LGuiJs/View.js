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
				//this._elementList[this._elementList.length-1].instance._mouse_over_flag = false;
				if(this._elementList[i].instance.isClick()){
					for(var j = 0; j < this._elementList[i].instance._click_event.length; j++){
						this._elementList[i].instance._click_event[j].apply(this, [this._elementList[i].instance]);
					}
					for(var j = 0; j < this._elementList.length; j++){
						if(this._elementList[j] != this._elementList[i]) this._elementList[j].instance._is_click = false;
					}

					console.log("click dentro de : "+this._elementList[i].instance.ClassName);
					LGuiJs._mouse.click.x = undefined;
					LGuiJs._mouse.click.y = undefined;
				}

				if(this._elementList[i].instance.isMouseOver()){
					//this._elementList[i].instance._mouse_over_flag = false;
					//Bug
					//al entrar a una debería desactivar a las otras
					//actualmente una desactiva a la otra, esta al estar
					//desactivada se activa y desactiva a las otras
					//loop
					/*
					for(var j = 0; j < this._elementList.length; j++){
						if(this._elementList[j] != this._elementList[i]){
						
							this._elementList[j].instance._is_mouse_over = false;
//							this._elementList[j].instance._mouse_over_flag = false;

							this._elementList[j].instance._is_mouse_out = true;
//							this._elementList[j].instance._mouse_out_flag = true;

						}
					}
					*/

					//console.log("dentro de : "+this._elementList[i].instance.ClassName);
					this._cursor.text = this._cursor.text || (this._elementList[i].instance._cursor == "text" && this._elementList[i].instance._is_mouse_over);
					this._cursor.pointer = this._cursor.pointer || (this._elementList[i].instance._cursor == "pointer" && this._elementList[i].instance._is_mouse_over);

					//LGuiJs._mouse.position.x = undefined;
					//LGuiJs._mouse.position.y = undefined;
				}

				this._elementList[this._elementList.length-1-i].instance.frameLoop();
			}
		
			//Crear metodo para disparar los eventos, todos deberían ser parecidos

			//unificar con for de arriba
			/*
			for(var i = 0; i < this._elementList.length; i++){
				
				//this._elementList[i].instance.frameLoop();
			}
			*/
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
		}	}
		
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