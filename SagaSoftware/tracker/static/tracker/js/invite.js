$(document).ready(function () {
    var inviteBtn = document.querySelector("#invite_new_members")
    form = document.getElementById("InviteForm")
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
                        if (datas.no_emails){
                            alert("Please provide at least one email to send an invitation!")
                        }
                    } else {
                        alert("One or more of the entered emails are not correct please correct them!")
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        })
    }
})