new Background("background-example2", { 
		"background-color": "green",
		"z-index": 0,
		"width": window.innerWidth,
		"height": window.innerWidth
});

new Text("welcome-example2", {
		"text": "Welcome to View-example2",
		"font": "Comic Sans MS bold",
		"font-size": 35,
		"align": "center",
		"text-color": "black",
		"x": 200,
		"y": 300,
		"z-index": 1
});

new Input("input-example2", {
		"default-text": "Go to View-example1",
		"font": "Comic Sans MS",
		"font-size": 10,
		"text-align": "center",
		"text-color": "black",
		"border-color": "white",
		"border-size": 3,
		"background-color": "yellow",
		"x": 150,
		"y": 150,
		"z-index": 4,
		"width": 150,
		"height": 40,
		"margin": 5,
		"radius": 10,
		"type": "button"
	}
);

new Input("input-text-example2", {
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

new Input("input-password-example2", {
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