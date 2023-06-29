<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="duck"></div>
    <script src="inex.js"></script>
    <script>
      var table = new dtquick("#duck", {
        cols: ["S.no.", "Name", "Address"],
        defLimit: 100,
        ajaxFile: 'fetch.php'
      });
    </script>
  </body>
</html>
