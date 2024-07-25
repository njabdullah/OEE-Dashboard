let quantityTotal = 0;
let summaryTime = 0;
// let standardCycle = 0;
let totalStandardCycleAll = 0;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    quantityTotal = 0;
    totalStandardCycleAll = 0;
    let latestEntry = null;
    // let totalStandardCycleAll = 0;

    data_Produksi.forEach(entry => {
        const timestampCapture = new Date(entry.timestamp_capture);
        if (timestampCapture <= currentDateTime) {
            if (!latestEntry || timestampCapture > new Date(latestEntry.timestamp_capture)) {
                latestEntry = entry;
            }
            totalStandardCycleAll += entry.standard_cycle;
        }
    });

    if (latestEntry) {
        const currentTipeBarang = latestEntry.tipe_barang;
        // standardCycle = latestEntry.standard_cycle; // Set the standard cycle for the current tipe_barang

        // Count entries with the same tipe_barang
        quantityTotal = data_Produksi.filter(entry => {
            const timestampCapture = new Date(entry.timestamp_capture);
            return entry.tipe_barang === currentTipeBarang && timestampCapture <= currentDateTime;
        }).length;

        document.getElementById('summary-type').textContent = latestEntry.tipe_barang;
        document.getElementById('summary-ideal').textContent = latestEntry.standard_cycle;
        document.getElementById('summary-quantity').textContent = quantityTotal;
        document.getElementById('summary-capture').textContent = latestEntry.timestamp_capture;

        // Calculate summaryTime using the formula operationTime - (quantityTotal * standardCycle)
        // summaryTime = operationTime - (quantityTotal * standardCycle);
        summaryTime = operationTime - totalStandardCycleAll;
        if (summaryTime < 0) {
            summaryTime = 0;
        }
        summaryTime = parseFloat(summaryTime.toFixed(1));
        document.getElementById('summary-time').textContent = summaryTime;
    }
}