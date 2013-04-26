<?php
	//Connects to the database
	require_once("db.php");
	
	//Insert the new score into database
	mysql_query("INSERT INTO `bubbleFloat_highscores` (`name`, `score`) VALUES 
		('".mysql_real_escape_string($_GET['name'])."', '".mysql_real_escape_string($_GET['score'])."')"); 
?>