//contact
function cont() {
    alert("Numar telefon: 0723400130" + "\n" + "E-mail: blog@gmail.com" + "\n" + "Nume: Adrian");
}
//nume required
function validate() {
    isValid = true;
    if (document.getElementById("Nume").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}
const list = document.getElementById('list');
const formName = document.getElementById('formName');
const formC = document.getElementById('formC');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');


function getComments() {
    fetch('http://localhost:3000/posts')
        .then(function (response) {
            response.json().then(function (comments) {
                appendCommentsToDOM(comments);
            });
        });
};

function postComment() {
    const postObject = {
        name: formName.value,
        comentariu: formC.value,
        img: formUrl.value
    }
    fetch('http://localhost:3000/posts', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getComments();
        // Reset Form
        resetForm();
    });
}

function deleteComment(id) {
    fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getComments();
    });
}

function updateComment(id) {
    const putObject = {
        name: formName.value,
        comentariu: formC.value,
        img: formUrl.value
    }
    fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getComments();

        // change button event from update to add
        addButton.disabled = false;

        // remove all event from update button
        clearUpdateButtonEvents();

        // Reset Form
        resetForm();
    });
}

function editComment(comment) {
    formName.value = comment.name;
    formC.value = comment.comentariu;
    formUrl.value = comment.img;

    // disable add button
    addButton.disabled = true;

    // clear all events update button events
    clearUpdateButtonEvents();

    // enable and add event on update button
    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateComment(comment.id)
    });

}

// Create and append img and name DOM tags
function appendCommentsToDOM(comments) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    // create and append tags
    for (let i = 0; i < comments.length; i++) {
        // create image obj
        let img = document.createElement('img');
        img.src = comments[i].img;
        // create name obj
        let name = document.createElement('span');
        name.innerText = comments[i].name;

        let comentariu = document.createElement('span');
        comentariu.innerText = comments[i].comentariu;

        // create button and event for edit and delete
        let editButton = document.createElement('button')
        editButton.addEventListener('click', function () {
            editComment(comments[i])
        });
        editButton.innerText = 'Edit';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteComment(comments[i].id)
        });
        deleteButton.innerText = 'Delete';
        // create a container for img and name
        let container = document.createElement('div');
        // append elements to container
        container.appendChild(name);
        container.appendChild(img);
        container.appendChild(comentariu);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        // append container to DOM (list div)
        list.appendChild(container);
    }
}

// reset form
function resetForm() {
    formName.value = '';
    formC.value = '';
    formUrl.value = '';
}
//  remove Update Button to clear events more at https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
// add event listener on add button
addButton.addEventListener('click', postComment);

getComments();