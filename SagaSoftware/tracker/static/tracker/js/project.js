$(document).ready(function() {
    $("#id_key").attr('oninput', "let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);")
    var site_slug = (window.location.pathname).split("/")[2]
    var url_end = (window.location.pathname).split("/").at(-2)

    $("#vert-tabs-right-tabContent #createProjectForm #id_key").parent().css({
        'width': '400px;'
    })

    $(".add-project").on("click", (e)=> {
        $("#createProject").modal()
    })

    // /////////////  EventListeners  //////////////
    //.sidebar .nav .nav-item .nav-link
    var sidebar = document.querySelector("#sidebar")
    var navbar_ = document.querySelector("nav.navbar.col-lg-12")
    var style = $("#sidebar").attr('style')
    if (!window.location.pathname.includes('dashboard') && !window.location.pathname.includes('profile')){
        if (style.includes("fff")) {
            if (sidebar.classList.contains("clr-wt")) {
                $(sidebar).removeClass('clr-wt')
            }
            if (navbar_.classList.contains("clr-wt")) {
                $(navbar_).removeClass('clr-wt')
            }
            $(sidebar).addClass("clr-bk")
            $(navbar_).addClass('clr-bk')
        } else {
            if (sidebar.classList.contains("clr-bk")) {
                $(sidebar).removeClass('clr-bk')
            }
            if (navbar_.classList.contains("clr-bk")) {
                $(navbar_).removeClass('clr-bk')
            }
            $(sidebar).addClass("clr-wt")
            $(navbar_).addClass('clr-wt')
        }
    }


    document.querySelector("#createProject .modal-content .modal-body").addEventListener("keyup", (e) => {
        if (e.target.tagName === "INPUT") return checkAndRemoveInvalidClass(e)
    })
    document.querySelector("#createProject .modal-content .modal-body").addEventListener("click", (e) => {
        var $el = e.target
        var currentIcon = document.getElementById("current-project-icon")
        if ($el.classList.contains("icon-choice")) {
            var iconObj = { element: $el, currentIcon: currentIcon }
            updateIcon(iconObj)
        } else if ($el.classList.contains("color-choice")) {
            var iconObj = { element: $el, currentIcon: currentIcon }
            updateColorIcon(iconObj);
        } else if ($el.getAttribute("name") == "new-project") {
            createProjectFunc(e);
        } else if ($el.classList.contains("change-icon-btn")) {
            $("#submit-id-new-project").attr("disabled", "true");
            $(".icon-container-parent").show();

        } else if ($el.parentElement.classList.contains("close-icon-selection")) {
            $(".icon-container-parent").hide();
            $("#submit-id-new-project").prop("disabled", false); // this will remove the disabled attribute
        }
    });
    $(".select-this-theme").on("click", (e) => {
        e.preventDefault();
        $(".select-this-theme").attr("disabled", true)
        $(".select-this-theme").text("Updating....")
        var key = $("#vert-tabs-right-tabContent #createProjectForm input[name='key']").val();
        var url = `/trackers/${site_slug}/projects/edit/${key}/`
        var _form = document.querySelector("#vert-tabs-right-tabContent #createProjectForm")
        var form_data = new FormData(_form)
        fetch(url, { method: 'POST', body: form_data })
            .then(response => response.json())
            .then(data => {
                if (!data.response && data.not_valid) {
                    $("#vert-tabs-right-tabContent #createProjectForm").replaceWith(data.formErrors)
                } else {
                    var currVal = data.value
                    setTimeout(() => {
                        // CLOSE THE THEME CONTAINER
                        $(".close-change-theme-btn").click();
                        // ALERT THE USER ABOUT THE THEME CHANGE
                        alertUser("project", "has been updated successfully!", "Theme of")
                        setTimeout(() => {
                            $(".select-this-theme").text("Select this Theme")
                            $('.select-this-theme').prop("disabled", false);
                        }, 500)
                    }, 1000);
                    /// change the url when the key ofthe prject is changed
                }

            })

    });
    $("#add_mil").on("click", e => {
        $(".add_mil_section").fadeIn();
        $(e.target).attr("disabled", true)
    })
    $("#edit_mil").on("click", e => {
        $(".edit_mil_section").fadeIn();
        $(e.target).attr("disabled", true)
    })
    $(".add_members_section").on("click", (e) => {
        if ($(e.target).attr("id") === "add_new_members") return addNewMembersFunc(e);
    });

    function addNewMembersFunc(e) {
        e.preventDefault();
        var _form = document.querySelector("#add_proj_members")
        var url = `/trackers/${site_slug}/projects/add-members/${url_end}/`
        var form_data = new FormData(_form)
        fetch(url, { method: 'POST', body: form_data })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $(_form)[0].reset();
                    $("#proj_mem_list").append(data.template)
                    $(".mem_close_icon").click();
                    alertUser('New', 'added to the project successfully!', 'members');
                }
            })
            .catch(error => {
                alert("Something went wrong.Please try later!");
                console.log("error");
            })
    }
    var closeMilestone = (e) => {

        $(e.target).parent().parent().fadeOut();
        $("#add_mil").prop("disabled", false)
        $("#edit_mil").prop("disabled", false)
        $('#milestoneForm')[0].reset();
    };

    function createNewMilestone(e) {
        e.preventDefault()
        var _form = document.querySelector("#milestoneForm")
        var form_data = new FormData(_form);
        var project_key = (window.location.pathname).split("/").at(-2)
        var url = `/trackers/${project_key}/create-milestone/`
        fetch(url, { method: "POST", body: form_data })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    if ($("#vert-tabs-right-milestone .empty").length) {
                        $("#vert-tabs-right-milestone .empty").parent().html("");
                    }
                    $(".milestones_body").prepend(data.template);

                    $("#vert-tabs-right-milestone #milestoneForm")[0].reset();
                    $(".add_mil_section .mdi-close-box").click();
                    alertUser("Milestone", "created with success", "New")
                } else {
                    $("#vert-tabs-right-tabContent #milestoneForm").replaceWith(data.formErrors)
                    var end_date = $('#milestoneForm #id_end_date')
                    var start_date = $('#milestoneForm #id_start_date')
                    flatpickr(start_date, {});
                    flatpickr(end_date, {});
                }
            })
            .catch(error => {
                console.log(error)
                alert("Something went wrong please try again later", error)
            })
    }

    function getEditMilestoneForm(e) {

        $(".edit_mil_section").html(
            `
            <div class="text-center">
                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            `
        )
        $("#edit_mil").click();
        var mil_id = $(e.target).parent().attr("data-mil-id-ed");
        var url_mil = `/trackers/edit-milestone/${mil_id}/`
        fetch(url_mil)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $("#vert-tabs-right-milestone .edit_mil_section").html(data.template)
                    var end_date = $('#milestoneForm #id_end_date')
                    var start_date = $('#milestoneForm #id_start_date')
                    flatpickr(start_date, {});
                    flatpickr(end_date, {});
                }
            })
            .catch(error => {
                console.log(error)
                alert("Something when wrong PLease try later!")
            })
    }

    function editMilestone(e) {
        e.preventDefault();
        $(e.target).attr("disabled", true)
        var mil_id = $(".mil_close_icon").attr("data-close-mil")
        var url_mil = `/trackers/edit-milestone/${mil_id}/`
        var _form = document.querySelector(".edit_mil_section #milestoneForm")
        var form_data = new FormData(_form)
        fetch(url_mil, { method: 'POST', body: form_data, })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    var tr = $(`tr[data-reg="${mil_id}"`)
                    alertUser('Milestone', "has been edited successfully", "Project")
                    $(".mil_close_icon .mdi-close-box").click();
                    tr.html(data.template)
                    $(tr).css({ 'background': '#fff8a226' })
                    $(e.target).prop('disabled', false)
                    setTimeout(() => {
                        $(tr).css({ 'background': 'transparent' });

                    }, 2000)
                } else {
                    $("#vert-tabs-right-tabContent #milestoneForm").replaceWith(data.formErrors)
                }
            })
    }

    function deleteMilestone(e) {
        $("#del_milestone").modal();
        var mil_id = $(e.target).parent().attr('data-mil-id-de')
        $("#del_milestone .modal-body").attr('data-mil-id-de', mil_id)

    }
    $("#del_mil").on("click", (e) => {
        delMilFunc(e)
    })

    function delMilFunc(e) {
        var mil_id = $("#del_milestone .modal-body").attr('data-mil-id-de')
        var url = `/trackers/delete-milestone/${mil_id}/`
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    var spn = document.querySelector(`span[data-mil-id-de="${mil_id}"`);
                    spn.parentElement.parentElement.parentElement.remove();
                    $("#del_milestone").modal('toggle');
                    alertUser('deleted', 'from project successfully!', 'Milestone')
                }
            })
            .catch(error => { alert("Something went wrong.Please try later...") })
    }
    $("#vert-tabs-right-milestone").on("click", (e) => {
        if ($(e.target).attr("id") === "submit-id-save") return createNewMilestone(e);
        if (e.target.classList.contains("mdi-pencil")) return getEditMilestoneForm(e);
        if (e.target.classList.contains("mdi-trash-can")) return deleteMilestone(e);
        if (e.target.classList.contains("mdi-close-box")) return closeMilestone(e);
        if ($(e.target).attr("id") === "submit-id-edit") return editMilestone(e);

    })
    var end_date = $('#milestoneForm #id_end_date')
    var start_date = $('#milestoneForm #id_start_date')
    flatpickr(start_date, {});
    flatpickr(end_date, {});
    $(".close-icon-selection").on("click", (e) => {
        if (url_end !== 'dashboard') {
            var key = $("#vert-tabs-right-tabContent #createProjectForm input[name='key']").val();
            var url = `/trackers/${site_slug}/projects/edit/${key}/`
            var _form = document.querySelector("#vert-tabs-right-tabContent #createProjectForm")
            var form_data = new FormData(_form)
            fetch(url, { method: 'POST', body: form_data })
                .then(response => response.json())
                .then(data => {
                    if (!data.response && data.not_valid) {
                        $("#vert-tabs-right-tabContent #createProjectForm").replaceWith(data.formErrors)
                    } else {

                        setTimeout(() => {

                            // ALERT THE USER ABOUT THE THEME CHANGE
                            alertUser("project", "has been updated successfully!", "The icon of the")
                        }, 1000);

                    }

                })
        }
    })

    $("#vert-tabs-right-tabContent input[type='text']").each((index, element) => {
        if (($(element).attr('name') === 'key') | ($(element).attr('name') === 'name')) {
            showInputEditIcon(element);
        }
        $(element).attr("autocomplete", "off");
        $("#vert-tabs-right-tabContent #createProjectForm #id_key").attr('oninput', "let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);")
    });

    $("#proj_mem_list").on("click", (e) => {
            if (!(e.target.classList).contains('mdi')) return;
            if ((e.target.classList).contains('mdi-pencil')) return getUserRoleForm(e)
            if (e.target.classList.contains("mdi-trash-can")) return RemoveMember(e);
        })
        // /////////////// functions  /////////////////

    function RemoveMember(e) {
        $("#RemoveMemberModal").modal();
        var user_id = $(e.target.parentElement.parentElement).attr("data-reg")
        $("#RemoveMemberModal .modal-body").attr("data-reg", user_id)

        $("#cancel_rem").on("click", (e) => {
            $("#RemoveMemberModal").modal('toggle');
        })
    }

    $("#remove_mem").on("click", (e) => {
        var user_id = document.querySelector("#RemoveMemberModal .modal-body").getAttribute('data-reg')
        var url = `/trackers/${site_slug}/projects/remove-member/${url_end}/${user_id}/`
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    $("#RemoveMemberModal").modal('toggle');
                    var spn = document.querySelector(`span[data-reg="${user_id}"`);
                    spn.parentElement.parentElement.remove();
                    alertUser('removed', 'from project successfully!', 'member')
                }
            })
            .catch(error => { alert('Something went wrong. Please try later') })
    })

    function createProjectFunc(e) {
        e.preventDefault();
        var _form = document.getElementById("createProjectForm")
        var url = `/trackers/${site_slug}/create_project/`
        var data = new FormData(_form)
        fetch(url, {
                method: 'POST',
                body: data,
            })
            .then(response => response.json())
            .then(data => {
                if (!data.result) {
                    $(_form).replaceWith(data.formErrors)
                    $("#id_key").attr('oninput', "let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);")
                    $("#createProjectForm input[type='text']").each( //putting back the autocomplete since this is replace(dynamically created)
                        function() {
                            $(this).attr("autocomplete", "off");
                        }
                    );

                } else {
                    var project_key = data.key.toUpperCase();
                    $("#createProject").modal("hide"); // hiding the modal
                    setTimeout(() => {
                        $(_form)[0].reset();
                        alertUser(project_key, "has been created successufully", "project")
                    }, 1000)
                    InsertNewProject(data);

                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    };

    function InsertNewProject(data) {
        if (url_end !== 'dashboard') return;
        if ($('.dashboard-projects-container .empty-projects')[0]) { // checking if the class exist and remove the content before inserting new projects
            $(".dashboard-projects-container").html("")
        }
        $('.dashboard-projects-container').prepend(data.template)
    }

    function updateIcon(iconObj) {
        // element, currentIcon, dashboardIcon, previewIcon
        var newClass = iconObj.element.classList[2]
        var oldClass = iconObj.currentIcon.firstElementChild.classList[2]
        $(iconObj.currentIcon).children(":first-child").removeClass(oldClass).addClass(newClass);

        // checking if we are in the edit project page
        if ("dashboardIcon" in iconObj) {
            $("#vert-tabs-right-tabContent #id_project_icon").attr("value", newClass)
            $(iconObj.dashboardIcon).children(":first-child").removeClass(oldClass).addClass(newClass);
            $(iconObj.previewIcon).children(":first-child").removeClass(oldClass).addClass(newClass);
            var oldActiveProjectClass = document.querySelector("#activeProjectLi i").classList[2]
            $("#activeProjectLi i").removeClass(oldActiveProjectClass).addClass(newClass);

        } else {
            $("#createProjectForm #id_project_icon").attr("value", newClass) // for the hidden innput in the form
        }

    };

    function updateColorIcon(iconObj) {
        var allIcons = document.getElementsByClassName("icon-choice")
        var newColor = iconObj.element.getAttribute("style").slice(-8, -1);
        iconObj.currentIcon.setAttribute("style", `color: ${newColor}`);
        for (let i = 0; i < allIcons.length; i++) {
            const element = allIcons[i];
            element.parentElement.setAttribute("style", `color: ${newColor}`);

        }
        if ("dashboardIcon" in iconObj) {
            iconObj.previewIcon.attr("style", `color: ${newColor}`);
            iconObj.dashboardIcon.attr("style", `color: ${newColor}`);

        } else {
            var projectColorInput = document.getElementById("id_project_color")
            projectColorInput.setAttribute("value", `${newColor}`) // for the hidden input 
        }
    }

    function changeProjectTheme(color, element) {
        var asidenav = document.getElementById("sidebar")
        if ($(element).parent().find(".mdi-check").length === 1) {
            $(element).parent().find(".mdi-check").parent().html("");
        }
        var hover_open = $(".sidebar-icon-only .sidebar .nav .nav-item.hover-open .nav-link .menu-title")
        var sidebarLi = $("#sidebar ul li")
        var alphaColor = shade(color, -0.31)
        var sidebarAnchor = $("#sidebar ul li a")
            // var key = document.querySelector("#vert-tabs-right-tabContent .project-key.badge").textContent;
        asidenav.setAttribute("style", `background:${color};`)
        hover_open.attr("style", `background:${color};`)
        sidebarLi.attr("style", "border-bottom: none;")
        $("#sidebar ul li.borderBottom").attr("style", `border-bottom: 1px solid #f3f3f373;`)
        if (color === "#ffffff") {
            $(".navbar-brand-wrapper").attr("style", `background:#ffffff;`)
            $(".navbar-menu-wrapper").attr("style", `background:#ffffff;`)
            $("#id_project_theme").val(`${color} #ffffff`)
            if (sidebar.classList.contains("clr-wt")) {
                $(sidebar).removeClass('clr-wt')
            }
            if (navbar_.classList.contains("clr-wt")) {
                $(navbar_).removeClass('clr-wt')
            }
            $(sidebar).addClass("clr-bk")
            $(navbar_).addClass('clr-bk')
        } else {
            $(".navbar-brand-wrapper").attr("style", `background:${alphaColor};`)
            $(".navbar-menu-wrapper").attr("style", `background:${alphaColor};`)
            $("#id_project_theme").val(`${color} ${alphaColor}`);
            if (sidebar.classList.contains("clr-bk")) {
                $(sidebar).removeClass('clr-bk')
            }
            if (navbar_.classList.contains("clr-bk")) {
                $(navbar_).removeClass('clr-bk')
            }
            $(sidebar).addClass("clr-wt")
            $(navbar_).addClass('clr-wt')
        }

    }

    function alertUser(key, message, type) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.set('notifier', 'delay', 10);
        alertify.success(`${type} <span class="alert-key">${key} </span>${message}`);
    };

    function showInputEditIcon(el) {

        var _icon = el.closest(".align-items-center").lastElementChild.firstElementChild
        var name = $("#vert-tabs-right-tabContent #createProjectForm input[name='name']").val();
        var key = $("#vert-tabs-right-tabContent #createProjectForm input[name='key']").val();
        var currVal = el.getAttribute("id") === "id_key" ? key : name

        el.addEventListener("keyup", (e) => {
            el.classList.contains("is-invalid") ? el.classList.remove("is-invalid") : "";

            if (currVal !== el.value.trim()) {
                $(".input-edit-icon").each((a, b) => {
                    if ($(b).is(":visible")) {
                        if (b !== _icon) {
                            $(b).fadeOut();
                            $(_icon).fadeIn();
                        }
                    } else if (!$(".input-edit-icon").is(":visible").length) {
                        $(_icon).fadeIn();
                    }
                });
            } else {
                $(_icon).fadeOut();
            }
        });
        el.onfocusout = () => {
            setTimeout(() => {
                if (!document.activeElement.classList.contains("input-edit-icon")) {
                    $(_icon).fadeOut();
                    el.value = currVal;
                }
            }, 400)
        }
        _icon.addEventListener("click", (e) => {
            e.preventDefault();
            $(_icon).fadeOut();
            $(_icon).next().fadeIn();
            var url = `/trackers/${site_slug}/projects/edit/${key}/`
            var _form = document.querySelector("#vert-tabs-right-tabContent #createProjectForm")
            var form_data = new FormData(_form)
            fetch(url, { method: 'POST', body: form_data })
                .then(response => response.json())
                .then(data => {
                    if (!data.response && data.not_valid) {
                        $("#vert-tabs-right-tabContent #createProjectForm").replaceWith(data.formErrors)
                        $(_icon).next().fadeOut()
                    } else {
                        currVal = data.value
                        setTimeout(() => {
                            $(_icon).next().fadeOut();
                            if (!data.not_valid) {
                                alertUser(`${data.name}`, 'has been updated successfully!', `Project`)
                            }
                        });
                        /// change the url when the key ofthe prject is changed
                        const domain = location.protocol + '//' + location.host;
                        history.pushState(null, 'project detail key', `${domain}/trackers/${site_slug}/projects/${data.value}/`);
                        (data.name == "key") ? $('.active_project_key').text(`${data.value}`): $('.active_project').text(data.value);
                    }

                })
                .catch(error => {
                    console.log("there was an error", error);
                })
        });
    }
    $("#vert-tabs-right-tabContent").on("click", (e) => {
        e.stopImmediatePropagation();
        var $el = e.target
        if ($(e.target).attr("type") === "radio") {
            editRadionBtn();
        }
        if ($el.classList.contains("change-theme-btn")) {
            $(".theme-container-parent").show();
            $(".close-change-theme-btn").on("click", () => { $(".theme-container-parent").hide(); })


        } else if ($el.classList.contains("change-icon-btn")) {
            $(".edit-project-icon-container-parent").fadeIn();
        } else if ($el.classList.contains("icon-choice")) {
            var currentIcon = document.getElementById("project-edit-current-icon");
            var projectKey = $("#vert-tabs-right-tabContent #id_key").val()
            var dashboardIcon = $(`.active_project_icon`);
            var previewIcon = $(".project-icon.preview-icon");

            // take care of the do not repeat yourself  after

            var iconObj = { element: $el, currentIcon: currentIcon, dashboardIcon: dashboardIcon, previewIcon: previewIcon }
            updateIcon(iconObj)
        } else if ($el.classList.contains("color-choice")) {
            var currentIcon = document.getElementById("project-edit-current-icon");
            var projectKey = $("#vert-tabs-right-tabContent #id_key").val()
            var dashboardIcon = $(`.active_project_icon`);
            var previewIcon = $(".project-icon.preview-icon");
            var iconObj = { element: $el, currentIcon: currentIcon, dashboardIcon: dashboardIcon, previewIcon: previewIcon }

            updateColorIcon(iconObj);
        } else if ($el.classList.contains("mdi-close-box")) {
            $(".edit-project-icon-container-parent").fadeOut();
        } else if ($el.classList.contains("theme-choice")) {
            var _color = $el.getAttribute("style").slice(-8, -1);
            changeProjectTheme(_color, $el);
        }
        return false;
    });

    function hex2(c) {
        c = Math.round(c);
        if (c < 0) c = 0;
        if (c > 255) c = 255;

        var s = c.toString(16);
        if (s.length < 2) s = "0" + s;

        return s;
    }

    function color(r, g, b) {
        return "#" + hex2(r) + hex2(g) + hex2(b);
    }

    function shade(col, light) {

        // TODO: Assert that col is good and that -1 < light < 1

        var r = parseInt(col.substr(1, 2), 16);
        var g = parseInt(col.substr(3, 2), 16);
        var b = parseInt(col.substr(5, 2), 16);

        if (light < 0) {
            r = (1 + light) * r;
            g = (1 + light) * g;
            b = (1 + light) * b;
        } else {
            r = (1 - light) * r + light * 255;
            g = (1 - light) * g + light * 255;
            b = (1 - light) * b + light * 255;
        }

        return color(r, g, b);
    }
    var changeProjectType = () => {
        var key = $("#vert-tabs-right-tabContent #createProjectForm input[name='key']").val();
        var url = `/trackers/${site_slug}/projects/edit/${key}/`
        var _form = document.querySelector("#vert-tabs-right-tabContent #createProjectForm")
        var form_data = new FormData(_form)
        fetch(url, { method: 'POST', body: form_data })
            .then(response => response.json())
            .then(data => {
                if (!data.response && data.not_valid) {
                    data.formErrors ? $("#nav-general #createProjectForm").replaceWith(data.formErrors) : ""

                } else {
                    var editPlace = $(".over_header .proj_type")
                    editPlace.text(data.value)
                    alertUser(`Type`, 'has been updated successfully!', `Project`)

                }
            })
            .catch(error => {
                alert('something went wrong please try again!')
            })

    }
    $("#vert-tabs-right-tabContent #id_project_type").on("change", (e) => {
        changeProjectType();
    })

    function checkAndRemoveInvalidClass(e) {
        if (e.target.classList.contains("is-invalid")) {
            $(e.target).removeClass("is-invalid")
        }
    }


    function editUserRole(e) {
        e.preventDefault();
        $("#editProfile").attr('disabled', "true")
        var user_id = $("#editRoleModal .modal-body").attr("data-reg")
        var url = `/trackers/${site_slug}/projects/user-role/${url_end}/${user_id}/`
        var _form = document.querySelector("#editUserProfile");
        var form_data = new FormData(_form)
        fetch(url, { method: 'POST', body: form_data })
            .then(res => res.json())
            .then(data => {
                    // if success : close the modal, alert the user and update the datatable
                if (data.success) {
                    $('#editRoleModal').modal('toggle');
                    $("#editRoleModal .modal-body").first().html(
                        `
                        <div class="d-flex justify-content-center">
                              <div class="lds-hourglass "></div>
                            </div>
                        `
                    );
                    $("#editProfile").prop("disabled", false);
                    alertUser('Profile', 'has been updated successfully', 'Your')
                }
            })
            .catch(error => {
                alert("OOOPS, Something went wrong. Please try later!")
            })

    }
    $("#editRoleModal .close").on("click", (e) => {
        $("#editRoleModal .modal-body").first().html(
            `
            <div class="d-flex justify-content-center">
                <div class="lds-hourglass "></div>
            </div>
            `
        );
    })

    $(".add_new_users").on("click", (e) => {
        $(".add_members_section").fadeIn();
        var url = `/trackers/${site_slug}/projects/add-members/${url_end}/`
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                $(".add_mem_sec").html(data.template);
                $("#addMembers").chosen({ no_results_text: "Oops, no member were found!" });
            })
            .catch(error => {
                console.log(error);
                alert("Something Went wrong. Please try later")
            })

    })
    $(".mem_close_icon").on("click", (e) => {
        $(".add_members_section").fadeOut();
        $(".add_mem_sec").html(`
            <div class="d-flex justify-content-center">
                <div class="lds-hourglass "></div>
            </div>
        `);
    })

    function getUserRoleForm(e) {
        $("#editRoleModal").modal();
        var user_id = e.target.parentElement.parentElement.getAttribute('data-reg')
        $("#editRoleModal .modal-body").attr("data-reg", user_id)
        var url = `/trackers/${site_slug}/projects/user-role/${url_end}/${user_id}/`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                $("#editRoleModal .modal-body").first().html(data.template);
                $("#editRole").on("click", (e) => { editUserRole(e) })
            })
            .catch(error => {
                alert("something went wrong. Please try later!")
                console.log("error", error)
            })


    }
})