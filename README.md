# `dataTables`

You have been provided an example of server-side scripting using PHP.
In your html file you just need to to paste this kind of CDN :-

```
https://mohiwalla.github.io/cdn.js/
```

And then initialize the `dataTablesLite` just by creating a div with `id="datatable"`. 
In the div you have to add an attribute named `cols` and write all the columns seprated with a comma.


`Example: <div id="datatable" cols="S. no. = S,name = Name, E-mail = Email, Pass = Password, Addresses = Address"></div>`

The assignment operator is to divide the client side part and server side part and luckily extra spaces don't matter.

The client-side part means which the user will see in table as coloumn name and server-side part is said for the coloumn names (keys) in database.


Once you have initialized the dataTablesLite in you index.html, then when ever the page will load the `function fetch()` will be called which will send five arguments to fetchList.php. Which are:

i) `orderBy` : a coloumn name according to which rows are desired to arrange;

ii) `order` : could be either 'ASC' or 'DESC' to sort elements in ascending or desending order;

iii) `limit` : the number of rows to be display per page (selected from drop down);

iv) `key`:  the search query entered in the search box;

v) `pageNo` : the page number on which the user clicked;

You can use these arguments in you server-side script for fetching, searching and sorting.



Credits : `Mr. Sumit Kumar Munjal`, `Mr. Prabhjot Singh`

Made by : `Kamaljot Singh`

Inspired By : `DataTables`


#  `Note` :
This is just a homework I did, given by my teachers, and is not intended to make money from. It has a lot of flaws and need to be improved and I definately I'll improve. So, dear `dataTables`, Please avoid to hit a blame on me 🙂
