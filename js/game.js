$(document).ready(function(){
	//Canvas init
	var canvas = $("#gameCanvas")[0];
	var ctx = canvas.getContext("2d");
	var canvasWidth = $("#gameCanvas").width();
	var canvasHeight = $("#gameCanvas").height();
		
	var bubbleRadius = Math.round(bubbleSprite.width/2); //The diameter of the bubble in pixels
	var lineDistance = 150; //The distance between each line in pixels
	var startingSpeed = 7; //The starting speed of the game (Lower = Faster)
	var scoreToIncreaseSpeed = 75; //Every time the players score reachs a multiple of this number the speed will increase. 
	
	var gameLines;
	var pressedKeys = [];
	var keysCheckInterval; //The interval to check which keys have been pressed down
	var playingWithMouse = null;
	
	var bubbleX = Math.round((canvasWidth/2)-bubbleRadius);
	var bubbleY = Math.round((canvasHeight/2)-bubbleRadius);

	var playerScore = 0;
	var scoreLoopCounter = 0; //The loop to slow down the score increment
	var isDead; //Value for if the bubble is dead 

	function init(){
		paintBackground();
	}
	
	var sprites = new Image();
	sprites.src = "images/sprite.png";
	
	// Make sure the image is loaded first otherwise nothing will draw.
	sprites.onload = init;
	
	
	function startGame(isMouse){
		updateGamesPlayed();
		toggleCursor(false);
		gameLines = [];
		playerScore = 0;
		isDead = false;
		
		//Fade the title and show the speed and score box

		$('#gameTitle').fadeOut(1000, function(){
			$('#speed').fadeIn(500);
			$('#score').fadeIn(500);
		})
		
		$('#gameCanvas').focus();
		
		if(isMouse){
			playingWithMouse = true;
			canvas.addEventListener('mousemove', mouseMoveBubble, false);
		}else{
			playingWithMouse = false;
			keysCheckInterval = setInterval(checkKeyboardKeys, 11)
		}
		createStartingLines();
		paint();
		update();
	}
	
	function createStartingLines(){
		var numberLines = Math.ceil(canvasHeight/lineDistance);
		for(var i = 0; i<numberLines; i++){
			gameLines.push(createNewLine((-lineDistance)*(i+1)));
		}
		
	}
	
	//Creates a line object at position x
	function createNewLine(position){
		var line = new Object();
		
		//The size of the opening for the bubble (Between 1.5*(The bubble width) and 2.5*(The bubble width))
		var openingSize = Math.floor(bubbleSprite.width*1.5 + (Math.random()*bubbleSprite.width)); 
		
		line.position = position;
		line.leftLineSize = Math.floor(Math.random() * ((canvasWidth-openingSize) + 1)/spikeSprite.width)*spikeSprite.width;
		line.rightLineSize = Math.floor((canvasWidth-openingSize-line.leftLineSize)/spikeSprite.width)*spikeSprite.width;
		return line;
	}
	
	function mouseMoveBubble(event){
		var mousePos = getMousePos(event);
		moveBubbleTo(Math.round(mousePos.x-bubbleRadius), Math.round(mousePos.y-bubbleRadius));
	}
	
	function checkKeyboardKeys(){
		if(pressedKeys[37])
			moveBubbleTo(bubbleX-2, bubbleY);
		if(pressedKeys[38])
			moveBubbleTo(bubbleX, bubbleY-2);
		if(pressedKeys[39])
			moveBubbleTo(bubbleX+2, bubbleY);
		if(pressedKeys[40])
			moveBubbleTo(bubbleX, bubbleY+2);
	}
	
	function moveBubbleTo(x, y){
		if(!isDead){
			if((x<canvasWidth-bubbleSprite.width)&&(x>0)&&(y>0)&&(y<canvasHeight-bubbleSprite.height)){
				bubbleX = x;
				bubbleY = y;
				paint();
			}
		}else{
			deadSequence();
		}
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
			setTimeout(update, getGameSpeed());
		}else{
			deadSequence();
		}
		if(scoreLoopCounter>12){
			checkAchievmentProgress(playerScore, getGamesPlayed());
			$('#score').html('Current Score: ' + ++playerScore);
			$('#speed').html('Speed: ' + ((startingSpeed+2)/(getGameSpeed()+2)).toFixed(2) + 'x');
			scoreLoopCounter = 0;
		}else{
			scoreLoopCounter++;
		}		
	}
	
	function paint()
	{
		canvas.width = canvas.width;
		paintBackground();
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
	
	function paintBackground(){
		ctx.drawImage(sprites, bgSprite.x, bgSprite.y, bgSprite.width, bgSprite.height, 0, 0, canvasWidth, canvasHeight);
	} 
	
	function drawLine(line){
		var firstSpikesToDraw = line.leftLineSize/spikeSprite.width;
		var secondSpikesToDraw = line.rightLineSize/spikeSprite.width;

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
	
	//Returns the 
	function getGameSpeed(){
		var speedIncreaser = Math.floor(playerScore/scoreToIncreaseSpeed);
		if(speedIncreaser>=startingSpeed){
			return 1;
		}else{
			return startingSpeed-speedIncreaser;
		}
	}
	
	//This function detects if the bubble is on contact with 
	function isLineCollision(line){

		if((Math.abs(line.position-bubbleY-5)<=bubbleRadius)||(Math.abs(line.position-bubbleY-20)<=bubbleRadius)){
			var trueBubbleX = (bubbleX+bubbleRadius);
			var trueBubbleY = (bubbleY+bubbleRadius);
		
			//Check if we have a left hand spide
			if(line.leftLineSize>=spikeSprite.width){

				//Check if we have directly hit the left hand line
				if(line.leftLineSize>=trueBubbleX){
					return true;
				}
				
				//Check the edge of left hand line
				//Works by measuring the distance between the edge of the line and the center of the bubble
				//if the distance is less than the radius we have a collision
				var topDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-line.leftLineSize, 2)+Math.pow(trueBubbleY-line.position, 2));
				var bottomDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-line.leftLineSize-5, 2)+Math.pow(trueBubbleY-line.position-15, 2));
				if((topDistanceToCircle<bubbleRadius-7)||(bottomDistanceToCircle<bubbleRadius-7)){
					return true;
				}
			}
			
			//Check if we have a right hand spide
			if(line.rightLineSize>=spikeSprite.width){
				
				var rightLinePos = (canvasWidth-line.rightLineSize); //X coord of that start of the right line
				
				//Check if we have directly hit the right hand line
				if(rightLinePos<trueBubbleX){
					return true;
				}
				
				//Check the edge of right hand line
				var topDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-rightLinePos, 2)+Math.pow(trueBubbleY-line.position, 2));
				var bottomDistanceToCircle = Math.sqrt(Math.pow(trueBubbleX-rightLinePos+5, 2)+Math.pow(trueBubbleY-line.position-15, 2));
				if((topDistanceToCircle<bubbleRadius-7)||(bottomDistanceToCircle<bubbleRadius-7)){
					return true;
				}
			}
			
		}
		return false;
	}
	
	function deadSequence(){
		playSound('pop');
		toggleCursor(true);
		if(!playingWithMouse){
			clearInterval(keysCheckInterval);
		}else{
			canvas.removeEventListener('mousemove', mouseMoveBubble, false);
		}
		ctx.globalAlpha = 0.1;
		var alphaCount = 0;
		var fadeOutGameInterval = setInterval(function(){
			if(alphaCount<20){
				ctx.globalAlpha = ctx.globalAlpha+0.02;
				paintBackground();
				alphaCount++;
			}else{
				clearInterval(fadeOutGameInterval);
				canvas.width = canvasWidth;
				paintBackground();
				showGameReview();
			}
		}, 50)
		showGameReview();
		
	}
	
	function playSound(type){
		switch(type){
			case 'achievement':
				new Audio("sounds/achiv.mp3").play();
				break;
			case 'pop':
				new Audio("sounds/pop.mp3").play();
				break;
			case 'powerup':
				new Audio("sounds/powerup.mp3").play();
				break;
		}	
	}
	
	function showGameReview(){
		
		$('#finalScore').html(playerScore);
	
		$('#gameTitle').html('Game Over!');
		$('#speed').fadeOut(500, function(){
			$('#gameTitle').fadeIn(500);
			$('#gameReview').fadeIn(500);
		})
		$('#score').fadeOut(500);
	}
	
	function updateGamesPlayed(){
		localStorage.gamesPlayed = getGamesPlayed()+1;
	}
	
	function getGamesPlayed(){
		if(!localStorage.gamesPlayed)
			localStorage.gamesPlayed = 0;
		return parseInt(localStorage.gamesPlayed);
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
		
	function toggleCursor(on){
		if(on){
			//Show cursor
			$('#gameCanvas').css("cursor", "auto");
		}else{
			//Hide Cursor
			$('#gameCanvas').css("cursor", "none");
		}
	}
	
	$('#mouseStart').click(function(){
		$('#gameMenu').fadeOut(200, function(){
			startGame(true);
		})
		return false;
	});
	
	$('#keyboardStart').click(function(){
		$('#gameMenu').fadeOut(200, function(){
			startGame(false);
		})
	});
	
	$('#playAgain').click(function(){
		$('#gameReview').fadeOut(200, function(){
			startGame(playingWithMouse);
		})
	});
	
	$('#backToMenu').click(function(){
		$('#gameReview').fadeOut(200, function(){
			$('#gameMenu').fadeIn(500);
		})
	});
	
	$(document).keydown(function(e){
		if(!playingWithMouse){
			pressedKeys[e.which] = true;
			e.preventDefault();
		}
	}).keyup(function(e) {
		if(!playingWithMouse){
			delete pressedKeys[e.which];
		}
	});
	
});