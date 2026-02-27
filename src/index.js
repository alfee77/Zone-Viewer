import { Chart, plugins } from "chart.js/auto";

// Zone input elements
const addZoneBtn = document.getElementById("add-zone-btn");
const addZoneModal = document.getElementById("add-zone-modal");
const zoneCreationForm = document.getElementById("zone-creation-form");
const zoneNameElement = document.getElementById("zone-name");
const zoneDirectionElement = document.getElementById("zone-direction");
const fwdRPosElement = document.getElementById("fwd-r-pos");
const fwdXPosElement = document.getElementById("fwd-x-pos");
let arrayOfZones = [];

//Circuit element input elements
const addCircuitElementBtn = document.getElementById("add-circuit-element-btn");
const addCircuitElementModal = document.getElementById(
  "add-circuit-element-modal",
);
let arrayOfCircuitElements = [];

//chart elements
const chartArea = document.querySelector("#theChart");
let myChart;
const colorPalette = ["#f79256ff", "#7dcfb6ff", "#00b2caff", "#1d4e89ff"];

//card elements
let arrayOfZonesCards = [];
let arrayOfCircuitElementCards = [];

let selectedCardIndex;

for (let i = 0; i < 10; i++) {
  arrayOfZonesCards.push(document.querySelector(`.zc${i}`));
  arrayOfCircuitElementCards.push(document.querySelector(`.cedc${i}`));
}

addZoneBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addZoneModal.style.display = "block";
});

addCircuitElementBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addCircuitElementModal.style.display = "block";
});

zoneCreationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const zone = {
    zoneName: zoneNameElement.value,
    zoneDirection: zoneDirectionElement.value,
    fwdRPos: Number.parseInt(fwdRPosElement.value),
    fwdXPos: Number.parseFloat(fwdXPosElement.value),
    label: zoneNameElement.value,
  };

  arrayOfZones.push(zone);

  for (let i = 0; i < arrayOfZones.length; i++) {
    arrayOfZones[i].backgroundColor = colorPalette[i];
    arrayOfZones[i].borderColor = colorPalette[i];

    arrayOfZonesCards[i].classList.add("zc-visible");
    arrayOfZonesCards[i].innerHTML = `
    <div class="card-title">
      <p>${arrayOfZones[i].zoneName}</p>
      <div style="background: ${colorPalette[i]}; height: 10px; width: 10px; border-radius: 50%"></div>
    </div>
    <div class="card-body">
      <p>Zone Direction: ${arrayOfZones[i].zoneDirection}</p>
      <p>Forward R (+ve): ${arrayOfZones[i].fwdRPos} Ω</p>
      <p>Forward X (+ve): ${arrayOfZones[i].fwdXPos} Ω</p>
    </div>`;
  }

  //drawChart(arrayOfZones, arrayOfCircuitElements);
  addZoneModal.style.display = "none";
});

//Function draws the chart
function drawChart(pArrayOfZones, parrayOfCircuitElements) {
  console.log(pArrayOfZones);
  console.log(parrayOfCircuitElements);
  const arrayOfData = pArrayOfZones.concat(parrayOfCircuitElements);

  console.log(arrayOfData);
  calculateChartData();

  if (myChart) {
    myChart.destroy();
  }

  const config = {
    type: "line",
    data: {
      datasets: arrayOfData,
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: "logarithmic",
          position: "bottom",
          title: {
            display: true,
            text: "Current (A)",
          },
        },
        y: {
          type: "logarithmic",
          title: {
            display: true,
            text: "Time (s)",
          },
        },
      },
      pointRadius: 1,
      tension: 0.4,
    },
  };
  myChart = new Chart(chartArea, config);
}

function calculateChartData() {
  arrayOfZones.forEach((Zone) => {
    Zone.maxCurrent = Math.min(Zone.pickUpSetting * 100, 63000);
    Zone.data = [];
    let stepSize = (Zone.maxCurrent - Zone.pickUpSetting) / 500;

    switch (Zone.ZoneType) {
      case "SI":
        for (
          let x = Zone.pickUpSetting + 1;
          x <= Zone.maxCurrent;
          x = x + stepSize
        ) {
          let y =
            (Zone.timeMultiplier * 0.14) /
            ((x / Zone.pickUpSetting) ** 0.02 - 1);
          Zone.data.push({ x, y });
        }
        break;
      case "VI":
        for (
          let x = Zone.pickUpSetting + 1;
          x <= Zone.maxCurrent;
          x = x + stepSize
        ) {
          let y =
            (Zone.timeMultiplier * 13.5) / ((x / Zone.pickUpSetting) ** 1 - 1);
          Zone.data.push({ x, y });
        }
        break;
      case "EI":
        for (
          let x = Zone.pickUpSetting + 1;
          x <= Zone.maxCurrent;
          x = x + stepSize
        ) {
          let y =
            (Zone.timeMultiplier * 80) / ((x / Zone.pickUpSetting) ** 2 - 1);
          Zone.data.push({ x, y });
        }
        break;
      case "LTI":
        for (
          let x = Zone.pickUpSetting + 1;
          x <= Zone.maxCurrent;
          x = x + stepSize
        ) {
          let y =
            (Zone.timeMultiplier * 120) / ((x / Zone.pickUpSetting) ** 1 - 1);
          Zone.data.push({ x, y });
        }
        break;
    }
  });
}

// When the user clicks anywhere outside of the add or editZoneModal, close it
window.onclick = function (event) {
  if (event.target == addZoneModal || event.target == addCircuitElementModal) {
    addZoneModal.style.display = "none";
    addCircuitElementModal.style.display = "none";
  }
};

// When the user clicks the escape key close all modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    addZoneModal.style.display = "none";
    addCircuitElementModal.style.display = "none";
  }
});
