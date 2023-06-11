/*
TODO: 그래프 숫자범위 고정?
FIXME: 차트 반응형?
FIXME: 웹팩 HMR 안됨
FIXME: 차트에 날짜 포맷 ex)6/6
FIXME: await때문에 데이터를 다 받아오는데 까지 시간이 걸림 fetch분리?
*/

import chartjs from "chart.js/auto";
import dayjs from "dayjs";

//날짜 포맷
const now = dayjs();
const nowFormat = now.format("YYYYMMDD");
const yesterday = now.subtract(1, "d").format("YYYYMMDD");

//API로 가져올 날짜
let dateArr: string[] = [];
dateArr.push(yesterday);
dateArr.push(nowFormat);

//TMN 일 최저기온
let TMNArr: string[] = [];
//TMX 일 최고기온
let TMXArr: string[] = [];

const getData = async () => {
  try {
    const resNow = await fetch("https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=F1%2FDTeneAsxTz0l63eAO7XlVSvkovHvIthVJX9h5P%2BiSWNp5k4gt9LAAif6c0tkk7u8ERcKROU%2BkgK5tJ20EwA%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=" + nowFormat + "&base_time=0500&nx=55&ny=127");
    const resYesterday = await fetch("https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=F1%2FDTeneAsxTz0l63eAO7XlVSvkovHvIthVJX9h5P%2BiSWNp5k4gt9LAAif6c0tkk7u8ERcKROU%2BkgK5tJ20EwA%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=" + yesterday + "&base_time=0500&nx=55&ny=127");
    let nowData = await resNow.json();
    let YesterdayData = await resYesterday.json();

    const data = {
      //category : TMN 일 최저기온, item[301]
      //category : TMX 일 최고기온, item[410]
      nowCategory1: nowData.response.body.items.item[301].category,
      nowTMN: nowData.response.body.items.item[301].fcstValue,
      nowCategory2: nowData.response.body.items.item[410].category,
      nowTMX: nowData.response.body.items.item[410].fcstValue,

      yesterdayCategory1: YesterdayData.response.body.items.item[301].category,
      yesterdayTMN: YesterdayData.response.body.items.item[301].fcstValue,
      yesterdayCategory2: YesterdayData.response.body.items.item[410].category,
      yesterdayTMX: YesterdayData.response.body.items.item[410].fcstValue
    }

    TMNArr.push(data.nowTMN);
    TMNArr.push(data.yesterdayTMN);
    TMXArr.push(data.nowTMX);
    TMXArr.push(data.yesterdayTMX);

    const canvas = <HTMLCanvasElement>document.querySelector(".myChart");
    const ctx = canvas.getContext("2d");
    const myChart = new chartjs(ctx, {
      type: "line",
      data: {
        labels: dateArr,
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
};

getData();


