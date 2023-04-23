<script>
import { toRaw } from '@vue/reactivity'
import timeSelect from './TimeSelect.vue'
export default {
    components: { timeSelect },
    emits: ['saveConfig'],
    props: {
        coursePlan: Object
    },
    data() {
        let currentPlan = toRaw(this.coursePlan);
        let tsConfig = {
            cHour: 9,
            cMin: 0,
            left: "50%",
            top: "50%"
        };
        return {
            currentPlan: currentPlan,
            isAutoCalc: true,
            tsConfig: tsConfig,//时间选择器配置
            tsShow: true,//时间选择器是否显示
            cevent: null,//当前点击的事件
        }
    }, methods: {
        spanMethod({
            row,
            column,
            rowIndex,
            columnIndex,
        }) {
            if (columnIndex != 0) {
                return {
                    rowspan: 1,
                    colspan: 1,
                }
            }
            let cInfo = Object.values(toRaw(this.currentPlan['courseNumInfo']));
            let cspan = this.typeCourseOrder.findIndex((v, i) => {
                return rowIndex === v;
            });

            // console.log("累计课程数量",this.typeCourseOrder,"课程安排信息",cInfo);
            // console.log("跨行规则 行号:",rowIndex,"当前跨行索引",cspan,"跨行数量",cInfo[cspan]||"该行已隐藏显示");
            if (cspan !== -1) {

                cInfo[0] == 0 && cspan++;

                return {
                    rowspan: cInfo[cspan],
                    colspan: 1,
                }
            }
            return {
                rowspan: 0,
                colspan: 0,
            }

        }, reIndex(index) {
            if (this.currentPlan['courseNumInfo']['earlyMorning'] === 0) {
                return index + 1;
            }
            // console.log("重置索引",typeof this.currentPlan.courseNumInfo.earlyMorning,this.currentPlan['courseNumInfo'].earlyMorning);
            return index < this.currentPlan['courseNumInfo']['earlyMorning'] ? null : index - this.currentPlan['courseNumInfo']['earlyMorning'] + 1;
        }, changeTime(index) {
            if (!this.isAutoCalc || !this.currentPlan['timeSpan'][index]['endTime'] || !this.currentPlan['timeSpan'][index]['stTime']) {
                // console.log("未改变后续时间安排")
                return;
            }
            console.log('数值变化')
            String.prototype.getMins = function (s) {
                let o = this.split(":")
                return o[0] * 60 + parseInt(o[1]);
            }
            String.prototype.addTime = function (s = 10) {
                // to Minutes
                let om = this.split(":");
                let minTotal = om[0] * 60 + parseInt(om[1]);
                minTotal += parseInt(s);
                let h = "0" + parseInt(minTotal / 60);
                return h.slice(-2) + ":" + ("0" + minTotal % 60).slice(-2);
            }
            let ts = this.currentPlan['timeSpan'];
            //计算课程时间，默认40 min，根据当前课程的结束时间 - 开始时间
            let courseTime = (ts[index]['endTime'].getMins() - ts[index]['stTime'].getMins()) || 40;
            //计算休息时间。默认为10 min： 有早读时 第1节课的开始时间 - 早读结束时间 无早读 第二节课上课时间- 第一节课下课时间
            let freeTime = (ts[1]['stTime'].getMins() - ts[0]['endTime'].getMins()) || 10;

            console.log("当前课程时间", courseTime, "休息时间", freeTime);
            //从下一行开始改变时间 index + 1
            for (let i = index + 1; i < ts.length; i++) {
                //两节课间隔时间超过三十分钟有可能为休息时间,不调整后续的时间,
                if (i >= this.typeCourseOrder.find(v => index < v)) {
                    console.log("第", i, "节课及其后面的学段时间未改变", this.typeCourseOrder.find(v => index < v))
                    return;
                }
                this.currentPlan['timeSpan'][i]['stTime'] = ts[i - 1]['endTime'].addTime(freeTime);
                this.currentPlan['timeSpan'][i]['endTime'] = ts[i]['stTime'].addTime(courseTime);
                console.log("时间发生改变", this.currentPlan['timeSpan'][i])
            }
        }, showTS(event) {
            // console.log(event)
            let domRect = event.target.getBoundingClientRect()
            //console.log("坐标", domRect)
            //设置ts的位置
            let left = domRect.x;
            let top = this.getOffsetTop(event.target);
            //设置当前时和分
            let [cHour, cMin] = event.target.value.split(':');
            this.tsConfig.cHour = ~~cHour;
            this.tsConfig.cMin = ~~cMin;
            this.tsConfig.top = top;
            this.tsConfig.left = left;
            this.cevent = event;
            // console.log("配置", this.tsConfig);
            // this.$emit('show-time-select',config)
            // console.log(this.$emit)
            // console.log(this.$parent)
            // this.$parent.showTimeSelect(config);
        }, getOffsetTop(elem) {
            var offsetTop = 0;
            do {
                if (!isNaN(elem.offsetTop)) {
                    offsetTop += elem.offsetTop;
                }
            } while (elem = elem.offsetParent);
            return offsetTop;
        }, setNewTime(nHour, nMin) {
            console.log("改变时间前",this.cevent.target)
            console.log("设置新时间", nHour, nMin)
            this.cevent.target.value = ('0'+nHour).slice(-2) + ':' + ('0'+nMin).slice(-2);
            // this.$set(this.cevent.target.value,nHour + ':' + nMin)
            this.cevent.target.dispatchEvent(new Event('input'))
            // console.log(this.cevent.target)
            // console.log(this.currentPlan['timeSpan'])
            //保存设置
            this.$emit('saveConfig');
            // this.changeTime()
            this.cevent.target.dispatchEvent(new Event('change'))
            // console.log(this.cevent);
        }
    }, computed: {
        typeCourseOrder() {
            let typeCourseOrder = [0];
            // console.log(this.currentPlan['courseNumInfo'])
            this.currentPlan['courseNumInfo']['earlyMorning'] && typeCourseOrder.push(this.currentPlan['courseNumInfo']['earlyMorning']);
            Object.values(this.currentPlan['courseNumInfo']).reduce((a, b) => {
                typeCourseOrder.push(a + b)
                return a + b;
            });
            // console.log(typeCourseOrder)
            return typeCourseOrder;
        }
    }, watch: {
        coursePlan(current) {
            this.currentPlan = toRaw(current);
            // this.resetType();
            // console.log(this.currentPlan)
        }
    }
}

