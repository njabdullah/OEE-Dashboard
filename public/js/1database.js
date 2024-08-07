let data_header;
let data_Linestop;
let data_Produksi;
let isFetching = false;

async function fetchData() {
    if (isFetching) {
        return;
    }

    isFetching = true;

    try {
        // data_header
        let response = await fetch('/api/data-header');
        if (response.ok) {
            data_header = await response.json();
            if (!Array.isArray(data_header)) {
                data_header = [data_header];
            }
        } else {
            throw new Error(`Failed to fetch data-header: ${response.status} ${response.statusText}`);
        }

        // data_linestop
        response = await fetch('/api/data-linestop');
        if (response.ok) {
            data_Linestop = await response.json();
            if (!Array.isArray(data_Linestop)) {
                data_Linestop = [data_Linestop];
            }
        } else {
            throw new Error(`Failed to fetch data-linestop: ${response.status} ${response.statusText}`);
        }

        // data_produksi (including joined data_standard and data_qualityloss)
        response = await fetch('/api/data-produksi');
        if (response.ok) {
            data_Produksi = await response.json();
            if (!Array.isArray(data_Produksi)) {
                data_Produksi = [data_Produksi];
            }
        } else {
            throw new Error(`Failed to fetch data-produksi: ${response.status} ${response.statusText}`);
        }

        updateDateTime();
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isFetching = false;
    }
}

window.onload = function() {
    fetchData();
    setInterval(fetchData, 500);
};