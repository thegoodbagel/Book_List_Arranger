
window.onload = function() {
  createBookCards();
};









// BOOK STORAGE

class Book {
  constructor(title) {
    this.title = title;
    this.commentary = "";
    this.date = new Date();
  }
}

function actOnEachBook(bookListExistFunction, bookListEmptyFunction){
  let bookList = localStorage.getItem("bookList")
  if (bookList == null || bookList.length == 0) {
    bookListEmptyFunction();
  } else {
    for (let i = 0; i < bookList.length; i++){
      bookListExistFunction(bookList[i]);
    }
  }
}

function elementExists(elementId){
  return (document.getElementById(elementId) != null);
}

// ADD BOOK

document.getElementById("add_book_button").addEventListener("click", addBookButtonClicked);

function addBookButtonClicked() {
  // prevent creating new book before
  // at least giving current book a title
  if (document.querySelectorAll(".tab.activated").length > 0) {
    const tab = document.querySelectorAll(".tab.activated")[0];
    const tab_title = tab.id;
    const book_title = tab_title.substring(0, tab_title.length - 4);
    if (book_title == "New Book") {
      alert("Please Enter a Title");
      return;
    }
  }
  createTab("New Book");
  createBookMakerPanel();
}

function addBook(title, commentary) {
  console.log("add book");

  // set numbooks (needed for bookcard id)
  let numBook;
  if (localStorage.getItem("numBooks") == null) {
    numBook = 1;
    localStorage.setItem("numBooks", 1);
  } else {
    numBook = parseInt(localStorage.getItem("numBooks")) + 1;
    localStorage.setItem("numBooks", numBook);
  }

  // get bookList from localStorage
  let bookList = localStorage.getItem("bookList")
  if (bookList == null || bookList.length == 0) {
    bookList = []
  } else {
    bookList = JSON.parse(bookList);
  }

  // create new book
  const new_book = new Book(title);
  new_book.commentary = commentary;

  // update bookList
  bookList.push(new_book);

  localStorage.setItem("bookList", JSON.stringify(bookList));

  // display newly added book
  createBookCard(new_book, numBook);
}




// CLEAR BOOKS

document.getElementById("clear_books_button").addEventListener("click", clearBookList);

function clearBookList() {
  console.log("clear book list");

  try{
    let bookList = localStorage.getItem("bookList");
    if (bookList != null && bookList.length > 0) {
      bookList = JSON.parse(bookList);
      for (let i = 0; i < bookList.length; i++) {
        const book = bookList[i];
        const title = book.title;
        removeBookCard(book, i + 1);
        if (elementExists(title + "_tab")){
          removeTab(title);
          removePanel(title);
        }
      }
    }
  }
  catch(error){
    alert(error.message);
  }
  localStorage.setItem("bookList", []);
  localStorage.setItem("numBooks", 0);
}













// BOOK DISPLAY

// BOOK CARDS

function createBookCard(book, numBook) {
  console.log("display book");
  console.log("numBook: " + numBook.toString());
  const bookCard = document.createElement("div");
  bookCard.id = numBook.toString() + "_" + book.title;
  bookCard.className = "book_card";

  bookCard.innerHTML = `
    <div class = "book_card_menu_wrapper"> </div>
    <div class = "book_card_text_wrapper">
      <p class = "book_card_title_text"> ${book.title} </p>
      <p class = "book_card_commentary_text"> ${book.commentary} </p>
    </div>
    <div class = "book_card_image_wrapper">
      <img src="./assets/default_image.jpg" alt="default image" class = "book_card_image">
    </div>
  `
  bookCardClicked(bookCard);
  document.getElementById("left_window").appendChild(bookCard);
}

function removeBookCard(book, numBook) {
  console.log("delete book");
  const book_div = document.getElementById(numBook.toString() + "_" + book.title);
  book_div.remove();
}

function createBookCards() {
  console.log("display books");
  let bookList = localStorage.getItem("bookList");
  if (bookList != null && bookList.length != 0) {
    bookList = JSON.parse(bookList);
    for (let i = 0; i < bookList.length; i++) {
      createBookCard(bookList[i], i + 1);
    }
  }
}

function bookCardClicked(bookCard) {
  bookCard.addEventListener("click", function() {
    console.log("book card clicked");
    console.log(bookCard.id);
    const bookList = JSON.parse(localStorage.getItem("bookList"));
    // get number at front of bookcard id
    const bookNum = bookCard.id.replace(/(^\d+)(.+$)/i, '$1');
    const book = bookList[bookNum - 1];
    const title = book.title
    // check if tab already exists
    if (elementExists(title + "_tab")){
      activatePanel(title);
      activateTab(title);
    } else {
      createBookInfoPanel(book);
      createTab(title);
    }
  });
}











