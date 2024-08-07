// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------- ATUR DATE AND TIME ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var initialTime = new Date();
var dateElement = document.getElementById('date');
var timeElement = document.getElementById('time');

function updateDateTime() {
    var now = new Date();
    var timeSinceStart = now.getTime() - initialTime.getTime();
    var adjustedTime = new Date(initialTime.getTime() + timeSinceStart);

    var date = adjustedTime.getFullYear() + '-' +
               ('0' + (adjustedTime.getMonth() + 1)).slice(-2) + '-' +
               ('0' + adjustedTime.getDate()).slice(-2);
    var time = ('0' + adjustedTime.getHours()).slice(-2) + ':' +
               ('0' + adjustedTime.getMinutes()).slice(-2) + ':' +
               ('0' + adjustedTime.getSeconds()).slice(-2);

    dateElement.textContent = date;
    timeElement.textContent = time;

    updateMachineDetails(adjustedTime, date, time);
}

setInterval(updateDateTime, 1000);

// var startTime = new Date('2024-07-02T20:59:55');
// var initialTime = new Date();
// var dateElement = document.getElementById('date');
// var timeElement = document.getElementById('time');

// function updateDateTime() {
//     var now = new Date();
//     var timeSinceStart = now.getTime() - initialTime.getTime();
//     var adjustedTime = new Date(startTime.getTime() + timeSinceStart);

//     var date = adjustedTime.getFullYear() + '-' +
//                ('0' + (adjustedTime.getMonth() + 1)).slice(-2) + '-' +
//                ('0' + adjustedTime.getDate()).slice(-2);
//     var time = ('0' + adjustedTime.getHours()).slice(-2) + ':' +
//                ('0' + adjustedTime.getMinutes()).slice(-2) + ':' +
//                ('0' + adjustedTime.getSeconds()).slice(-2);

//     dateElement.textContent = date;
//     timeElement.textContent = time;

//     updateMachineDetails(adjustedTime, date, time);
// }

// setInterval(updateDateTime, 1000);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------- ATUR MACHINE INFORMATION (LINE, LINEDESC, SHIFT) -------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function updateMachineDetails(currentTime, date, time) {
    var dateMatched = false;
    var lineElement = document.getElementById('line');
    var linedescElement = document.getElementById('linedesc');
    var shiftElement = document.getElementById('shift');

    for (const entry of data_header) {
        const startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        const endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);

        if (endDateTime < startDateTime) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }

        if (currentTime >= startDateTime && currentTime <= endDateTime) {
            lineElement.innerText = entry.line;
            linedescElement.innerText = entry.linedesc;
            shiftElement.innerText = entry.shift;
            dateMatched = true;
            break;
        }
    }

    if (!dateMatched) {
        lineElement.innerText = '---';
        linedescElement.innerText = '---';
        shiftElement.innerText = '---';
    }

    updateMachineStatus(date, time);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------- ATUR MACHINE STATUS (RUN/STOP), OPERATION/LOADING/STOP TIME --------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let operationTime = 0;
let operationInterval;
let totalStopTime = 0;
let totalStopInterval;
let loadingTime = 0;

