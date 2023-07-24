import { SCHOOLS_CSV } from "./schools.js";

/*
Scrape zipwho.com
JSON.stringify(Object.fromEntries(Array.from(document.querySelectorAll('#details_table tr')).map(el=>{
    return [el.querySelector(':first-child').innerText, el.querySelector(':nth-child(2)').innerText]
}).filter(t => t[0] || t[1])))
*/

let map;
let featureLayer;

let state = {
    get mapMode() {
        return document.querySelector('#map-mode').value
    }
}

document.querySelector('#map-mode').addEventListener('change', () => {
    addFeatureLayerStyles(map)
})

// San Jose: ChIJ9T_5iuTKj4ARe3GfygqMnbk

const featureStyleOptions = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
    fillColor: "#810FCB",
    fillOpacity: 0.5,
};


const FEATURES = {
    "ChIJZ2fd6RvMj4ARKUI5wEomras": { code: 95101 },
    "ChIJwygk8ZfMj4ARznbY9UhpqaQ": { code: 95103 },
    "ChIJwygk8ZfMj4ARPgtGzl0wKi8": { code: 95106 },
    "ChIJwygk8ZfMj4ARSqcVz-cymNo": { code: 95108 },
    "ChIJwygk8ZfMj4ARBCDgHblLwL0": { code: 95109 },
    "ChIJ31SYUmLLj4AR4o5iJ_upyvk": { code: 95110, "Median Income":48000,"Cost Of Living Index":311.4,"Median Mortgage To Income Ratio (%)":24.8,"Owner Occupied Homes (%)":38.6,"Median Rooms In Home":3.7,"College Degree (%)":14.7,"Professional (%)":22,"Population":18,"Average Household Size":3.8,"Median Age":29,"Male To Female Ratio (%)":134.5,"Married (%)":44.6,"Divorced (%)":9.7,"White (%)":18.9,"Black (%)":2.4,"Asian (%)":5,"Hispanic Ethnicity (%)":70.7},
    "ChIJoUEVh2syjoARCxcoKKPt_QM": { code: 95111, "Median Income":58000,"Cost Of Living Index":298.2,"Median Mortgage To Income Ratio (%)":26.5,"Owner Occupied Homes (%)":65.1,"Median Rooms In Home":4.6,"College Degree (%)":14.1,"Professional (%)":24.5,"Population":57,"Average Household Size":4,"Median Age":29,"Male To Female Ratio (%)":104.5,"Married (%)":54.6,"Divorced (%)":7.7,"White (%)":15.6,"Black (%)":3.4,"Asian (%)":30.2,"Hispanic Ethnicity (%)":47.3 },
    "ChIJ4YcqPMHKj4AR_oe_L8U_ojs": { code: 95117, "Median Income":57000,"Cost Of Living Index":443.1,"Median Mortgage To Income Ratio (%)":24.2,"Owner Occupied Homes (%)":35.7,"Median Rooms In Home":4.1,"College Degree (%)":35.1,"Professional (%)":43.8,"Population":29,"Average Household Size":2.6,"Median Age":32.2,"Male To Female Ratio (%)":102.7,"Married (%)":51.4,"Divorced (%)":11.6,"White (%)":46.2,"Black (%)":4.6,"Asian (%)":19.5,"Hispanic Ethnicity (%)":25.2},
    "ChIJBYcmMu4zjoAR23pm-OuPmhk": { code: 95118, "Median Income":73000,"Cost Of Living Index":425.2,"Median Mortgage To Income Ratio (%)":24.7,"Owner Occupied Homes (%)":66.1,"Median Rooms In Home":5.6,"College Degree (%)":33,"Professional (%)":43.8,"Population":32,"Average Household Size":2.8,"Median Age":35,"Male To Female Ratio (%)":96.3,"Married (%)":56.7,"Divorced (%)":11.5,"White (%)":63,"Black (%)":2.3,"Asian (%)":10.7,"Hispanic Ethnicity (%)":18.4},
    "ChIJJ1GmEqQvjoARRt9lVOHVrjs": { code: 95119, "Median Income":87000,"Cost Of Living Index":420.1,"Median Mortgage To Income Ratio (%)":24.7,"Owner Occupied Homes (%)":75.5,"Median Rooms In Home":6.2,"College Degree (%)":34.5,"Professional (%)":45.2,"Population":10,"Average Household Size":3.2,"Median Age":34.3,"Male To Female Ratio (%)":95.4,"Married (%)":60.8,"Divorced (%)":7.5,"White (%)":59.1,"Black (%)":3.7,"Asian (%)":13.4,"Hispanic Ethnicity (%)":17.5},
    "ChIJ7dRTL0AwjoARro34O1rqo6g": { code: 95120, "Median Income":120000,"Cost Of Living Index":690.6,"Median Mortgage To Income Ratio (%)":24,"Owner Occupied Homes (%)":91.7,"Median Rooms In Home":7.5,"College Degree (%)":60.8,"Professional (%)":66.6,"Population":37,"Average Household Size":2.9,"Median Age":40,"Male To Female Ratio (%)":94,"Married (%)":73.3,"Divorced (%)":4.9,"White (%)":66.8,"Black (%)":0.4,"Asian (%)":22.7,"Hispanic Ethnicity (%)":4.9 },
    "ChIJXXfFDoAtjoAR41J6sTZE5no": { code: 95121, "Median Income":75000,"Cost Of Living Index":361.8,"Median Mortgage To Income Ratio (%)":24.4,"Owner Occupied Homes (%)":77.4,"Median Rooms In Home":5.5,"College Degree (%)":20.1,"Professional (%)":34.6,"Population":36,"Average Household Size":4.1,"Median Age":31.4,"Male To Female Ratio (%)":102.2,"Married (%)":56.3,"Divorced (%)":6.2,"White (%)":16.3,"Black (%)":4.5,"Asian (%)":45.1,"Hispanic Ethnicity (%)":30.5},
    "ChIJTUEkLsgyjoARxHqSosTCbHw": { code: 95122, "Median Income":60000,"Cost Of Living Index":301.1,"Median Mortgage To Income Ratio (%)":24.6,"Owner Occupied Homes (%)":57.8,"Median Rooms In Home":4.2,"College Degree (%)":10.1,"Professional (%)":16.3,"Population":60,"Average Household Size":4.9,"Median Age":27.2,"Male To Female Ratio (%)":104.6,"Married (%)":52.7,"Divorced (%)":5.9,"White (%)":5.5,"Black (%)":3,"Asian (%)":30.9,"Hispanic Ethnicity (%)":57.4},
    "ChIJRUdx1SQujoAR1D1l6hEvUYE": { code: 95123, "Median Income":75000,"Cost Of Living Index":381.7,"Median Mortgage To Income Ratio (%)":24.6,"Owner Occupied Homes (%)":69.7,"Median Rooms In Home":5.5,"College Degree (%)":30.6,"Professional (%)":43.3,"Population":59,"Average Household Size":2.9,"Median Age":33.6,"Male To Female Ratio (%)":94.8,"Married (%)":56.6,"Divorced (%)":9.9,"White (%)":55.2,"Black (%)":3.7,"Asian (%)":14.8,"Hispanic Ethnicity (%)":20.7},
    "ChIJLYZ0HUI0joARxZgtM_Ya-JY": { code: 95124, "Median Income":79000,"Cost Of Living Index":469.5,"Median Mortgage To Income Ratio (%)":23.6,"Owner Occupied Homes (%)":73.4,"Median Rooms In Home":5.8,"College Degree (%)":37.2,"Professional (%)":48.1,"Population":45,"Average Household Size":2.7,"Median Age":36.9,"Male To Female Ratio (%)":95.3,"Married (%)":59.9,"Divorced (%)":10.2,"White (%)":72.1,"Black (%)":1.4,"Asian (%)":7.6,"Hispanic Ethnicity (%)":12.8},
    "ChIJeTX-s5XMj4ARpd08-2y8v5w": { code: 95112, "Median Income":41000,"Cost Of Living Index":323.3,"Median Mortgage To Income Ratio (%)":24.9,"Owner Occupied Homes (%)":31.9,"Median Rooms In Home":3.2,"College Degree (%)":20.8,"Professional (%)":29,"Population":51,"Average Household Size":3.1,"Median Age":29.4,"Male To Female Ratio (%)":123.1,"Married (%)":42.1,"Divorced (%)":8.9,"White (%)":23.9,"Black (%)":3.8,"Asian (%)":17.5,"Hispanic Ethnicity (%)":51.2},
    "ChIJ1exwkKTMj4ARj5Ab73tinkE": { code: 95113, },
    "ChIJwygk8ZfMj4AR9qozvkE24Ac": { code: 95115, },
    "ChIJYTY2Nh_Nj4ARMZCOkQZEniA": { code: 95116, "Median Income":48000,"Cost Of Living Index":283.6,"Median Mortgage To Income Ratio (%)":26.9,"Owner Occupied Homes (%)":43.2,"Median Rooms In Home":3.4,"College Degree (%)":10.4,"Professional (%)":16.6,"Population":51,"Average Household Size":4.2,"Median Age":27.9,"Male To Female Ratio (%)":104.2,"Married (%)":53.6,"Divorced (%)":6.6,"White (%)":8.8,"Black (%)":2.1,"Asian (%)":21.4,"Hispanic Ethnicity (%)":64.7},
    "ChIJtykoQGQzjoARurml4V3nAyA": { code: 95125, "Median Income":68000,"Cost Of Living Index":524.2,"Median Mortgage To Income Ratio (%)":24.6,"Owner Occupied Homes (%)":66.7,"Median Rooms In Home":5.3,"College Degree (%)":42.3,"Professional (%)":51.8,"Population":45,"Average Household Size":2.4,"Median Age":38.1,"Male To Female Ratio (%)":88.6,"Married (%)":54.3,"Divorced (%)":11.8,"White (%)":66,"Black (%)":1.8,"Asian (%)":6.9,"Hispanic Ethnicity (%)":20.9},
    "ChIJWyd8j0PLj4AR0jHDddMCreQ": { code: 95126, "Median Income":50000,"Cost Of Living Index":444.2,"Median Mortgage To Income Ratio (%)":25,"Owner Occupied Homes (%)":32,"Median Rooms In Home":3.8,"College Degree (%)":34.9,"Professional (%)":40.4,"Population":26,"Average Household Size":2.4,"Median Age":32.4,"Male To Female Ratio (%)":104.2,"Married (%)":45.1,"Divorced (%)":11.3,"White (%)":44.4,"Black (%)":4.3,"Asian (%)":7.8,"Hispanic Ethnicity (%)":38.5},
    "ChIJacdbrpHSj4ARM6AAE-bcDPQ": { code: 95127, "Median Income":63000,"Cost Of Living Index":355.1,"Median Mortgage To Income Ratio (%)":26.1,"Owner Occupied Homes (%)":71,"Median Rooms In Home":5.2,"College Degree (%)":18.4,"Professional (%)":28.1,"Population":60,"Average Household Size":3.9,"Median Age":30.7,"Male To Female Ratio (%)":99.2,"Married (%)":56.6,"Divorced (%)":7.4,"White (%)":22.5,"Black (%)":3,"Asian (%)":17.3,"Hispanic Ethnicity (%)":53.6},
    "ChIJ3ZbVUSXLj4ARuieDkEUgBOI": { code: 95128, "Median Income":55000,"Cost Of Living Index":436.3,"Median Mortgage To Income Ratio (%)":24.8,"Owner Occupied Homes (%)":41,"Median Rooms In Home":4.2,"College Degree (%)":32.1,"Professional (%)":42.2,"Population":32,"Average Household Size":2.6,"Median Age":33.7,"Male To Female Ratio (%)":97.6,"Married (%)":49.2,"Divorced (%)":12,"White (%)":51.2,"Black (%)":3.5,"Asian (%)":13,"Hispanic Ethnicity (%)":27.7},
    "ChIJFS71F1HMj4ARh01coyA6A-U": { code: 95133, "Median Income":68000,"Cost Of Living Index":352.7,"Median Mortgage To Income Ratio (%)":23.6,"Owner Occupied Homes (%)":60,"Median Rooms In Home":4.5,"College Degree (%)":26.8,"Professional (%)":35.5,"Population":25,"Average Household Size":3.6,"Median Age":32.3,"Male To Female Ratio (%)":97.4,"Married (%)":56.6,"Divorced (%)":6.9,"White (%)":13.5,"Black (%)":3.3,"Asian (%)":54.1,"Hispanic Ethnicity (%)":24.7},
    "ChIJjbOSYFTIj4ARp-EMf8nPxds": { code: 95134, "Median Income":82000,"Cost Of Living Index":277.9,"Median Mortgage To Income Ratio (%)":22.3,"Owner Occupied Homes (%)":52,"Median Rooms In Home":3.7,"College Degree (%)":50.5,"Professional (%)":61.1,"Population":9,"Average Household Size":2.3,"Median Age":32.7,"Male To Female Ratio (%)":113.3,"Married (%)":52.7,"Divorced (%)":9,"White (%)":45.2,"Black (%)":5.6,"Asian (%)":28.7,"Hispanic Ethnicity (%)":15.4},
    "ChIJt0U-uVMpjoARJ0ZAtDJPLb8": { code: 95135, "Median Income":96000,"Cost Of Living Index":510.9,"Median Mortgage To Income Ratio (%)":25.2,"Owner Occupied Homes (%)":91.8,"Median Rooms In Home":6.1,"College Degree (%)":50.4,"Professional (%)":62,"Population":15,"Average Household Size":2.7,"Median Age":40.8,"Male To Female Ratio (%)":90.4,"Married (%)":71.2,"Divorced (%)":5.6,"White (%)":47,"Black (%)":2.2,"Asian (%)":35.9,"Hispanic Ethnicity (%)":11.6},
    "ChIJC9n4LjQyjoAR7dWpzRgN3Y8": { code: 95136, "Median Income":74000,"Cost Of Living Index":404.9,"Median Mortgage To Income Ratio (%)":24.5,"Owner Occupied Homes (%)":63.7,"Median Rooms In Home":5.4,"College Degree (%)":35.3,"Professional (%)":46,"Population":36,"Average Household Size":2.8,"Median Age":32.8,"Male To Female Ratio (%)":96.2,"Married (%)":55.9,"Divorced (%)":8.9,"White (%)":48.6,"Black (%)":4.2,"Asian (%)":21.9,"Hispanic Ethnicity (%)":18.7},
    "ChIJJYZOSaAljoARR7a0_2vEAOQ": { code: 95141, },
    "ChIJ6ZtKgx4tjoARABCcOiZT_sQ": { code: 95148,  "Median Income":89000,"Cost Of Living Index":428.9,"Median Mortgage To Income Ratio (%)":24.8,"Owner Occupied Homes (%)":84.5,"Median Rooms In Home":6.2,"College Degree (%)":30.2,"Professional (%)":38.5,"Population":44,"Average Household Size":4,"Median Age":32.9,"Male To Female Ratio (%)":98.9,"Married (%)":61.5,"Divorced (%)":5.4,"White (%)":17.4,"Black (%)":4.6,"Asian (%)":50,"Hispanic Ethnicity (%)":22.9 },
    "ChIJOZ8DxADMj4AR9kuXoYKfAe8": { code: 95150, },
    "ChIJy25rQxHNj4AR4dz81AdRtWo": { code: 95156, },
    "ChIJW7eBtbHKj4ARfctsqQIIXH4": { code: 95157, },
    "ChIJs3ET8ekzjoARPUpZYks_Vxo": { code: 95158, },
    "ChIJZU3fgTnLj4AR-ZqU6inVDaA": { code: 95159, },
    "ChIJiVor7gYxjoARKHkdLoz_Jq0": { code: 95160, },
    "ChIJa32MrwrMj4ARDiOZycxDRLE": { code: 95190, },
    "ChIJyZh3ZGvLj4ARh0PaJoJ9IXE": { code: 95191, },
    "ChIJRa5JnL_Mj4ARMafo2tLOVfQ": { code: 95192, },
    "ChIJtYfohF21j4ARJPJuL5HvXUA": { code: 95129, "Median Income":79000,"Cost Of Living Index":592.6,"Median Mortgage To Income Ratio (%)":22.8,"Owner Occupied Homes (%)":59.2,"Median Rooms In Home":5,"College Degree (%)":55.6,"Professional (%)":62.7,"Population":37,"Average Household Size":2.6,"Median Age":36.6,"Male To Female Ratio (%)":97.3,"Married (%)":60.6,"Divorced (%)":8.1,"White (%)":46.2,"Black (%)":1.1,"Asian (%)":41.1,"Hispanic Ethnicity (%)":6.8},
    "ChIJd7h0hEU1joARgyoJyf-zlUA": { code: 95130, "Median Income":73000,"Cost Of Living Index":488.9,"Median Mortgage To Income Ratio (%)":24,"Owner Occupied Homes (%)":57.9,"Median Rooms In Home":5.2,"College Degree (%)":35.9,"Professional (%)":47.3,"Population":13,"Average Household Size":2.7,"Median Age":35.2,"Male To Female Ratio (%)":101.1,"Married (%)":57.6,"Divorced (%)":10.3,"White (%)":60.8,"Black (%)":2.3,"Asian (%)":18.1,"Hispanic Ethnicity (%)":13.5},
    "ChIJTy9bNf_Lj4AR_zes01Ezz38": { code: 95131, "Median Income":87000,"Cost Of Living Index":393,"Median Mortgage To Income Ratio (%)":23.8,"Owner Occupied Homes (%)":72.1,"Median Rooms In Home":4.9,"College Degree (%)":43.6,"Professional (%)":49.5,"Population":26,"Average Household Size":3.2,"Median Age":33.1,"Male To Female Ratio (%)":99.5,"Married (%)":57.2,"Divorced (%)":7.7,"White (%)":18.2,"Black (%)":2.8,"Asian (%)":64.6,"Hispanic Ethnicity (%)":11},
    "ChIJ2-SY--fNj4ARX6knYBbpsRA": { code: 95132, "Median Income":82000,"Cost Of Living Index":405.7,"Median Mortgage To Income Ratio (%)":23.1,"Owner Occupied Homes (%)":74.1,"Median Rooms In Home":5.9,"College Degree (%)":33.5,"Professional (%)":44.9,"Population":40,"Average Household Size":3.4,"Median Age":34.8,"Male To Female Ratio (%)":97.1,"Married (%)":60.2,"Divorced (%)":7.5,"White (%)":27.3,"Black (%)":3.3,"Asian (%)":50.8,"Hispanic Ethnicity (%)":14.8},
    "ChIJ0YUuM-EujoAREUuAYIkFtD8": { code: 95138, "Median Income":103000,"Cost Of Living Index":528.8,"Median Mortgage To Income Ratio (%)":27.8,"Owner Occupied Homes (%)":88.1,"Median Rooms In Home":6.3,"College Degree (%)":49.5,"Professional (%)":53.3,"Population":15,"Average Household Size":3.1,"Median Age":33.6,"Male To Female Ratio (%)":96.9,"Married (%)":67.8,"Divorced (%)":7.2,"White (%)":45.6,"Black (%)":3.7,"Asian (%)":31.5,"Hispanic Ethnicity (%)":13.8},
    "ChIJsyWpKHAvjoARADUnGXwEqno": { code: 95139, "Median Income":86000,"Cost Of Living Index":407.8,"Median Mortgage To Income Ratio (%)":23.4,"Owner Occupied Homes (%)":79.9,"Median Rooms In Home":6.1,"College Degree (%)":33.7,"Professional (%)":49.1,"Population":6,"Average Household Size":3,"Median Age":34.8,"Male To Female Ratio (%)":99,"Married (%)":57.9,"Divorced (%)":11.4,"White (%)":61.2,"Black (%)":4,"Asian (%)":13.5,"Hispanic Ethnicity (%)":17.3},
    "ChIJz5drSL4yjoARl_vnMc_dpqw": { code: 95151, },
    "ChIJ53Rd8NHNj4ARWVFv4yKQafI": { code: 95152, },
    "ChIJg4j6AoQxjoARrGJ6xiAU1EY": { code: 95153, },
    "ChIJx1DRy3M0joAR3El4PdL-iQI": { code: 95154, },
    "ChIJC58LTFYzjoARaB9yH3mESU0": { code: 95155, },
    "ChIJsfFOKRvMj4ARwkeNcPDBaZ4": { code: 95161, },
    "ChIJl4HmI1_Jj4ARPVrpTKYcjyQ": { code: 95164, },
    "ChIJifqZKWy1j4AR5NoPaJM_oCo": { code: 95170, },
    "ChIJy6RfrqPMj4AR9-jXQ6tLV5o": { code: 95172, },
    "ChIJwygk8ZfMj4ARI_2kDYJdg5k": { code: 95173, },
    "ChIJRceLsMExjoARx5LSfHTalDM": { code: 95193, },
    "ChIJsfFOKRvMj4ARDhhgRPBZvnw": { code: 95194, },
    "ChIJCR2PyKbMj4ARFbQn3REnVjs": { code: 95196, },
}

