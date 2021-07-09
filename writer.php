<?php
	include 'json_format.php';
	header('Content-Type: application/json');

	$fname = $_POST['to'];
	$data = $_POST['data'];
	$data = prettyPrint($data);
	$file = fopen("$fname", "w");
	fwrite($file, $data);
	fclose($file);
?>