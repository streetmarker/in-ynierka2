<template>
	<div id="app">
		<h1>My Calendar</h1>
		<CalendarView
			:show-date="showDate"
			class="theme-default holiday-us-traditional holiday-us-official">
			<!-- <template #header="{ headerProps }">
				<CalendarViewHeader
					@input="setShowDate" />
			</template> -->
		</CalendarView>
	</div>
</template>
<script>
	import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"

	import "vue-simple-calendar/dist/style.css"
	// The next two lines are optional themes
	import "vue-simple-calendar/dist/css/default.css"
	import "vue-simple-calendar/dist/css/holidays-us.css"

	export default {
		name: 'app',
		data: function() {
			return { showDate: new Date() }
		},
		components: {
			CalendarView,
			CalendarViewHeader,
		},
		methods: {
			setShowDate(d) {
				this.showDate = d;
			},
		}
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		color: #2c3e50;
		height: 67vh;
		width: 90vw;
		margin-left: auto;
		margin-right: auto;
	}
</style>