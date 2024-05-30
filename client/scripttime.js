// Pobierz element select
const selectTime = document.getElementById('time');

// Funkcja do generowania opcji godzin co 15 minut
function generateTimeOptions() {
  const startTime = 12 * 60; // Godzina początkowa w minutach (12:00)
  const endTime = 20 * 60;   // Godzina końcowa w minutach (20:00)
  const interval = 15;       // Interwał czasowy w minutach

  for (let time = startTime; time < endTime; time += interval) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60; // Wyliczamy minuty

    // Formatujemy minuty jako dwucyfrową liczbę
    const formattedMinutes = minutes.toString().padStart(2, '0');
    // Formatujemy czas
    const formattedTime = `${hours.toString().padStart(2, '0')}:${formattedMinutes}`;
    // Tworzymy nową opcję
    const option = new Option(formattedTime, formattedTime);
    // Dodajemy opcję do selecta
    selectTime.add(option);
  }
}

// Wywołaj funkcję generującą opcje godzin
generateTimeOptions();
