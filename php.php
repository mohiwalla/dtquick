<?php

$con = mysqli_connect("localhost", 'root', '', "myDB");

if(!$con)
    die('could not get the connection');

$rows = mysqli_query($con, $_REQUEST['query']);
$total = mysqli_fetch_assoc(mysqli_query($con, "SELECT count(*) as allcount from datatable"))['allcount'];

if (!$rows)
    echo "Ducked so bad 😶";

$found = 0;
$data = array();

while ($row = mysqli_fetch_assoc($rows)) {
    $found++;
    $temp = array();
    foreach($row as $key => $value)
        $temp[$key] = $value;

    $data[] = $temp;
}

$response = array(
    "data" => $data,
    "found" => $found,
    "total" => $total
);

echo json_encode($response);

?>
