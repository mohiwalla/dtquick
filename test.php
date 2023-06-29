<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="duck"></div>
    <script src="inex.js"></script>
    <script>
      var table = new dtquick("#duck", {
        cols: ["S", "Name", "Email", "Address"],
        limits: [10, 20, 50, 100, 1000],
        ajaxFile: 'fetch.php',
        table: 'datatable',
        defLimit: 10,
        searchBoxAutoFocus: true
      });
    </script>
  </body>
</html>