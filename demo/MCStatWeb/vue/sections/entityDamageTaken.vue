<template>
    <Box :title="data.getTrans('ENTITY_DAMAGE_TAKEN')">
       <table class="flex-grow basis-0 w-full" v-if="hasData()">
            <tr>
                <th class="text-left">{{ data.getTrans("ENTITY") }}</th>
                <th class="text-right">{{ data.getTrans("DAMAGE") }}</th>
            </tr>
            <tr v-for="damage of sortedEntries()" :key="damage[0]">
                <td class="font-semibold p-1">{{ damage[0] }}</td>
                <td class="text-right p-1">{{ window.roundTwoDecimals(damage[1]) }}</td>
            </tr>
        </table>
        <NoDataAvailable v-if="!hasData()" :data="data"></NoDataAvailable>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import NoDataAvailable from '../shared/NoDataAvailable.vue';

export default {
    components: { Box, NoDataAvailable },
    props: ["data"],
    data: () => ({ damageData: null }),
    async mounted() {
        await this.loadDataFromDB();
    },
    methods: {
        async loadDataFromDB() {
            this.damageData = await this.data.DBR.getWorldEntityDamageRecievedData();
        },

        sortedEntries() {
            return Object.entries(this.damageData).sort((a, b) => { return b[1] - a[1] });
        },

        hasData() {
            return this.damageData && this.sortedEntries().length > 0;
        }
    }
}
</script>