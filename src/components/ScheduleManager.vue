<template>
  <div class="calendar-container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions } from '@fullcalendar/core'

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

// Calendar options
const calendarOptions: CalendarOptions = {
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: [
    {
      title: 'Sample Event 1',
      start: new Date(),
      allDay: true
    },
    {
      title: 'Sample Event 2',
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      allDay: true
    }
  ],
  // Date click event
  dateClick: function(arg: any) {
    const title = prompt('Please enter event title:')
    if (title) {
      // Get calendar instance and add event
      const calendarApi = arg.view.calendar
      calendarApi.addEvent({
        title,
        start: arg.date,
        allDay: arg.allDay
      })
    }
  },
  // Event click event
  eventClick: function(arg: any) {
    if (confirm(`Are you sure you want to delete the event: ${arg.event.title}`)) {
      arg.event.remove()
    }
  },
  // Time period selection event
  select: function(arg: any) {
    const title = prompt('Please enter event title:')
    if (title) {
      const calendarApi = arg.view.calendar
      calendarApi.unselect()
      calendarApi.addEvent({
        title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay
      })
    }
  }
}

// 窗口大小调整处理
const handleResize = () => {
  if (calendarRef.value) {
    // 调用 FullCalendar 的 updateSize 方法来适应新的容器大小
    calendarRef.value.getApi().updateSize()
  }
}

// 组件挂载时添加事件监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始调整大小
  setTimeout(() => {
    handleResize()
  }, 100)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.calendar-container {
  height: calc(100vh - 100px);
  padding: 20px 20px 20px 0px;
  box-sizing: border-box;
  width: 90%;
  overflow: hidden;
}

:deep(.fc) {
  height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:deep(.fc-view-harness) {
  width: 100% !important;
  overflow-x: hidden;
}

/* Header toolbar style */
:deep(.fc) {
  --fc-border-color: #f0f0f0;
  --fc-button-text-color: #000;
  --fc-button-bg-color: #fff;
  --fc-button-border-color: #d9d9d9;
  --fc-button-hover-bg-color: #f5f5f5;
  --fc-button-hover-border-color: #d9d9d9;
  --fc-button-active-bg-color: #e6f7ff;
  --fc-button-active-border-color: #1890ff;
}

/* Dark mode adaptation */
@media (prefers-color-scheme: dark) {
  :deep(.fc) {
    --fc-border-color: #303030;
    --fc-button-text-color: #fff;
    --fc-button-bg-color: #1f1f1f;
    --fc-button-border-color: #434343;
    --fc-button-hover-bg-color: #262626;
    --fc-button-hover-border-color: #434343;
    --fc-button-active-bg-color: #11263c;
    --fc-button-active-border-color: #177ddc;
  }
  
  :deep(.fc-theme-standard td, .fc-theme-standard th) {
    border-color: #303030;
  }
  
  :deep(.fc-col-header-cell-cushion) {
    color: #fff;
  }
  
  :deep(.fc-daygrid-day-number) {
    color: #fff;
  }
}
</style>