let myMap = L.map("map", {
    center: [40.7607, -111.8939],
    zoom: 11
});
// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
let queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// Perform a GET request to the query URL/
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Style each feature (in this case, an earthquake)
        pointToLayer: function (feature, latlng) {
            // Determine marker size and color based on magnitude and depth
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            // Marker size based on magnitude
            let radius = magnitude * 3; // Example factor

            // Marker color based on depth
            let fillColor;
            if (depth > 50) {
                fillColor = 'red';
            } else if (depth > 30) {
                fillColor = 'orange';
            } else if (depth > 10) {
                fillColor = 'yellow';
            } else {
                fillColor = 'green';
            }

            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: fillColor,
                color: 'gray', // Outline color
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            });
        },
        // Called on each feature
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                <strong>Location:</strong> ${feature.properties.place}<br>
                <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km
                <strong>Time:</strong> ${new Date(feature.properties.time).toLocaleString()}
            `);
        }
    }).addTo(myMap);
});

    // Create a legend control
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let grades = [0, 10, 30, 50];
        let colors = ['green', 'yellow', 'orange', 'red'];
        let labels = [];

        // Loop through depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
        }

        return div;
    };

// Add the legend to the map
    legend.addTo(myMap);