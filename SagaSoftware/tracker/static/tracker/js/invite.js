$(document).ready(function() {
    function checkAndRemoveInvalidClass(e) {
        if (e.target.classList.contains("is-invalid")) {
            console.log("ok got the class")
            $(e.target).removeClass("is-invalid")
        }
    }
    var url_end = (window.location.pathname).split("/").at(-2)
    var site_slug = (window.location.pathname).split("/")[2]
    var inviteBtn = document.querySelector("#invite_new_members")
    var form = document.getElementById("InviteForm")
    if (inviteBtn !== null) {
        inviteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            var url = "/trackers/invite_members/"
            var data = new FormData(form)
            console.log("this isthe data from the form", data)
            fetch(url, {
                    method: 'POST',
                    body: data,
                })
                .then(response => response.json())
                .then(datas => {
                    console.log('Success:', datas);
                    if (datas.success) {
                        if (datas.no_emails) {
                            alert("Please provide at least one email to send an invitation!")
                        } else {
                            $("#invitationsModal .close").click();
                            $(form)[0].reset();
                            alertUser("", 'invitations has been sent successfully!', "New")
                        }
                    } else {
                        $("#InviteForm").replaceWith(datas.formErrors)
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        })
    }

    $(".profile-form").on('keyup', (e) => {
        if (e.target.tagName === 'INPUT') {
            checkAndRemoveInvalidClass(e)
        }

    })
    var editProfileBtn = document.querySelector("#editProfile")
    if (editProfileBtn !== null) {
        editProfileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            var _form = document.querySelector("#editUserProfile")
            var url = `/accounts/${site_slug}/profile/${url_end}/`
            var form_data = new FormData(_form)

            fetch(url, { method: 'POST', body: form_data })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alertUser('Your', 'has updated successfully!', 'profile')
                    } else {
                        $("#editUserProfile").replaceWith(data.formErrors)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }

    function alertUser(key, message, type) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.set('notifier', 'delay', 10);
        alertify.success(`${type} <span class="alert-key">${key} </span>${message}`);
    };

    $("#invitationsModal .close").on("click", (e) => {
        $("#InviteForm")[0].reset();
    })
})