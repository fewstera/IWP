function loadHighscoresPage(){
	$('#gameTitle').fadeOut(200, function(){
		$('#gameTitle').html('Highscores');
		$('#gameTitle').fadeIn(500);
	})
	$('#gameMenu').fadeOut(200, function(){
	
		//$('#achievmentList ul').html(achievmentsHtml);
		$('#highscores').fadeIn(500);
	})
}