var achievements = [];

var playerScore, gamesPlayed = 0;

var newcomer = {
	name: 'Newcomer',
	desc: 'Play atleast one game!',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			setComplete(this);
			makeNotification(this);
		}
	}
}
achievements.push(newcomer);


var keenPlayer = {
	name: 'Keen player',
	desc: 'Play atleast 10 games!',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(gamesPlayed>=10){
				
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(keenPlayer);

var avidPlayer = {
	name: 'Avid player',
	desc: 'Play atleast 30 games!',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(gamesPlayed>=30){
				
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(avidPlayer);

var addiction = {
	name: 'Addicited player',
	desc: 'Play atleast 50 games!',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(gamesPlayed>=30){
				
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(addiction);

var scoreCollector = {
	name: 'Score collector',
	desc: 'Score atleast 200 points',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(playerScore>=200){
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(scoreCollector);

var scoreDemon = {
	name: 'Score demon',
	desc: 'Score atleast 400 points',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(playerScore>=400){
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(scoreDemon);

var scoreMaster = {
	name: 'Score master',
	desc: 'Score atleast 600 points',
	isComplete: null,
	progressCheck: function(){
		if(!isComplete(this)){
			if(playerScore>=600){
				setComplete(this);
				makeNotification(this);
			}
		}	
	}
}
achievements.push(scoreMaster);

function checkAchievmentProgress(lPlayerScore, lGamesPlayed){
	playerScore = lPlayerScore;
	gamesPlayed = lGamesPlayed;
	for(var i = 0; i<achievements.length; i++){
		achievements[i].progressCheck();
	}
}

function isComplete(achi){
	if(achi.isComplete===null){
		var localAchi = getStorageAchievements();
		for(var i = 0; i < localAchi.length; i++){
			if(String(localAchi[i].name)==achi.name){
				achi.isComplete = true;
			}
		}
		if(achi.isComplete===null){
			achi.isComplete = false;
		}
	}
	return achi.isComplete;
};

function setComplete(achi){
	var localAchi = getStorageAchievements();
	localAchi.push(achi);
	localStorage.achievements = JSON.stringify(localAchi);
	achi.isComplete = true;
};

function makeNotification(achi){
	alert('Completed ' + achi.name + ' - ' + achi.desc);
};

function getStorageAchievements(){
	if(!localStorage.achievements){
		localStorage.achievements = JSON.stringify([]);
	}
	return JSON.parse(localStorage.achievements);
}