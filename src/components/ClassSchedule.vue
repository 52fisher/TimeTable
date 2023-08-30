<template>
    <table class="course" cellspacing="0">
      <tr>
        <th colspan="9">
          <div class="course_info">
            <h2 id="course_title">{{ title }}</h2>
          </div>
        </th>
      </tr>
      <!-- 按周日或周一排列的一周星期 -->
      <tr>
        <th colspan="2" class="course_week"><span>{{ cweek }}</span></th>
        <template v-for="day in weekday" :key="day.id">
          <th v-if="day.id >= S.firstDay && day.id < S.firstDay + 7" :class="day.id==cweekday?'active':null">
            <div class="weekday_en">{{ day.en }}</div>
            <div class="weekday_zh">{{ day.zh }}</div>
          </th>
        </template>
      </tr>
      <!-- 各时间段表格渲染 -->
      <template v-for="n in totolCourseNum" :key="n">
        <tr :class="'section' + n">
          <th :rowspan="typeCourseOrder[n - 1]['span']" class="type" v-if="typeCourseOrder.hasOwnProperty(n - 1)">{{
            typeCourseOrder[n - 1]['typeName']
          }}</th>
          <th class="order_and_time">
            <div class="order">{{ courseIndex[n] > 0 ? courseIndex[n] : null }}</div>
            <div class="time">{{ plan['timeSpan'][n - 1].stTime + " - " + plan['timeSpan'][n - 1].endTime }}</div>
          </th>
          <td v-for="m in 7" :class="'day' + m + ' ' + (courseList[n - 1][m - 1].currentWeek ? '' : 'not_current_week')"
            :style="{ 'background-color': courseList[n - 1][m - 1].bgcolor, 'color': courseList[n - 1][m - 1].color }"
            @click="editCourseMess(courseList[n - 1][m - 1])">
            <div class="course_name">{{ courseList[n - 1][m - 1].name }}</div>
            <div class="course_position">{{
              courseList[n - 1][m - 1].position ? "@" + courseList[n - 1][m - 1].position :
              null
            }}</div>
            <div class="course_teacher">{{ courseList[n - 1][m - 1].teacher }}</div>

          </td>
        </tr>
        <tr v-if="n > S.courseNumInfo.earlyMorning && typeCourseOrder.hasOwnProperty(n)">
          <td :colspan="9">{{ typeCourseOrder[n]['typeEndName'] }}</td>
        </tr>
      </template>
    </table>
    <el-dialog v-model="editCourseDiag" title="编辑课程" width="600px" @keyup.ctrl.c="copyCourse" @keyup.ctrl.v="pasteCourse"
      :before-close="resetCourseMess">
      <el-form :model="dialogContent">
        <el-form-item label="课程名称">
          <el-input v-model="dialogContent.name" />
        </el-form-item>
        <el-form-item label="上课地点">
          <el-input v-model="dialogContent.position" />
        </el-form-item>
        <el-form-item label="上课教师">
          <el-input v-model="dialogContent.teacher" />
        </el-form-item>
        <el-form-item label="上课周数">
          <el-select v-model="dialogContent.weekType" placeholder="请选择上课周数">
            <el-option label="全周" value="0" />
            <el-option label="单周" value="1" />
            <el-option label="双周" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteCourseMess" type="danger">删除课程</el-button>
          <el-button type="primary" @click="saveCourseMess(dialogContent)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script>
// import S from "./SettingData.vue";
import DataConfig from "@/components/SettingData.vue"
import moment from 'moment'