</script>
<template>
    <div class="plan_list">
        <div class="plan_info">
            <el-row justify="start" align="middle">
                <el-col :span="4"><span>作息名称</span></el-col>
                <el-col :span="8">
                    <el-input v-model="currentPlan['name']" placeholder="请输入作息名称" />
                </el-col>
                <el-col :span="6" :offset="4"><el-switch v-model="isAutoCalc" active-text="自动推算" size="large" /></el-col>
            </el-row>
        </div>
        <el-table :data="currentPlan['timeSpan']" style="width: 100%" :span-method="spanMethod" align="center">
            <el-table-column prop="type" label="时间段" width="80" align="center" />
            <el-table-column type="index" :index="reIndex" label="节次" width="120" align="center" />
            <el-table-column prop="stTime" label="开始时间" width="180">
                <template v-slot="scope">
                    <el-input v-model="scope.row.stTime"
                        :min-time="scope.$index - 1 > 0 ? currentPlan['timeSpan'][scope.$index - 1]['endTime'] : null"
                        :max-time="scope.row.endTime" placeholder="Start time" @change="changeTime(scope.$index)"
                        @click="showTS($event)" />
                </template>

            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="180">
                <template v-slot="scope">
                    <el-input v-model="scope.row.endTime" :min-time="scope.row.stTime" placeholder="End time" start="05:00"
                        end="23:55" @change="changeTime(scope.$index)" @mousedown="showTS($event)" />
                </template>
            </el-table-column>
        </el-table>
    </div>
    <timeSelect v-bind="tsConfig" :st-hour="9" :end-hour="23" ref="tsShow" @change-time="setNewTime" />
</template>
