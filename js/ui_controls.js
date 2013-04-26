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
	return false;
});

$('#submitScoreButton').click(function(){
	$('#gameReview').fadeOut(200, function(){
		$('#postScore').html($('#finalScore').html());
		$('#submitScore').fadeIn(500);
	})
	return false;
});

$('#playAgain').click(function(){
	$('#gameReview').fadeOut(200, function(){
		startGame(playingWithMouse);
	})
	return false;
});

$('#backToMenu').click(function(){
	backToMenu();
	return false;
});

$('#helpButton').click(function(){
	achievementSound.play();
	var noty = $('#achievmentBox').noty({
		text: 'Achievment Unlocked: Speed Demon - Have a speed faster',
		timeout: 800,
		dismissQueue: false
	});
	return false;
});

$('#showAchievements').click(function(){
	loadAchievementsPage();
	return false;
});

function backToMenu(){
	$('#gameTitle').fadeOut(200, function(){
		$('#gameTitle').html('Bubble Float');
		$('#gameTitle').fadeIn(500);
	})
	$('#achievmentList').fadeOut(200);
	$('#highscores').fadeOut(200);
	$('#gameReview').fadeOut(200, function(){
		$('#gameMenu').fadeIn(500);
	})
}

$('#loadHighscores').click(function(){
	loadHighscoresPage();
	return false;
});