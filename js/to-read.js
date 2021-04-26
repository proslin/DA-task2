///import {BooksUI} from './books-ui.js';

export class ToReadUI {
   
    

   static getFromLocalStorage() {
      let booksList = JSON.parse(localStorage.getItem("booksList")) || [];
      return booksList;
       
   }

   static setToLocalStorage(booksList) {
      localStorage.setItem("booksList", JSON.stringify(booksList));
   }
   
   static addNewBookToLocalStorage(bookToAdd) {
    let booksList = ToReadUI.getFromLocalStorage();
    //найти по id нет ли этой книги в списке
    let resultBookIndex = booksList.findIndex(item => item.id === bookToAdd.id);
    if (resultBookIndex == -1) {
      booksList.push(bookToAdd);
      ToReadUI.setToLocalStorage(booksList);
    } else {
      alert("Книга уже есть в списке");
    }

   }

   static getBooksCount() {
    let booksList = ToReadUI.getFromLocalStorage();
    return booksList.length;
   }

   static getReadBooksCount() {
    let booksList = ToReadUI.getFromLocalStorage();
    let readBooksList = booksList.filter(item => item.read ==true);    
   return readBooksList.length;
   }

   static renderHeaderReadList() {
    const readListHeader = document.getElementById("readListHeader"); 
    readListHeader.innerHTML = `To read list...
    <div class = "books-count">
    <span>${ToReadUI.getBooksCount()} books</span>
    <span>${ToReadUI.getReadBooksCount()} read</span>
    </div>`;
   }

   static renderReadList(booksList) {
      
    ToReadUI.renderHeaderReadList()
    const readList = document.getElementById("readListList");     
       const readBooksHTML = booksList.reduce((acc, item) => {
       let authorName = "";
       if (!item.author_name) {
        authorName = "no info about author";
       } else {
        authorName = item.author_name[0];
       };
       let language = "";
       if (!item.language) {
        language = "";
       } else {
        language = item.language[0];
       };
       if (item.read) {
         return (
       acc + 
       `
       <div id="${item.id}" class="read-list-item mark-as-read"> 
       <h3 id ="toRead" class="read-book-info">${item.title}(${language})</h3>
        <p class="read-book-subtitle">${item.subtitle || ""}</p>
        <p>${authorName}</p>
        </div>
        `
        );
      } else {
         return (
            acc + 
            `
            <div class="read-list-item"> 
            <h3 id ="toRead" class="read-book-info">${item.title}(${language})</h3>
             <p>${item.subtitle || ""}</p>
             <p>${authorName}</p>
             <button id="markAsReadBtn/${item.id}" class="read-list-btn">Mark as read</button>
             <button id="RemoveFromListBtn/${item.id}" class="read-list-btn">Remove from list</button>
             </div>
             `
             );
      }
    }, "");
    readList.innerHTML =readBooksHTML;
   }

   static markAsRead(){ 
    if (event.target.id.includes("markAsReadBtn")) {
    let bookId = event.target.id.split("/").pop();
    console.log(bookId.split("/").pop());

    let booksList = ToReadUI.getFromLocalStorage();
    console.log(booksList);
    //найденная книга
    let resultBook = booksList.find(item => item.id === bookId);
    resultBook.read = true;
    ToReadUI.setToLocalStorage(booksList);
    console.log(booksList);
    //booksList = ToReadUI.getFromLocalStorage();
    ToReadUI.renderReadList(booksList);
    }
  }

  static removeFromList() {
    
    if (event.target.id.includes("RemoveFromListBtn")) {
      let bookId = event.target.id.split("/").pop();
    console.log(bookId.split("/").pop());

    let booksList = ToReadUI.getFromLocalStorage();
    console.log(booksList);
    //найденная книга
    let resultBookIndex = booksList.findIndex(item => item.id === bookId);
    booksList.splice(resultBookIndex, 1);
    ToReadUI.setToLocalStorage(booksList);
    //booksList = ToReadUI.getFromLocalStorage();
    ToReadUI.renderReadList(booksList);
    }
  }



}