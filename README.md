# DataTables Quick

DataTables Quick is a extremely light, fast and easy to use pre-written dyanmic JavaScript code to help programmers to display there data from data-base with almost no husstle. It requires quite less server side code and generates the queries itself. It is extremely easy to use and saves tons of time.

You can either include this script tag in the `<head>` section of you document...

```HTML
<script src="https://mohiwalla.github.io/dtquick/index.js" async defer></script>
```

or just copy the code from [index.js](https://github.com/mohiwalla/dtquick/blob/mohiwalla/index.js) and paste at the end of your document

# Initialization

To initialize `DataTables Quick` you just need to add a `<div>` element with `id="datatable"`.

# Attributes

Here are three `attributes` those have to be added in this `<div>`.

## db-table

It takes the name of the table as an argument to use it in the mysql query at server-side to fetch the data from the database.

## cols

All the name of the columns which you want to display in the table should be specified here in comma-seprated form (and no need to worry about the extra or less spaces). Every column name contains two parts one before the assignment operator for client-side to display in the table's `<th>` and another for the server-side (which name you have used to created the column in database) something like this...

```CSS
cols="S. no. = S,name = Name, E-mail = Email, Pass = Password"
```

## file-name

Specify the name of your server-side file here, to whick the `DataTables Quick` will send an AJAX request for the data.


# Complete example
```HTML
<div id="datatable" db-table="datatable" file-name="fetchli.php" cols="Address = Address,......"></div>

<script src="https://mohiwalla.github.io/dtquick/"></script>
```



# Server-side file

Server-side file should fetch the query. The total number of rows available in the table and the total found results as per query. You can use any server-side language with it as per you comfort. Here some sample code for [PHP](https://github.com/mohiwalla/dtquick#php) as server-side script has been provided for a reference.

## PHP

```PHP
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
```

# Miscellaneous

Credits : `Mr. Sumit Kumar Munjal`, `Mr. Prabhjot Singh`

Made by : `Kamaljot Singh`

Inspired By : `DataTables`

## Contributers : [mohiwalla](https://github.com/mohiwalla/)


#  **Note**
Before you start using it in production, Please note that this file sends query from client-side to the server-side which is not tradional at all. As the result of which anyone from the client side directly can modify the query to fetch the data from the your table, which is a potential risk to your data. If you want to have safety of please consider using [DataTables](https://datatables.net/) as it creates queries at server end and lower the risk. The sole purpose of creating queries at client-end was to keep the structure of the both client and server side file simple and easy to use for newbies. And if you find any bugs in the code or any possible improvements wihtout compromising the simplicity of usage you can send pull request or modified code on this hindustanjindabad5911@gmail.com. Existing code will be replaced by the code provided by you as soon as the eximination will finish and your name will be in the list of [contributes](https://github.com/mohiwalla/dtquick#contributers--mohiwalla) as well, So don't hesitate to give it a try. Lastly if you found it useful please consider giving a star to this repository.

Thanks a lot......
