// var allIcons = document.getElementsByClassName("icon-choice")
// var allColors = document.getElementsByClassName("color-choice")
// var current_icon = document.getElementById("current-project-icon")
// const closeIconSelection = document.querySelector(".close-icon-selection")
// const createProjectBtn = document.querySelector("#submit-id-create-new-project");
// // var projectNameInput = document.querySelector("#createProject form").querySelector("#id_name")
// var workspace_slug = (window.location.pathname).split("/")[1]


// //allow milestone checkbox;
// $("#div_id_Allow_Milestone label").parent().addClass("form-check")
// $("#div_id_Allow_Milestone label").removeClass("custom-control-label").addClass("form-check-label").append($("#div_id_Allow_Milestone input"))
// $("#div_id_Allow_Milestone input").removeClass("custom-control-input checkboxinput").addClass("form-check-input")

// // functions section
// function updateIcon(iconObj) {
//     // element, currentIcon, dashboardIcon, previewIcon
//     var newClass = iconObj.element.classList[2]
//     var oldClass = iconObj.currentIcon.firstElementChild.classList[2]
//     $(iconObj.currentIcon).children(":first-child").removeClass(oldClass).addClass(newClass);

//     if ("dashboardIcon" in iconObj) {
//         $(".project-edit #id_project_icon").attr("value", newClass)
//         $(iconObj.dashboardIcon).children(":first-child").removeClass(oldClass).addClass(newClass);
//         $(iconObj.previewIcon).children(":first-child").removeClass(oldClass).addClass(newClass);
//         var oldActiveProjectClass = document.querySelector("#activeProjectLi i").classList[2]
//         console.log(oldActiveProjectClass)
//         $("#activeProjectLi i").removeClass(oldActiveProjectClass).addClass(newClass);

//     } else {
//         $("#id_project_icon").attr("value", newClass) // for the hidden innput in the form
//     }

// };

// function updateColorIcon(iconObj) {
//     var newColor = iconObj.element.getAttribute("style").slice(-8, -1);
//     iconObj.currentIcon.setAttribute("style", `color: ${newColor}`);
//     for (let i = 0; i < allIcons.length; i++) {
//         const element = allIcons[i];
//         element.parentElement.setAttribute("style", `color: ${newColor}`);

//     }
//     if ("dashboardIcon" in iconObj) {
//         iconObj.previewIcon.attr("style", `color: ${newColor}`);
//         iconObj.dashboardIcon.attr("style", `background: ${newColor}`);

//     } else {
//         projectColorInput.setAttribute("value", `${newColor}`) // for the hidden input 
//         var projectColorInput = document.getElementById("id_project_color")
//     }
// }

// function addAlpha(color, opacity = 0.1) {
//     // coerce values so ti is between 0 and 1.
//     const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
//     return color + _opacity.toString(16).toUpperCase();
// }
// function changeProjectTheme(color, element) {
//     var asidenav = document.getElementById("sidebar")
//     if ($(element).parent().find(".mdi-check").length === 1) {
//         $(element).parent().find(".mdi-check").parent().html("");
//     }
//     var hover_open = $(".sidebar-icon-only .sidebar .nav .nav-item.hover-open .nav-link .menu-title")
//     var sidebarLi = $("#sidebar ul li")
//     var alphaColor = addAlpha(color)
//     var sidebarAnchor = $("#sidebar ul li a")
//     var key = document.querySelector(".project-edit .project-key.badge").textContent;
//     asidenav.setAttribute("style", `background:${color};`)
//     hover_open.attr("style", `background:${color};`)
//     sidebarLi.attr("style", "border-bottom: none;")
//     $("#sidebar ul li.borderBottom").attr("style", `border-bottom: 1px solid #f3f3f373;`)
//     $(".navbar-brand-wrapper").attr("style", `background:${alphaColor};`)
//     $(".navbar-menu-wrapper").attr("style", `background:${alphaColor};`)
//     $("#id_project_theme").val(`${color} ${alphaColor}`)
//     if (color === "#ffffff") {
//         $("<i class='mdi mdi-24px mdi-check' style='color: #000'></i>").appendTo($(element))
//         $(element).attr("color", "#000")
//         sidebarAnchor.attr("style", "color: #000;");
//         $(".menu-arrow").attr("style", "color: #000;");
//         $(".theme-choice.selected").attr("style", `background:${color}; `).addClass("border");
//     } else {
//         $("<i class='mdi mdi-24px mdi-check' style='color: #fff'></i>").appendTo($(element))
//         $(".theme-choice.selected").attr("style", `background:${color};`)
//         sidebarAnchor.attr("style", "color: #fff;");
//         $(".menu-arrow").attr("style", "color: #fff;")
//         $(element).attr("color", "#fff")
//         //projectThemeSelection();
//     }
//     $(".select-this-theme").on("click", (e) => {
//         e.preventDefault();
//         $(".select-this-theme").attr("disabled", true)
//         $(".select-this-theme").text("Updating....")