const parseCsv = (csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((line) => {
        const row = {};
        line.split(",").forEach((value, index) => {
            row[headers[index]] = value;
        });
        return row;
    });
    return rows;
}

const schools = parseCsv(SCHOOLS_CSV)

const getStyleForPlace = (placeId) => {
    const feature = FEATURES[placeId];
    if (feature && feature['Median Income']) {
        // Set opacity based on current map mode.

        return {
            ...featureStyleOptions,
            fillOpacity: getFillOpacity(feature),
        };
    }
}

const getFillOpacity = (feature) => {
    const { mapMode } = state;
    if(mapMode === 'Median Income') {
        return feature['Median Income'] / 120000;
    } else if(mapMode === 'Cost Of Living Index') {
        return feature['Cost Of Living Index'] / 700;
    } else if(mapMode === 'Average Household Size') {
        return feature['Average Household Size'] / 7;
    } else if(mapMode === 'Median Age') {
        return feature['Median Age'] / 60;
    } else if(mapMode === 'Population') {
        return feature['Population'] / 100;
    } else if(mapMode === 'Male To Female Ratio (%)') {
        return feature['Male To Female Ratio (%)'] / 200;
    } else {
        return feature[mapMode] / 100;
    }
}

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.332509, lng: -121.886408 }, // 37.332509, -121.886408
    zoom: 12,
    // In the cloud console, configure this Map ID with a style that enables the
    // "Locality" feature layer.
    mapId: "6ba3da8b0db296b1", // <YOUR_MAP_ID_HERE>,
  });

  return map
}