// BOOK VIEWER

// TABS

function createTab(title) {
  console.log("create tab");
  const newTab = document.createElement("li");
  newTab.id = title + "_tab";
  newTab.className = "tab";
  newTab.innerHTML = `
    <p class = "tab_text"> ${title} </p>
  `
  document.getElementById("tab_bar").appendChild(newTab);
  activateTab(title);

  newTab.addEventListener("click", function() {
    title = newTab.id.substring(0, newTab.id.length - 4);
    activateTab(title);
    activatePanel(title);
  });
}

function removeTab(title) {
  const tab = document.getElementById(title + "_tab");
  tab.remove();
}

function updateTab(curTitle, prevTitle) {
  const tab = document.getElementById(prevTitle + "_tab");
  tab.id = title + "_tab";
  tab.innerHTML = `
    <p class = "tab_text"> ${curTitle} </p>
  `
}

function activateTab(title) {
  console.log("activate tab");
  // Get prev book title
  if (document.querySelectorAll(".tab.activated").length > 0) {
    const otherTab = document.querySelectorAll(".tab.activated")[0];
    otherTab.classList.remove("activated");
  }
  const tab = document.getElementById(title + "_tab");
  tab.classList.add("activated");
}







//PANELS

function activatePanel(title) {
  console.log("activate panel of " + title);
  if (document.querySelectorAll(".panel.activated").length > 0) {
    const otherPanel = document.querySelectorAll(".panel.activated")[0];
    console.log("other panel: " + otherPanel.id);
    otherPanel.classList.remove("activated");
    otherPanel.style.zIndex = 0;
  }
  const curPanel = document.getElementById(title + "_panel");
  console.log("cur panel: " + curPanel.id);
  curPanel.classList.add("activated");
  curPanel.style.zIndex = 1;
}


// BOOK INFO PANEL 

function createBookInfoPanel(book) {
  console.log("create book info panel");
  const bookInfoPanel = document.createElement("div");
  bookInfoPanel.className = "panel";
  bookInfoPanel.id = book.title + "_panel";
  bookInfoPanel.style.display = "block";
  bookInfoPanel.innerHTML = ` 
    <div class = "panel_wrapper">
      <p class = "book_panel_title"> ${book.title}  </p>
      <p class = "book_panel_commentary"> ${book.commentary} </p>
    </div>
    `
  const rightWindow = document.getElementById("right_window");
  rightWindow.appendChild(bookInfoPanel);
  activatePanel(book.title);
}







// BOOK MAKER FORM

function createBookMakerPanel() {
  console.log("display panel");
  const bookMakerPanel = document.createElement('div');
  bookMakerPanel.id = "New Book_panel";
  bookMakerPanel.className = "panel";
  bookMakerPanel.innerHTML = ` 
      <form>
        <label for="title_button" id="title_label">
          Title:
        </label>
        <input type="text" id="title_input">
        <label for="commentary_button" id="commentary_label">
          Commentary:
        </label>
        <input type="textarea" id="commentary_input">
        <input type="submit" id="submit_book_button">
        </input>
      </form> 
    `
  document.getElementById("right_window").appendChild(bookMakerPanel);
  document.getElementById("submit_book_button").addEventListener("click", preventRefresh);
  document.getElementById("submit_book_button").addEventListener("click", validateBookMakerForm);
  

  activatePanel("New Book");
}

function removePanel(title) {
  console.log("removing panel");
  document.getElementById(title + "_panel").remove();
}


function validateBookMakerForm() {
  console.log("validate book maker form function called");
  const title = document.getElementById("title_input").value;
  // prevent empty book
  if (!title) {
    alert("Please enter a book title");
    return false;
  }
  // prevent duplicate book
  let bookList = localStorage.getItem("bookList");
  if (bookList != null && bookList.length != 0) {
    console.log("localStorage is not null");
    bookList = JSON.parse(bookList);
    for (let i = 0; i < bookList.length; i++) {
      if (bookList[i].title == title) {
        alert("Book already added to list");
        return;
      }
    }
  }
  submitBook();
}

function preventRefresh(event) {
  console.log("preventing refresh");
  event.preventDefault();
}

function submitBook() {
  console.log("submitting book");
  let title = document.getElementById('title_input').value;
  let commentary = document.getElementById('commentary_input').value;
  removeTab("New Book");
  addBook(title, commentary);
  removePanel("New Book");
}
