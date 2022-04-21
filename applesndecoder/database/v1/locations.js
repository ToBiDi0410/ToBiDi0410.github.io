export let LOCATIONS = {
    'FC': {
        country: 'US',
        subarea: 'Colorado',
        city: 'Fountain',
    },

    'F': {
        country: 'US',
        subarea: 'California',
        city: 'Fremont',
    },

    'XA|XB|QP|G8': {
        country: "US"
    },

    'RN': {
        country: "MX",
    },

    'CK': {
        country: "IE",
        subarea: "Cork"
    },

    'VM': {
        name: "Foxconn",
        country: "CZ",
        city: "Pardubice"
    },

    'SG|E': {
        country: "SG"
    },

    'MB': {
        country: "MY"
    },

    'PT|CY': {
        country: "KR"
    },

    'EE|QT|UV': {
        country: "CN",
        subarea: "Taiwan"
    },

    'FK|F1|F2': {
        name: "Foxconn",
        country: "CN",
        city: "Zhengzhou"
    },

    'W8': {
        country: "CN",
        city: "Shanghai"
    },

    'DL|DM': {
        name: "Foxconn",
        country: "CN",
    },

    'DN': {
        name: "Foxconn",
        country: "CN",
        city: "Chengdu"
    },

    'YM|7J': {
        name: "Hon Hai or Foxconn",
        country: "CN"
    },

    '1C|4H|WQ|F7': {
        country: "CN",
    },

    'C0': {
        name: "Tech Com - Quanta Computer Subsidiary",
        country: "CN"
    },

    'C3': {
        name: "Foxxcon",
        country: "CN",
        city: "Shenzhen"
    },

    'C7': {
        name: "Pentragon",
        country: "CN",
        city: "Changhai"
    },

    'RM': {
        name: "Refurbished somewhere by Apple"
    }
}

Object.entries(LOCATIONS).forEach((pair) => {
    const key = pair[0];
    if (key.includes("|")) {
        for (const str of key.split("|")) {
            LOCATIONS[str] = pair[1];
        }
    }
});