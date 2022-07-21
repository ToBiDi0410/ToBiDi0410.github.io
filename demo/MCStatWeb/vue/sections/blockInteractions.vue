<template>
    <Box :title="data.getTrans('BLOCK_INTERACTIONS')">
        <ApexChart class="basis-0 flex-grow" :title="data.getTrans('TOTAL_BLOCK_INTERACTIONS') + ' (' + data.getTrans('TOP10') + ')'" :options="totalInteractionChartOptions" v-if="hasData() && totalInteractionChartOptions"></ApexChart>
        <ApexChart class="basis-0 flex-grow" :title="data.getTrans('BLOCK_BREAK_PLACE_RATIO') + ' (' + data.getTrans('TOP10') + ')'" :options="breakPlaceChartOptions" v-if="hasData() && breakPlaceChartOptions"></ApexChart>
        
        <ExpandableSection :data="data" v-if="hasData()">
            <table class="flex-grow basis-0 w-full">
                <tr>
                    <th class="text-left">{{ data.getTrans("BLOCK") }}</th>
                    <th class="text-right">{{ data.getTrans("TOTAL") }}</th>
                    <th class="text-right">{{ data.getTrans("BROKEN") }}</th>
                    <th class="text-right">{{ data.getTrans("PLACED") }}</th>
                </tr>
                <tr v-for="buildData of sortedData()" :key="buildData[0]">
                    <td class="font-semibold p-1">{{ buildData[0] }}</td>
                    <td class="text-right p-1 font-semibold">{{ buildData[1].TOTAL || 0 }}</td>
                    <td class="text-right text-red-600 p-1 font-semibold">{{ buildData[1].BREAK || 0 }}</td>
                    <td class="text-right text-green-600 p-1 font-semibold">{{ buildData[1].PLACE || 0 }}</td>
                </tr>
            </table>
        </ExpandableSection>
        <NoDataAvailable :data="data" v-if="!hasData()"></NoDataAvailable>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import ApexChart from "../shared/ApexChart.vue";
import ExpandableSection from '../shared/ExpandableSection.vue';
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
    components: { Box, ApexChart, ExpandableSection, NoDataAvailable },
    props: ["data"],
    data: () => ({
        buildData: null,
        totalBuildCounts: null,
        totalInteractionChartOptions: null,
        breakPlaceChartOptions: null,
        listShown: true
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
            if(this.buildData) this.totalBuildCounts = Object.entries(this.buildData).map(([key, value]) => ({ key: key, value: this.getTotal(value)})).sort((a, b) => { return b.value - a.value; });
        },

        async prepareTotalInteractionChart() {
            var filledTreeOptions = copyObject(treeChartOptions);
            for(const [index, value] of limitArray(Object.entries(this.totalBuildCounts), 10)) {
                filledTreeOptions.series[0].data.push({ x: value.key, y: value.value });
            }
            this.totalInteractionChartOptions = filledTreeOptions;
        },

        async prepareBreakPlaceChart() {
            const TRANS_BROKEN = this.data.getTrans("BROKEN");
            const TRANS_PLACED = this.data.getTrans("PLACED");

            var filledBarOptions = copyObject(stackedBarOptions);
            for(const [index, [key, value]] of limitArray(Object.entries(Object.entries(this.buildData), 10))) {
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
        },

        sortedData() {
            let entries = Object.entries(this.buildData);
            entries = entries.map((a) => { 
                a[1].TOTAL = this.getTotal(a[1]);
                return a;
            });
            entries = entries.sort((a, b) => { return b[1].TOTAL - a[1].TOTAL });
            return entries;
        },

        getTotal(obj) {
            return ((obj.BREAK || 0) + (obj.PLACE || 0));
        },

        hasData() {
            return this.buildData && this.totalBuildCounts;
        }
    }
}
</script>