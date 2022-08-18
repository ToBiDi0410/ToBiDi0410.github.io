<template>
    <div class="mt-2 p-2 bg-black flex flex-row align-middle items-center content-center justify-between center w-full relative overflow-hidden">
        <div class="linkImage z-10 min-w-fit">
            <img class="h-8 w-8" :src="getIconUrl()" :title="plattform">
        </div>
        <div class="linkText font-gothic text-lg w-fit h-fit rainbow z-5 text-center break-words overflow-hidden p-2">
            {{ getUserNamePrefix() + name }}
        </div>
        <div class="linkButton rounded-full px-4 py-2 text-center w-fit h-fit font-semibold z-10" :class="(clicked ? 'bg-lime-700 hover:bg-lime-600' : 'bg-sky-600 hover:bg-sky-400 buttonblinkDISABLED') + (canClick() ? '' : ' invisible')" @click="visitPage()">
            <a>{{ !clicked ? getButtonText() : '✓' }}</a>
        </div>
    </div>
</template>

<script>
export default {
    props: ["name", "plattform", "values"],
    data: () => ({ clicked: false }),
    methods: {
        getButtonText() {
            return "Visit";
        },
        getIconUrl() {
            if(!this.hasPlattform()) return "NOT_FOUND";
            return this.replaceDataValue(this.getPlattform().icon);
        },
        getUserNamePrefix() {
            if(!this.hasPlattform()) return "(UNK)";
            return this.getPlattform().hasAt ? '@' : '';
        },
        getPlattform() {
            const plattform = plattformDB[(this.plattform || "").toLowerCase()];
            return plattform;
        },
        hasPlattform() {
            return this.getPlattform() != undefined;
        },
        canClick() {
            return this.getPlattform().linkTemplate != null;
        },
        replaceDataValue(str) {
            if(this.values == undefined || this.values.length == 0) return str;
            if(str == undefined) return "";
            let modS = str;
            for(var i=0 + 1; i<this.values.length + 1; i++) {
                modS = modS.replace("%" + i + "%", this.values[i-1]);
            }
            return modS;
        },
        async visitPage() {
            if(!this.canClick()) return;
            const strg = window.pressedKeys[17] == true;
            if(this.hasPlattform()) {
                let baseURL = this.getPlattform().linkTemplate || 'about:blank';
                baseURL = this.replaceDataValue(baseURL);

                if(this.getPlattform().warnBeforeRedirect) {
                    const willDelete = await swal({
                        title: "Are you sure?",
                        text: "We are not sure if this is safe, please check the link yourself\n\nThis will redirect you to the following URL:\n" + baseURL,
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    });
                    if(!willDelete) return;
                }

                if(strg || window.pressedKeys[17]) window.open(baseURL, '').focus();
                else window.location.href = baseURL;
                this.clicked = true;
            }
        }
    }
}

const plattformDB = {
    "youtube": { hasAt: false, icon: "./icons/youtube.png", linkTemplate: "https://www.youtube.com/channel/%1%" },
    "instagram": { hasAt: true, icon: "./icons/instagram.png", linkTemplate: "https://www.instagram.com/%1%" },
    "tiktok": { hasAt: true, icon: "./icons/tiktok.ico", linkTemplate: "https://www.tiktok.com/%1%" },
    "github": { hasAt: false, icon: "./icons/github.png", linkTemplate: "https://www.github.com/%1%" },
    "discorduser": { hasAt: false, icon: "./icons/discord.png", linkTemplate: "https://discordapp.com/users/%1%" },
    "discordserver": { hasAt: false, icon: "./icons/discord.png", linkTemplate: "https://discord.gg/%1%" },
    "spigotmc": { hasAt: false, icon: "./icons/spigotmc.png", linkTemplate: "https://www.spigotmc.org/members/%1%/" },
    "fiverr": { hasAt: true, icon: "./icons/fiverr.png", linkTemplate: "https://de.fiverr.com/%1%" },
    "minecraft": { hasAt: false, icon: "./icons/minecraft.png", linkTemplate: "https://de.namemc.com/profile/%1%" },
    "steam": { hasAt: false, icon: "./icons/steam.png", linkTemplate: "https://steamcommunity.com/id/%1%" },
    "origin": { hasAt: false, icon: "./icons/origin.png" },
    "epicgames": { hasAt: false, icon: "./icons/epicgames.png", linkTemplate: "https://store.epicgames.com/de/u/%1%" }
}
</script>