export default {
  data: function () {
    let S = DataConfig.getConfig();
    // console.log("获取到的数据", S)
    // moment.locale("zh-cn");
    //初始化每周第一天
    // moment().weekday(S.firstDay);

    const weekday = [
      { id: 0, en: "SUN", zh: "周日" },
      { id: 1, en: "MON", zh: "周一" },
      { id: 2, en: "TUE", zh: "周二" },
      { id: 3, en: "WED", zh: "周三" },
      { id: 4, en: "THU", zh: "周四" },
      { id: 5, en: "FRI", zh: "周五" },
      { id: 6, en: "SAT", zh: "周六" },
      { id: 7, en: "SUN", zh: "周日" },
    ];
    //当前作息
    const currentPlan = S.schedulePlan[S.schedule];
    let dialogContent = {
      name: "",
      teacher: "",
      position: "",
      section: 0,
      day: 0,
      weekType: "0",
    }
    // console.log("查找课程列表",DataConfig.getCourseList(this.totolCourseNum))
    // console.log(currentPlan);
 
    // console.log("日期",moment().weekday())
    return {
      cweekday:moment().weekday()+S.firstDay,//moment().weekday()+S.firstDay
      S: S,
      weekday: weekday,
      plan: currentPlan,
      dialogContent: dialogContent,
      editCourseDiag: false,
      course_copy: {},
      currentCourseMessOrigin: {},
      // courseList: courseList,
    }
  }, methods: {
    editCourseMess(e) {
      this.currentCourseMessOrigin = Object.assign({}, e);
      //保存原始数据,未确认保存前，不应该直接改动双向绑定的源数据，否则界面会直接改变
      // this.currentCourseMessOrigin = Object.assign({}, e)
      this.dialogContent = e;
      //currentCourseMessOrigin始终保存当前编辑对象的数据
      this.editCourseDiag = true;
      // console.log('当前编辑对象',this.dialogContent);

    }, resetCourseMess() {

      this.dialogContent.currentWeek = this.currentCourseMessOrigin.currentWeek;
      this.dialogContent.day = this.currentCourseMessOrigin.day;
      this.dialogContent.name = this.currentCourseMessOrigin.name;
      this.dialogContent.position = this.currentCourseMessOrigin.position;
      this.dialogContent.teacher = this.currentCourseMessOrigin.teacher;
      this.dialogContent.weekType = this.currentCourseMessOrigin.weekType;

      this.editCourseDiag = false
    }, saveCourseMess(content) {
      //重新计算当前周，是否需要上课  

      content.currentWeek = content.weekType == 0|| (content.weekType == (this.cweek % 2 ? 1 : 2));

      // console.log('当前周是否有该课程', content.currentWeek )
      //将原始数据的值替换为新的值
      // this.currentCourseMessOrigin = content;
      // console.log("更新后的原始数据", this.currentCourseMessOrigin);
      DataConfig.saveCourseList(this.courseList);
      this.editCourseDiag = false;
      ElMessage({
        message: '保存成功',
        type: 'success',
      })
    }, deleteCourseMess() {
      ElMessageBox.confirm(
        '此操作将永久删除该课程, 是否继续?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          this.dialogContent.name = "";
          this.dialogContent.teacher = "";
          this.dialogContent.position = "";
          this.dialogContent.weekType = "0";
          //重置color和bgcolor
          this.dialogContent.color = "";
          this.dialogContent.bgcolor = "";
          DataConfig.saveCourseList(this.courseList);
          this.editCourseDiag = false;
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '删除失败',
          })
        })


    }, copyCourse() {
      this.course_copy = this.dialogContent;
      ElMessage({
        message: '已复制该课程',
        type: 'success',
      })
    }, pasteCourse() {
      this.dialogContent.name = this.course_copy.name;
      this.dialogContent.teacher = this.course_copy.teacher;
      this.dialogContent.position = this.course_copy.position;
      this.dialogContent.weekType = this.course_copy.weekType;
      // console.log(e);
      // e = this.dialogContent;
    }, sortBy(attr) {
      return function (a, b) {
        return a[attr] - b[attr]
      }
    }, colorCourse(name = '') {
      let colorList = ["#ff8a80", "#87cefa", "#da70d6", "#80cbc4", "#2E94B9", "#D25565", "#ba55d3", "#cd5c5c", "#ffa500", "#4aaaa5",
        "#03A9F4", "#3F51B5", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#e45f56", "#3cb371", "#b8860b", "#30e0e0",
        "#80cbc4", "#fedf82", "#ff8a80", "#b39ddb", "#96ceb4", "#ffad60", "#2E94B9", "#D25565", "#EAFFD0", "#4aaaa5", "#a3d39c", "#e45f56", "#791E94", "#41D3BD", "#7F95D1",];
      let courseNameList = DataConfig.getCourseList(this.totolCourseNum).courseNameDist;
      if (name) {
        //针对当前课程进行调色
        let cindex = courseNameList.indexOf(name);
        if (cindex == -1) {
          return colorList[courseNameList.length];
        }
        return colorList[cindex];
      }
      //针对所有课程调色
      for (let i = 0; i < courseNameList.length; i++) {
        this.courseList.forEach((row, rowi) => {
          row.forEach((course, linei) => {
            if (course.name != courseNameList[i]) {
              return;
            }
            this.courseList[rowi][linei]['color'] = this.lightenDarkenColor(colorList[i], -80);
            this.courseList[rowi][linei]['bgcolor'] = colorList[i]
          })
        })

      }

    }, lightenDarkenColor(col, amt) {
      let usePound = false;
      if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
      }
      let num = parseInt(col, 16);
      let r = (num >> 16) + amt;
      let g = (num & 0x0000FF) + amt;
      let b = ((num >> 8) & 0x00FF) + amt;
      if (r > 255) r = 255;
      if (r < 0) r = 0;
      if (b > 255) b = 255;
      if (b < 0) b = 0;
      if (g > 255) g = 255;
      if (g < 0) g = 0;
      return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
    },cdayTimer(){
      setInterval(()=>{
        this.cweekday =  moment().weekday()+this.S.firstDay;
      },30000)
    }

  }, computed: {
    cweek() {

      moment().weekday(this.S.firstDay);
      //计算两个时间之内的周数,起始周为0,故需要+1
      let cweek = moment().diff(moment(this.S.termStart), "weeks") + 1;
      // console.log(this.typeCourseOrder);
      return cweek;
    }, title() {
      //通过月份计算是第一学期还是第二学期
      let term = moment().month() > 8 ? "一" : "二";
      let year = moment().year();
      return `${year}-${year + 1}学年第${term}学期课程表`;
    }, totolCourseNum() {
      return Object.values(this.plan['courseNumInfo']).reduce((a, b) => a + b);
    }, typeCourseOrder() {
      let typeCourseOrder = { 0: { typeName: '早读', typeEndName: '早自习', index: 0, span: this.plan['courseNumInfo']['earlyMorning'] } };
      // console.log(this.currentPlan['courseNumInfo'])
      // this.plan['courseNumInfo']['earlyMorning'] && typeCourseOrder.push(this.plan['courseNumInfo']['earlyMorning']);
      let typeList = [['早读'], ['上午', '早自习'], ['下午', '午休'], ['晚上', '晚休']];
      Object.values(this.plan['courseNumInfo']).reduce((a, b, index) => {
        let sum = a;
        typeCourseOrder[sum] = { typeName: typeList[index][0], typeEndName: typeList[index][1], index: index, span: b };
        return a + b;
      });

      // console.log(typeCourseOrder)
      return typeCourseOrder;
    }, courseIndex() {
      let courseIndex = [];
      let courseIndexNum = 0 - this.plan.courseNumInfo.earlyMorning;
      for (let i = 0; i <= this.totolCourseNum; i++) {
        courseIndex.push(courseIndexNum);
        courseIndexNum++;
      }
      // console.log(courseIndex)
      return courseIndex;
    }, currentWeekClass() {
      // let cweek = this.cweek;
      // let cweekType = cweek % 2 == 0 ? "双周" : "单周";
      return this.cweek % 2 == 0 ? "not_current_week" : null;
    },courseList(){
      return DataConfig.getCourseList(this.totolCourseNum, this.cweek).courseList;
    }
  }, created() {
    this.colorCourse()
    this.cdayTimer()
  },watch:{
    'dialogContent.name'(nv){
          if(nv){
            this.dialogContent.bgcolor = this.colorCourse(nv)
            this.dialogContent.color = this.lightenDarkenColor(this.dialogContent.bgcolor,-80)
            // console.log('当前课程详情',this.dialogContent)
            return;
          }
          //name为空则不要设置bgcolor和color
          this.dialogContent.bgcolor = '';
          this.dialogContent.color = '';  
    }
  }
}
</script>
<style  lang="less">
/* 内部容器设置 */


