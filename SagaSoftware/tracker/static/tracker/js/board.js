$(document).ready(function() {
    var url_end = (window.location.pathname).split("/").at(-2)
    var site_slug = (window.location.pathname).split("/")[2]
    if (window.location.pathname.includes('board')) {
        $(".mdi.mdi-sort-variant").click();
    }
    $("._stat").sortable({
        connectWith: "._stat",
        items: '.card',
        placeholder: "sortable-placeholder",
        receive: function( event, ui ) {
            var new_status = event.target.children[0].innerText
            var ticket_key = ui.item[0].getAttribute('data-key').slice(2)
            var url = `/api/${site_slug}/${url_end}/${ticket_key}/?new_status=${new_status}`;
            fetch(url)
            .then(res => res.json())
            .then(data=> {
                if(data.success) return;
                alert('Something went wrong. Please try later!') 
                
            })
            .catch(error=> {
                console.log(error);
                alert('Something went wrong! Please try later');
            })
        } 
    })
})