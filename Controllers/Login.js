Element.getElement("submitInput").addEventListener("click", function(me){
	var url = "http://localhost:8080/user/login";
	url += "?login=";
	url += Element.getElement("userInput").getValue();
	url += "&pass=";
	url += sha256(Element.getElement("passInput").getValue());

	LGuiJs.getGui("main").httpRequest("GET", url, function(http){
		if(http.readyState == 4 && http.status == 0){
			Element.getElement("messageLogin")._text = "No existe conexión al servidor.";
		}
		if(http.readyState == 4 && http.status == 200){
			console.log(http.responseText);
	  		var response = JSON.parse(http.responseText);
	  		if(response.code == 200){
	  			LGuiJs.getGui("main").setView(View.getView("Home"));
	  		}
	  		else if(response.code == 300){
	  			Element.getElement("messageLogin")._text = "Usuario o contraseña erronea.";
	  		}
		}
	});
});

Element.getElement("signinButton").addEventListener("click", function(me){
	LGuiJs.getGui("main").setView(View.getView("Signin"));
//	LGuiJs.getGui("main")._canvas.requestFullscreen();
});