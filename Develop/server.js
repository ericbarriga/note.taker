// dependencies 
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

//handling async processes
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)


// setting up server 
const app = express();
const PORT = process.env.PORT || 3000;


// idk what this does 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// static middleware
app.use(express.static('public'));




/// html routes ???/
app.get('/', (req, res,) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
)

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});






// api route , 'GET' request 
app.get('/api/notes', function (req, res) {

    readFileAsync('db/db.json', 'utf8').then(function (data) {

        const notes = [].concat(JSON.parse(data))
        res.json(notes)
    }).catch(err => {
        res.status(500).json(err);
    })
})




/// api route , 'POST' request
app.post('/api/notes', function (req, res) {
    const note = req.body;
    console.log(note);
    readFileAsync('db/db.json', 'utf8').then(function (data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1;
        notes.push(note);
        return notes
    }).then(function (notes) {
        writeFileAsync('db/db.json', JSON.stringify(notes))
        res.json(note)
    })
});

///api route , 'delete' request

app.delete('/api/notes/:id', function (req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync('db/db.json', 'utf8').then(function (data) {
        const notes = [].concat(JSON.parse(data))
        const newNotesData = []
        for (let i = 0; i < notes.length; i++) {
            if (idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function (notes) {
        writeFileAsync('db/db.json', JSON.stringify(notes))
        res.send('delete')
    })
})



app.get('*', (req, res,) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
)


app.listen(PORT, function () { console.log('are you listing bitch' + PORT) })