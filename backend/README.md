# Industrial Temperature Management System Backend

This project has been created by the help of [Backend API Generator]("https://www.npmjs.com/package/bapig").

## Available Scripts

In the directory you can run:

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:1000](http://localhost:1000) to view the backend in your browser.


# Temperature Handling Route
On Development => POST data to http://localhost:1000/temperature/create
On production => POST data to https://itms.bapig.dev:1001/temperature/create

Body to post must be a stringified object (JSON)

Example:
```JSON
{
        "branch": 1, /* branch id goes here */
        "temperature": 30
}
```