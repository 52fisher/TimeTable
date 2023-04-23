<template>
    <div class="container">
        <ClassSchedule></ClassSchedule>
    </div>
    <div class="weidget">
        <CourseTips />
        <TimeCountDown />
    </div>
</template>
<script>
import ClassSchedule from '../components/ClassSchedule.vue';
import CourseTips from '../components/CourseTips.vue';
import TimeCountDown from '../components/TimeCountDown.vue';
</script>
<style>
.container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.weidget {
    float: right;
    top: 10px;
    right: 80px;
    width: 240px;
    height: 200px;
    position: absolute;
    text-align: center;
    user-select: none;
}
</style>