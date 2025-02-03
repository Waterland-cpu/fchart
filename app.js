const ctx = document.getElementById('myChart').getContext('2d');

// 確保 Chart.js 的 datalabels 插件已啟用
Chart.register(ChartDataLabels);

const outerData = [10, 10, 7, 8, 
                   11, 11, 13,
                   7, 6, 6, 6,
                    6, 7, 7,
                     5, 5, 5];
const innerData = [35, 35, 25, 20, 5, 5, 5];

const outerLabels = [
    "A17", "A16.26", "A02", "A01.19", "W03", "W04.05.07.09",
    "W01", "A05-44~47", "A24.25", "A23", "A22", "V03.04.06", "V01.02",
    "P03", "W06", "A08.09.14", "Fxx"
];

const innerLabels = ['handpiece', 'cooling system', 'biotip', 'vacuum', 'console', 'lubricant', 'USB'];

const outerColors = [
    '#FF5733', '#FF5733', '#FF5733', '#FF5733',
    '#36A2EB', '#36A2EB', '#36A2EB',
    '#FFCE56', '#FFCE56', '#FFCE56', '#FFCE56',
    '#D2691E', '#D2691E', '#D2691E',
    '#9966FF', '#FF9F40', '#66FF99'
];

const innerColors = [
    '#FF5733', '#36A2EB', '#FFCE56', '#D2691E', '#9966FF', '#FF9F40', '#66FF99'
];

// **內外層對應關係**
const mapping = {
    "handpiece": ["A17", "A16.26", "A02", "A01.19"],
    "cooling system": ["W03", "W04.05.07.09", "W01"],
    "biotip": ["A05-44~47", "A24.25", "A23", "A22"],
    "vacuum": ["V03.04.06", "V01.02","P03"],
    "console": ["W06"],
    "lubricant": ["A08.09.14"],
    "USB": [ "Fxx"]
};

// **內層的詳細資訊**
const innerInfo = {
    'handpiece': '🔹 handpiece: 這是 handpiece的詳細資訊。',
    'cooling system': '🔹 cooling system: 這是 cooling system的詳細資訊。',
    'biotip': '🔹 biotip: 你選擇了 biotip的詳細資訊。',
    'vacuum': '🔹 vacuum: 這是vacuum的詳細資訊。',
    'console': '🔹 console: 這console的詳細資訊。',
    'lubricant': '🔹 lubricant: 你點擊了 lubricant的詳細資訊。',
    'USB': '🔹 USB: 這是一組USB的詳細資訊。'
};


// **外層的詳細資訊**
const outerInfo = {
    "A17": "📌 A17: APP_SELFTEST",
    "A16.26": "🔸A16: APPLICATOR_TA_OVERTEMP\n🔸A26: APP_TA_TC_FAULT",
    "A02": "📌 A02: APPLICATOR_CRADLED_DURING_TREATMENT",
    "A01.19": "🔸 A01: APPLICATOR_DISCONNECTED\n🔸 A19:APPLICATOR_COMM_TIMEOUT",
    "W03": "📌 W03: WATER_FLOW_RATE_LOW",
    "W04.05.07.09": "🔸 W04: WATER_FLOW_RATE_HIGH\n🔸 W05: TEC_HOTSIDE_TEMP\n🔸 W07: WATER_FLOW_SENSOR_ISR_FAULT\n🔸 W09: WATER_TEMP_TOO_LOW",
    "W01": "📌 W01: WATER_LEVEL_LOW",
    "A05-44~47": "📌 A05-44~47: APPLICATOR_REPORTS_ERROR",
    "A24.25": "🔸 A24: BIOTIP_ID_UNEXPECTED_REMOVAL\n🔸 A25:BIOTIP_WRITE_VERIFY_FAILED.",
    "A23": "📌 A23: APPLICATOR_TA_UNDERTEMP",
    "A22": "📌 A22: APP_LATCH_ANGLE",
    "V03.04.06": "🔸V03: PATIENT_PRESSURE_HIGH\n🔸V04: TC_REPEATED_VACUUM_LOSS\n🔸V06: PRESSURE_MISMATCH.",
    "V01.02": "🔸V01: RESERVOIR_PRESSURE_LOW\n🔸V02: RESERVOIR_PRESSURE_HIGH.",
    "P03": "📌 P03: VACUUM_PUMP_FAULT",
    "W06": "📌 W06: WATER_TEMP_TOO_HIGH",
    "A08.09.14": "📌 A08.09.14: 這是一組有趣的數據。",
    "Fxx": "🔸Fxx: F00:FILESYSTEM NOT AVAILABLE\n🔸 F01:FILESYSTEM_OPEN\n🔸 F02:FILESYSTEM_WRITE\n🔸 F03:FILESYSTEM_ERROR\n🔸 F04:THUMBDRIVE_FAULT\n🔸 F05:THUMBDRIVE_ALMOST_FULL\n🔸 F06:THUMBDRIVE_NOT_INSTALLED"

};


// 打開 modal 並顯示文字
function openModal(text) {
    document.getElementById("infoText").innerText = text;
    document.getElementById("infoModal").style.display = "block";
}

// 關閉 modal
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("infoModal").style.display = "none";
});

// **建立圖表**
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [
            {
                label: '外層數據',
                data: outerData,
                backgroundColor: outerColors,
                 
                borderWidth: 2,
                hoverOffset: 5
            },
            {
                label: '內層數據',
                data: innerData,
                backgroundColor: innerColors,
               
                borderWidth: 2,
                hoverOffset: 5
            }
        ]
    },
    options: {
        responsive: true,
        cutout: '50%', // 調整內層大小
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.label;
                    }
                }
            },
            datalabels: {
                color: 'black',
                font: {
                    size: 14,
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    if (context.datasetIndex === 1) {
                        return innerLabels[context.dataIndex];
                    } else {
                        return outerLabels[context.dataIndex];
                    }
                }
            }
        },
        onClick: (evt, elements) => {
            if (elements.length > 0) {
                const datasetIndex = elements[0].datasetIndex;
                const dataIndex = elements[0].index;

                if (datasetIndex === 0) {
                    // 點擊外層顯示詳細資訊
                    openModal(outerInfo[outerLabels[dataIndex]]);
                } else {
                    // 點擊內層顯示詳細資訊
                    const label = innerLabels[dataIndex];
                    const relatedOuterLabels = mapping[label].map(item => outerInfo[item]).join("\n");
                    
                }
            }
        }
    },
    plugins: [ChartDataLabels]
});




