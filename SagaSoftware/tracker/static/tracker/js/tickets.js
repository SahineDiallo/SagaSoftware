$(document).ready(function() {
    var table = $("#tkts-bkl").DataTable({
        'columnDefs': [{
                "targets": 0, // your case first column
                "className": "text-center",
                "width": "4%"
            },
            {
                "targets": 3,
                "className": "text-center",
            }, {
                "targets": 4,
                "className": "text-center",
            }
        ],

    })




});