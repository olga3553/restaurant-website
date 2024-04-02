window.onload = function() {
    // Pobierz rezerwacje z serwera
    fetch('/admin')
        .then(response => response.json())
        .then(data => {
            // Wyświetl rezerwacje na stronie
            const reservationsTable = document.getElementById('reservations-table');
            data.reservations.forEach(reservation => {
                const row = reservationsTable.insertRow();
                row.innerHTML = `
                    <td>${reservation.name}</td>
                    <td>${reservation.email}</td>
                    <td>${reservation.people}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td><button class="btn-cancel" data-id="${reservation._id}">Anuluj</button></td>
                `;
            });
        })
        .catch(error => {
            console.error('Wystąpił błąd podczas pobierania rezerwacji:', error);
        });
};
