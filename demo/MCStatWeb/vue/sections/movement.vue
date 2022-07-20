<template>
    <Box :title="data.getTrans('MOVEMENT')">
        <div class="flex flex-col lg:flex-row flex-wrap w-full" v-if="hasData()">
            <table class="flex-grow basis-0">
                <tr>
                    <th class="text-left">{{ data.getTrans("MOVEMENT_TYPE") }}</th>
                    <th class="text-right">{{ data.getTrans("DISTANCE") }} ({{ data.getTrans("BLOCKS") }})</th>
                </tr>
                <tr v-for="move of sortedEntries()" :key="move[0]">
                    <td class="font-semibold p-1">{{ data.getTrans(move[0]) }}</td>
                    <td class="text-right p-1">{{ Math.round(move[1]) }}</td>
                </tr>
            </table>
            <ApexChart class="flex-grow basis-0" :options="filledMovementChartOptions" v-if="filledMovementChartOptions"></ApexChart>
        </div>
        <NoDataAvailable v-if="!hasData()" :data="data"></NoDataAvailable>
    </Box>
</template>

<script>
const chartOptions = {
    id: "Movement",
    chart: {
        type: "pie",
        height: 250,
    },
    labels: [],
    series: []
}

import Box from '../shared/Box.vue';
import ApexChart from '../shared/ApexChart.vue';
import NoDataAvailable from '../shared/NoDataAvailable.vue';

export default {
    components: { Box, ApexChart, NoDataAvailable },
    props: ["data"],
    data: () => ({ travelData: null, filledMovementChartOptions: null }),
    async mounted() {
        await this.loadDataFromDB();
    },
    methods: {
        async loadDataFromDB() {
            this.travelData = await this.data.DBR.getWorldTravelData();

            const copiedChartOptions = copyObject(chartOptions);
            for(const [key, value] of this.sortedEntries()) {
                copiedChartOptions.labels.push(this.data.getTrans(key));
                copiedChartOptions.series.push(Math.round(value));
            }
            this.filledMovementChartOptions = copiedChartOptions;
        },

        sortedEntries() {
            if(!this.travelData) return [];
            return Object.entries(this.travelData).sort((a, b) => { return b[1] - a[1] });
        },

        hasData() {
            return this.travelData && this.sortedEntries().length > 0;
        }
    }
}
</script>