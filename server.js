// Frontend is done and I need to focus on building the backend
// Establish the packages that will be used here: express middleware? fs function that will be used to send and return notes to the db.json file
const express = require('express');
const app = express();
const path = require('path');
// Create a variable to store our port establishing environment variables
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// GET Routes

app.get('/notes', (req, res) => {
    // GET /notes should return the notes.html file.
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get("*", (req, res) => {
    // GET * should return the index.html file.
    console.log(`Here is the main page that is running`);
    res.sendFile(path.join(__dirname, 'public/index.html'))

})
// This function will eliminate the get/notes prompt because a route was not found for each get/post
app.get('/api/notes', (req, res) => {
    // res.json__dirname
    // GET /api/notes should read the db.json file and return all saved notes as JSON.
    // Use node fs file here that gets stored into a variable.(readFile how to read a file using node.fs)
    // To take out of a json file is you would need to parse the data that was read out of the json file
    // Now it needs to be sent back to the browser with res.json()

})

// POST Route
app.post('/api/notes', (req, res) => {
    // POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
    // What extra steps do I need to take with the GET route above to include into the POST

})

// This is the port for the express server to run on
app.listen(PORT, () => console.log(`Express server is running on port ${PORT}`))