//         $.ajax({
//             url: `/${workspace_slug}/getEditProject/${key}/`,
//             data: $("#nav-general #createProjectForm").serialize(),
//             dataType: "json",
//             method: 'POST',
//             success: (data) => {
//                 if (!data.response) {
//                     data.formErrors ? $("#nav-general #createProjectForm").replaceWith(data.formErrors) : ""
//                 } else {
//                     if (data.response) {

//                         setTimeout(() => {
//                             // CLOSE THE THEME CONTAINER
//                             $(".close-change-theme-btn").click();
//                             // ALERT THE USER ABOUT THE THEME CHANGE
//                             alertUser(key, "has been updated successfully!", "Theme of")
//                             setTimeout(() => {
//                                 $(".select-this-theme").text("Select this Theme")
//                                 $('.select-this-theme').prop("disabled", false);
//                             }, 500)
//                         }, 1000);
//                     }

//                 }
//             },
//             error: (error) => {
//                 console.log("this is the error", error);
//             }
//         })

//     })
// }

// var showInputEditIcon = (el) => {
//     // need to update the kep everytime the ajax call has  been made
//     var _icon = el.closest(".align-items-center").lastElementChild.firstElementChild
//     var name = document.querySelector(".project-edit .project-name").textContent;
//     var key = document.querySelector(".project-edit .project-key.badge").textContent;
//     var currVal = el.getAttribute("id") === "id_key" ? key : name
//     el.addEventListener("keyup", (e) => {
//         el.classList.contains("is-invalid") ? el.classList.remove("is-invalid") : "";

//         if (currVal !== el.value.trim()) {
//             $(".input-edit-icon").each((a, b) => {
//                 if ($(b).is(":visible")) {
//                     if (b !== _icon) {
//                         $(b).fadeOut();
//                         $(_icon).fadeIn();
//                     }
//                 } else if (!$(".input-edit-icon").is(":visible").length) {
//                     $(_icon).fadeIn();
//                 }
//             });
//         } else {
//             $(_icon).fadeOut();
//         }
//     });
//     el.onfocusout = () => {
//         setTimeout(() => {
//             if (!document.activeElement.classList.contains("input-edit-icon")) {
//                 $(_icon).fadeOut();
//                 el.value = currVal;
//             }
//         }, 400)
//     }
//     _icon.addEventListener("click", (e) => {
//         e.preventDefault();
//         $(_icon).fadeOut();
//         $(_icon).next().fadeIn();
//         $.ajax({
//             url: `/${workspace_slug}/getEditProject/${key}/`,
//             type: "POST",
//             dataType: "json",
//             data: $("#nav-general #createProjectForm").serialize(),
//             success: (data) => {
//                 if (!data.response) {
//                     $("#nav-general #createProjectForm").replaceWith(data.formErrors)
//                     $(_icon).next().fadeOut()
//                 } else {
//                     if (data.response) {
//                         var editPlace = $(".project-edit .modal-header").find(".project-" + data.name)
//                         var dashboardEditPlace = $(".dashboard-icon-" + `${key}`).next().find(".project-" + data.name)
//                         setTimeout(() => {
//                             $(_icon).next().fadeOut();
//                             editPlace.text(data.value)
//                             dashboardEditPlace.text(data.value)
//                             if (data.name == "key") {
//                                 $('.dashboard-icon-' + `${key}`).removeClass('dashboard-icon-' + `${key}`).addClass('dashboard-icon-' + `${data.value}`)
//                             } else {
//                                 $('.active-project').text(data.value);
//                             }
//                         });
//                         55
//                     }

//                 }
//             },
//             error: (error) => {
//                 console.log("this is the error", error);
//             }
//         });
//     });
// }

// var editRadionBtn = () => {
//     var key = document.querySelector(".project-edit .project-key.badge").textContent;
//     $.ajax({
//         url: `/${workspace_slug}/getEditProject/${key}/`,
//         type: "POST",
//         dataType: "json",
//         data: $("#nav-general #createProjectForm").serialize(),
//         success: (data) => {
//             if (!data.response) {
//                 data.formErrors ? $("#nav-general #createProjectForm").replaceWith(data.formErrors) : ""

//             } else {
//                 var editPlace = $(".project-edit .modal-header").find(".project-" + data.name)
//                 var dashboardEditPlace = $(".dashboard-icon-" + `${key}`).next().find(".project-" + data.name)
//                 setTimeout(() => {

//                     editPlace.text(data.value)
//                     dashboardEditPlace.text(data.value)
//                     if (data.name == "key") {
//                         $('.dashboard-icon-' + `${key}`).removeClass('dashboard-icon-' + `${key}`).addClass('dashboard-icon-' + `${data.value}`)
//                     }
//                 }, 1000)

