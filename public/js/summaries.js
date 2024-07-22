let quantityTotal = 0;
let summaryTime = 0;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    quantityTotal = 0;
    let latestEntry = null;

    data_Produksi.forEach(entry => {
        const timestampCapture = new Date(entry.timestamp_capture);
        if (timestampCapture <= currentDateTime) {
            quantityTotal++;
            if (!latestEntry || timestampCapture > new Date(latestEntry.timestamp_capture)) {
                latestEntry = entry;
            }
        }
    });

    if (latestEntry) {
        document.getElementById('summary-type').textContent = latestEntry.tipe_barang;
        document.getElementById('summary-quantity').textContent = quantityTotal;
        document.getElementById('summary-capture').textContent = latestEntry.timestamp_capture;

        summaryTime = operationTime - (2 * quantityTotal);
        if (summaryTime < 0) {
            summaryTime = 0;
        }
        summaryTime = summaryTime.toFixed(1);
        document.getElementById('summary-time').textContent = summaryTime;
    }
}