function updateMachineStatus(adjustedDate, adjustedTime) {
    const machineStatusElement = document.getElementById('machine-status');
    const troubleInformationElement = document.getElementById('trouble-information');
    const operationTimeElement = document.getElementById('operation-time');
    const totalStopTimeElement = document.getElementById('total-stop-time');
    const loadingTimeElement = document.getElementById('loading-time');

    currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);

    let machineRunning = false;
    let activeStopEntry = null;
    let startDateTime;

    for (const entry of data_header) {
        startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);

        if (endDateTime < startDateTime) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }

        if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
            machineRunning = true;
            break;
        }
    }

    let machineStopped = false;
    if (machineRunning) {
        for (const stopEntry of data_Linestop) {
            const startTime = new Date(`${adjustedDate}T${stopEntry.mulai}`);
            const endTime = new Date(`${adjustedDate}T${stopEntry.selesai}`);

            if (endTime < startTime) {
                startTime.setDate(startTime.getDate() - 1);
            }

            if (currentDateTime >= startTime && currentDateTime <= endTime) {
                machineStopped = true;
                activeStopEntry = stopEntry;
                break;
            }
        }
    }

    if (machineRunning && !machineStopped) {
        if (machineStatusElement.textContent !== "RUN") {
            machineStatusElement.textContent = "RUN";
            troubleInformationElement.textContent = "- - -";
            clearInterval(totalStopInterval);
            totalStopInterval = null;

            if (!operationInterval) {
                operationInterval = setInterval(() => {
                    operationTime = (currentDateTime - startDateTime - (totalStopTime*60000)) / 60000;
                    operationTimeElement.textContent = operationTime.toFixed(1) + ' min';
                    loadingTime = operationTime + totalStopTime;
                    loadingTimeElement.textContent = loadingTime.toFixed(1) + ' min';
                }, 6000);
            }
        }
        updateSummary(adjustedDate, adjustedTime, operationTime);
    } else {
        if (machineStatusElement.textContent !== "STOP") {
            machineStatusElement.textContent = "STOP";
            clearInterval(operationInterval);
            operationInterval = null;
    
            if (!totalStopInterval) {
                totalStopInterval = setInterval(() => {
                    let accumulatedStopTime = 0;
    
                    for (const stopEntry of data_Linestop) {
                        const startTime = new Date(`${adjustedDate}T${stopEntry.mulai}`);
                        const endTime = stopEntry.selesai ? new Date(`${adjustedDate}T${stopEntry.selesai}`) : currentDateTime;
    
                        if (endTime < startTime) {
                            startTime.setDate(startTime.getDate() - 1);
                        }
    
                        if (currentDateTime >= startTime) {
                            accumulatedStopTime += (Math.min(currentDateTime, endTime) - startTime) / 60000;
                        }
                    }
    
                    totalStopTime = accumulatedStopTime;
                    totalStopTimeElement.textContent = totalStopTime.toFixed(1) + ' min';
    
                    if (activeStopEntry) {
                        troubleInformationElement.textContent = activeStopEntry.downtimedesc;
    
                        if (stopTimes[activeStopEntry.downtimedesc] !== undefined) {
                            stopTimes[activeStopEntry.downtimedesc] += 0.1;
                        } else {
                            stopTimes['Others'] += 0.1;
                        }
    
                        updateChartData();
                    }
                    loadingTime = operationTime + totalStopTime;
                    loadingTimeElement.textContent = loadingTime.toFixed(1) + ' min';
                    updateSummaryStopTimer();
                }, 6000);
            }
        }
        updateSummary(adjustedDate, adjustedTime, operationTime);
    }    
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------ ATUR SUMMARY BAGIAN BAWAH -------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let quantityTotal = 0;
let totalStandardCycleAll = null;
let summaryTime = 0;
let quantityLossTotal = 0;
let qualityLossTotal = 0;

let lastUpdateTime = null;
let lastQualityLossUpdateTime = null;

