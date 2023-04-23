<template>
    <div class="tips">
        <div class="tips_title">{{ title }}</div>
        <div class="tips_content">{{ content }}</div>
    </div>
</template>
<script>
import DataConfig from "@/components/SettingData.vue"
import moment from "moment";
import 'moment/dist/locale/zh-cn'
export default {
    data() {
        let S = DataConfig.getConfig();
        // moment.updateLocale("zh-cn");
        let courseList = DataConfig.getCourseList(this.totolCourseNum, this.cweek).courseList;
        return {
            S: S,
            title: '',
            content: '',
            hour: '',
            minute: '',
            section: '',
            day: '',
            courseList: courseList,
        }
    }, methods: {
        setTips(title, content) {
            this.title = title;
            this.content = content;
        },
        tipsTimer() {
            setTimeout(() => {
                this.getTips()
            }, 30000)

        }, getDay() {
            return moment().weekday()-1;
        },getHM(){
            return moment().format("HH:mm");
            // return "20:10";
        }, getSection() {
            //获取作息时间表
            let plan = this.S.schedulePlan[this.S.schedule];
            //plan.timeSpan是作息表中的时间段
            let timeSpan = plan.timeSpan;
            let courseInfo = {hasCourse:false,sectionInfo:{}}
            //获取当前时间的hour和minute的总分钟数
            let totalMinute =this.totalMinute(this.getHM());
            // let totalMinute = 21 * 60 + 50;
            //获取当前的星期几，从0开始
            let day = this.getDay();
            //获取当前时间的section
            let csection = timeSpan.findIndex((v, i) => {
                let stm = this.totalMinute(v.stTime);
                let endm = this.totalMinute(v.endTime);
                //    console.log(stm,endm,totalMinute)
                return totalMinute + this.S.alertTime >= stm && totalMinute < endm;
            })
            // console.log(csection)
            // console.log('当前星期',day,this.getDay(),this.S.firstDay)
            // console.log('课程',this.courseList[csection],csection)
            if (csection == -1) {
                courseInfo.hasCourse = csection
                return courseInfo;
            }
            // 从courseList中查询当前section是否有课
            // let section = this.courseList[csection].find((v, i) => {
            //     // console.log(v)
            //     return v.day == day && v.currentWeek && v.name != '';
            // })
            let dayinfo = this.courseList[csection][day];
            this.section = timeSpan[csection];
            // console.log('课程信息', this.courseList,csection,day)
            //返回false 表示没课
            let hasCourse = dayinfo.day == day && dayinfo.currentWeek && dayinfo.name != '';
            courseInfo.hasCourse = hasCourse ;
            courseInfo.sectionInfo = dayinfo;
            return courseInfo;
        }, getTips() {
            let section = this.getSection();
            //S.firstDay =1 第一天为星期一 0 表示第一天为星期日
            //本地存储中的day索引永远从0开始，故而需要减去firstDay,此处的day表示本地数据中的周几的索引
            // let day = this.getDay()-S.firstDay;
            // console.log(this.section,"是否有课",section)
            if (section.hasCourse === -1) {
                this.title = "下班"
                this.content = '现在是休息时间'
                return;
            }
            if (section.hasCourse === undefined||section.hasCourse === false) {
                this.title = "休息"
                this.content = '现在可以暂时休息一下了'
                return;
            }
            let tdiff = this.totalMinute(this.getHM())-this.totalMinute(this.section.stTime)
            // console.log('tdiff', tdiff, '当前分钟',this.section)
            let tips_title = tdiff < 0 ? -tdiff + "分钟后" : "上课中";
            let tips_content = section.sectionInfo.name + '\n' + section.sectionInfo.position + '\n' + this.section.stTime + "-" + this.section.endTime;
            this.setTips(tips_title, tips_content);

        }, totalMinute(time) {
            //将09:00格式的时间转换成分钟数
            let t = time.split(":")
            return t[0] * 60 + t[1] * 1;
        }
    }, created() {
        this.getTips()
        this.tipsTimer();
    },
    mounted() {

    }
}
</script>
<style lang="less">
.tips {
    position: relative;
}

.tips {
    .tips_title {
        height: 60px;
        background-color: #d74b4b;
        text-align: center;
        font-size: 2em;
        color: #fff;
        line-height: 60px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .tips_content {
        background-color: rgb(246, 246, 246, 0.6);
        border-bottom: 1px solid #9f9fa1;
        border-left: 1px solid #9f9fa1;
        border-right: 1px solid #9f9fa1;
        height: 140px;
        font-size: 1.2em;
        padding: 5px;
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre-line;
    }

}
</style>