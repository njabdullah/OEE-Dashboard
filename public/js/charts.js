// -------------------------------------------------------------- CHART AVAILABILITY, PERFORMANCE, QUALITY, & OEE (QUALITY STILL STATIC) --------------------------------------------------------------
let OEE = 0;
document.addEventListener('DOMContentLoaded', function() {
    const OEEGauge = new JustGage({
        id: "OEEGauge",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
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
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
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
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
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
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        valueFontColor: "#FFFFFF",
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
        if (isNaN(availability) || !isFinite(availability)) availability = 0;
        if (availability > 100) availability = 100;
        availabilityGauge.refresh(availability.toFixed(2));
    
        // Calculate performance using the new formula
        let performance = (totalStandardCycleAll / operationTime) * 100;
        if (isNaN(performance) || !isFinite(performance)) performance = 0;
        if (performance > 100) performance = 100;
        performanceGauge.refresh(performance.toFixed(2));
    
        let quality = (quantityTotal / quantityTotal) * 100;
        if (isNaN(quality) || !isFinite(quality)) quality = 0;
        if (quality > 100) quality = 100;
        qualityGauge.refresh(quality.toFixed(2));
    
        OEE = (availability / 100) * (performance / 100) * (quality / 100) * 100;
        if (isNaN(OEE) || !isFinite(OEE)) OEE = 0;
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
            data: [0, 0, 0],
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
            }
        }
    };

    const pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });

    function updateOEEvsLoss(totalStopTime, summaryTime, OEE) {
        const QualityLoss = 0;
        const SpeedLoss = (summaryTime/loadingTime)*100;
        const StopLoss = (totalStopTime/loadingTime)*100;
        pieChart.data.datasets[0].data = [QualityLoss, SpeedLoss, StopLoss, OEE];
        pieChart.update();

        document.getElementById('oee-final-time').textContent = `${(OEE * loadingTime / 100).toFixed(1)} min`;
        document.getElementById('oee-final-percent').textContent = `${(OEE).toFixed(1)}%`;

        document.getElementById('stoploss-final-time').textContent = `${(totalStopTime).toFixed(1)} min`;
        document.getElementById('stoploss-final-percent').textContent = `${StopLoss.toFixed(1)}%`;

        document.getElementById('speedloss-final-time').textContent = `${(summaryTime).toFixed(1)} min`;
        document.getElementById('speedloss-final-percent').textContent = `${SpeedLoss.toFixed(1)}%`;

        document.getElementById('qualityloss-final-time').textContent = '0.0 min';
        document.getElementById('qualityloss-final-percent').textContent = '0.0%';
    }

    setInterval(function() {
        updateOEEvsLoss(totalStopTime, summaryTime, OEE);
    }, 1000);
});