async function addFeatureLayerStyles(map) {
  featureLayer = map.getFeatureLayer("POSTAL_CODE");

  // Apply the style to all boundaries in the layer.
  featureLayer.style = (options) => {
    const { placeId } = options.feature;
    if (placeId) {
        return getStyleForPlace(placeId);
    }
  };

  return map
}

async function addMarkers(map) {

    schools.map((school) => {
        school['Closed Date'] = new Date(school['Closed Date'])

        //if(school['Closed Date'] > currentDate) {
            let lat, lng;
            try {
                lat = parseFloat(school['Latitude'])
                lng = parseFloat(school['Longitude'])

                const marker = new google.maps.Marker({
                    map,
                    position: { lat, lng },
                    title: school['School'],
                });

                const contentString = `
                    <div id="content">
                    <div id="bodyContent">
                        <p><b>School:</b> ${school['School']}</p>
                        <p><b>Closed on:</b> ${school['Closed Date'].toDateString()}</p>
                        <p><b>Address:</b> ${school['Street Address']} ${school['Street City']}, ${school['Street State']} ${school['Street Zip']}</p>
                    </div>
                    </div>
                `
                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    ariaLabel: school['School'],
                });

                marker.addListener("click", () => {
                    infowindow.open({
                      anchor: marker,
                      map,
                    });
                });

            } catch(e) {
                console.log(e)
            }
        //}
    })

    return map
}

initMap()
.then(addFeatureLayerStyles)
.then(addMarkers)