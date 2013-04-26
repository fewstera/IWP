function loadHighscoresPage(){
	$('#gameTitle').fadeOut(200, function(){
		$('#gameTitle').html('Highscores');
		$('#gameTitle').fadeIn(500);
	})
	$('#gameMenu').fadeOut(200, function(){
		$.get("getScores.php", function(highscores) {
			$('#highscores ul').empty();
			highscores = JSON.parse(highscores);
			$(highscores).each(function(index, score) {
			    $('#highscores ul').append(
			        $(document.createElement('li')).text(score.position + '. ' + score.name + ' (Score: ' + score.score + ')')
			    );
			});
			$('#highscores ul').append('<li><a href="#" onclick="backToMenu(); return false;">Back to menu</a></li>');
			$('#highscores').fadeIn(500);
		});

	})
}

function saveHighScore(score, name){
	$.get("submitScore.php", { name: name, score: score } );
}
