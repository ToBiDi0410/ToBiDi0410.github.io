<template>
    <Box :title="data.getTrans('ENTITY_DAMAGE_DEALT')">
        <ApexChart v-if="hasData() && filledDamageOptions" :title="data.getTrans('ENTITY_DAMAGE_DEALT_SHORT') + ' (' + data.getTrans('TOP10') + ')'" :options="filledDamageOptions"></ApexChart>
        <ApexChart v-if="hasData() && filledKillsOptions" :title="data.getTrans('ENTITIES_KILLED') + ' (' + data.getTrans('TOP10') + ')'" :options="filledKillsOptions"></ApexChart>

        <ExpandableSection :data="data" v-if="hasData()">
            <table class="flex-grow basis-0 w-full" >
                <tr>
                    <th class="text-left">{{ data.getTrans("ENTITY") }}</th>
                    <th class="text-right">{{ data.getTrans("DAMAGE") }}</th>
                    <th class="text-right">{{ data.getTrans("KILLED") }}</th>
                </tr>
                <tr v-for="damage of sortedEntries()" :key="damage[0]">
                    <td class="p-1 font-semibold">{{ damage[0] }}</td>
                    <td class="text-right p-1 font-semibold">{{ window.roundTwoDecimals(damage[1].hp) }}</td>
                    <td class="text-right p-1 font-semibold">{{ damage[1].kills }}</td>
                </tr>
            </table>
        </ExpandableSection>
        
        <NoDataAvailable v-if="!hasData()" :data="data"></NoDataAvailable>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import ApexChart from '../shared/ApexChart.vue';
import ExpandableSection from '../shared/ExpandableSection.vue';
import NoDataAvailable from '../shared/NoDataAvailable.vue';

var damageBarChartOptions = {
    series: [
        { data: [] },
    ],
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

var killsBarChartOptions = {
    series: [
        { data: [] },
    ],
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
    components: { Box, ApexChart, ExpandableSection, NoDataAvailable },
    props: ["data"],
    data: () => ({ damageData: null, killsData: null, joinedData: null, filledKillsOptions: null, filledDamageOptions: null }),
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
            const copiedDamageOptions = copyObject(damageBarChartOptions);
            copiedDamageOptions.series[0].name = this.data.getTrans("DAMAGE") + " (" + this.data.getTrans("HITPOINTS_SHORT") + ")",
            copiedDamageOptions.series[0].data = [];
            copiedDamageOptions.xaxis.categories = [];

            const copiedKillsOptions = copyObject(killsBarChartOptions);
            copiedKillsOptions.series[0].data = [];
            copiedKillsOptions.series[0].name = this.data.getTrans("KILLS"),
            copiedKillsOptions.xaxis.categories = [];

            for(const [key, value] of this.sortedEntries()) {
                if(value.hp > 0) {
                    copiedDamageOptions.xaxis.categories.push(key);
                    copiedDamageOptions.series[0].data.push(roundTwoDecimals(value.hp));
                }

                if(value.kills > 0) {
                    copiedKillsOptions.series[0].data.push(value.kills);
                    copiedKillsOptions.xaxis.categories.push(key);
                }
            }

            if(copiedKillsOptions.series[0].data.length > 0) this.filledKillsOptions = copiedKillsOptions;
            if(copiedDamageOptions.series[0].data.length > 0) this.filledDamageOptions = copiedDamageOptions;
        },

        sortedEntries() {
            return Object.entries(this.joinedData).sort((a, b) => { return (b[1].hp + b[1].kills * 20) - (a[1].hp + a[1].kills * 20) });
        },

        sortedDamageData() {
            return Object.entries(this.damageData).sort((a, b) => { return b[1] - a[1] })
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