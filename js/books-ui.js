import {
    ToReadUI
} from './to-read.js';

export class BooksUI {
    api;
    currentPage = [];
    searchResultHolder;
    bookInfoHolder;
    pageNum = 1;
    constructor(api) {
        this.searchResultHolder = document.getElementById("searchResultHolder");
        this.bookInfoHolder = document.getElementById("bookInfoHolder");
        this.footerInfo = document.getElementById("searchBlockFooterInfo");
        this.footerPagination = document.getElementById("searchBlockFooterPagination");
        this.prevBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        this.pageNum = 1;
        const searchInput = document.getElementById("searchInput");
        const goButton = document.getElementById("goButton");
        
        let elem = this;
        const nextBtnFunc = function() {
            const querry = searchInput.value;           
            elem.pageNum = String(parseInt(elem.pageNum)+1);             
            api.search(querry, elem.pageNum).then(nextPage => {
                elem.processSearchResult(nextPage);                   
                elem.footerInfo.innerHTML = elem.renderColumnFooter(nextPage);                
                elem.prevBtn.className = "prev-btn-show";
               let pagesCount = Math.trunc(nextPage.numFound/100);
               let currentPage = nextPage.start/100;
               if (pagesCount == currentPage) {
                elem.nextBtn.className = "next-btn-hide";
            } else {elem.nextBtn.className = "next-btn-show";}
            });  
            elem.checkSelectedBook(elem);          
        }        
        nextBtn.addEventListener("click", nextBtnFunc);

        const prevBtnFunc = function() {        
            const querry = searchInput.value;
            elem.pageNum = String(parseInt(elem.pageNum)-1);                
               api.search(querry, elem.pageNum).then(prevPage => {
                elem.processSearchResult(prevPage);                      
                elem.footerInfo.innerHTML = elem.renderColumnFooter(prevPage);                      
                  if (elem.pageNum == "1") {
                    elem.prevBtn.className = "prev-btn-hide";
                  } else {
                    elem.prevBtn.className = "prev-btn-show";
                  }
                  elem.nextBtn.className = "next-btn-show";                      
        });
        elem.checkSelectedBook(elem); 
      }
        prevBtn.addEventListener("click", prevBtnFunc);

        goButton.addEventListener("click", () => {
            const querry = searchInput.value;
            this.pageNum = 1;
            if (!querry) {
                return;
            }
            api.search(querry, String(this.pageNum)).then(page => {
                this.processSearchResult(page);               
                this.footerInfo.innerHTML = this.renderColumnFooter(page);
                this.nextBtn.className = "next-btn-show";                 
            });           
           
            this.checkSelectedBook(this);
            this.bookInfoHolder.innerHTML = "";
            
        });

        searchInput.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("goButton").click();
            }
        });


        this.searchResultHolder.addEventListener("click", event => {
            // console.log(event.target.id);
            const targetDiv = event.target;
            const id = targetDiv.id;
            const selectedBook = this.currentPage.find(item => item.id === id);
            
             if (!selectedBook) {
                return;
            }

            if (this.selectedBook) {
                const selectedBook = this.searchResultHolder.querySelector(
                    "#" + this.selectedBook.id
                );
                selectedBook.classList.remove("select-book");
            }
            this.selectedBook = selectedBook;
            targetDiv.classList.add("select-book"); 
            let bookLanguages = "";
            let bookAuthor = "";
            let publishYear = "";
            let firstPublishYear = "";
            if (!selectedBook.language) {
                bookLanguages = "no info about language";
            } else {bookLanguages = selectedBook.language.join(", ");}
            if (!selectedBook.author_name) {
                bookAuthor = "no info about author";
            } else {
                bookAuthor = selectedBook.author_name[0]; 
            }
            if (!selectedBook.publish_year) {
                publishYear = "no info about publish years";
            } else {publishYear = selectedBook.publish_year.join(", ");}
            if (!selectedBook.first_publish_year) {firstPublishYear = "no info about publish year";
        } else {firstPublishYear = selectedBook.first_publish_year;}
            this.bookInfoHolder.innerHTML = `
          <h2 class="selected-book-title">${selectedBook.title}</h2>
          <div class="selected-book-subtitle">${selectedBook.subtitle || ""}</div>
          <div>${bookAuthor}</div>
          <div>Languages available: ${bookLanguages}</div>
          <div>Full text available: ${selectedBook.has_fulltext}</div>
          <div>First publish year: ${firstPublishYear}</div>
          <div>Years published: ${publishYear}</div>
          <button id="toReadListBtn" class="toread-list-btn">Add book to Read List</button>          
          `;

            const addToReadListBtn = document.getElementById("toReadListBtn");
            addToReadListBtn.addEventListener("click", event => {
                let selectedBooksList = ToReadUI.getFromLocalStorage();
                selectedBook.read = false;
                selectedBooksList.push(selectedBook);                
                ToReadUI.addNewBookToLocalStorage(selectedBook)
                const readList = document.getElementById("readListList");
                selectedBooksList = ToReadUI.getFromLocalStorage();
                ToReadUI.renderReadList(selectedBooksList);
            });

            
        });
       
    }


    processSearchResult(page) {
        page.docs.forEach(item => {
            item.id = item.key.split("/").pop();
        });

        this.currentPage = page.docs;

        const booksHTML = page.docs.reduce((acc, item) => {
            let bookLanguage = "";
            if (item.language) {
                bookLanguage = item.language[0]; 
            }
            return (
                acc +
                `
          <div id ="${item.id}" class="book-info">${item.title}(${bookLanguage})</div>
          `
            );
        }, "");
        this.searchResultHolder.innerHTML = booksHTML;
    }

    renderColumnFooter(page) {
      return  `
        <span>Found: ${page.numFound}</span>
        <span>Start: ${page.start}</span>
        <span>Page size: ${page.docs.length}</span>
        `;
    }
    
    checkSelectedBook(book) {
        if (book.selectedBook) {
            const selectedBook = book.searchResultHolder.querySelector(
                "#" + book.selectedBook.id
            );
            selectedBook.classList.remove("select-book");
            delete book.selectedBook; 
           } 
    }
    
}