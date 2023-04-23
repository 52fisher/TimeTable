<!--
 * @Author: fisher && i@qnmlgb.trade
 * @Date: 2022-12-31 02:23:26
 * @LastEditors: fisher && i@qnmlgb.trade
 * @LastEditTime: 2023-04-22 15:33:44
 * @FilePath: \timetable\src\components\SettingData.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by i@qnmlgb.trade, All Rights Reserved. 
-->
<script>
var getConfig = function () {
  let config_m = localStorage.getItem("schedule_config") || null;
  // console.log(config_m);
  // config_m = null;

  let Ss = JSON.parse(config_m) || {
    "alertTime": 20,
    "schedule": 2,
    "schedulePlan": [
      { "timeSpan": [{ "stTime": "09:50", "endTime": "10:10", "type": "早读" }, 
      { "stTime": "10:20", "endTime": "11:00", "type": "上午" }, 
      { "stTime": "11:10", "endTime": "11:50", "type": "上午" }, 
      { "stTime": "12:20", "endTime": "13:00", "type": "上午" }, 
      { "stTime": "13:10", "endTime": "13:50", "type": "上午" }, 
      { "stTime": "15:50", "endTime": "16:30", "type": "下午" }, 
      { "stTime": "16:40", "endTime": "17:20", "type": "下午" }, { "stTime": "17:30", "endTime": "18:30", "type": "下午" }, { "stTime": "18:40", "endTime": "19:40", "type": "下午" }, { "stTime": "20:20", "endTime": "21:40", "type": "晚自习" }, { "stTime": "21:40", "endTime": "23:00", "type": "晚自习" }], "courseNumInfo": { "earlyMorning": 1, "morning": 4, "afternoon": 4, "evening": 2 }, "name": "冬季作息" }, { "timeSpan": [{ "stTime": "10:30", "endTime": "11:00", "type": "上午" }, { "stTime": "11:20", "endTime": "11:50", "type": "上午" }, { "stTime": "12:10", "endTime": "12:40", "type": "上午" }, { "stTime": "13:00", "endTime": "13:40", "type": "上午" }, { "stTime": "16:00", "endTime": "16:30", "type": "下午" }, { "stTime": "16:50", "endTime": "17:20", "type": "下午" }, { "stTime": "17:40", "endTime": "18:10", "type": "下午" }, { "stTime": "18:30", "endTime": "19:00", "type": "下午" }, { "stTime": "21:00", "endTime": "22:00", "type": "晚自习" }], "courseNumInfo": { "earlyMorning": 0, "morning": 4, "afternoon": 4, "evening": 1 }, "name": "线上教学" }, { "timeSpan": [{ "stTime": "09:40", "endTime": "10:00", "type": "早读" }, { "stTime": "10:10", "endTime": "10:50", "type": "上午" }, { "stTime": "11:00", "endTime": "11:40", "type": "上午" }, { "stTime": "12:10", "endTime": "12:50", "type": "上午" }, { "stTime": "13:05", "endTime": "13:45", "type": "上午" }, { "stTime": "15:50", "endTime": "16:30", "type": "下午" }, { "stTime": "16:40", "endTime": "17:20", "type": "下午" }, { "stTime": "17:35", "endTime": "18:35", "type": "下午" }, { "stTime": "18:45", "endTime": "19:45", "type": "下午" }, { "stTime": "20:25", "endTime": "21:40", "type": "晚上" }, { "stTime": "21:40", "endTime": "23:00", "type": "晚上" }], "courseNumInfo": { "earlyMorning": 1, "morning": 4, "afternoon": 4, "evening": 2 }, "name": "春季作息" }], "courseNumInfo": { "earlyMorning": 1, "morning": 4, "afternoon": 4, "evening": 2 }, "examTime": "2023-06-18 00:00:00", "termStart": "2023-02-06", "maxWeekdays": 30, "firstDay": 1, "showWeekend": false
  };
  return Ss;
}
//保存配置
var saveConfig = function (S) {
  localStorage.setItem("schedule_config", JSON.stringify(S));
}
var getCourseList = function (n, cweek, changeDay = "") {
  //从本地获取课程列表
  let courseLists_m = localStorage.getItem("schedule_courselist") || null;
  //生成默认空的课程列表
  let courseLists = JSON.parse(courseLists_m) || [];
  let courseNameDist = new Set();
  if (courseLists.length) {
    courseLists.forEach((v, row) => {
      v.forEach((item, col) => {
        //获取数据时计算是否为当前周 weekType = [0,1,2] [全部,单周,双周]
        item.name && courseNameDist.add(item.name)
        item.weekType == "0" && (courseLists[row][col].currentWeek = true);
        if (item.weekType != "0") {
          let cweekType = cweek % 2 ? "1" : "2";
          courseLists[row][col].currentWeek = item.weekType == cweekType;
        }
        //清除默认bgcolor和color
        courseLists[row][col].bgcolor = "";
        courseLists[row][col].color = '';
        //根据changeDay改变对应天的课程,changeDay是0，说明起始日从星期一改变为星期天，对应的天数数字要+1，如果是0，则-1，留空则不操作
        let delta = [1, -1];
        if (changeDay !== "") {
          if (delta[changeDay]) {
            courseLists[row][col].day = courseLists[row][col].day + delta[changeDay]
            courseLists[row][col].day = courseLists[row][col].day > 6 ? 0 : courseLists[row][col].day
            courseLists[row][col].day = courseLists[row][col].day < 0 ? 6 : courseLists[row][col].day
          }
        }
      })
      //按照day排序
      courseLists[row] = v.sort(sortBy("day"))
    })
    // console.log("获取课程列表", courseLists, courseNameDist)
    return { courseList: courseLists, courseNameDist: [...courseNameDist] };
  }

  let arr = [];
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < 8; j++) {
      arr.push({
        name: "",
        teacher: "",
        position: "",
        section: i + 1,
        day: j,
        weekType: "0",
        bgcolor: "",
        color: "",
        currentWeek: true,
      });
    }
    courseLists.push(arr);
    arr = [];
  }
  // console.log("生成默认课程列表",n, courseLists,courseNameDist)
  return { courseList: courseLists, courseNameDist: [] };
  // return [[{"name":"","teacher":"","position":"","section":1,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":1,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":2,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":2,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":3,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":3,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":4,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":4,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":5,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":5,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":6,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":6,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":7,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":7,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":8,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":8,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":9,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":9,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":10,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":10,"day":7,"weekType":0}],[{"name":"","teacher":"","position":"","section":11,"day":1,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":2,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":3,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":4,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":5,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":6,"weekType":0},{"name":"","teacher":"","position":"","section":11,"day":7,"weekType":0}]]
}
//保存课程列表
var saveCourseList = function (courseList) {
  localStorage.setItem("schedule_courselist", JSON.stringify(courseList));
}
var sortBy = function (attr) {
  return function (a, b) {
    return a[attr] - b[attr]
  }
}
var setDefaultCourseList = function (){
 const courseList =  '[[{"name":"","teacher":"","position":"","section":1,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":2,"weekType":0,"currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":1,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":2,"day":0,"weekType":"0","currentWeek":true,"color":"","bgcolor":""},{"name":"","teacher":"","position":"","section":2,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":2,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":2,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(2)","teacher":"","position":"9(2)","section":2,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":2,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":2,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"数学(2)","teacher":"","position":"9(2)","section":3,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":3,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(1)","teacher":"","position":"9(1)","section":3,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"数学(1)","teacher":"","position":"9(1)","section":3,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"","teacher":"","position":"","section":3,"day":4,"weekType":"0","currentWeek":true,"color":"","bgcolor":""},{"name":"","teacher":"","position":"","section":3,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":3,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"数学(1)","teacher":"","position":"9(1)","section":4,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"数学(1)","teacher":"","position":"9(1)","section":4,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"数学(2)","teacher":"","position":"9(2)","section":4,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":4,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(1)","teacher":"","position":"9(1)","section":4,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"","teacher":"","position":"","section":4,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":4,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":5,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(2)","teacher":"","position":"9(2)","section":5,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":5,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":5,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":5,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":5,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":5,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":6,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":6,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(2)","teacher":"","position":"9(2)","section":6,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"数学(2)","teacher":"","position":"9(2)","section":6,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"数学(1)","teacher":"","position":"9(1)","section":6,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"","teacher":"","position":"","section":6,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":6,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":7,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":7,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":8,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":8,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":9,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":9,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":10,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(2)","teacher":"","position":"9(2)","section":10,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":10,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":10,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(2)","teacher":"","position":"9(2)","section":10,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"#ff8a80","color":"#af3a30"},{"name":"","teacher":"","position":"","section":10,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":10,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}],[{"name":"","teacher":"","position":"","section":11,"day":0,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(1)","teacher":"","position":"9(1)","section":11,"day":1,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"","teacher":"","position":"","section":11,"day":2,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":11,"day":3,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"数学(1)","teacher":"","position":"9(1)","section":11,"day":4,"weekType":"0","currentWeek":true,"bgcolor":"#87cefa","color":"#377eaa"},{"name":"","teacher":"","position":"","section":11,"day":5,"weekType":"0","currentWeek":true,"bgcolor":"","color":""},{"name":"","teacher":"","position":"","section":11,"day":6,"weekType":"0","currentWeek":true,"bgcolor":"","color":""}]]';
 localStorage.setItem('schedule_courselist',courseList);
}
export default { getConfig, saveConfig, getCourseList, saveCourseList,setDefaultCourseList };
</script>