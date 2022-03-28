$(document).ready(function() {
    let assignee;
    let accountable;
    let status;
    let type;
    var url_end = (window.location.pathname).split("/").at(-2)
    let _type = ""
    var end_date = $('#createTicketForm #id_end_date')
    var start_date = $('#createTicketForm #id_start_date')
    $(".tkt-frm-bdy").height($(".cr-edt-tkt.p-3").height() - $(".cr-edt-tkt.p-3 .hd_").height() - $(".cr-edt-tkt.p-3 .modal-footer").height())
    $('#createTicketForm #id_assignee').chosen();
    $('#createTicketForm #id_accountable').chosen();
    $("#nw_tkt").on("click", (e) => {
        $(".cr-edt-tkt").show('slide', { direction: 'right' }, 500)
    });
    $(".cl_cr").on("click", (e) => {
        $(".cr-edt-tkt").hide('slide', { direction: 'right' }, 500)
    });


    flatpickr(start_date, {});
    flatpickr(end_date, {});
    $("#type_select").chosen();
    $("#assignee_select").chosen({ no_results_text: "Oops, no member were found!" });
    $("#accountable_select").chosen({ no_results_text: "Oops, no member were found!" });
    $("#assignee_select").on("change", function(e) {
        assignee = this.value
        table.draw()
    });
    $("#accountable_select").on("change", function(e) {
        accountable = this.value
        table.draw()
    });
    $("#type_select").on("change", function(e) {
        type = this.value
        table.draw()
    })
    $('input[type=radio][name=status_fil]').change(function() {
        status = this.value;
        table.draw();
    });
    table = $("#tkts-bkl").DataTable({
        'sScrollX': true,
        dom: 'lBfrtip',
        buttons: [
            'csv', 'excel', 'pdf', 'print'
        ],
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
                    "status": status,
                    "type": type
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

        "DT_RowId": "someId",
        "columns": [
            { "data": "key" },
            {
                "data": "subject",
                render: function(data, type) {
                    if (type === "display") {
                        return `<span class="d-flex align-items-center">
                                    <div class="dropdown-menu dropdown-primary">
                                        <a class="dropdown-item" href="#"><i class="fab fa-apple-pay"></i>&nbsp;&nbsp;Pay</a>
                                        <a class="dropdown-item" href="#"><i class="fas fa-bell-slash"></i>&nbsp;&nbsp;Disable alertss</a>
                                        <a class="dropdown-item" href="#"><i class="far fa-envelope"></i>&nbsp;&nbsp;Check mail</a>
                                    </div>
                                    ${data}
                                    </span>`
                    }
                    return data;
                }
            },
            {

                className: `${_type}`,
                "data": "ticket_type",
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
                    let background;
                    let profile;
                    if (data) {
                        profile = get_first_letters(data.full_name)
                        background = data.background;
                    } else {
                        background = "";
                        profile = ""
                    }

                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${background}">${profile}</span> ${data.full_name}`
                    }
                    return data;
                }
            },
            {

                "data": "accountable",
                render: function(data, type) {
                    let background;
                    let profile;
                    if (data) {
                        profile = get_first_letters(data.full_name)
                        background = data.background;
                    } else {
                        background = "";
                        profile = ""
                    }
                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${background}">${profile}</span> ${data.full_name}`
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
                    let background;
                    let profile;
                    if (data) {
                        profile = get_first_letters(data.full_name)
                        background = data.background;
                    } else {
                        background = "";
                        profile = ""
                    }
                    if (type === 'display') {
                        return `<span class="tkts-asg" style="background:${background}">${profile}</span> ${data.full_name}`
                    }
                    return data;
                }
            },
            {

                "data": "act_hours"
            },
            { "data": "updated_date" },
            { "data": "created_date" },
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
    $("#cr_nw_tk").on("click", (e) => {
        e.preventDefault();
        var form = document.querySelector("#createTicketForm")
        var _form_data = new FormData(form)
        var url = `/api/create-ticket/${url_end}/`;
        fetch(url, { method: 'POST', body: _form_data, })
            .then(response => response.json())
            .then(data => {
                if (!data.response && data.not_valid) {
                    $("#createTicketForm").replaceWith(data.formErrors)
                    $('#createTicketForm #id_assignee').chosen();
                    $('#createTicketForm #id_accountable').chosen();

                    var end_date = $('#createTicketForm #id_end_date')
                    var start_date = $('#createTicketForm #id_start_date')
                    flatpickr(start_date, {});
                    flatpickr(end_date, {});

                } else {
                    $("#tkts-bkl tbody").prepend(data.template);

                }

            })
            .catch(error => { alert('something went wrong.Please try later') })

    })
    $(".ext-prt").on("click", (e) => {
        if (e.target.classList.contains("buttons-csv")) {
            $(".dt-buttons .buttons-csv").click();
        } else if (e.target.classList.contains("buttons-excel")) {
            $(".dt-buttons .buttons-excel").click();
        } else if (e.target.classList.contains("buttons-pdf")) {
            $(".dt-buttons .buttons-pdf").click();
        } else if (e.target.classList.contains("buttons-print")) {
            $(".dt-buttons .buttons-print").click();
        }
    })


});