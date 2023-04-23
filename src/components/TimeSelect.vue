<template>
    <Teleport to="body">
        <div class="time_select_poper" v-if="tsShow">
            <div class="time_select_mask" @click="tsShow = false"></div>
            <div class="time_select" :style="{ 'left': tsleft, 'top': tstop }">
                <ul class="tp_hour" ref="tp_hour">
                    <template v-for="(hour, index) in hourList" :key="index">
                        <li v-if="hour != nHour" @click="this.nHour = hour">{{ hour }}</li>
                        <li v-else class="active">{{ hour }}</li>
                    </template>
                </ul>
                <ul class="tp_minute" ref="tp_minute">
                    <template v-for="(min, index) in minList" :key="index">
                        <li v-if="min != nMin" @click="this.nMin = min">{{ min }}</li>
                        <li v-else class="active">{{ min }}</li>
                    </template>
                </ul>
                <button class="tp_cancle" @click="tsShow = false">取消</button><button class="tp_ok" @click="changeTime($event)">确定</button>
            </div>

        </div>
    </Teleport>
</template>
<script>
export default {
    emits: ['change-time'],
    props: {
        stHour: {
            type: Number,
            default: 5
        },
        endHour: {
            type: Number,
            default: 23
        },
        cHour: Number,
        cMin: Number,
        top: {
            type: [String, Number],
            default: "50%"
        },
        left: {
            type: [String, Number],
            default: "50%"
        }

    },
    data() {
        const stHour = this.stHour;
        const endHour = this.endHour;
        //生成24小时的数组，小时和分钟，分钟每5分钟一个间隔
        let hours = [];
        let minutes = [];
        for (let i = stHour; i <= endHour; i++) {
            hours.push(("0" + i).slice(-2));
        }
        for (let i = 0; i < 60; i += 5) {
            minutes.push(("0" + i).slice(-2));
        }
        console.log(this.cHour, this.cMin)
        return {
            hourList: hours,
            minList: minutes,
            tsShow: false,
            nHour: this.cHour,
            nMin: this.cMin,
        }
    }, methods: {
        scrollTs() {
            this.$nextTick(() => {
                this.$refs.tp_hour.scrollTop = this.tp_hour_sct;
                this.$refs.tp_minute.scrollTop = this.tp_min_sct;
            })
        }, changeTime(event) {
            this.$emit('change-time', this.nHour, this.nMin);
            this.tsShow = false;
        }
    }, computed: {
        tsleft() {
            return this.left + 'px';
        }, tstop() {
            let tstop = (this.top + 180) > document.body.offsetHeight ? this.top - 190 : this.top + 30;
            tstop += 'px';
            return tstop;
        }, tp_hour_sct() {
            return (this.cHour - this.stHour - 3) * 20
        }, tp_min_sct() {
            return (this.cMin / 5 - 3) * 20;
        }, 
    }, watch: {
        left(nv) {
            this.tsShow = true;
            console.log("left", nv)
            this.scrollTs()
        },
        top(nv) {
            this.tsShow = true;
            console.log("top", nv)
            this.scrollTs()
        },cHour(nv){
            this.nHour = this.cHour;
        },cMin(nv){
            this.nMin = this.cMin;
        }
    }


}
</script>
<style lang="less">
.time_select_poper {
    height: 100vh;
    width: 100vw;
    position: absolute;
    z-index: 998;
    top: 0;
    left: 0;
}

.time_select_mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0,0);
}

.time_select {
    --item-height: 20px;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    // padding: 10px;
    width: 140px;
    height: 170px;
    // overflow-y: scroll;
    text-align: center;
    flex-wrap: wrap;
    border-radius: 5px;
    overflow: hidden;
}

.time_select {
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 50%;
        height: calc(var(--item-height) * 7);
        overflow-y: scroll;
        cursor: default;
    }

    //去除ul的滚动条
    ul::-webkit-scrollbar {
        display: none;
    }

    li {
        height: var(--item-height);
    }

    li:hover {
        background-color: #ebeef5;

    }

    .active {
        background-color: #409eff !important;
        color: #fff;
    }

    button {
        width: 50%;
        height: 30px;
        border: none;
        background-color: #fff;
        color: #409eff;
        cursor: pointer;

        &:hover {
            background-color: #ebeef5;
        }
    }

    //设置确定按钮的背景色
    .tp_ok {
        background-color: #E7475E;
        color: #fff;

        &:hover {
            background-color: #F71E35;
        }
    }
}
</style>