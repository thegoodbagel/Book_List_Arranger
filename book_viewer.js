import {
    undisplayBookMakerPanel,
    displayBookInfoPanel,
    activateTab, createTab, deleteTab
} from "./layout.js";

import { addBook } from "./book_list.js";

document.getElementById("submit_book_button").addEventListener("click", preventRefresh);
document.getElementById("submit_book_button").addEventListener("click", submitBook);

const tabs = document.getElementsByClassName("tab");
for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    tab.addEventListener("click", function() {
        activateTab(tab);
    });
}

function validateBookMakerForm() {
    const title = document.getElementById("title_input").value;
    // prevent empty book
    if (!title) {
        alert("Please enter a book title");
        return false;
    }
    // prevent duplicate book
    if (localStorage.getItem("bookList") != null){
        const bookList = JSON.parse(localStorage.getItem("bookList"));
        for (let i = 0; i < bookList.length; i++){
            if (bookList[i].title == title){
                alert("Book already added to list");
                return false;
            }
        }
    }
    return true;
}

function bookCardClicked(bookCard) {
    bookCard.addEventListener("click", function() {
        console.log("book card clicked");
        console.log(bookCard.id);
        const bookList = JSON.parse(localStorage.getItem("bookList"));
        // get number at front of bookcard id
        const bookNum = bookCard.id.replace(/(^\d+)(.+$)/i, '$1');
        displayBookInfoPanel(bookList[bookNum - 1]);
        createTab(bookList[bookNum - 1].title);
    });
}

function preventRefresh(event) {
    console.log("preventing refresh");
    event.preventDefault();
}

function submitBook() {
    console.log("submitting book");
    let title = document.getElementById('title_input').value;
    let commentary = document.getElementById('commentary_input').value;
    deleteTab("New Book");
    addBook(title, commentary);
    undisplayBookMakerPanel();
}

export { bookCardClicked };