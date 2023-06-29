<?php

$database = "newDB";

$con = mysqli_connect("localhost", 'root', '', $database);
if (!$con)
    exit('Could not get the connection');

$rows = mysqli_query($con, $_REQUEST['query']);
$total = mysqli_fetch_assoc(mysqli_query($con, $_REQUEST['totalRecords']))['totalRecords'];

if (!$rows)
    echo "Query failed 😶";

$found = 0;
$data = array();

while ($row = mysqli_fetch_assoc($rows)) {
    $found++;
    $temp = array();
    foreach ($row as $key => $value)
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