
let form = document.querySelector("#book-form")

const list = document.querySelector("#book-list")


function createList(title, author, isbn) {
    const row = document.createElement("tr")//<tr></tr>
    row.innerHTML = `
    <td>${title}</td>
    <td>${author}</td>
    <td>${isbn}</td>
    <td class="btn btn-danger float-right delete">
    <a  type="button" >X</a>
    </td>
    `
    list.appendChild(row)
}

function addBookToStorage(title, author, isbn) {
    //Append object in the local storage
    let books
    if (localStorage.getItem("books") === null) {
        books = []
    } else {
        books = JSON.parse(localStorage.getItem("books"))
    }
    books.push({ title, author, isbn }) // [{title:'abc',author:"pqr",isbn:123}]
    localStorage.setItem("books", JSON.stringify(books))
}

function clearAllFields() {
    document.querySelector("#title").value = null
    document.querySelector("#author").value = null
    document.querySelector("#isbn").value = null

}


function showAlert(msg, className) {
    let div = document.createElement("div")//<div></div>
    div.className = "alert alert-" + className
    div.appendChild(document.createTextNode(msg)) // <div></div>
    const container = document.querySelector(".container")
    container.insertBefore(div, form)
    setTimeout(function () {
        document.querySelector(".alert").remove()
    }, 3000)
}

function removeBookFromStorage(isbn) {

    let books = JSON.parse(localStorage.getItem("books"))
    let newbooks = []

    for (let i = 0; i < books.length; i++) {
        if (books[i].isbn !== isbn) {
            newbooks.push(books[i])
        }
    }
    console.log(newbooks, isbn)
    localStorage.setItem("books", JSON.stringify(newbooks))
}

function isDuplicateISBN(isbn) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    return books.some(book => book.isbn === isbn);
}


function toggleUpdateButton() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updateBtn = document.getElementById("update-btn");
    if (books.length > 0) {
        updateBtn.style.display = "block";
    } else {
        updateBtn.style.display = "none";
    }
}

function refreshUI() {
    list.innerHTML = ""; // clear table
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach(book => {
        createList(book.title, book.author, book.isbn);
    });
    toggleUpdateButton();
}


form.addEventListener("submit", function (e) {
    e.preventDefault()
    let title = document.querySelector("#title").value
    let author = document.querySelector("#author").value
    let isbn = document.querySelector("#isbn").value

    if (title.length === 0 || author.length === 0 || isbn.length === 0) {
        showAlert("Please Fill all the Field", "danger")
        return;
        // alert("Please Fill all the Field!!!")
        // return;
    }

    // Check for duplicate ISBN
    if (isDuplicateISBN(isbn)) {
        showAlert("ISBN already exists", "danger");
        clearAllFields();
        return;
    }

    createList(title, author, isbn) // Add book to UI
    showAlert("Book Added Successfully", "success")

    clearAllFields()

    //Append object in the local storage
    addBookToStorage(title, author, isbn)
    toggleUpdateButton()

})


list.addEventListener('click', function (e) {
    if (e.target.parentElement.classList.contains("delete")) {

        let parentElement = e.target.parentElement.parentElement
        list.removeChild(parentElement) // Remove from the UI
        //--Remove book from local storage
        let isbn = e.target.parentElement.previousElementSibling.textContent
        removeBookFromStorage(isbn)
        showAlert("Book Deleted Successfully", "success")
        toggleUpdateButton()
    }
})

window.addEventListener("DOMContentLoaded", function () {
    let books = JSON.parse(localStorage.getItem("books"))

    for (let i = 0; i < books.length; i++) {
        createList(books[i].title, books[i].author, books[i].isbn)
    }
    toggleUpdateButton()

})

document.getElementById("update-btn").addEventListener("click", function () {
    document.getElementById("update-modal").style.display = "flex";
});

document.getElementById("save-update").addEventListener("click", function () {
    const isbn = document.getElementById("update-isbn").value;
    const newTitle = document.getElementById("update-title").value;
    const newAuthor = document.getElementById("update-author").value;

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let found = false;

    books = books.map(book => {
        if (book.isbn === isbn) {
            found = true;
            return {
                title: newTitle || book.title,
                author: newAuthor || book.author,
                isbn: book.isbn
            }
        }
        return book;
    });

    if (!found) {
        showAlert("Book with this ISBN not found", "danger");
    } else {
        localStorage.setItem("books", JSON.stringify(books));
        refreshUI();
        showAlert("Book Updated Successfully", "success");
        document.getElementById("update-modal").style.display = "none";
    }
    document.getElementById("update-isbn").value = "";
    document.getElementById("update-title").value = "";
    document.getElementById("update-author").value = "";
});
