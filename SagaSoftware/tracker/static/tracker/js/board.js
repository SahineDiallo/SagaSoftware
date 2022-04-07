$(document).ready(function() {
    if (window.location.pathname.includes('board')) {
        $(".mdi.mdi-sort-variant").click();
    }
    $("._stat").sortable({
        connectWith: "._stat",
        items: '.card',
        placeholder: "sortable-placeholder",
        stop: function( event, ui ) {
            console.log('this is the event', event)
            console.log('this is the ui', ui)
            console.log(ui.item[0])
            console.log(ui.item[0].getAttribute('data-key'))
        } 
    })
})