function updateSummary(adjustedDate, adjustedTime, operationTime = 0) {
    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    
    let isWithinPeriod = false;
    for (const entry of data_header) {
        const startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        let endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);
        
        if (endDateTime < startDateTime) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }
        
        if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
            isWithinPeriod = true;
            break;
        }
    }
    
    if (!isWithinPeriod) {
        return;
    }

    if (lastUpdateTime && currentDateTime.getTime() === lastUpdateTime.getTime()) {
        return;
    }

    quantityTotal = 0;
    totalStandardCycleAll = null;
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
    const tbody = document.querySelector('.quality-loss-time tbody');

    let isWithinPeriod = false;
    for (const entry of data_header) {
        const startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        let endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);
        
        if (endDateTime < startDateTime) {
            startDateTime.setDate(startDateTime.getDate() - 1);
        }
        
        if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
            isWithinPeriod = true;
            break;
        }
    }
    
    if (!isWithinPeriod) {
        tbody.innerHTML = '';
        quantityLossTotal = 0;
        qualityLossTotal = 0;

        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>-</td>
            <td>-</td>
            <td>-</td>
        `;
        tbody.appendChild(emptyRow);

        lastQualityLossUpdateTime = currentDateTime;
        return;
    }

    if (lastQualityLossUpdateTime && currentDateTime.getTime() === lastQualityLossUpdateTime.getTime()) {
        return;
    }

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

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------- ATUR SELURUH BAGIAN CHARTS & TABLE --------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------- CHART AVAILABILITY, PERFORMANCE, QUALITY, & OEE (QUALITY STILL STATIC) --------------------------------------------------------------
let OEE = 0;
document.addEventListener('DOMContentLoaded', function() {
    const OEEGauge = new JustGage({
        id: "OEEGauge",
        value: 100,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
        valueMinFontSize: 30,
        relativeGaugeSize: true,
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const availabilityGauge = new JustGage({
        id: "availabilityGauge",
        value: 100,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
        valueMinFontSize: 30,
        relativeGaugeSize: true,
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const performanceGauge = new JustGage({
        id: "performanceGauge",
        value: 100,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
        valueMinFontSize: 30,
        relativeGaugeSize: true,
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const qualityGauge = new JustGage({
        id: "qualityGauge",
        value: 100,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
        valueMinFontSize: 30,
        relativeGaugeSize: true,
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    setInterval(() => {
        let availability = (operationTime / loadingTime) * 100;
        if (isNaN(availability) || !isFinite(availability)) availability = 100;
        if (availability > 100) availability = 100;
        availabilityGauge.refresh(availability.toFixed(2));
    
        let performance = (totalStandardCycleAll / operationTime) * 100;
        if (totalStandardCycleAll === null || isNaN(performance) || !isFinite(performance)) performance = 100;
        if (performance > 100) performance = 100;
        performanceGauge.refresh(performance.toFixed(2));
    
        let quality = ((quantityTotal - quantityLossTotal) / quantityTotal) * 100;
        if (isNaN(quality) || !isFinite(quality)) quality = 100;
        if (quality > 100) quality = 100;
        qualityGauge.refresh(quality.toFixed(2));
    
        OEE = (availability / 100) * (performance / 100) * (quality / 100) * 100;
        if (isNaN(OEE) || !isFinite(OEE)) OEE = 100;
        if (OEE > 100) OEE = 100;
        OEEGauge.refresh(OEE.toFixed(2));
    }, 1000);
});

// --------------------------------------------------------------------------- CHART SUMMARY STOP TIME ---------------------------------------------------------------------------
const stopTimes = {
    'Breakdown': 0,
    'Quality': 0,
    'Start Up': 0,
    'Tool': 0,
    'Others': 0
};

const ctx = document.getElementById('stopCategoryChart').getContext('2d');
const stopCategoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(stopTimes),
        datasets: [{
            label: 'Time (minutes)',
            data: Object.values(stopTimes),
            backgroundColor: '#2279e3',
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                display: false,
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: '#ffffff'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false
    }
});

function updateChartData() {
    stopCategoryChart.data.datasets[0].data = Object.values(stopTimes);
    stopCategoryChart.update();
}

function updateSummaryStopTimer() {
    document.getElementById('breakdown-time').textContent = stopTimes['Breakdown'].toFixed(1) + ' min';
    document.getElementById('quality-time').textContent = stopTimes['Quality'].toFixed(1) + ' min';
    document.getElementById('startup-time').textContent = stopTimes['Start Up'].toFixed(1) + ' min';
    document.getElementById('tool-time').textContent = stopTimes['Tool'].toFixed(1) + ' min';
    document.getElementById('others-time').textContent = stopTimes['Others'].toFixed(1) + ' min';
}

// --------------------------------------------------------------------------- CHART OEE VS LOSS ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('OEElossPieChart').getContext('2d');
    const data = {
        labels: ['Quality Loss', 'Speed Loss', 'Stop Loss', 'OEE'],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: ['#2279e3', '#ffe716', '#ff4048', '#2df726'],
            borderColor: '#333333'
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                    }
                }
            },
            datalabels: {
                color: '#fff',
                formatter: (value) => {
                    if (value > 0 && !isNaN(value)) {
                        return value + '%';
                    }
                    return '';
                },
                font: {
                    weight: 'bold',
                    size: 14
                }
            }
        }
    };

    const pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
        plugins: [ChartDataLabels]
    });

    function updateOEEvsLoss(qualityLossTotal, totalStopTime, summaryTime, OEE) {
        const QualityLoss = (loadingTime === 0 ? 0 : ((qualityLossTotal / loadingTime) * 100).toFixed(1));
        const SpeedLoss = (loadingTime === 0 ? 0 : ((summaryTime / loadingTime) * 100).toFixed(1));
        const StopLoss = (loadingTime === 0 ? 0 : ((totalStopTime / loadingTime) * 100).toFixed(1));
        const OEEvsLoss = OEE.toFixed(1);
        
        pieChart.data.datasets[0].data = [
            parseFloat(QualityLoss), 
            parseFloat(SpeedLoss), 
            parseFloat(StopLoss), 
            parseFloat(OEEvsLoss)
        ];
        pieChart.update();
    
        document.getElementById('oee-final-time').textContent = `${(OEE * loadingTime / 100).toFixed(1)} min`;
        document.getElementById('oee-final-percent').textContent = `${OEE.toFixed(1)}%`;
    
        document.getElementById('stoploss-final-time').textContent = `${totalStopTime.toFixed(1)} min`;
        document.getElementById('stoploss-final-percent').textContent = `${parseFloat(StopLoss).toFixed(1)}%`;
    
        document.getElementById('speedloss-final-time').textContent = `${summaryTime.toFixed(1)} min`;
        document.getElementById('speedloss-final-percent').textContent = `${parseFloat(SpeedLoss).toFixed(1)}%`;
    
        document.getElementById('qualityloss-final-time').textContent = `${qualityLossTotal.toFixed(1)} min`;
        document.getElementById('qualityloss-final-percent').textContent = `${parseFloat(QualityLoss).toFixed(1)}%`;
    }
    
    setInterval(function() {
        updateOEEvsLoss(qualityLossTotal, totalStopTime, summaryTime, OEE);
    }, 1000);
});