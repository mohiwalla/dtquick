# DataTables Quick

DataTables Quick is an extremely light, fast, and easy-to-use pre-written dynamic JavaScript code that helps programmers display their data from databases with almost no hassle. It requires minimal server-side code and generates queries automatically, saving tons of time.

You can either include this CDN in the `<head>` section of your `HTML` document:

```HTML
<script src="https://cdn.jsdelivr.net/gh/mohiwalla/dtquick@mohiwalla/index.js" async defer></script>
```

Or just copy the code from [index.js](https://github.com/mohiwalla/dtquick/blob/mohiwalla/index.js) and paste it at the end of your document.

## Initialization

To initialize DataTables Quick, you just need to add a `<div>` element with `id="datatable"`.

## Attributes

Three attributes have to be added to this `<div>`:

### db-table

It takes the name of the table as an argument to use it in the MySQL query at the server-side to fetch the data from the database.

### cols

All the names of the columns that you want to display in the table should be specified here in a comma-separated form (with no need to worry about extra or fewer spaces). Every column name contains two parts: one before the assignment operator for client-side to display in the table's `<th>` and another for the server-side (which name you have used to create the column in the database), something like this:

```CSS
cols="S. no. = S, name = Name, E-mail = Email, Pass = Password"
```

### file-name

Specify the name of your server-side file here, to which DataTables Quick will send an AJAX request for the data.

## Complete example

```HTML
<div id="datatable" db-table="datatable" file-name="fetchli.php" cols="Address = Address,......"></div>

<script src="https://cdn.jsdelivr.net/gh/mohiwalla/dtquick@mohiwalla/index.js" async defer></script>
```

## Server-side file

The server-side file should fetch the query, the total number of rows available in the table, and the total found results as per query. You can use any server-side language with it as per your comfort. Here is some sample code for [PHP](#php) as a server-side script provided for reference.

### PHP

```PHP
<?php

$database = "myDB";
$table = "datatable";

$con = mysqli_connect("localhost", 'root', '', $database);

if (!$con) {
    die('Could not get the connection');
}

$rows = mysqli_query($con, $_REQUEST['query']);
$total = mysqli_fetch_assoc(mysqli_query($con, "SELECT count(*) as allcount from $table"))['allcount'];

if (!$rows) {
    echo "Query failed 😶";
}

$found = 0;
$data = array();

while ($row = mysqli_fetch_assoc($rows)) {
    $found++;
    $temp = array();
    foreach($row as $key => $value) {
        $temp[$key] = $value;
    }

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

## Miscellaneous

Credits: `Mr. Sumit Kumar Munjal`, `Mr. Prabhjot Singh`

Made by: `Kamaljot Singh`

Inspired by: `DataTables`

### Contributors: [mohiwalla](https://github.com/mohiwalla/), [YshDhiman](https://github.com/yshdhiman)

## Note

Before you start using it in production, please note that this file sends a query from the client-side to the server-side, which is not traditional at all. As a result of this, anyone from the client side can modify the query to fetch the data from your table, which is a potential risk to your data. If you want to have safety, please consider using [DataTables](https://datatables.net/) as it creates queries at the server end and lowers the risk. The sole purpose of creating queries at the client end was to keep the structure of both client and server-side files simple and easy to use for newbies. If you find any bugs in the code or any possible improvements without compromising the simplicity of usage, you can send a pull request or modified code to hindustanjindabad5911@gmail.com. The existing code will be replaced by the code provided by you as soon as the examination is finished, and your name will be in the list of [Contributors](#Contributors) as well, so don't hesitate to give it a try. Lastly, if you liked the effort, please consider giving a star to this repository.

Thank you.
