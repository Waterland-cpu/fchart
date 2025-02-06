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

const outerInfo = {
    "A17": `<a href="#" class="info-link" data-key="A17">📌 A17: APP_SELFTEST</a>`,
    "A16.26": `<a href="#" class="info-link" data-key="A16.26">🔸A16: APPLICATOR_TA_OVERTEMP<br>🔸A26: APP_TA_TC_FAULT</a>`,
    "A02": `<a href="#" class="info-link" data-key="A02">📌 A02: APPLICATOR_CRADLED_DURING_TREATMENT</a>`,
    "A01.19": `<a href="#" class="info-link" data-key="A01.19">🔸 A01: APPLICATOR_DISCONNECTED<br>🔸 A19:APPLICATOR_COMM_TIMEOUT</a>`,
    "W03": `<a href="#" class="info-link" data-key="W03">📌 W03: WATER_FLOW_RATE_LOW</a>`,
    "W04.05.07.09": `<a href="#" class="info-link" data-key="W04.05.07.09">🔸 W04: WATER_FLOW_RATE_HIGH<br>🔸 W05: TEC_HOTSIDE_TEMP<br>🔸 W07: WATER_FLOW_SENSOR_ISR_FAULT<br>🔸 W09: WATER_TEMP_TOO_LOW</a>`,
    "W01": `<a href="#" class="info-link" data-key="W01">📌 W01: WATER_LEVEL_LOW</a>`,
    "A05-44~47": `<a href="#" class="info-link" data-key="A05-44~47">📌 A05-44~47: APPLICATOR_REPORTS_ERROR</a>`,
    "A24.25": `<a href="#" class="info-link" data-key="A24.25">🔸 A24: BIOTIP_ID_UNEXPECTED_REMOVAL<br>🔸 A25: BIOTIP_WRITE_VERIFY_FAILED</a>`,
    "A23": `<a href="#" class="info-link" data-key="A23">📌 A23: APPLICATOR_TA_UNDERTEMP</a>`,
    "A22": `<a href="#" class="info-link" data-key="A22">📌 A22: APP_LATCH_ANGLE</a>`,
    "V03.04.06": `<a href="#" class="info-link" data-key="V03.04.06">🔸V03: PATIENT_PRESSURE_HIGH<br>🔸V04: TC_REPEATED_VACUUM_LOSS<br>🔸V06: PRESSURE_MISMATCH</a>`,
    "V01.02": `<a href="#" class="info-link" data-key="V01.02">🔸V01: RESERVOIR_PRESSURE_LOW<br>🔸V02: RESERVOIR_PRESSURE_HIGH</a>`,
    "P03": `<a href="#" class="info-link" data-key="P03">📌 P03: VACUUM_PUMP_FAULT</a>`,
    "W06": `<a href="#" class="info-link" data-key="W06">📌 W06: WATER_TEMP_TOO_HIGH</a>`,
    "A08.09.14": `<a href="#" class="info-link" data-key="A08.09.14">📌 A08.09.14: 這是一組有趣的數據</a>`,
    "Fxx": `<a href="#" class="info-link" data-key="Fxx">🔸 F00:FILESYSTEM NOT AVAILABLE<br>🔸 F01:FILESYSTEM_OPEN<br>🔸 F02:FILESYSTEM_WRITE<br>🔸 F03:FILESYSTEM_ERROR<br>🔸 F04:THUMBDRIVE_FAULT<br>🔸 F05:THUMBDRIVE_ALMOST_FULL<br>🔸 F06:THUMBDRIVE_NOT_INSTALLED</a>`
};



// 打開 modal 並顯示文字
function openModal(text) {
    document.getElementById("infoText").innertext = text;
    document.getElementById("infoModal").style.display = "block";
}

// 關閉 modal
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("infoModal").style.display = "none";
});

// 打開 modal 並顯示文字
function openModal(text) {
    document.getElementById("infoText").innerHTML = text;
    document.getElementById("infoModal").style.display = "block";
  
    // **監聽彈出視窗內的超連結點擊事件**
    document.querySelectorAll(".info-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // 防止頁面跳轉
            const key = this.getAttribute("data-key"); // 取得 key 值
            showDetailedInfo(key);
        });
    });
}

