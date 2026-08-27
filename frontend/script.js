const API = window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "YOUR_RENDER_BACKEND_URL";

console.log("CloudDiag JavaScript loaded successfully");

let pingCounter = 0;
let dnsCounter = 0;
let portCounter = 0;
let websiteCounter = 0;


// =====================================================
// Ping Checker
// =====================================================

async function pingHost() {

    const host = document.getElementById("pingHost").value.trim();
    const resultBox = document.getElementById("pingResult");

    if (!host) {
        alert("Please enter a host.");
        return;
    }

    resultBox.innerHTML = "<p>Checking...</p>";

    try {

        const response = await fetch(
            `${API}/ping/${encodeURIComponent(host)}`
        );

        if (!response.ok) {
            throw new Error("Ping request failed");
        }

        const data = await response.json();

        // Display result
        resultBox.innerHTML = `
            <p><strong>Host:</strong> ${data.host}</p>
            <p><strong>Status:</strong> ${data.status}</p>

            ${
                data.response_time_ms !== undefined
                    ? `<p><strong>Response Time:</strong> ${data.response_time_ms} ms</p>`
                    : ""
            }
        `;

        // Update status badge if it exists
        const badge = document.getElementById("pingBadge");

        if (badge) {

            if (data.status === "Reachable") {
                badge.className = "badge success";
            } else {
                badge.className = "badge error";
            }

            badge.innerHTML = data.status;
        }

        // Update counter
        pingCounter++;

        document.getElementById("pingCount").innerHTML =
            pingCounter;

        // Refresh history
        loadHistory();

    } catch (error) {

        console.error("Ping Error:", error);

        resultBox.innerHTML = `
            <p class="error-message">
                Unable to perform ping check.
            </p>
        `;
    }
}


// =====================================================
// DNS Lookup
// =====================================================

async function dnsLookup() {

    const host = document.getElementById("dnsHost").value.trim();
    const resultBox = document.getElementById("dnsResult");

    if (!host) {
        alert("Please enter a hostname.");
        return;
    }

    resultBox.innerHTML = "<p>Checking...</p>";

    try {

        const response = await fetch(
            `${API}/dns/${encodeURIComponent(host)}`
        );

        if (!response.ok) {
            throw new Error("DNS request failed");
        }

        const data = await response.json();

        // Display result
        resultBox.innerHTML = `
            <p><strong>Hostname:</strong> ${data.hostname}</p>
            <p><strong>Status:</strong> ${data.status}</p>

            ${
                data.ip_address
                    ? `<p><strong>IP Address:</strong> ${data.ip_address}</p>`
                    : ""
            }
        `;

        // Update badge
        const badge = document.getElementById("dnsBadge");

        if (badge) {

            if (data.status === "Resolved") {
                badge.className = "badge success";
            } else {
                badge.className = "badge error";
            }

            badge.innerHTML = data.status;
        }

        // Update counter
        dnsCounter++;

        document.getElementById("dnsCount").innerHTML =
            dnsCounter;

        // Refresh history
        loadHistory();

    } catch (error) {

        console.error("DNS Error:", error);

        resultBox.innerHTML = `
            <p class="error-message">
                Unable to perform DNS lookup.
            </p>
        `;
    }
}


// =====================================================
// Port Checker
// =====================================================

async function portCheck() {

    const host =
        document.getElementById("portHost").value.trim();

    const port =
        document.getElementById("portNumber").value;

    const resultBox =
        document.getElementById("portResult");

    if (!host || !port) {
        alert("Please enter host and port.");
        return;
    }

    resultBox.innerHTML = "<p>Checking...</p>";

    try {

        const response = await fetch(
            `${API}/port/${encodeURIComponent(host)}/${port}`
        );

        if (!response.ok) {
            throw new Error("Port request failed");
        }

        const data = await response.json();

        // Display result
        resultBox.innerHTML = `
            <p><strong>Host:</strong> ${data.host}</p>
            <p><strong>Port:</strong> ${data.port}</p>
            <p><strong>Status:</strong> ${data.status}</p>
        `;

        // Update badge
        const badge =
            document.getElementById("portBadge");

        if (badge) {

            if (data.status === "Open") {
                badge.className = "badge success";
            } else {
                badge.className = "badge error";
            }

            badge.innerHTML = data.status;
        }

        // Update counter
        portCounter++;

        document.getElementById("portCount").innerHTML =
            portCounter;

        // Refresh history
        loadHistory();

    } catch (error) {

        console.error("Port Error:", error);

        resultBox.innerHTML = `
            <p class="error-message">
                Unable to perform port check.
            </p>
        `;
    }
}


// =====================================================
// Website Health Checker
// =====================================================

async function websiteCheck() {

    let url =
        document.getElementById("websiteUrl").value.trim();

    const resultBox =
        document.getElementById("websiteResult");

    if (!url) {
        alert("Please enter a website.");
        return;
    }

    resultBox.innerHTML = "<p>Checking...</p>";

    try {

        const encodedUrl =
            encodeURIComponent(url);

        const response = await fetch(
            `${API}/website/${encodedUrl}`
        );

        if (!response.ok) {
            throw new Error("Website request failed");
        }

        const data = await response.json();

        // Display result
        resultBox.innerHTML = `
            <p><strong>URL:</strong> ${data.url}</p>
            <p><strong>Status:</strong> ${data.status}</p>

            ${
                data.status_code !== undefined
                    ? `<p><strong>Status Code:</strong> ${data.status_code}</p>`
                    : ""
            }

            ${
                data.response_time_ms !== undefined
                    ? `<p><strong>Response Time:</strong> ${data.response_time_ms} ms</p>`
                    : ""
            }
        `;

        // Update badge
        const badge =
            document.getElementById("websiteBadge");

        if (badge) {

            if (data.status === "Reachable") {
                badge.className = "badge success";
            } else {
                badge.className = "badge error";
            }

            badge.innerHTML = data.status;
        }

        // Update counter
        websiteCounter++;

        document.getElementById("websiteCount").innerHTML =
            websiteCounter;

        // Refresh history
        loadHistory();

    } catch (error) {

        console.error("Website Error:", error);

        resultBox.innerHTML = `
            <p class="error-message">
                Unable to check website.
            </p>
        `;
    }
}


// =====================================================
// Load Diagnostic History
// =====================================================

async function loadHistory() {

    try {

        const response =
            await fetch(`${API}/history/`);

        if (!response.ok) {
            throw new Error("Unable to load history");
        }

        const data =
            await response.json();

        const table =
            document.getElementById("historyTable");

        if (!table) {
            return;
        }

        table.innerHTML = "";

        data.forEach(item => {

            table.innerHTML += `
                <tr>
                    <td>${item.check_type}</td>
                    <td>${item.target}</td>
                    <td>${item.result}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(
            "History Error:",
            error
        );
    }
}


// Load history when dashboard opens
loadHistory();