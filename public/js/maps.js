// Google Maps
function initialize(){
    var lat = $('#gmap-business').data('lat');
    var lng = $('#gmap-business').data('lng');
    var title = $('#gmap-business').data('title');

    mapOptions={
        zoom:15,
        center:new google.maps.LatLng(lat, lng),
        //        disableDefaultUI:true,
        zoomControl:true,
        scrollwheel:false,
        draggable:true,
        disableDoubleClickZoom:true,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map=new google.maps.Map(document.getElementById("gmap-business"),mapOptions);
    google.maps.visualRefresh=true;
    function addMarker(lat, lng, title){
        var marker =new google.maps.Marker({
            map:map,
            position:new google.maps.LatLng(lat,lng)
        });

        var infoWindow = new google.maps.InfoWindow({
            content: title
        });

        google.maps.event.addListener(marker,"click",function(){
            infoWindow.open(map, marker);
        });
    }
    addMarker(lat, lng, title);
    var h=[
        {
            featureType:"road",
            stylers:[{color:"#ffffff"}]
        },
        {
            stylers:[{saturation:-40}, { lightness: 20 }]
        },
        {
            elementType:"labels.text",
            stylers:[
                {color:"#9fa5ac"},
                {weight:0.3}
            ]
        },
        {
            elementType:"labels.icon",
            stylers:[{visibility:"off"}]
        },
        {
            featureType: "administrative",
            elementType: "labels",
            stylers:[{visibility:"on"}]
        }
    ];

    var g=new google.maps.StyledMapType(h,{name:"Styled Map"});
    map.mapTypes.set("map_style",g);
    map.setMapTypeId("map_style");
}
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
        'callback=initialize';
    document.body.appendChild(script);
}
window.onload = loadScript;