// **處理超連結點擊，顯示更詳細的資訊**
function showDetailedInfo(key) {
    const details = {
        "A17": "🔎 A17 詳細說明：<br>Explanation: Power-On Self-Test failure error.<br>Action: Take Handpiece out of the holster and shake it at various angles to dislodge any air bubbles.",
        "A16.26": "🔎 A16.26 詳細說明：<br>Explanation: high treatment temperatures. A16 with A26 likely indicates a failure of the cooling plate.<br>Action: Handpiece probably needs to be replaced.",
        "A02" :"🔎 A02 詳細說明：<br>Explanation: Handpiece removed from holster during POST.<br>Action: Place the Handpiece in the holstered down position until the POST is completed.",
        "A01.19": "🔎 A01.19 詳細說明：<br>Explanation: Handpiece disconnected / communication error.<br>Action: Check for noisy electrical equipment in room or building e.g. lasers. It may be necessary to restart the system.",
        "W03": "🔎 W03 詳細說明：<br>Explanation: Air in the cooling system.<br>Action: power off system and replace Handpiece with priming connector and run auto-prime.",
        "W04.05.07.09": "🔎 W04.05.07.09 詳細說明：<br>Explanation: Air in the cooling system.<br>Action: • Collect data to review water system.",
        "A05-44~47" :"🔎 A05-44~47 詳細說明：<br>Explanation: bioTip Latching issue.<br>Action: Remove bioTip, rotate 180° degrees, and reattach using firm, even pressure.",
        "W01": "🔎 W01 詳細說明：<br>Explanation: Insufficient DI water.<br>Action: Add deionized water until level is well above water filter.",
        "A24.25": "🔎 A24.25 詳細說明：<br>Explanation: bioTip attachment issue.<br>Action: Remove bioTip, rotate 180° degrees.If error persists, replace with a new bioTip.",
        "A23": "🔎 A23 詳細說明：<br>Explanation:Skin contact with cooling plate lost during delivery.<br>Action: remove bioTip (using Gear Menu), rotate 180°",
        "A22": "🔎 A22 詳細說明：<br>Explanation: bioTip Latching issue.<br>Action: Remove bioTip, rotate 180° degrees, and reattach using firm, even pressure.",
        "V03.04.06": "🔎 V03.04.06 詳細說明：<br>Explanation: Vacuum related error conditions.<br>Action: check to verify “skirt” on the bioTip is making complete contact with skin (no gaps).If error persists,using new bioTip.",
        "V01.02": "🔎 V01.02 詳細說明：<br>Explanation: Vacuum system related issue.<br>Action: Collect data to review vacuum system.",
        "P03": "🔎 P03 詳細說明：<br>Explanation: Vacuum pump over current.<br>Action: Contact Miramar Labs for P03 evaluation instructions. ",
        "W06": "🔎 W06 詳細說明：<br>Explanation: Room temperature is too warm/Air intake is blocked.<br>Action: DO NOT TURN OFF THE SYSTEM! Bring room temperature down or open door and place fan in doorway/Remove external air filter",
        "A08.09.14": "🔎 P03 詳細說明：<br>Explanation: Potential poor acquisition/contact with patient or detector failure or microwave chain failure.<br>Action: Ensure correct lubricant is getting used",
        "Fxx": "🔎 Fxx 詳細說明：<br>Explanation: Internal USB drive issue.<br>Action: Potential USB drive replacement.",
        // 其他項目...
    };

    const detailText = details[key] || "❌ 沒有找到詳細資訊";
    openModal(`<b>${key} 詳細資訊：</b><br><br>${detailText}`);
}

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
                    openModal(`${innerInfo[label]}<br><br>🌟 關聯的外層數據:<br>${relatedOuterLabels}`);
                }
            }
        }
    },
    plugins: [ChartDataLabels]
});





