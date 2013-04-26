<?php
	//Connects to the database
	require_once("db.php");
	
	//select the top ten
	$query = mysql_query("SELECT name, score FROM `bubbleFloat_highscores` ORDER BY `score` DESC LIMIT 10"); 
	$position = 1;
	while($row = mysql_fetch_assoc($query)) {
		//Add the players position
		$row['position'] = $position;
    	$rows[] = $row;
    	$position++;
    }
    echo json_encode($rows);
?>