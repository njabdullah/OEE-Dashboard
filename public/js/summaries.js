let quantityTotal = 0;
let totalStandardCycleAll = 0;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    quantityTotal = 0;
    totalStandardCycleAll = 0;

    // Find the latest entry for each tipe_barang
    const latestEntries = {};
    data_Produksi.forEach(entry => {
        const timestampCapture = new Date(entry.timestamp_capture);
        if (timestampCapture <= currentDateTime) {
            const tipeBarang = entry.tipe_barang;
            if (!latestEntries[tipeBarang] || timestampCapture > new Date(latestEntries[tipeBarang].timestamp_capture)) {
                latestEntries[tipeBarang] = entry;
            }
            totalStandardCycleAll += entry.standard_cycle;
        }
    });

    // Get the table body element
    const tbody = document.querySelector('.output-time tbody');

    // Clear existing rows (except the header)
    tbody.innerHTML = '';

    if (Object.keys(latestEntries).length === 0) {
        // If no data, add a single row with "-" values
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        `;
        tbody.appendChild(emptyRow);
    } else {
        // Add new rows for each latest entry
        Object.values(latestEntries).forEach(entry => {
            quantityTotal = data_Produksi.filter(e => {
                const timestampCapture = new Date(e.timestamp_capture);
                return e.tipe_barang === entry.tipe_barang && timestampCapture <= currentDateTime;
            }).length;

            // Create a new row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.tipe_barang}</td>
                <td>${entry.standard_cycle}</td>
                <td>${quantityTotal}</td>
                <td>${entry.timestamp_capture}</td>
                <td>${Math.max(0, (operationTime - totalStandardCycleAll).toFixed(1))}</td>
            `;

            // Append the new row to the tbody
            tbody.appendChild(newRow);
        });
    }
}