//             }
//         },
//         error: (error) => {
//             console.log("this is the error", error);
//         }
//     });

// }
// function createProjectFunc(e) {
//     e.preventDefault()
//     const _form = $("#createProjectForm");

//     $.ajax({
//         method: "post",
//         url: `/${workspace_slug}/create-project/`,
//         data: _form.serialize(),
//         success: function (data) {
//             if (!data.result) {
//                 _form.replaceWith(data.formErrors)
//                 $("#createProjectForm input[type='text']").each( //putting back the autocomplete since this is replace(dynamically created)
//                     function () {
//                         $(this).attr("autocomplete", "off");
//                     }
//                 );

//             } else {
//                 var project_key = data.key.toUpperCase();
//                 $("#createProject").modal("hide"); // hiding the modal
//                 setTimeout(() => {
//                     _form[0].reset();
//                     alertUser(project_key, "has been created successufully", "project")
//                 }, 1000)

//                 var newProjectTemplate = `
//                     <div class="project-instance d-flex align-items-center p-2">
//                         <div class="project-icon mr-3" style="background: ${data.project_color}"><i class="mdi ${data.project_icon} mdi-24px"></i></div>
//                         <div class="project-details">
//                             <p class="project-name">${data.name}</p>
//                             <div>
//                                 <div class="hidden-actions">
//                                     <div class="align-items-center d-flex mt-1 project-actions">                
//                                         <a href="#" class="event-title">Add ticket</a>
//                                         <a href="#" class="event-title">See Tickets</a>
//                                         <a href="#" class="event-title">Board</a>
//                                         <a href"#"="" class="event-title settings" style="border-right: none;"><i class="mdi mdi-settings"></i></a>
//                                     </div>
//                                 </div>
//                                 <div class="project-instance-key">
//                                     <span> ${data.key}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="item-thumbnail ml-auto">
//                                 <img src="/static/projectManagement/images/faces/face3.jpg" alt="image" class="profile-pic">
//                         </div>
//                     </div>
//                 `
//                 if ($('.dashboard-projects-container .empty-projects')[0]) { // checking if the class exist and remove the content before inserting new projects
//                     $(".dashboard-projects-container").html("")
//                 }
//                 $('.dashboard-projects-container').prepend(newProjectTemplate)
//             }

//         },
//         error: function () {
//             console.log("there was an error")
//         }

//     })

// };


// function alertUser(key, message, type) {
//     alertify.set('notifier', 'position', 'top-right');
//     alertify.set('notifier', 'delay', 10);
//     alertify.success(`${type} <span class="alert-key">${key} </span>${message}`);
// }
// function validateProjectName() {

// }

// $(document).ready(function () {

//     // change icon btn handling;

//     $(".change-theme-btn").on("click", () => { $(".theme-container-parent").show(); })

//     var project_edit = document.querySelector(".project-edit");
//     document.querySelector(".dashboard-projects-container").addEventListener("click", (e) => {

//         // Please put all of this logic in a function
//         $(project_edit).show('slide', { direction: "right" }, 400);
//         var projectKeyParent = $(e.target).closest(".project-details").find(".project-instance-key");
//         projectKey = projectKeyParent.children(":first-child").text().trim();

//         $.ajax({
//             url: `/${workspace_slug}/getEditProject/${projectKey}/`,
//             type: "GET",
//             dataType: "json",
//             success: function (data) {
//                 $(".project-edit").html(data.template)
//                 //allow milestone checkbox;
//                 $(".project-edit #nav-general #createProjectForm #div_id_Allow_Milestone label").parent().addClass("form-check")
//                 $(".project-edit #nav-general #createProjectForm #div_id_Allow_Milestone label").removeClass("custom-control-label").addClass("form-check-label").append($(".project-edit #nav-general #createProjectForm #div_id_Allow_Milestone input"))
//                 $(".project-edit #nav-general #createProjectForm #div_id_Allow_Milestone input").removeClass("custom-control-input checkboxinput").addClass("form-check-input")

//             },
//             error: function (error) {
//                 console.log("here is the error", error);
//             }
//         });
//     });
//     $("#invite_new_members").on('click', (e) => {
//         e.preventDefault()
//         // console.log("this is the default click")
//     })
// });

// try {
//     $("input[type='text']").each(
//         function () {
//             $(this).attr("autocomplete", "off");
//         });
// }
// catch (e) {
// }
// function forceKeyPressUppercase(e) {
//     var charInput = e.keyCode;
//     if ((charInput >= 97) && (charInput <= 122)) { // lowercase
//         if (!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
//             var newChar = charInput - 32;
//             var start = e.target.selectionStart;
//             var end = e.target.selectionEnd;
//             e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
//             e.target.setSelectionRange(start + 1, start + 1);
//             e.preventDefault();
//         }
//     }
// }

