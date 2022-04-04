$(document).ready(function() {

    let assignee;
    let accountable;
    let status;
    let type;
    var url_end = (window.location.pathname).split("/").at(-2)
    let _type = ""
    let backgroundOptions = { Todo: '#039b24', Open: '#05b1eb', Resolved: '#f39219', Closed: '#7608dd', 'In Progress': '#055ebd' }
    var end_date = $('#createTicketForm #id_end_date')
    var start_date = $('#createTicketForm #id_start_date')
    $(".tkt-frm-bdy").height($(".cr-edt-tkt.p-3").height() - $(".cr-edt-tkt.p-3 .hd_").height() - $(".cr-edt-tkt.p-3 .modal-footer").height())
    $('#createTicketForm #id_assignee').chosen();
    $('#createTicketForm #id_accountable').chosen();
    $('#editFullTicketForm #id_assignee').chosen();
    $('#editFullTicketForm #id_accountable').chosen();
    var ticket_full_pg_status = document.querySelector("#editFullTicketForm #id_status")
    if (ticket_full_pg_status !== null ) {
        adjustSelectLength(ticket_full_pg_status)
    }

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

            { 
                "data": "key",
                render: function(data, type) {
                    if (type === "display") {
                        return `<span id="key_${data.trim().slice(2)}"> ${data} </span>`
                    }
                    return data;
                }
            },

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
        var _key = tr.firstElementChild.firstElementChild.textContent.trim().slice(1);
        var url = `/api/edit-ticket/${url_end}/?key=${_key}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $(".cr-edt-tkt.p-3.edt-tkt").html(data.template)
                    $(".cr-edt-tkt.p-3.edt-tkt #ex1-content").height($(".cr-edt-tkt.p-3.edt-tkt").height() - $(".cr-edt-tkt.p-3.edt-tkt .tkt-dtls-menu").height())
                    let selectList = document.querySelector(".cr-edt-tkt.p-3.edt-tkt #id_status")
                    adjustSelectLength(selectList)
                    $('#ex1-content #id_assignee').chosen();
                    $('#ex1-content #id_accountable').chosen();
                    var end_date = $('.cr-edt-tkt.p-3.edt-tkt #id_end_date')
                    var start_date = $('.cr-edt-tkt.p-3.edt-tkt #id_start_date')
                    flatpickr(start_date, {});
                    flatpickr(end_date, {});
                    // var description = document.getElementById('descpt')
                    // const options = {
                    //     theme: "snow",
                    //     enable: false
                    // };

                    // var quill = Quill(description, options);
                    // var icons = quill.import('ui/icons');
                    // icons['bold'] = '<i class="fa fa-bold" aria-hidden="true"></i>';

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

        let maxOptValLen = findMaxLengthOpt(selectField)
            // calc width of single letter 
        let letterWidth = initialWidth / maxOptValLen
        let corCoef = 5.875; // Based on visual appearance
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

    function setBackground(selectel, selectedVal) {
        selectel.style.background = backgroundOptions[selectedVal]
    };

    $(".cr-edt-tkt.p-3.edt-tkt").on("click", '.mdi-close.cl_cr', (e) => {
        $('.cr-edt-tkt.p-3.edt-tkt').hide('slide', { direction: 'right' }, 500)
    });

    $('.cr-edt-tkt.p-3.edt-tkt').on('focusout', 'input', (e) => {
        var c_list = e.target.classList
        if (c_list.contains('chosen-search-input') | c_list.contains('is-invalid')) return false
        $('.cr-edt-tkt.p-3.edt-tkt #edt_tkt_frm').click();

    });
    $('.cr-edt-tkt.p-3.edt-tkt').on('change', 'select', (e) => {
        $('.cr-edt-tkt.p-3.edt-tkt #edt_tkt_frm').click();
    });

    $(".cr-edt-tkt.p-3.edt-tkt").on("click", '._ty_cl', (e)=> {
        $(e.target).parent().addClass('d-none')
        e.target.parentElement.previousElementSibling.classList.remove('d-none')
    })
    $('.cr-edt-tkt.p-3.edt-tkt').on('click', '#edt_tkt_frm', (e) => {
        updateTicket(e);
    });

    $(".cr-edt-tkt.p-3.edt-tkt").on('input', ' #id_subject', (e)=> {
        validateSubject(e.target.value, e.target)
    });
    function validateSubject(val, target) {
        var url = `/api/validate-subject/?subject=${val}`
        fetch(url)
        .then(res=> res.json())
        .then(data=> {
            if (!data.success) {
                $(target).addClass('is-invalid');
                $('.cr-edt-tkt.p-3.edt-tkt #error_1_id_subject').removeClass('d-none')
            } else {
                $(target).removeClass('is-invalid');
                $('.cr-edt-tkt.p-3.edt-tkt #error_1_id_subject').addClass('d-none')
            }
        })
    }
    function validatePositive(val, target, name="") {
        var url = `/api/validate-number/?value=${val}&name=${name}`
        fetch(url)
        .then(res=> res.json())
        .then(data=> {
            if (!data.success) {
                $(target).addClass('is-invalid');
                $('.cr-edt-tkt.p-3.edt-tkt #error_1_id_subject').removeClass('d-none')
            } else {
                console.log('the data is valid');
                $(target).removeClass('is-invalid');
                $('.cr-edt-tkt.p-3.edt-tkt #error_1_id_subject').addClass('d-none')
            }
        })
    }
    $(".cr-edt-tkt.p-3.edt-tkt").on('input', ' #id_progress', (e)=> {
        console.log($(e.target).attr('name'))
        validatePositive(e.target.value, e.target, $(e.target).attr('name'))
    });
    $(".cr-edt-tkt.p-3.edt-tkt").on('input', ' #id_act_hours', (e)=> {
        validatePositive(e.target.value, e.target)
    });
    $(".cr-edt-tkt.p-3.edt-tkt").on('input', ' #id_est_hours', (e)=> {
        validatePositive(e.target.value, e.target)
    });
    function updateTicket(e) {
        e.preventDefault()
        var form = document.querySelector(".cr-edt-tkt.p-3.edt-tkt #editTicketForm");
        var form_data = new FormData(form)
        var key = document.querySelector(".cr-edt-tkt.p-3.edt-tkt .inst_key").textContent.slice(1)
        var url = `/api/edit-ticket/${url_end}/?key=${key}`;
        fetch(url, {method:'POST', body: form_data})
        .then(res => res.json())
        .then(data => {
            if(data.form_changed) {
                if (data.fname === "ticket_type") {
                    var cur_type = document.querySelector(".cr-edt-tkt.p-3.edt-tkt ._ty_cl")
                    var cur_class = cur_type.classList[3]
                    $(cur_type).removeClass(cur_class).addClass(data.type_class)
                    cur_type.textContent = data.fvalue
                    $(cur_type).parent().prev().addClass('d-none');
                    $(cur_type).parent().removeClass('d-none')
    
                } else if(data.fname === "assignee" | data.fname === "accountable"){
                    var ass_or_acc = document.querySelector(`.cr-edt-tkt.p-3.edt-tkt .tkts-asg.ml-2.${data.fname.slice(0, 3)}`)
                    if (ass_or_acc.classList.contains('d-none') ){
                        $(ass_or_acc).removeClass('d-none') 
                    }
                    if (!data.fvalue) {
                        ass_or_acc.classList.add('d-none')
                    }
                    ass_or_acc.style.background = data.background
                    ass_or_acc.textContent = data.first_letters
                }
                alertUser(`${data.fname} `, 'has been updated with success', "Ticket's ")
                var tr = document.querySelector(`#key_${key.slice(1)}`).closest('tr')
                $(tr).html("")
                $(tr).html(data.template) // update the edited table row
            }
        })
        .catch(error => {
             console.log(error)
            alert("Something went wrong. Please try later!");
            
        });
    }

});