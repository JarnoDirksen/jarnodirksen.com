document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const viewRadios = document.getElementsByName('view');
    const coreRadios = document.getElementsByName('core');
    const yearSelect = document.getElementById('year-select');
    const monthWeekSelect = document.getElementById('month-week-select');
    const monthWeek = document.getElementById('month-week');
    const monthWeekLabel = document.getElementById('month-week-label');
    const pivotTableBody = document.getElementById('pivot-table-body');
    const rawDataBody = document.getElementById('raw-data-body');
    const showRawData = document.getElementById('show-raw-data');
    const rawDataDiv = document.getElementById('raw-data');
    const pivotTableTitle = document.getElementById('pivot-table-title');

    const API_URL = 'https://your-flask-app.com'; // Replace with your Flask API URL
    let data = [];

    // Check login status on load
    checkLoginStatus();

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Include cookies for session
            });
            const result = await response.json();
            if (result.status === 'success') {
                loginContainer.style.display = 'none';
                dashboardContainer.style.display = 'block';
                loginError.style.display = 'none';
                fetchData();
            } else {
                loginError.textContent = result.message;
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = 'Error logging in';
            loginError.style.display = 'block';
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', async function() {
        try {
            await fetch(`${API_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            loginContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    // Fetch data from API
    async function fetchData() {
        try {
            const response = await fetch(`${API_URL}/api/data`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') {
                data = result.data.map(item => ({
                    ...item,
                    Date: new Date(item.Date)
                }));
                updatePivotTable();
                updateChart();
            } else {
                loginContainer.style.display = 'block';
                dashboardContainer.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            loginContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
        }
    }

    // Check login status
    async function checkLoginStatus() {
        try {
            const response = await fetch(`${API_URL}/api/data`, {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.status === 'success') {
                loginContainer.style.display = 'none';
                dashboardContainer.style.display = 'block';
                fetchData();
            }
        } catch (error) {
            loginContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
        }
    }

    // Event listeners for view changes
    viewRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            monthWeekSelect.style.display = this.value === 'Year' ? 'none' : 'block';
            monthWeekLabel.textContent = this.value === 'Month' ? 'Select Month' : 'Select Week';
            updatePivotTable();
            updateChart();
        });
    });

    // Event listeners for core filter changes
    coreRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updatePivotTable();
            updateChart();
        });
    });

    yearSelect.addEventListener('change', () => {
        updatePivotTable();
        updateChart();
    });
    monthWeek.addEventListener('change', () => {
        updatePivotTable();
        updateChart();
    });
    showRawData.addEventListener('change', function() {
        rawDataDiv.style.display = this.checked ? 'block' : 'none';
        if (this.checked) updateRawData();
    });

    function filterData() {
        let filtered = data;
        const view = document.querySelector('input[name="view"]:checked').value;
        const core = document.querySelector('input[name="core"]:checked').value;
        const year = parseInt(yearSelect.value);

        filtered = filtered.filter(d => d.Date.getFullYear() === year);
        if (view === 'Month') {
            const month = parseInt(monthWeek.value);
            filtered = filtered.filter(d => d.Date.getMonth() + 1 === month);
        } else if (view === 'Week') {
            const week = parseInt(monthWeek.value);
            filtered = filtered.filter(d => d.WeekNumber === week);
        }
        if (core !== 'All') {
            filtered = filtered.filter(d => d.Core === (core === 'Core'));
        }
        return filtered;
    }

    function updatePivotTable() {
        const filtered = filterData();
        const pivot = {};
        filtered.forEach(d => {
            if (!pivot[d.Category]) pivot[d.Category] = { Credit: 0, Debit: 0 };
            pivot[d.Category][d.DC] += Math.abs(d.Amount); // Ensure positive amounts
        });

        pivotTableBody.innerHTML = '';
        let grandCredit = 0, grandDebit = 0;
        for (let category in pivot) {
            const row = pivot[category];
            const credit = row.Credit.toFixed(2);
            const debit = row.Debit.toFixed(2);
            const grandTotal = (row.Credit + row.Debit).toFixed(2);
            pivotTableBody.innerHTML += `
                <tr>
                    <td>${category}</td>
                    <td>${credit}</td>
                    <td>${debit}</td>
                    <td>${grandTotal}</td>
                </tr>
            `;
            grandCredit += row.Credit;
            grandDebit += row.Debit;
        }
        pivotTableBody.innerHTML += `
            <tr>
                <td>Grand Total</td>
                <td>${grandCredit.toFixed(2)}</td>
                <td>${grandDebit.toFixed(2)}</td>
                <td>${(grandCredit + grandDebit).toFixed(2)}</td>
            </tr>
        `;

        const view = document.querySelector('input[name="view"]:checked').value;
        const core = document.querySelector('input[name="core"]:checked').value;
        pivotTableTitle.textContent = `Pivot Table for ${view} View with ${core} Filter`;
    }

    function updateRawData() {
        const filtered = filterData();
        rawDataBody.innerHTML = '';
        filtered.forEach(d => {
            rawDataBody.innerHTML += `
                <tr>
                    <td>${d.ID}</td>
                    <td>${d.Name || ''}</td>
                    <td>${d.GeneralName || ''}</td>
                    <td>${d.Category || ''}</td>
                    <td>${d.Description || ''}</td>
                    <td>${d.Core}</td>
                    <td>${d.Amount.toFixed(2)}</td>
                    <td>${d.Date.toISOString().split('T')[0]}</td>
                    <td>${d.WeekNumber}</td>
                    <td>${d.DC}</td>
                </tr>
            `;
        });
    }

    function updateChart() {
        const filtered = filterData();
        const chartData = {};
        filtered.forEach(d => {
            if (!chartData[d.Category]) chartData[d.Category] = 0;
            chartData[d.Category] += d.Amount * (d.DC === 'Credit' ? -1 : 1);
        });

        const ctx = document.getElementById('myChart').getContext('2d');
        if (window.myChart) window.myChart.destroy();
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: 'Amount',
                    data: Object.values(chartData),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});