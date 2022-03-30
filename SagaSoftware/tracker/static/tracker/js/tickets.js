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
        $(".cr-edt-tkt.nw_tkt").show('slide', { direction: 'right' }, 500)
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
        order: [0, 'asc'],
        'columnDefs': [{
                "targets": 0, // your case first column
                "className": "text-center",
                "width": '70'
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

        "language": {
            "processing": `<div class="d-flex justify-content-center" style="margin-top:50%;">
                                <div class="lds-hourglass "></div>
                            </div>&emsp;Loading ...`,
        },
        "columns": [
            { "data": "key" },
            {
                "data": "subject",
                render: function(data, type) {
                    if (type === "display") {
                        return `<span class="_subj">
                                    <i class="mdi mdi-information tkt-dtls"></i>
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
                    var dt = get_user_chars(data)
                    if (type === 'display' && data) {
                        return `<span class="tkts-asg" style="background:${dt.background}">${dt.profile}</span> ${dt.full_name}`
                    }
                    return `<span class="d-flex justify-content-center">${dt}</span>`;
                }
            },
            {

                "data": "accountable",
                render: function(data, type) {
                    var dt = get_user_chars(data)
                    if (type === 'display' && data) {
                        return `<span class="tkts-asg" style="background:${dt.background}">${dt.profile}</span> ${dt.full_name}`
                    }
                    return `<span class="d-flex justify-content-center">${dt}</span>`;
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
            {
                "data": "milestone",
                render: function(data, type) {
                    if (type === 'display' && data) {
                        return `<span>${data}</span>`
                    }
                    return `<span class="d-flex justify-content-center"> -- </span>`;
                }
            },
            {
                "data": "est_hours",
                render: function(data, type) {
                    if (type === 'display' && data) {
                        return `<span>${data}</span>`
                    }
                    return `<span class="d-flex justify-content-center"> -- </span>`;
                }
            },
            {
                "data": "start_date",
                render: function(data, type) {
                    if (type === 'display' && data) {
                        return `<span>${data}</span>`
                    }
                    return `<span class="d-flex justify-content-center"> -- </span>`;
                }
            },
            {
                "data": "end_date",
                render: function(data, type) {
                    if (type === 'display' && data) {
                        return `<span>${data}</span>`
                    }
                    return `<span class="d-flex justify-content-center"> -- </span>`;
                }
            },
            {
                "data": "created_by",
                render: function(data, type) {
                    var dt = get_user_chars(data)
                    if (type === 'display' && data) {
                        return `<span class="tkts-asg" style="background:${dt.background}">${dt.profile}</span> ${dt.full_name}`
                    }
                    return `<span class="d-flex justify-content-center">${dt}</span>`;
                }
            },
            {

                "data": "act_hours",
                render: function(data, type) {
                    if (type === 'display' && data) {
                        return `<span>${data}</span>`
                    }
                    return `<span class="d-flex justify-content-center"> -- </span>`;
                }
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

    //     // `
    //is the data object for the row
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

    function get_user_chars(data) {
        let profile;
        let background;
        let full_name
        if (data) {
            var l = data.full_name.split(" ")
            profile = l[0][0].toUpperCase() + l.at(-1)[0].toUpperCase();
            background = data.background
            full_name = data.full_name
            return { "profile": profile, 'full_name': full_name, 'background': background }
        } else { return "--" }
    }
    $("#cr_nw_tk").on("click", (e) => {
        e.preventDefault();
        $('#createTicketForm #id_status').prop('disabled', false);
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
                    $(".cr-edt-tkt .cl_cr").click();
                    $("#createTicketForm")[0].reset();
                    alertUser("ticket", 'created_successfully!', 'New')
                    table.draw();
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

    function alertUser(key, message, type) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.set('notifier', 'delay', 10);
        alertify.success(`${type} <span class="alert-key">${key} </span>${message}`);
    };
    $("#MainEquipDiv").on("click", ".tkt-dtls", (e) => {
        $(".cr-edt-tkt.p-3.edt-tkt").show('slide', { direction: 'right' }, 500)
        var tr = e.target.closest('tr');
        var _key = tr.firstElementChild.textContent.slice(1);
        var url = `/api/edit-ticket/${url_end}/?key=${_key}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $(".cr-edt-tkt.p-3.edt-tkt").html(data.template)
                    let selectList = document.querySelector(".cr-edt-tkt.p-3.edt-tkt #id_status")
                    adjustSelectLength(selectList)
                    $('#ex1-content #id_assignee').chosen();
                    $('#ex1-content #id_accountable').chosen();
                    var description = document.getElementById('descpt')
                    console.log("this is the description", description)
                    const options = {
                        theme: "snow",
                        enable: false
                    };

                    var quill = new Quill(description, options);

                }

            })
            .catch(error => { alert('something went wrong. Please try later') })
    })

    function adjustSelectLength(selectField) {
        // get initial width of select element. 
        // we have to remember there is a dropdown arrow make it a little wider
        let initialWidth = selectField.offsetWidth
            // get text content length (not a value length) of widest option.
        let val = getSelected(selectField).textContent
        setBackground(selectField, val);
        // let curLength = getSelected(selectField).textContent.length
        // selectField.style.width = curLength + 'px'

        let maxOptValLen = findMaxLengthOpt(selectField)
            // calc width of single letter 
        let letterWidth = initialWidth / maxOptValLen
        let corCoef = 2.875; // Based on visual appearance
        // add the on change event listener to the select
        selectField.addEventListener("change", e => {
            let newOptValLen = getSelected(e.target).textContent.length
            let curVal = getSelected(e.target).textContent
            setBackground(selectField, curVal);
            let correction = (maxOptValLen - newOptValLen) * corCoef
            let newValueWidth = (newOptValLen * letterWidth) + correction
            e.target.style.width = newValueWidth + "px"
        }, false);
    }


    function getSelected(selectEl) {
        return [...selectEl.options].find(o => o.selected)
    }

    function findMaxLengthOpt(selectEl) {
        return [...selectEl.options].reduce((result, o) => o.textContent.length > result ? o.textContent.length : result, 0)
    }

    backgroundOptions = { Todo: '#039b24', Open: '#05b1eb', Resolved: '#7608dd', Close: '#f39219', 'In Progress': '#055ebd' }

    function setBackground(selectel, selectedVal) {
        selectel.style.background = backgroundOptions[selectedVal]
    };

    $(".cr-edt-tkt.p-3.edt-tkt").on("click", '.mdi-close.cl_cr', (e) => {
        console.log("ok")
        $('.cr-edt-tkt.p-3.edt-tkt').hide('slide', { direction: 'right' }, 500)
    })

});