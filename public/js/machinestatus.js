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

    const currentDateTime = new Date(`${adjustedDate}T${adjustedTime}`);
    console.log('Current DateTime:', currentDateTime);

    let machineRunning = false;
    let activeStopEntry = null;

    // Check if the machine should be running based on data_header
    for (const entry of data_header) {
        const startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        const endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);

        if (endDateTime < startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }

        if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
            machineRunning = true;
            break;
        }
    }

    // Check if the machine should be stopped based on data_linestop
    let machineStopped = false;
    if (machineRunning) {
        for (const stopEntry of data_Linestop) {
            const startTime = new Date(`${adjustedDate}T${stopEntry.mulai}`);
            const endTime = new Date(`${adjustedDate}T${stopEntry.selesai}`);

            if (endTime < startTime) {
                endTime.setDate(endTime.getDate() + 1);
            }

            if (currentDateTime >= startTime && currentDateTime <= endTime) {
                machineStopped = true;
                activeStopEntry = stopEntry; // Save the active stop entry
                break;
            }
        }
    }

    if (machineRunning && !machineStopped) {
        if (machineStatusElement.textContent !== "RUN") {
            machineStatusElement.textContent = "RUN";
            troubleInformationElement.textContent = "- - -"; // Clear trouble information
            clearInterval(totalStopInterval);
            totalStopInterval = null;

            if (!operationInterval) {
                operationInterval = setInterval(() => {
                    operationTime += 0.1;
                    operationTimeElement.textContent = operationTime.toFixed(1) + ' min';
                    loadingTime = operationTime + totalStopTime;
                    loadingTimeElement.textContent = loadingTime.toFixed(1) + ' min';
                }, 6000);
            }
        }
    } else {
        if (machineStatusElement.textContent !== "STOP") {
            machineStatusElement.textContent = "STOP";
            clearInterval(operationInterval);
            operationInterval = null;

            if (!totalStopInterval) {
                totalStopInterval = setInterval(() => {
                    totalStopTime += 0.1;
                    if (activeStopEntry) {
                        troubleInformationElement.textContent = activeStopEntry.downtimedesc;
                    }
                    totalStopTimeElement.textContent = totalStopTime.toFixed(1) + ' min';
                    loadingTime = operationTime + totalStopTime;
                    loadingTimeElement.textContent = loadingTime.toFixed(1) + ' min';
                }, 6000);
            }
        }
    }
}
