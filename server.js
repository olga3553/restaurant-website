const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/rezerwacje');
const db = mongoose.connection;

// Ustawienie katalogu, który będzie serwowany statycznie
app.use(express.static(path.join(__dirname, 'client')));

// Endpoint dla strony głównej
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Endpoint dla strony rezerwacji
app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'reservation.html'));
});

// Definicja schematu dla danych rezerwacji
const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    people: Number,
    date: Date,
    time: String
});

// Model danych rezerwacji
const Reservation = mongoose.model('Reservation', reservationSchema);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/reservation', (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const people = req.body.people;
        const date = req.body.date;
        const time = req.body.time;
        
        // Wykonaj operacje na danych, np. zapisz do bazy danych
        const newReservation = new Reservation({
            name: name,
            email: email,
            people: people,
            date: date,
            time: time
        });

        // Zapisanie nowej rezerwacji do bazy danych
        newReservation.save().then(savedReservation => {
            res.send('Dziękujemy za dokonanie rezerwacji!');
        },
        err => {
            console.error(err);
            res.status(500).send('Wystąpił błąd podczas zapisywania rezerwacji.');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Wystąpił błąd podczas przetwarzania rezerwacji.');
    }
});

// Nasłuch na określonym porcie
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});