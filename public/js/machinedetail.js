function updateMachineDetails(currentTime, date, time) {
    var dateMatched = false;
    var lineElement = document.getElementById('line');
    var linedescElement = document.getElementById('linedesc');
    var shiftElement = document.getElementById('shift');

    for (const entry of data_header) {
        const startDateTime = new Date(`${entry.tanggal}T${entry.start_prod}`);
        const endDateTime = new Date(`${entry.tanggal}T${entry.finish_prod}`);

        if (endDateTime < startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
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