.course {
  min-width: 600px;
  border: none;
  background-color: rgba(246, 246, 246, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 20px;
  user-select: none;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  font-family: mipro, miui, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.course {
  h2 {
    /* margin: 0; */
    padding: 5px;
    color: #000;
    border-bottom: 1px solid #dadada;
  }

  th {
    /* color: #9f9fa1; */
    color: #74828f;
    cursor: pointer;
  }

  th.active {
    color: #fd8479;
  }

  .course_week span {
    display: inline;
    font-size: 1.4em;
    font-style: italic;
  }

  .course_week span::before {
    content: "第 ";
    font-style: normal;
    font-size: 0.8em;
  }

  .course_week span::after {
    content: " 周";
    font-style: normal;
    font-size: 0.8em;
  }

  .weekday_en {
    font-size: 16px;
    font-family: Georgia, "Times New Roman", Times, serif;
    font-style: italic;
  }

  .weekday_zh {
    font-size: 30px;
    font-family: "方正楷体简体";
  }

  tr {
    height: var(--hsize);
  }

  td {
    width: var(--wsize);
    min-height: 60px;
    font-size: 18px;
    border-top: 1px solid #dadada;
    border-left: 1px solid #dadada;
    cursor: default;
    font-family: "思源黑体 CN Regular";
  }

  td[colspan="9"] {
    border-left: none;
  }

  .order_and_time {
    width: 100px;
  }

  .time {
    color: #74828f;
    font-size: 0.8em;
    min-width: 80px;
  }

  .order {
    font-size: 1.2em;
    color: #525252;
  }

  .type {
    color: #313131;
    width: 6vw;
    min-width: 40px;
  }

  .course_position,
  .course_teacher {
    font-size: 0.66em;
  }

  .course_name {
    font-size: 18px;
  }

  .current_course {
    box-shadow: rgb(255 85 85) 0px 0px 0px 3px;
    position: absolute;
    z-index: 99;
  }

  .not_current_week {
    background-color: rgba(221, 223, 230, 0.2) !important;
    color: rgba(113, 110, 119, 0.5) !important;
  }
}
</style>