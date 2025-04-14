$(document).ready(function (){
    $('#turkey-map-markers').vectorMap({
        map: 'turkey-tr',
        backgroundColor: 'transparent',
        zoomOnScroll: false,
        enableZoom: true,
        regionStyle: {
            initial: {
                fill: '#198fed'
            }
        }
    });
});
