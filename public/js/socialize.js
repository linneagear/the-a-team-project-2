const socializeLogChart = document
  .getElementById("socializeChart")
  .getContext("2d");

const socializeBtn = document.querySelector("#socializeBtn");

getSocialize();
//Global options
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "#777";

const socializeChart = new Chart(socializeLogChart, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Socialized",
        data: [],
        backgroundColor: "SteelBlue",
        hoverBackgroundColor: "LightBlue",
        barThickness: 50
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: "Socializing Tracker",
      fontSize: 25
    },
    legend: {
      //display, font options as well in labels object
      //position: "right"
    },
    layout: {
      padding: {
        left: 50,
        right: 0,
        bottom: 0,
        top: 0
      } //tooltips can be enabled:true or false
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5,
            stepSize: 1
          }
        }
      ]
    }
  }
});

socializeBtn.addEventListener("click", () => {
  event.preventDefault();
  addSocializeValue();
});

function addSocializeValue() {
  const inputDate = document.getElementById("logSocialDate").value;
  const day = moment(inputDate).format("ddd, MMMM Do");

  socializeValue = document.getElementById("socializeValue").value;

  socializeChart.data.datasets[0].data.push(socializeValue);

  socializeChart.data.labels.push(day);

  if (socializeValue == 3 || socializeValue == 4) {
    document.getElementById("socializeProgress").innerHTML =
      "Keep up the social quality!";
  } else if (socializeValue == 5) {
    document.getElementById("socializeProgress").innerHTML =
      "Wow! What a friend!";
  } else {
    document.getElementById("socializeProgress").innerHTML =
      "Give a friend a call!";
  }
  socializeChart.update();

  const newSocialize = {
    date: inputDate,
    value: socializeValue
  };
  // Send the POST request.
  $.ajax("/api/socialize", {
    type: "POST",
    data: newSocialize
  }).then(data => {
    console.log(data);
    console.log("logged social quality rating");
  });
}

function getSocialize() {
  $.get("/api/socialize", data => {
    //array that takes in the data values to populate the chart
    for (let i = 0; i < data.length; i++) {
      socializeChart.data.datasets[0].data.push(data[i].value);

      data[i].date = moment(data[i].date).format("ddd, MMMM Do");
      socializeChart.data.labels.push(data[i].date);
    }
    socializeChart.update();
  });
}
