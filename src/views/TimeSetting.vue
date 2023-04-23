<script>
import TimePlan from "@/components/TimePlan.vue";
import moment from 'moment'
import { toRaw } from '@vue/reactivity'
import DataConfig from "@/components/SettingData.vue"
export default {
  components: {
    TimePlan,
  },
  emits: ['saveConfig'],
  data() {
    // let config_m = localStorage.getItem("shedule_config") || null;
    // console.clear()
    // config_m = config_m || null;
    const S = DataConfig.getConfig();

    // moment.locale("zh-cn");
    // console.log(moment(), moment().weekday())
    return {
      S: S,
      // courseInfoStr: S.courseNumInfo.join(","),
      currentWeek: moment().diff(moment(S.termStart), "weeks") + 1,
      dialogVisible: false,
      checkPlan: false,
      resetCourseList: false,
     
    }
  },
  methods: {
    addNewPlan() {
      console.log(this.S.courseNumInfo)
      let cInfo = Object.values(toRaw(this.S.courseNumInfo));
      console.log("课程信息", typeof cInfo, cInfo);
      let sum = cInfo.reduce((a, b) => a + b); //课程总数
      let typeList = ["早读", "上午", "下午", "晚上"];
      let newPlanPattern = {
        timeSpan: cInfo.reduce((total, current, index) => {
          let list = new Array(current).fill(null).map(v => {
            return {
              stTime: "", endTime: "", type: typeList[index],
            }
          })
          return total.concat(list);
        }, []), //课程时间
        courseNumInfo: toRaw(this.S.courseNumInfo),
        name: "自定义",
      };

      console.log("课程总数", sum)

      this.S.schedulePlan.push(newPlanPattern);
      this.S.schedule = this.S.schedulePlan.length - 1;
      this.checkPlan = true;
      console.log("作息计划变更", this.S.schedulePlan, "新增内容", newPlanPattern)
    },
    deletePlan() {
      ElMessageBox.confirm(
        '确定要删除该作息吗?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          let newPlan = this.S.schedulePlan.filter((v, i) => {
            // console.log(i, this.S.schedule)
            return i != this.S.schedule;
          })
          ElMessage({
            type: 'success',
            message: `已删除作息 "${this.S.schedulePlan[this.S.schedule].name}"`,
          })
          this.S.schedule > 0 ? this.S.schedule-- : this.S.schedule++;
          this.S.schedulePlan = newPlan;
          this.checkPlan = false;
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除作息',
          })
        })

    },
    toFirstDay(e) {
      this.S.termStart = moment(e).weekday(this.S.firstDay).format("YYYY-MM-DD");
      this.currentWeek = moment().diff(moment(this.S.termStart), "weeks") + 1;
      ElMessage({
        showClose: true,
        message: '提醒: 已自动将该日期所在周的第一天设置为开学的第一天',
        type: 'warning',
      })
    }, dayToCurrentWeek(e) {
      // console.log("当前周：",e)
      this.S.termStart = moment().weekday(this.S.firstDay).add(-e + 1, "weeks").format("YYYY-MM-DD")
      // this.currentWeek = moment().diff(moment(this.S.termStart), "weeks") + 1;
    }, saveConfig() {
      // console.log("将要保存的数据",JSON.stringify(this.S));
      // console.log("重置课程标记", this.resetCourseList)
      DataConfig.saveConfig(this.S);
      if (this.resetCourseList) {
        //迁移对应日期的课程数据
        let cn = Object.values(this.S['schedulePlan'][this.S.schedule]['courseNumInfo']).reduce((a, b) => a + b);
        // console.log(e)
        //e表示当前的firstDay
        let cL = DataConfig.getCourseList(cn, this.currentWeek, this.S.firstDay).courseList
        // console.log("排序前", cL, "排序后", cL.forEach(v=>v.sort(this.sortBy("day"))))
        DataConfig.saveCourseList(cL);

        // DataConfig.getCourseList()
      }
      ElMessage({
        message: '所有设置已保存',
        type: 'success',
      })
    },setDefaultCourselist(){
      DataConfig.setDefaultCourseList();
      ElMessage({
        message: '已成功导入默认课程',
        type: 'success',
      })
    }, firstDayConfirm(e) {
      ElMessageBox.confirm('改变每周的起始日会在保存时自动迁移对应日期的课程数据,是否继续?')
        .then(() => {
          this.resetCourseList = !this.resetCourseList;
        })
        .catch((action) => {
          ElMessage({
            type: 'info',
            message:
              action === 'cancel' && (this.S.firstDay ^= 1, '已取消改变每周起始日')
          })

        })
    }, sortBy(attr) {
      return function (a, b) {
        return a[attr] - b[attr]
      }
    }
  }, computed: {
  }, watch: {
    // currentWeek(old, nvalue) {
    //   console.log(nvalue);

    // },
    // 'S.firstDay'(old, nvalue) {
    //   console.log(old, nvalue)
    //   ElMessageBox.confirm('改变每周的起始日需要迁移对应日期的课程数据,是否继续?')
    // .then(() => {
    //   DataConfig.getCourseList()

    // })
    // .catch((action) => {
    //   ElMessage({
    //     type: 'info',
    //     message:
    //       action === 'cancel'&&(this.S.firstDay ^= 1,'Changes discarded. Proceeding to a new route.')
    //   })

    // })
    // console.log(this.S.firstDay)
    // },
  }
}
</script>
<template>
  <!-- <el-container>
        <el-main style="background-color: #fff;"> -->
  <div class="setting_container">
    <el-col :span="24">
      <el-form :model="S" label-width="180px">
        <el-row justify="start">
          <el-col :span="11">
            <el-form-item label="开始上课时间">
              <el-date-picker v-model="S.termStart" type="date" placeholder="本学期第一周的星期一" @change="toFirstDay" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="毕业考试时间">
              <el-date-picker v-model="S.examTime" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="start">
          <el-form-item label="课前提醒时间">
            <el-input v-model="S.alertTime" />
          </el-form-item>
          <el-form-item label="当前学期周数">
            <el-input-number v-model="currentWeek" :min="1" :max="S.maxWeekdays" @change="dayToCurrentWeek" />
          </el-form-item>
        </el-row>
        <el-row justify="start">
          <el-form-item label="本学期总周数">
            <!-- <el-input v-model="" placeholder="超过最大周数就放假了" /> -->
            <el-input-number v-model="S.maxWeekdays" :min="1" :max="30" />
          </el-form-item>
          <el-form-item label="每周起始日">
            <el-select v-model="S.firstDay" placeholder="Select" @change="firstDayConfirm">
              <el-option v-for="(item, index) in ['星期日', '星期一']" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row justify="start">
          <el-form-item label="默认课程数量">
            <!-- <el-input v-model="courseInfoStr" @change="setCourseInfo" /> -->
            <el-col :span="24">
              <span style="margin:0 16px;">早读</span>
              <el-input-number v-model="S.courseNumInfo.earlyMorning" :min="0" :max="6" />
              <span style="margin:0 16px;">上午</span>
              <el-input-number v-model="S.courseNumInfo.morning" :min="0" :max="6" />
            </el-col>
            <span style="margin:0 16px;">下午</span>
            <el-input-number v-model="S.courseNumInfo.afternoon" :min="0" :max="6" />
            <span style="margin:0 16px;">晚上</span>
            <el-input-number v-model="S.courseNumInfo.evening" :min="0" :max="6" />
          </el-form-item>
        </el-row>


        <el-form-item label="作息计划">
          <el-radio-group v-model="S.schedule">
            <el-radio :label="index" border v-for="(plist, index ) in S.schedulePlan">{{ plist.name }}</el-radio>
            <!-- <el-col :span="1"></el-col> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="checkPlan" active-text="编辑详细作息" />
          <el-col :span="1"></el-col>
          <el-button type="primary" @click="addNewPlan">新增计划</el-button>
          <el-button type="danger" @click="deletePlan">删除该计划</el-button>
          <el-col :span="1"></el-col>
          <el-button type="warning" @click="saveConfig">保存设置</el-button>
          <el-button type="info" @click="setDefaultCourselist">导入默认课程</el-button>
        </el-form-item>
        <TimePlan :course-plan="S['schedulePlan'][S['schedule']]" v-if="checkPlan" @saveConfig="saveConfig"></TimePlan>
      </el-form>
    </el-col>

  </div>
  
</template>
<style type="text/css">
.setting_container {
  max-width: 800px;
  margin: 0 auto;
  /* background-color: rgba(246, 246, 246, 0.8); */
  padding: 40px;
  background-color: rgba(246, 246, 246, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 20px;
  user-select: none;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}
</style>