$(document).ready(function() {
    var url_end = (window.location.pathname).split("/").at(-2)
    var site_slug = (window.location.pathname).split("/")[2]
    var inviteBtn = document.querySelector("#invite_new_members")
    var form = document.getElementById("InviteForm")
    if (inviteBtn !== null) {
        inviteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            var url = "/trackers/invite_members/"
            data = new FormData(form)
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
                            $("#invitationModal .close").click();
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

    var editProfileBtn = document.querySelector("#editProfile")
    var _form = document.querySelector("#editUserProfile")
    if (editProfileBtn !== null) {
        editProfileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            var url = `/accounts/${site_slug}/profile/${url_end}/`
            var form_data = new FormData(_form)

            fetch(url, { method: 'POST', body: form_data })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
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
})