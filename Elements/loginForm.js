new Input("userInput", {
		"default-text": "Username",
		"font": "Comic Sans MS",
		"font-size": 15,
		"text-align": "center",
		"text-color": "black",
		"border-color": "black",
		"border-size": 3,
		"background-color": "white",
		"x": (window.innerWidth/2)-(250/2),
		"y": 100,
		"z-index": 4,
		"width": 250,
		"height": 40,
		"margin": 5,
		"radius": 10,
		"type": "text"
	}
);

new Input("passInput", {
		"default-text": "Password",
		"font": "Comic Sans MS",
		"font-size": 15,
		"text-align": "center",
		"text-color": "black",
		"border-color": "black",
		"border-size": 3,
		"background-color": "white",
		"x": (window.innerWidth/2)-(250/2),
		"y": 150,
		"z-index": 4,
		"width": 250,
		"height": 40,
		"margin": 5,
		"radius": 10,
		"type": "password"
	}
);
new Input("submitInput", {
		"default-text": "Log in",
		"font": "Comic Sans MS",
		"font-size": 15,
		"text-align": "center",
		"text-color": "black",
		"border-color": "black",
		"border-size": 3,
		"background-color": "white",
		"x": (window.innerWidth/2)+25,
		"y": 200,
		"z-index": 4,
		"width": 100,
		"height": 40,
		"margin": 5,
		"radius": 10,
		"type": "button"
	}
);

new Input("signinButton", {
	"default-text": "Sign in",
	"font": "Comic Sans MS",
	"font-size": 15,
	"text-align": "center",
	"text-color": "black",
	"border-color": "black",
	"border-size": 3,
	"background-color": "white",
	"x": (window.innerWidth/2)-(250/2),
	"y": 200,
	"z-index": 4,
	"width": 100,
	"height": 40,
	"margin": 5,
	"radius": 10,
	"type": "button"
});

new Text("messageLogin", {
	"text": "",
	"font": "Comic Sans MS bold",
	"font-size": 15,
	"align": "left",
	"text-color": "white",
	"x": (window.innerWidth/2)-(250/2),
	"y": 265,
	"z-index": 1
});