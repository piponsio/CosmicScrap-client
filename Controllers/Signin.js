Element.getElement("submitSignin").addEventListener("click", function(me){
	var url = "http://localhost:8080/user/signin";
	url += "?login=";
	url += Element.getElement("userSignin").getValue();
	url += "&email=";
	url += Element.getElement("emailSignin").getValue();
	url += "&pass=";
	url += sha256(Element.getElement("passSignin").getValue());
	url += "&code=";
	url += Element.getElement("codeSignin").getValue();

	if(!(Element.getElement("passSignin").getValue() == Element.getElement("pass2Signin").getValue())){
	//Limitar también vacios (validar) pero despues de arreglar bug en server
		Element.getElement("messageSignin")._text = "Contraseñas no coinciden.";
	}
	else{
		LGuiJs.getGui("main").httpRequest("GET", url, function(http){
			console.log(http);
			if(http.readyState == 4 && http.status == 0){
				Element.getElement("messageSignin")._text = "No existe conexión al servidor.";
				//Mensaje repetido
			}
			if(http.readyState == 4 && http.status == 200){
				var response = JSON.parse(http.responseText);
		  		if(response.code == 201){
		  			LGuiJs.getGui("main").setView(View.getView("Home"));
		  		}
		  		else if(response.code == 303) Element.getElement("messageSignin")._text = "Error de registro.";
		  		else if(response.code == 305) Element.getElement("messageSignin")._text = "El usuario ya existe.";
		  		else if(response.code == 307) Element.getElement("messageSignin")._text = "El correo ya existe.";
		  		else if(response.code == 310) Element.getElement("messageSignin")._text = "Este código no existe.";
		  		else if(response.code == 311) Element.getElement("messageSignin")._text = "Código utilizado.";
			}
		});
	}
	//Automatizar proceso de envío de formlarios por que es una paja c&p
});