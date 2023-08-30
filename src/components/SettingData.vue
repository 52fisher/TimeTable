<script>
import defaultConfig from "@/assets/schedule_config.json"
var getConfig = function () {
  let config_m = localStorage.getItem("schedule_config") || null;
  //启用默认数据
  // let defaultConfig = require("./schedule_config.json");
  let Ss = JSON.parse(config_m) || defaultConfig;
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
var setDefaultCourseList = function () {
  fetch("/default_course_list.json").then(r => r.json())
    .catch(error => ElMessage({
        message: '导入默认课程错误'+error,
        type: 'error',
      }))
    .then(e => {
      console.log('默认课程信息'+e)
      localStorage.setItem('schedule_courselist', JSON.stringify(e));
      ElMessage({
        message: '已成功导入默认课程',
        type: 'success',
      })
  });
    
}
export default { getConfig, saveConfig, getCourseList, saveCourseList, setDefaultCourseList };
</script>