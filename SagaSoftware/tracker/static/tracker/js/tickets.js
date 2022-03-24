$(document).ready(function() {
    var url_end = (window.location.pathname).split("/").at(-2)
    table = $("#tkts-bkl").DataTable({
        // stripeClasses: ['strip1', 'strip2'],
        "serverSide": true,
        "processing": true,
        ajax: {
            url: `/api/tickets/${url_end}`,
            dataSrc: 'results'
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ],
        initComplete: function(settings, json) {
            table.buttons().container().appendTo('#UserHead');
        },
        select: true,
        "bJQueryUI": true,
        order: [0, 'des'],
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

        colReorder: {
            realtime: false
        },
        "columns": [
            { "data": "key" },
            { "data": "subject" },
            { "data": "_type" },
            { "data": "status" },
            { "data": "priority" },
            { "data": "assignee.username" },
            { "data": "accountable.username" },
            { "data": "milestone" },
            { "data": "est_hours" },
            { "data": "start_date" },
            { "data": "end_date" },
            { "data": "created_by.username" },
            { "data": "act_hours" },
            { "data": "updated_date" },
            { "data": "created_date" }
        ]



    })

    $("#toggle_columns").multipleSelect({
        width: 200,
        onClick: function(view) {
            var selectedCols = $("#toggle_columns").multipleSelect('getSelects')
            hideAllColumns();
            for (var i = 0; i <= selectedCols.length; i++) {
                s = selectedCols[i]
                table.column(s).visible(1);
            }
        },
        onCheckAll: function() {
            showAllColumns()
        },
        onUncheckAll: function() {
            hideAllColumns();
        },
    })
    table.on("column-reorder", (e, settings, details) => {
        var orders = table.order();
        console.log(details);
        console.log(orders)
    })


    //////////// functions ///////////

    function hideAllColumns() {
        for (var i = 0; i <= 13; i++) {
            table.column(i).visible(0);
        }
    }

    function showAllColumns() {
        for (var i = 0; i <= 13; i++) {
            table.column(i).visible(1);
        }
    }
    // $('#tkts-bkl tbody').on('click',
    //     'td.details-control',
    //     function() {

    //         var tr = $(this).closest('tr');
    //         var row = table.row(tr);

    //         if (row.child.isShown()) {

    //             // Closing the already opened row           
    //             row.child.hide();

    //             // Removing class to hide
    //             tr.removeClass('shown');
    //         } else {

    //             // Show the child row for detail
    //             // information
    //             row.child(getChildRow()).show();

    //             // To show details,add the below class
    //             tr.addClass('shown');
    //         }
    //     });
    /* Function for child row details*/
    // function getChildRow(data) {

    //     // `data` is the data object for the row
    //     return '<table cellpadding="5" cellspacing="0"' +
    //         ' style="padding-left:50px;">' +
    //         '<tr>' +
    //         '<td>Full name:</td>' +
    //         '<td>' + "name" + '</td>' +
    //         '</tr>' +
    //         '<tr>' +
    //         '<td>Address in detail:</td>' +
    //         '<td>' + "something as a data" + '</td>' +
    //         '</tr>' +
    //         '<tr>' +
    //         '<td>Extra details like ID:</td>' +
    //         '<td>' + "employee" + '</td>' +
    //         '</tr>' +
    //         '</table>';
    // }
});