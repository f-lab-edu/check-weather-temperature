import Chart from "chart.js/auto";

fetch(
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=F1%2FDTeneAsxTz0l63eAO7XlVSvkovHvIthVJX9h5P%2BiSWNp5k4gt9LAAif6c0tkk7u8ERcKROU%2BkgK5tJ20EwA%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20230531&base_time=0500&nx=55&ny=127"
)
  .then((res: any) => res.json())
  .then((res: any) => console.log(res))
  .then((res: any) => console.log(res.response.body.items.item[0].baseDate))
  .then((res: any) => console.log(res.response.body.items.item[0].baseTime))
  .then((res: any) => console.log(res.response.body.items.item[0].category))
  .then((res: any) => console.log(res.response.body.items.item[0].fcstValue))
  .catch((error: Error) => {
    console.log("Error:", error);
  });

const canvas = <HTMLCanvasElement>document.getElementById("myChart");
const ctx = canvas.getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["2023.05.30", "2023.05.31"],
    datasets: [
      {
        label: "Check Yesterday & Today Weather Temperature",
        fill: false,
        data: [28, 27],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  },
});
Chart.defaults.font.size = 13;
