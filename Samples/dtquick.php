<?php

$database = "newDB";

// Establish database connection
$con = mysqli_connect("localhost", 'root', '', $database);
if (!$con)
    exit('Could not get the connection');

// Execute the query and get the total number of records
$rows = mysqli_query($con, $_REQUEST['query']);
$total = mysqli_fetch_assoc(mysqli_query($con, $_REQUEST['totalRecords']))['totalRecords'];

if (!$rows)
    die(mysqli_error($con));

$found = 0;
$data = array();

while ($row = mysqli_fetch_assoc($rows)) {
    $found++;
    $temp = array();
    foreach ($row as $key => $value)
        $temp[$key] = $value;

    $data[] = $temp;
}

// Format the response as JSON and send it back to the client
$response = array(
    "data" => $data,
    "found" => $found,
    "total" => $total
);

echo json_encode($response);
?>
