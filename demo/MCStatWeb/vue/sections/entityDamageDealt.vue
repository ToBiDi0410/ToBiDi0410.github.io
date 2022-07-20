<template>
    <Box :title="data.getTrans('ENTITY_DAMAGE_DEALT')">
        <ApexChart v-if="filledBarChartOptions" :options="filledBarChartOptions"></ApexChart>
        <table class="flex-grow basis-0 w-full" v-if="hasData()">
            <tr>
                <th class="text-left">{{ data.getTrans("ENTITY") }}</th>
                <th class="text-right">{{ data.getTrans("DAMAGE") }}</th>
                <th class="text-right">{{ data.getTrans("KILLED") }}</th>
            </tr>
            <tr v-for="damage of sortedEntries()" :key="damage[0]">
                <td class="font-semibold p-1">{{ damage[0] }}</td>
                <td class="text-right p-1">{{ window.roundTwoDecimals(damage[1].hp) }}</td>
                <td class="text-right p-1">{{ damage[1].kills }}</td>
            </tr>
        </table>
        <NoDataAvailable v-if="!hasData()" :data="data"></NoDataAvailable>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import ApexChart from '../shared/ApexChart.vue';
import NoDataAvailable from '../shared/NoDataAvailable.vue';

var barChartOptions = {
    series: [{ 
        data: [] 
    }],
    chart: {
        type: 'bar',
        height: 'auto',
        height: 400
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
        }
    },
    xaxis: { categories: [] }
};

export default {
    components: { Box, NoDataAvailable, ApexChart },
    props: ["data"],
    data: () => ({ damageData: null, killsData: null, joinedData: null, filledBarChartOptions: null }),
    async mounted() {
        await this.loadDataFromDB();
    },
    methods: {
        async loadDataFromDB() {
            this.damageData = await this.data.DBR.getWorldEntityDamageGivenData() || {};
            this.killsData = await this.data.DBR.getWorldEntityKills() || {};

            this.joinedData = {};
            for(const [key, value] of Object.entries(this.damageData)) {
                if(!this.joinedData[key]) this.joinedData[key] = { kills: 0, hp: 0 }
                this.joinedData[key].hp += value;
            }

            for(const [key, value] of Object.entries(this.killsData)) {
                if(!this.joinedData[key]) this.joinedData[key] = { kills: 0, hp: 0 }
                this.joinedData[key].kills += value;
            }

            this.prepareBarChart();
        },

        prepareBarChart() {
            const copiedOptions = copyObject(barChartOptions);

            copiedOptions.series[0].name = this.data.getTrans("DAMAGE") + " (" + this.data.getTrans("HITPOINTS_SHORT") + ")",
            copiedOptions.series[0].data = [];
            copiedOptions.xaxis.categories = [];
            for(const [key, value] of this.sortedDamageData()) {
                copiedOptions.series[0].data.push(roundTwoDecimals(value));
                copiedOptions.xaxis.categories.push(key);
            }

            this.filledBarChartOptions = copiedOptions;
        },

        sortedEntries() {
            return Object.entries(this.joinedData).sort((a, b) => { return (b[1].hp + b[1].kills * 20) - (a[1].hp + a[1].kills * 20) });
        },

        sortedDamageData() {
            return Object.entries(this.damageData).sort((a, b) => { return b[1] - a[1] })
        },

        hasData() {
            return this.joinedData && this.sortedEntries().length > 0;
        }
    }
}
</script>