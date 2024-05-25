// Pobierz element select
const selectTime = document.getElementById('time');

// Funkcja do generowania opcji godzin co 15 minut
function generateTimeOptions() {
  const startTime = 12 * 60; // Godzina początkowa w minutach (12:00)
  const endTime = 20 * 60;   // Godzina końcowa w minutach (20:00)
  const interval = 15;        // Interwał czasowy w minutach

  for (let time = startTime; time < endTime; time += interval) {
    const hours = Math.floor(time / 60);
    const minutes = (time % 60 === 0) ? '00' : '15'; // Zaokrąglamy do 15 minut

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    const option = new Option(formattedTime, formattedTime);
    selectTime.add(option);
  }
}

// Wywołaj funkcję generującą opcje godzin
generateTimeOptions();