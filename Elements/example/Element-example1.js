new Background("background-example1", { 
		"background-color": "rgba(80,155,160,1)",
		"z-index": 0,
		"width": window.innerWidth,
		"height": window.innerWidth
});

var time = 0;
new Text("timer-example1", {
		"text": "Seg: 0",
		"font": "Comic Sans MS bold",
		"size": 15,
		"align": "left",
		"text-color": "white",
		"x": 2,
		"y": 15,
		"z-index": 1
	}, function(me){
		this.setText("Time: "+ Math.floor(time += (1000/60)/1000)+"s" );
	}
);

new Text("welcome-example1", {
		"text": "Welcome to View-example1",
		"font": "Comic Sans MS bold",
		"size": 30,
		"align": "left",
		"text-color": "white",
		"x": 300,
		"y": 100,
		"z-index": 1
});

new Input("input-example1", {
		"default-text": "Go to View-example2",
		"font": "Comic Sans MS",
		"size": 15,
		"text-align": "center",
		"text-color": "black",
		"border-color": "black",
		"border-size": 3,
		"background-color": "white",
		"x": 300,
		"y": 200,
		"z-index": 4,
		"width": 200,
		"height": 40,
		"margin": 5,
		"radius": 10,
		"type": "button"
	}
);