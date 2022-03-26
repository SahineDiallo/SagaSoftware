$(document).ready(function() {
    let assignee;
    let accountable;
    let status;
    var url_end = (window.location.pathname).split("/").at(-2)
    let _type = ""
    $("#assignee_select").chosen({ no_results_text: "Oops, no member were found!" });
    $("#accountable_select").chosen({ no_results_text: "Oops, no member were found!" });
    $("#assignee_select").on("change", function(e) {
        assignee = this.value
        table.draw()
    });
    $("#accountable_select").on("change", function(e) {
        accountable = this.value
        table.draw()
    })
    $('input[type=radio][name=status_fil]').change(function() {
        status = this.value;
        table.draw();
    });
    table = $("#tkts-bkl").DataTable({
        "serverSide": true,
        "processing": true,
        fixedHeader: true,
        ajax: {
            url: `/api/tickets/${url_end}`,
            type: 'GET',
            "data": function(d) {
                return $.extend({}, d, {
                    "assignee": assignee,
                    "accountable": accountable,
                    "status": status
                });
            }
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ],
        "autoWidth": false, // might need this to disable the auto width calc
        select: true,
        "bJQueryUI": true,
        order: [0, 'des'],
        'columnDefs': [{
                "targets": 0, // your case first column
                "className": "text-center",
                "width": '4%'
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
                className: 'pr-0',
                "data": "status",
                render: function(data, type) {
                    if (type === 'display') {
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
                className: 'px-0',
                "data": "priority",

                render: function(data, type) {
                    if (type === 'display') {
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

                "data": "assignee",
                render: function(data, type) {
                    var profile = get_first_letters(data.full_name)
                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${data.background}">${profile}</span> ${data.full_name}`
                    }
                    return data;
                }
            },
            {

                "data": "accountable",
                render: function(data, type) {
                    var profile = get_first_letters(data.full_name)
                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${data.background}">${profile}</span> ${data.full_name}`
                    }
                    return data;
                }
            },
            {
                "data": "progress",
                render: function(data, type) {
                    if (type === 'display') {
                        return `<div class="progress">
                                    <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${data}%" aria-valuenow="${data}" aria-valuemin="0" aria-valuemax="100">
                                        ${data}%
                                    </div>
                                </div>`
                    }
                    return data;
                }
            },
            { "data": "milestone" },
            {
                "data": "est_hours"
            },
            { "data": "start_date" },
            { "data": "end_date" },
            {
                "data": "created_by",
                render: function(data, type) {
                    var profile = get_first_letters(data.full_name)
                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${data.background}">${profile}</span> ${data.full_name}`
                    }
                    return data;
                }
            },
            {

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
    });

    //////////// functions ///////////

    function hideAllColumns() {
        for (var i = 0; i <= 15; i++) {
            table.column(i).visible(0);
        }
    }

    function showAllColumns() {
        for (var i = 0; i <= 15; i++) {
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

    function get_first_letters(string) {
        l = string.split(" ")
        return l[0][0].toUpperCase() + l.at(-1)[0].toUpperCase();
    }

});