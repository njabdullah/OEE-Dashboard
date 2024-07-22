function updateSummary(adjustedDate, adjustedTime) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    let quantityTotal = 0;
    let lastCapture = null;

    data_Produksi.forEach(entry => {
        const timestampCapture = new Date(entry.timestamp_capture);
        if (timestampCapture <= currentDateTime) {
            quantityTotal++;
            lastCapture = timestampCapture;
        }
    });

    if (lastCapture) {
        const latestEntry = data_Produksi.find(entry => new Date(entry.timestamp_capture).getTime() === lastCapture.getTime());

        document.getElementById('summary-type').textContent = latestEntry.tipe_barang;
        document.getElementById('summary-ideal').textContent = latestEntry.tipe_barang;
        document.getElementById('summary-quantity').textContent = quantityTotal;
        document.getElementById('summary-capture').textContent = lastCapture.toISOString().slice(0, 19).replace('T', ' ');
        document.getElementById('summary-time').textContent = latestEntry.tipe_barang;
    }
}