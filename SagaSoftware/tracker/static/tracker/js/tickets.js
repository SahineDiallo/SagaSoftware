$(document).ready(function() {
    var url_end = (window.location.pathname).split("/").at(-2)
    let _type = ""
    table = $("#tkts-bkl").DataTable({
        // stripeClasses: ['strip1', 'strip2'],
        "serverSide": true,
        "processing": true,
        ajax: {
            url: `/api/tickets/${url_end}`,
            type: 'GET'
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ],
        // initComplete: function(settings, json) {
        //     table.buttons().container().appendTo('#UserHead');
        // },
        "autoWidth": false, // might need this
        select: true,
        "bJQueryUI": true,
        order: [0, 'des'],
        'columnDefs': [{
                "targets": 0, // your case first column
                "className": "text-center",
                "width": "10%"
            },
            {
                "targets": 3,
                "className": "text-center",
            }, {
                "targets": 4,
                "className": "text-center",
            },
            { "targets": 1, "width": "200" }
        ],

        colReorder: {
            realtime: false
        },
        "columns": [
            { "data": "key" },
            { "data": "subject" },
            {

                className: `${_type}`,
                "data": "_type",
                render: function(data, type) {
                    if (type === 'display') {
                        switch (data) {
                            case 'BUG':
                                _type = '_bug';
                                break;
                            case 'REQUEST':
                                _type = '_feat';
                                break;
                            case 'TASK':
                                _type = '_tsk';
                                break;
                            case 'OTHER':
                                _type = '_other';
                                break;

                        }
                        //I will need to place the data outside of the sapn
                        return `<span class="${_type}">${data}</span> `;
                    }

                    return data;
                }
            },
            {
                "data": "status",
                render: function(data, type) {
                    if (type === 'display') {
                        console.log('display')
                        let status = '';

                        switch (data) {
                            case 'Open':
                                status = '_open';
                                break;
                            case 'Todo':
                                status = '_todo';
                                break;
                            case 'In Progress':
                                status = '_in_prog';
                                break;
                            case 'Resolved':
                                status = '_on_hold';
                                break;
                            case 'Closed':
                                status = '_done';
                                break;
                        }
                        // I will need to place the data outside of the sapn
                        return `<span class="${status}">${data}</span> `;
                    }

                    return data;
                }

            },
            {
                "data": "priority",

                render: function(data, type) {
                    if (type === 'display') {
                        console.log('display')
                        let priority = '';

                        switch (data) {
                            case 'Normal':
                                priority = '_norm';
                                break;
                            case 'High':
                                priority = '_high';
                                break;
                            case 'Low':
                                priority = '_low';
                                break;
                            case 'Immediate':
                                priority = '_imm';
                                break;

                        }
                        // I will need to place the data outside of the sapn
                        return `<span class="${priority}">${data}</span> `;
                    }

                    return data;
                }


            },
            {
                className: "tdtk",
                "data": "assignee.username",
            },
            {
                className: "tdtk",
                "data": "accountable.username"
            },
            { "data": "milestone" },
            {
                className: "estm",
                "data": "est_hours"
            },
            { "data": "start_date" },
            { "data": "end_date" },
            { "data": "created_by.username" },
            {
                className: "estm",
                "data": "act_hours"
            },
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