/*
FIXME: 차트 반응형?
FIXME: 웹팩 HMR 안됨
*/

import Swiper, { Navigation } from "swiper";
import chartjs from "chart.js/auto";
import dayjs from "dayjs";

const swiper = new Swiper(".swiper", {
  modules: [Navigation],
  direction: "vertical",
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  observer: true,
  observeParents: true,
  parallax: true,
});

//날짜 포맷
const now = dayjs();
//기상청 API 호출용 날짜 포맷
const nowFormat = now.format("YYYYMMDD");
//chart로 그릴 날짜 포맷
const nowFormat2 = now.format("MM/DD");
const tomorrow = now.add(1, "d").format("MM/DD");
const after2days = now.add(2, "d").format("MM/DD");
const after3days = now.add(3, "d").format("MM/DD");
const after4days = now.add(4, "d").format("MM/DD");
const after5days = now.add(5, "d").format("MM/DD");
const after6days = now.add(6, "d").format("MM/DD");
const after7days = now.add(7, "d").format("MM/DD");

//API로 조회할 날짜
let dateArr: string[] = [];
dateArr.push(nowFormat2);
dateArr.push(tomorrow);
dateArr.push(after2days);
dateArr.push(after3days);
dateArr.push(after4days);
dateArr.push(after5days);
dateArr.push(after6days);
dateArr.push(after7days);

//TMN 일 최저기온
let TMNArr: string[] | number[] = [];
//TMX 일 최고기온
let TMXArr: string[] | number[] = [];

//오늘 & 내일 온도 그래프
const getTodayData = async () => {
  try {
    const resNow = await fetch(
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=F1%2FDTeneAsxTz0l63eAO7XlVSvkovHvIthVJX9h5P%2BiSWNp5k4gt9LAAif6c0tkk7u8ERcKROU%2BkgK5tJ20EwA%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=" +
      nowFormat +
      "&base_time=0200&nx=55&ny=127"
    );

    let nowData = await resNow.json();

    const data = {
      //category : TMN 일 최저기온, item[301]
      //category : TMX 일 최고기온, item[410]
      nowTMN: nowData.response.body.items.item[48].fcstValue,
      nowTMX: nowData.response.body.items.item[157].fcstValue,

      tomorrowTMN: nowData.response.body.items.item[338].fcstValue,
      tomorrowTMX: nowData.response.body.items.item[447].fcstValue,

      after2daysTMN: nowData.response.body.items.item[628].fcstValue,
      after2daysTMX: nowData.response.body.items.item[737].fcstValue,
    };

    TMNArr[0] = parseInt(data.nowTMN);
    TMNArr[1] = parseInt(data.tomorrowTMN);
    TMNArr[2] = parseInt(data.after2daysTMN);
    TMXArr[0] = parseInt(data.nowTMX);
    TMXArr[1] = parseInt(data.tomorrowTMX);
    TMXArr[2] = parseInt(data.after2daysTMX);

    const canvas = <HTMLCanvasElement>document.querySelector(".todayChart");
    const ctx = canvas.getContext("2d");
    const todayChart = new chartjs(ctx, {
      type: "line",
      data: {
        labels: [dateArr[0], dateArr[1]],
        datasets: [
          {
            label: "Lowest Temperature",
            fill: false,
            data: [TMNArr[0], TMNArr[1]],
            backgroundColor: ["rgba(77,201,246, 0.2)"],
            borderColor: ["rgba(77,201,246, 1)"],
            borderWidth: 3,
          },
          {
            label: "Highest Temperature",
            fill: false,
            data: [TMXArr[0], TMXArr[1]],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 3,
          },
        ],
      },
    });

    chartjs.defaults.font.size = 15;

  } catch (error) {
    console.log("Error:", error);
  }

  getWeeklyData();

};

getTodayData();

//주간 온도 그래프
const getWeeklyData = async () => {
  try {
    const resWeekly = await fetch(
      "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=F1%2FDTeneAsxTz0l63eAO7XlVSvkovHvIthVJX9h5P%2BiSWNp5k4gt9LAAif6c0tkk7u8ERcKROU%2BkgK5tJ20EwA%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=11B10101&tmFc=" + nowFormat + "0600"
      );
    
    let weeklyData = await resWeekly.json();

    const data = {
      after3daysTMN: weeklyData.response.body.items.item[0].taMin3,
      after3daysTMX: weeklyData.response.body.items.item[0].taMax3,

      after4daysTMN: weeklyData.response.body.items.item[0].taMin4,
      after4daysTMX: weeklyData.response.body.items.item[0].taMax4,

      after5daysTMN: weeklyData.response.body.items.item[0].taMin5,
      after5daysTMX: weeklyData.response.body.items.item[0].taMax5,

      after6daysTMN: weeklyData.response.body.items.item[0].taMin6,
      after6daysTMX: weeklyData.response.body.items.item[0].taMax6,
      
      after7daysTMN: weeklyData.response.body.items.item[0].taMin7,
      after7daysTMX: weeklyData.response.body.items.item[0].taMax7,
    };

    TMNArr[3] = data.after3daysTMN;
    TMNArr[4] = data.after4daysTMN;
    TMNArr[5] = data.after5daysTMN;
    TMNArr[6] = data.after6daysTMN;
    TMNArr[7] = data.after7daysTMN;

    TMXArr[3] = data.after3daysTMX;
    TMXArr[4] = data.after4daysTMX;
    TMXArr[5] = data.after5daysTMX;
    TMXArr[6] = data.after6daysTMX;
    TMXArr[7] = data.after7daysTMX;

    const canvas = <HTMLCanvasElement>document.querySelector(".weeklyChart");
    const ctx = canvas.getContext("2d");
    const weeklyChart = new chartjs(ctx, {
      type: "line",
      data: {
        labels: dateArr,
        datasets: [
          {
            label: "Lowest Temperature",
            fill: false,
            data: TMNArr,
            backgroundColor: ["rgba(77,201,246, 0.2)"],
            borderColor: ["rgba(77,201,246, 1)"],
            borderWidth: 3,
          },
          {
            label: "Highest Temperature",
            fill: false,
            data: TMXArr,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 3,
          },
        ],
      },
    });

    chartjs.defaults.font.size = 15;

  } catch (error) {
    console.log("Error:", error);
  }
};