// function navGeneralObserverFunc() {
//     // setting the editing functionality
//     $("#nav-general input[type='text']").each((index, element) => {
//         showInputEditIcon(element);
//         $(element).attr("autocomplete", "off");
//         document.querySelector("#nav-general #createProjectForm #id_key").addEventListener("keypress", forceKeyPressUppercase, false);
//     });
//     $('#nav-general input[type="radio"]').on('click', function () {
//         console.log("the check project type has been changed");
//         editRadionBtn();
//     });
// }
// //mutationObservers
// let projectEditObserver = new MutationObserver((mutations) => {
//     mutations.forEach(mutation => {
//         if (mutation.addedNodes.length) {
//             document.querySelector(".project-edit-close").addEventListener("click", () => {
//                 $(project_edit).hide('slide', { direction: "right" }, 400);
//             });
//             // navGeneralObserver.observe(document.querySelector("#nav-general"), { "childList": true });
//             navGeneralObserverFunc();
//         }
//     })
// });
// var project_edit = document.querySelector(".project-edit")
// projectEditObserver.observe(project_edit, { "childList": true, "subtree": true, });


// // EventListeners

// $("#createProject .modal-content .modal-body").on("keypress", (e) => {
//     if (e.target.getAttribute("id") == "id_key") {
//         forceKeyPressUppercase(e);

//     };
//     // 
// }, false);
// document.querySelector("#createProject .modal-content .modal-body").addEventListener("click", (e) => {
//     var $el = e.target
//     var currentIcon = document.getElementById("current-project-icon")
//     if ($el.classList.contains("icon-choice")) {
//         var iconObj = { element: $el, currentIcon: currentIcon }
//         updateIcon(iconObj)
//     } else if ($el.classList.contains("color-choice")) {
//         var iconObj = { element: $el, currentIcon: currentIcon }
//         updateColorIcon(iconObj);
//     } else if ($el.getAttribute("name") == "create-new-project") {
//         createProjectFunc(e);
//     } else if ($el.classList.contains("change-icon-btn")) {
//         $("#submit-id-create-new-project").attr("disabled", "true");
//         $(".icon-container-parent").show();

//     } else if ($el.parentElement.classList.contains("close-icon-selection")) {
//         $(".icon-container-parent").hide();
//         $("#submit-id-create-new-project").prop("disabled", false); // this will remove the disabled attribute
//     }
// });

// // project-edit div eventlistener click
// document.querySelector(".project-edit").addEventListener("click", (e) => {
//     e.stopImmediatePropagation();
//     var $el = e.target
//     if ($el.classList.contains("change-theme-btn")) {
//         $(".theme-container-parent").show();
//         $(".close-change-theme-btn").on("click", () => { $(".theme-container-parent").hide(); })


//     } else if ($el.classList.contains("change-icon-btn")) {
//         $(".edit-project-icon-container-parent").fadeIn();
//     } else if ($el.classList.contains("icon-choice")) {
//         var currentIcon = document.getElementById("project-edit-current-icon");
//         var projectKey = $(".project-edit #id_key").val()
//         var dashboardIcon = $(`.dashboard-icon-${projectKey}`);
//         var previewIcon = $(".project-icon.preview-icon");

//         // take care of the do not repeat yourself  after

//         iconObj = { element: $el, currentIcon: currentIcon, dashboardIcon: dashboardIcon, previewIcon: previewIcon }
//         updateIcon(iconObj)
//     } else if ($el.classList.contains("color-choice")) {
//         var currentIcon = document.getElementById("project-edit-current-icon");
//         var projectKey = $(".project-edit #id_key").val()
//         var dashboardIcon = $(`.dashboard-icon-${projectKey}`);
//         var previewIcon = $(".project-icon.preview-icon");
//         iconObj = { element: $el, currentIcon: currentIcon, dashboardIcon: dashboardIcon, previewIcon: previewIcon }

//         updateColorIcon(iconObj);
//     } else if ($el.classList.contains("mdi-close-box")) {
//         $(".edit-project-icon-container-parent").fadeOut();
//     } else if ($el.classList.contains("theme-choice")) {
//         color = $el.getAttribute("style").slice(-8, -1);
//         changeProjectTheme(color, $el);
//     }
//     return false;
// });


// // projectNameInput.addEventListener("keyup", () => {
// //     var nameValue = { "name": projectNameInput.value }
// //     $.ajax({
// //         url: '/validate-project-name/',
// //         type: "GET",
// //         data: nameValue,
// //         success: function (data) {
// //             if (data.is_taken) {
// //                 console.log("the project name is taken")
// //             }
// //         },
// //         error: function (error) {

// //         }
// //     });
// // })

// // functions section

