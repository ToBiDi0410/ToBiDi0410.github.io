<template>
    <Box :title="data.getTrans('BLOCK_INTERACTIONS')">
        <ApexChart class="basis-0 flex-grow" :title="data.getTrans('TOTAL_BLOCK_INTERACTIONS')" :options="totalInteractionChartOptions" v-if="totalInteractionChartOptions"></ApexChart>
        <ApexChart class="basis-0 flex-grow" :title="data.getTrans('BLOCK_BREAK_PLACE_RATIO')" :options="breakPlaceChartOptions" v-if="breakPlaceChartOptions"></ApexChart>
        <NoDataAvailable :data="data" v-if="!totalBuildCounts"></NoDataAvailable>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import ApexChart from "../shared/ApexChart.vue";
import NoDataAvailable from '../shared/NoDataAvailable.vue';

const treeChartOptions = {
    id: "BlockInteractionsTree",
    series: [{
        data: []
    }],
    labels: [],
    chart: {
        type: 'treemap',
        height: 200
    },
}

const stackedBarOptions = {
    id: "BlockInteractionsStacked",
    series: [],
    chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%',
        height: 200
    },
    xaxis: {
        categories: [],
        labels: {
            rotate: 0
        }
    },
    yaxis: {
        show: true
    },
    colors: ['#E91E63', '#15803D'],
    legend: {
        show: false
    },
    fill: {
        opacity: 1
    },
};

export default {
    components: { Box, ApexChart, NoDataAvailable },
    props: ["data"],
    data: () => ({
        buildData: null,
        totalBuildCounts: null,
        totalInteractionChartOptions: null,
        breakPlaceChartOptions: null,
    }),
    async mounted() {
        await this.loadDataFromDB();

        if(this.buildData) {
            setTimeout(async () => {
                await this.prepareTotalInteractionChart();
                await this.prepareBreakPlaceChart();
            }, 100);
        }
    },
    methods: {
        async loadDataFromDB() {
            this.buildData = await this.data.DBR.getWorldBuildData();
            if(this.buildData) this.totalBuildCounts = Object.entries(this.buildData).map(([key, value]) => ({ key: key, value: value.BREAK || 0 + value.PLACE || 0})).sort((a, b) => { return b.value - a.value; });
        },

        async prepareTotalInteractionChart() {
            var filledTreeOptions = copyObject(treeChartOptions);
            for(const [index, value] of Object.entries(this.totalBuildCounts)) {
                filledTreeOptions.series[0].data.push({ x: value.key, y: value.value });
            }
            this.totalInteractionChartOptions = filledTreeOptions;
        },

        async prepareBreakPlaceChart() {
            const TRANS_BROKEN = this.data.getTrans("BROKEN");
            const TRANS_PLACED = this.data.getTrans("PLACED");

            var filledBarOptions = copyObject(stackedBarOptions);
            for(const [index, [key, value]] of Object.entries(Object.entries(this.buildData))) {
                filledBarOptions.xaxis.categories[index] = key.replace("_", "\n").match(/.{1,6}/g);

                var BREAK_DATA = nulledArray(Object.entries(this.buildData).length);
                BREAK_DATA[index] = value.BREAK || 0;

                var PLACE_DATA = nulledArray(Object.entries(this.buildData).length);
                PLACE_DATA[index] = value.PLACE || 0;

                filledBarOptions.series.push({
                    name: TRANS_BROKEN,
                    data: BREAK_DATA
                });

                filledBarOptions.series.push({
                    name: TRANS_PLACED,
                    data: PLACE_DATA
                });
            }

            this.breakPlaceChartOptions = filledBarOptions;
        }
    }
}
</script>