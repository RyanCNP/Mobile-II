let express = require('express');
const mongoose = require('mongoose');

let url = "mongodb://localhost:27017/dsm_2026";

mongoose.Connection(url).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

const Us = mongoose.model('Usuario', mongoose.Schema({ name: String}));

let app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', async (req, res) => {
    const documentos = await Us.find({});
    console.log(documentos);
    res.send(documentos);
});

app.post('/add', (req, res) => {
    let i = req.query.name;
    res.send('Form submitted! ' + i);
});

app.put('/update', (req, res) => {
    let i = req.params.i;
    res.send('Form updated! ' + i);
});

app.delete('/delete', (req, res) => {
    let i = req.params.i;
    res.send('Form deleted! ' + i);
});