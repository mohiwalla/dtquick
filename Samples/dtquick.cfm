<cfscript>
    // Establish database connection
    db = new Query();
    db.setDatasource('datasource_name');

    // Build the query
    query = url.query;
    totalRecords = url.totalRecords;

    // Execute the query and get the total number of records
    rows = db.execute(query);
    total = db.execute(totalRecords).totalRecords;

    // Format the response as JSON and send it back to the client-side
    response = {
        data = [],
        found = 0,
        total = total
    };

    while(rows.next()) {
        row = {};
        for(col in rows.getColumnNames()) {
            row[col] = rows[col];
        }
        response.data.append(row);
        response.found++;
    }

    writeOutput(serializeJSON(response));
</cfscript>