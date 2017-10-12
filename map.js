mapboxgl.accessToken = "pk.eyJ1IjoiMjAxMnpoYW5nemloYW8iLCJhIjoiY2o3MHU0bm1pMDExNTMzbWsyazNrZjYzZCJ9.E-sNz3FCD6Kog_1WsL6VUg";


var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/2012zhangzihao/cj70ueol104612smxkvi0wsss",
    center: [-78.491, 38.036],
    zoom: 14.4,
    maxZoom: 17,
    minZoom: 13,
});

function openMenu(evt, menuName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(menuName).style.display = "block";
    evt.currentTarget.className += " active";
};

document.getElementById('defaultOpen').click();


//toggle layers
var toggleableLayerIds = ['Bicycle Lane', 'Bus Stop', 'Sidewalk', 'Crime', 'Crime-icon'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];
    var container = document.createElement('div');
    container.setAttribute('class', 'layer')
    container.innerHTML = id;
    var input = document.createElement('input');
    input.id = id;
    input.type = 'checkbox';


    var inputContainer = document.createElement('div');
    inputContainer.setAttribute('class', 'inputContainer');



    var label = document.createElement('label');
    label.setAttribute('for', id)
    label.className = 'toggleLayers';

    inputContainer.appendChild(input);
    inputContainer.appendChild(label);

    input.addEventListener('change', function (e) {
        map.setLayoutProperty(this.id, 'visibility',
            e.target.checked ? 'visible' : 'none');

    });

    var layers = document.getElementById('layer-container');
    container.appendChild(inputContainer);
    layers.appendChild(container);
}



map.on('load', function () { // the event listener that does some code after the map loads

    var layers = ['0&nbsp;&nbsp;Lux', '1&nbsp;-&nbsp;5&nbsp;&nbsp;Lux', '5 - 15&nbsp;&nbsp;Lux', '> 15&nbsp;&nbsp;Lux'];
    var spaces = ['22px', '16px', '10px', '0px'];
    var sizes = ['3px', '9px', '15px', '25px'];
    var discriptions = [
        'too dark',
        'dark',
        'ok',
        'light',
    ]

    // add a legend to the map
    for (i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var size = sizes[i];
        var spacesize = spaces[i];
        var item = document.createElement('div');
        var discription = discriptions[i];


        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.width = size;
        key.style.height = size;

        var spaceleft = document.createElement('span');
        spaceleft.style.width = parseInt(spacesize) / 2;
        spaceleft.style.display = "inline-block";

        var spaceright = document.createElement('span');
        spaceright.style.width = parseInt(spacesize) / 2;
        spaceright.style.display = "inline-block";


        var value = document.createElement('span');
        value.innerHTML = layer;

        value.className = 'tooltip';

        var tooltip = document.createElement('span')
        tooltip.className = 'tooltiptext';
        tooltip.innerHTML = discription;

        value.appendChild(tooltip);

        item.appendChild(spaceleft);
        item.appendChild(key);
        item.appendChild(spaceright);
        item.appendChild(value);

        legend.appendChild(item);

    };



    map.on('mousemove', function (e) { // event listener to do some code when the mouse moves
        var d = map.queryRenderedFeatures(e.point, {
            layers: ['DataC', 'DataA', 'DataB'], // replace 'cville-parks' with the name of your layer, if using a different layer
        });

        if (d.length > 0) {
            document.getElementById('pd').innerHTML = '<p> Illuminance : ' + d[0].properties.Lux + ' Lux</p><p> Light Color: ' + d[0].properties.Color + ' K </p><p>Sound: ' + parseInt(d[0].properties.Sound - 512) + '</p>';
        } else {
            document.getElementById('pd').innerHTML = '<p>Hover over a data point or click on a feature to learn more about it.</p>';
        }


    });

    map.on('mousemove', function (e) { // event listener to do some code when the mouse moves
        var d = map.queryRenderedFeatures(e.point, {
            layers: ['Crime'],
        });

        if (d.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
        } else {
            map.getCanvas().style.cursor = '';
        }


    });

    map.on('click', function (e) {
        var crimes = map.queryRenderedFeatures(e.point, {
            layers: ['Crime'] // replace this with the name of the layer
        });

        // if the layer is empty, this if statement will return NULL, exiting the function (no popups created) -- this is a failsafe to avoid endless loops
        if (!crimes.length) {
            return;
        }


        var crime = crimes[0];

        // Initiate the popup
        var popup = new mapboxgl.Popup({
            closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
            closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
            anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
            offset: [0, -15]

            // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
        });

        // Set the popup location based on each feature
        popup.setLngLat(crime.geometry.coordinates);

        // Set the contents of the popup window
        popup.setHTML('<h3>Type: ' + crime.properties.Descriptio +
            '</h3><h3>Location: ' + crime.properties.Location +
            '</h3><h3>Time: ' + crime.properties.Date +
            '</h3>');

        // Add the popup to the map
        popup.addTo(map); // replace "map" with the name of the variable in line 28, if different
    });

});

$("#infobar-toggle").click(function () {
    $("#infobar").toggle("slide");
    $(this).toggleClass("on");
});
