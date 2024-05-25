// Frontend is done and I need to focus on building the backend
// Establish the packages that will be used here: express middleware? fs function that will be used to send and return notes to the db.json file
const fs = require('node:fs');
const express = require('express');
const app = express();
const path = require('path');
// Create a way to create a unique id for each note in the POST route
const { v4: uuidv4 } = require('uuid');
// Create a variable to store our port establishing environment variables
const PORT = process.env.PORT || 3000

// Variable to store db.json as a file path
const filePath = './db/db.json';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// GET Routes

app.get('/notes', (req, res) => {
    // GET /notes should return the notes.html file.
    console.log(`Here is the notes page`)
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    // res.json__dirname
    // GET /api/notes should read the db.json file and return all saved notes as JSON.

    // Use node fs file here that gets stored into a variable.(readFile how to read a file using node.fs)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes' });
            return;
        }
        console.log(data);
        // To take out of a json file is you would need to parse the data that was read out of the json file
        let savedNotes = [];

        if (data) {
            savedNotes = JSON.parse(data);
        }

        // Now it needs to be sent back to the browser with res.json()
        res.json(savedNotes);
    });


})

// POST Route
app.post('/api/notes', (req, res) => {
    // POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
    // What extra steps do I need to take with the GET route above to include into the POST
    // Step 1 POST/api/notes receives a new note to save on the request body
    const newNote = req.body;

    // Give each note a unique id
    newNote.id = uuidv4();
    console.log(newNote);
    // Step 2 Add the new note to the db.json file and return the new note to the client
    // fs.readFileSync
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err
        console.log(data)
        // After the file is read the data needs to be updated into the db.json file. Include a variable to store JSON data to be include in writeFile method
        const jsonData = JSON.stringify(data);
        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error('Error writing file', err);
                return;
            }
            console.log('Note has been successfully written to file')
        });
    });
    res.json(newNote);


})
app.get("*", (req, res) => {
    // GET * should return the index.html file.
    console.log(`Here is the main page that is running`);
    res.sendFile(path.join(__dirname, 'public/index.html'))

})

// This is the port for the express server to run on
app.listen(PORT, () => console.log(`Express server is running on port ${PORT}`))