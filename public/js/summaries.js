let quantityTotal = 0;
let totalStandardCycleAll = 0;
let summaryTime = 0;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    quantityTotal = 0;
    totalStandardCycleAll = 0;
    summaryTime = 0;

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

    const tbody = document.querySelector('.output-time tbody');
    tbody.innerHTML = '';

    if (Object.keys(latestEntries).length === 0) {
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
        Object.values(latestEntries).forEach(entry => {
            quantityTotal = data_Produksi.filter(e => {
                const timestampCapture = new Date(e.timestamp_capture);
                return e.tipe_barang === entry.tipe_barang && timestampCapture <= currentDateTime;
            }).length;

            summaryTime = operationTime - totalStandardCycleAll;
            if (summaryTime < 0) {
                summaryTime = 0;
            }
            summaryTime = parseFloat(summaryTime.toFixed(1));

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.tipe_barang}</td>
                <td>${entry.standard_cycle}</td>
                <td>${quantityTotal}</td>
                <td>${entry.timestamp_capture}</td>
                <td>${summaryTime}</td>
            `;

            tbody.appendChild(newRow);
        });
    }
}