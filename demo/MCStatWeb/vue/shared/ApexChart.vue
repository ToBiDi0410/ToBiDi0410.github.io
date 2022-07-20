<template>
    <div class="ApexChart bg-transparent rounded-lg m-2 relative">
        <div class="font-bold p-2">{{ title }}</div>
        <div ref="chart" class="h-12 left-0 right-0 mx-auto" style="width: 100%; max-width: 80vw;"></div>
    </div>
</template>

<script>
const defaultOptions = {
    chart: {
        background: 'transparent',
        width: '100%',
        height: '100%',
        toolbar: {
            show: false
        }
    },
    theme: {
        mode: 'light'
    },
    xaxis: {
        labels: {
            hideOverlappingLabels: false,
        }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#03A9F4', '#4CAF50', '#F9CE1D', '#FF9800', '#33B2DF', '#546E7A', '#D4526E', '#13D8AA', '#A5978B']
}

export default {
    name: "ApexCharts",
    props: ["title", "options"],
    data: () => ({ chart: null, processedOptions: {}, id: Math.random() }),
    mounted() {
        this.processedOptions = mergeDeep(copyObject(defaultOptions), copyObject(this.options));
        if(isNum(this.options.chart.height)) {
            this.$refs.chart.style.height = this.options.chart.height + "px";
        }
        this.chart = new ApexCharts(this.$refs.chart, this.processedOptions);
        this.chart.windowResizeHandler();
        this.chart.render();
        console.log("[APEXCHART] Created new Chart", this.id);
    },
    beforeUnmount() {
        console.log("[APEXCHART] Destroyed Chart", this.id);
        this.chart.destroy();
    }
}
</script>