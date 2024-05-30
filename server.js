require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Middleware do parsowania ciała żądania
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ustawienie mechanizmu sesji
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

// Ustawienie widoku EJS dla strony administratora
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client'));

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/rezerwacje', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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

// Endpoint dla strony potwierdzenia
app.get('/confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'confirmation.html'));
});

// Endpoint dla strony logowania
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.render('login', { errorMessage: 'Nieprawidłowe dane logowania' });
  }
});

// Middleware do sprawdzania, czy użytkownik jest zalogowany
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Endpoint dla strony administracyjnej
app.get('/admin', isAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.render('admin', { reservations: reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send('Wystąpił błąd podczas pobierania rezerwacji.');
  }
});

// Endpoint do anulowania rezerwacji
app.delete('/cancel/:id', async (req, res) => {
  try {
    const reservationId = req.params.id;
    await Reservation.findByIdAndDelete(reservationId);
    res.status(200).send('Rezerwacja anulowana');
  } catch (err) {
    console.error(err);
    res.status(500).send('Wystąpił błąd podczas anulowania rezerwacji.');
  }
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

app.post('/reservation', async (req, res) => {
  try {
    const { name, email, people, date, time } = req.body;

    // Wykonaj operacje na danych, np. zapisz do bazy danych
    const newReservation = new Reservation({ name, email, people, date, time });

    // Zapisanie nowej rezerwacji do bazy danych
    await newReservation.save();
    res.redirect('/confirmation');
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
