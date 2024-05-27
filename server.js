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
    // Step 1 POST/api/notes receives a new note to save on the request body
    console.info(`${req.method} request received to add new note`);
    const { text, title } = req.body;

    const newNote = {
        text,
        title,
        id: uuidv4() // Give each note a unique id
    };

    // Step 2 Read the db.json file and parse the data to JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        const notes = JSON.parse(data);
        notes.push(newNote);
        // After the file is read and updated into the db.json file, we are using the fs writeFile method to write the new note into the db.json file
        fs.writeFile(filePath, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error('Error writing file', err);
                return;
            }
            console.log('Note has been successfully written to file')
        });
    });
    res.json(newNote);
})

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    // Step 1: Get the note ID from the req parameters
    const noteId = req.params.id;
    // Step 2: Read all the notes in the db.json file to gather the list of notes
    const notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Step 3: Find the note with the matching ID using filter method
    const findNotes = notes.filter(note => note.id !== noteId);
    // Step 4: Now we need to save the updated list of notes back to the db.json file
    fs.writeFileSync(filePath, JSON.stringify(findNotes));

    res.json({ message: 'Successfully deleted note' });
});

app.get("*", (req, res) => {
    // GET * should return the index.html file.
    console.log(`Here is the main page that is running`);
    res.sendFile(path.join(__dirname, 'public/index.html'))

})

// This is the port for the express server to run on
app.listen(PORT, () => console.log(`Express server is running on port ${PORT}`))