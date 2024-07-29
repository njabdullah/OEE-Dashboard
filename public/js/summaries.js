let quantityTotal = 0;
let totalStandardCycleAll = 0;
let summaryTime = 0;
let quantityLossTotal = 0;
let qualityLossTotal = 0;

let lastUpdateTime = null;
let lastQualityLossUpdateTime = null;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    
    if (lastUpdateTime && currentDateTime.getTime() === lastUpdateTime.getTime()) {
        return;
    }

    quantityTotal = 0;
    totalStandardCycleAll = 0;
    summaryTime = 0;

    const latestEntries = {};
    let updateQualityLoss = false;

    data_Produksi.forEach(entry => {
        const timestampCapture = new Date(entry.timestamp_capture);
        if (timestampCapture <= currentDateTime) {
            const tipeBarang = entry.tipe_barang;
            if (!latestEntries[tipeBarang] || timestampCapture > new Date(latestEntries[tipeBarang].timestamp_capture)) {
                latestEntries[tipeBarang] = entry;
            }
            if (timestampCapture.getTime() === currentDateTime.getTime()) {
                updateQualityLoss = true;
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
            const quantityEach = data_Produksi.filter(e => {
                const timestampCapture = new Date(e.timestamp_capture);
                return e.tipe_barang === entry.tipe_barang && timestampCapture <= currentDateTime;
            }).length;

            quantityTotal += quantityEach;

            summaryTime = operationTime - totalStandardCycleAll;
            if (summaryTime < 0) {
                summaryTime = 0;
            }
            summaryTime = parseFloat(summaryTime.toFixed(1));

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.tipe_barang}</td>
                <td>${entry.standard_cycle}</td>
                <td>${quantityEach}</td>
                <td>${entry.timestamp_capture}</td>
                <td>${summaryTime}</td>
            `;

            tbody.appendChild(newRow);
        });
    }

    lastUpdateTime = currentDateTime;
    updateQualityLossTable(latestEntries, currentDateTime, operationTime);
}

function updateQualityLossTable(latestEntries, currentDateTime, operationTime) {
    if (lastQualityLossUpdateTime && currentDateTime.getTime() === lastQualityLossUpdateTime.getTime()) {
        return;
    }

    const tbody = document.querySelector('.quality-loss-time tbody');
    tbody.innerHTML = '';
    quantityLossTotal = 0;
    qualityLossTotal = 0;

    if (Object.keys(latestEntries).length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>-</td>
            <td>-</td>
            <td>-</td>
        `;
        tbody.appendChild(emptyRow);
    } else {
        Object.values(latestEntries).forEach(entry => {
            const quantityEach = data_Produksi.filter(e => {
                const timestampCapture = new Date(e.timestamp_capture);
                return e.tipe_barang === entry.tipe_barang && timestampCapture <= currentDateTime;
            }).length;
        
            const quantityLossEach = Math.floor(quantityEach / entry.ratio);
            quantityLossTotal += quantityLossEach;
        
            let qualityLoss = (((quantityLossEach * entry.standard_cycle) / totalStandardCycleAll) * (operationTime - summaryTime)).toFixed(2);
            qualityLoss = parseFloat(qualityLoss);
        
            if (qualityLoss < 0) {
                qualityLoss = 0;
            }
            
            qualityLossTotal += qualityLoss;
        
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.tipe_barang}</td>
                <td>${quantityLossEach}</td>
                <td>${qualityLoss}</td>
            `;
            tbody.appendChild(newRow);
        });        
    }
    lastQualityLossUpdateTime = currentDateTime;
}