# dtquick

DataTables Quick is a lightweight and fast JavaScript library that simplifies the process of displaying data from databases. With minimal server-side code required, DataTables Quick generates queries automatically and saves time. [Live demo here](https://mohiwalla.000webhostapp.com/dtquick/)

## Usage

There are several ways to use DataTables Quick:

- #### Using CDN

Include the following script tag in the `<head>` section of your HTML document to use DataTables Quick via CDN:

```HTML
<script src="https://cdn.jsdelivr.net/gh/mohiwalla/dtquick@mohiwalla/index.js" defer></script>
```

- #### Cloning the Repository

If you have Git installed on your machine, you can clone the repository using the following command:

```console
git clone https://github.com/mohiwalla/dtquick
```

- #### Installing via npm

If you have Node.js installed on your machine, you can use the following command to install the module:

```console
npm install dtquick
```

- #### Downloading the Script

You can also download the [index.js](https://github.com/mohiwalla/dtquick/blob/mohiwalla/index.js) file and include it in your HTML document using the following script tag:

```HTML
<script src="path/to/index.js" defer></script>
```

Alternatively, you can copy the code from [index.js](https://github.com/mohiwalla/dtquick/blob/mohiwalla/index.js) and paste it into a `<script>` tag in your HTML document.

## Initialization

To initialize DataTables Quick, add a `<div>` element with `id="datatable"`.

### Attributes

The following attributes must be added to the `<div>` element:

- #### db-table

Specifies the name of the table to be used in the MySQL query to fetch data from the database.

- #### cols

Specifies the names of the columns to be displayed in the table as a comma-separated list. Each column name should contain two parts: one for the client-side to display in the table's `<th>` and another for the server-side (which is the name used to create the column in the database). For example:

```CSS
cols="S. no. = S, name = Name, E-mail = Email, Pass = Password"
```

- #### file-name

Specifies the name of the server-side file to which DataTables Quick will send an AJAX request for data.

## Example

```HTML
<div id="datatable" db-table="datatable" file-name="fetch.php" cols="Address = Address,......"></div>

<script src="https://cdn.jsdelivr.net/gh/mohiwalla/dtquick@mohiwalla/index.js" defer></script>
```

## Server-Side File

The server-side file should fetch the query, the total number of rows available in the table, and the total found results as per query. You can use any server-side language with it as per your comfort. Code samples for server-side script have been provided for reference from the list of languages given below.
- [PHP](https://github.com/mohiwalla/dtquick/blob/mohiwalla/Samples/dtquick.php)
- [ColdFusion](https://github.com/mohiwalla/dtquick/blob/mohiwalla/Samples/dtquick.cfm)
- [Node.js](https://github.com/mohiwalla/dtquick/blob/mohiwalla/Samples/dtquick.js)
- [Python](https://github.com/mohiwalla/dtquick/blob/mohiwalla/Samples/dtquick.py)

## Miscellaneous

Credits: `Mr. Sumit Kumar Munjal`, `Mr. Prabhjot Singh`

Made by: `mohiwalla`

Inspired by: `DataTables`

## Note

Before using DataTables Quick in production, please note that this library sends a query from the client-side to the server-side, which is not traditional. Therefore, anyone from the client-side can modify the query to fetch data from your table, which is a potential risk to your data. If you want to have safety, please consider using [DataTables](https://datatables.net/) as it creates queries at the server end and lowers the risk. The purpose of creating queries at the client-end was to keep the structure of both client and server-side files simple and easy to use for newbies. If you find any bugs in the code or any possible improvements without compromising the simplicity of usage, you can send a pull request or modified code to hindustanjindabad5911@gmail.com. The existing code will be replaced by the code provided by you as soon as the examination is finished, and your name will be in the list of [Contributors](#contributors) as well, so don't hesitate to give it a try. Lastly, if you liked the effort, please consider giving a star to this repository.

## Licence

dtquick is distributed under [MIT LICENCE.](https://github.com/mohiwalla/dtquick/blob/mohiwalla/LICENSE)
