$(document).ready(function(){
	//Canvas init
	var canvas = $("#gameCanvas")[0];
	var ctx = canvas.getContext("2d");
	var canvasWidth = $("#gameCanvas").width();
	var canvasHeight = $("#gameCanvas").height();
	
	var bubbleRadius = Math.round(bubbleSprite.width/2); //The diameter of the bubble in pixels
	var lineDistance = 150; //The distance between each line in pixels
	var gameLines = [];

	var bubbleX = Math.round((canvasWidth/2)-bubbleRadius);
	var bubbleY = Math.round((canvasHeight/2)-bubbleRadius);

	var isDead; //Value for if the bubble is dead 

	function init(){
		startMouseGame();
	}
	
	var sprites = new Image();
	sprites.src = "images/sprite.png";
	
	// Make sure the image is loaded first otherwise nothing will draw.
	sprites.onload = init;
	
	
	function startMouseGame(){
		isDead = false;
		canvas.addEventListener('mousemove', mouseMoveBubble, false);
		createStartingLines();
		paint();
		update();
	}
	
	function mouseMoveBubble(event){
		var mousePos = getMousePos(event);
		bubbleX = Math.round(mousePos.x-bubbleRadius);
		bubbleY = Math.round(mousePos.y-bubbleRadius);
		paint();
	}
	
	function createStartingLines(){
		var numberLines = Math.floor(canvasHeight/lineDistance);
		for(var i = 0; i<numberLines; i++){
			gameLines.push(createNewLine((-lineDistance)*(i+1)));
		}
		
	}
	
	//Creates a line object at position x
	function createNewLine(position){
		var line = new Object();
		var randomOpening = Math.floor((Math.random()*(51)+20)/spikeSprite.width)*spikeSprite.width; //The extra bit of room
		line.position = position;
		line.leftLineSize = Math.floor(Math.random() * ((canvasWidth-bubbleSprite.width-randomOpening) + 1)/spikeSprite.width)*spikeSprite.width;
		line.openingSize = bubbleSprite.width+randomOpening;
		return line;
	}
	
	function update(){
		for (var i = 0; i < gameLines.length; i++) {
			gameLines[i].position++;
			if(gameLines[i].position>canvasHeight){
				gameLines.shift();
				gameLines.push(createNewLine(0));
			}
		}
		paint();
		if(!isDead){
			setTimeout(update, 1);
		}
	}
	
	function paint()
	{
		
		//Repaint the canvas everytime
		ctx.drawImage(sprites, bgSprite.x, bgSprite.y, bgSprite.width, bgSprite.height, 0, 0, canvasWidth, canvasHeight);   
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
		
		ctx.drawImage(sprites, bubbleSprite.x, bubbleSprite.y, bubbleSprite.width, bubbleSprite.height, 
			bubbleX, bubbleY, bubbleSprite.width, bubbleSprite.height);  
		
		for (var i = 0; i < gameLines.length; i++) {
			if(gameLines[i].position>0){
				drawLine(gameLines[i]);
				if(isLineCollision(gameLines[i])){
					isDead = true;
				}
				
			}
		}	
		
			
		
	}
	
	function drawLine(line){
		var firstSpikesToDraw = line.leftLineSize/spikeSprite.width;
		var secondSpikesToDraw = (canvasWidth-line.leftLineSize-line.openingSize)/spikeSprite.width;

		//Draw first point of line
		for(var i = 0; i<firstSpikesToDraw; i++){
			ctx.drawImage(sprites, spikeSprite.x, spikeSprite.y, spikeSprite.width, spikeSprite.height, 
				(i*spikeSprite.width), line.position, spikeSprite.width, spikeSprite.height); 
		}
		
				
		//Draw second point
		for(var i = 0; i<secondSpikesToDraw; i++){
		
			ctx.drawImage(sprites, spikeSprite.x, spikeSprite.y, spikeSprite.width, spikeSprite.height, 
				(canvasWidth-((1+i)*(spikeSprite.width))), line.position, spikeSprite.width, spikeSprite.height); 
		}
	}
	
	//This function detects if the bubble is on contact with 
	function isLineCollision(line){

		if((Math.abs(line.position-bubbleY-3)<=bubbleRadius)||(Math.abs(line.position-bubbleY-20)<=bubbleRadius)){
			var trueBubbleX = (bubbleX+bubbleRadius);
			var trueBubbleY = (bubbleY+bubbleRadius);
		
			//Check if we have a left hand spike
			if(line.leftLineSize>=spikeSprite.width){
				//Check the left hand line
				if(line.leftLineSize>=trueBubbleX){
					return true;
				}
				//Check the edge of left hand line
				//Works by measuring the distance between the edge of the line and the center of the bubble
				//if the distance is less than the radius we have a collision
				var topDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-line.leftLineSize, 2)+Math.pow(trueBubbleY-line.position, 2));
				var bottomDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-line.leftLineSize-5, 2)+Math.pow(trueBubbleY-line.position-15, 2));
				if((topDistanceToCircle<bubbleRadius-7)||(bottomDistanceToCircle<bubbleRadius-6)){
					console.log('Top: ' + topDistanceToCircle + '\nBottom: ' + bottomDistanceToCircle);
					return true;
				}
			}
			
		}
		return false;
	}
	
	//Function originally found at http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	//Was edited to work with my game
	function getMousePos(event) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }
	
});