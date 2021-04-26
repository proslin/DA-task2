import {
    ToReadUI
} from './to-read.js';

export class BooksUI {
    api;
    currentPage = [];
    searchResultHolder;
    bookInfoHolder;
    constructor(api) {
        this.searchResultHolder = document.getElementById("searchResultHolder");
        this.bookInfoHolder = document.getElementById("bookInfoHolder");
        this.footerInfo = document.getElementById("searchBlockFooterInfo");
        this.footerPagination = document.getElementById("searchBlockFooterPagination");
        this.prevBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        const searchInput = document.getElementById("searchInput");
        const goButton = document.getElementById("goButton");
        


        goButton.addEventListener("click", () => {
            const querry = searchInput.value;
            if (!querry) {
                return;
            }
            api.search(querry).then(page => {
                this.processSearchResult(page);
               console.log(api);
                console.log(page);
                console.log(this);
                this.footerInfo.innerHTML = `
                <span>Found: ${page.numFound}</span>
                <span>Start: ${page.start}</span>
                <span>Page size: ${page.docs.length}</span>
                `;
                //сделать кнопки видимыми прев некст
                this.nextBtn.className = "next-btn-show "; 
                //this.nextBtn = document.getElementById("nextBtn");
            nextBtn.addEventListener("click", event => {
                console.log(this);
                console.log(page);
               let nextPage = page.start + 100; 
               let pageNum = String(nextPage/100+1);
                console.log(page.start);
                api.search(querry, pageNum).then(nextpage => {
                    this.processSearchResult(nextpage);
                   console.log(api);
                    console.log(nextpage);
                    console.log(this);
                    this.footerInfo.innerHTML = `
                    <span>Found: ${nextpage.numFound}</span>
                    <span>Start: ${nextpage.start}</span>
                    <span>Page size: ${nextpage.docs.length}</span>
                    `;
                   //сделать кнопки видимыми прев некст
                   this.prevBtn.className = "prev-btn-show";
                   this.nextBtn.className = "next-btn-show ";
                });
            }); 
          });
            
            
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
           // console.log(selectedBook);
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
            this.bookInfoHolder.innerHTML = `
          <h2>${selectedBook.title}</h2>
          <div>${selectedBook.subtitle}</div>
          <div>Languages available: ${selectedBook.language.join(", ")}</div>
          <div>Full text available: ${selectedBook.has_fulltext}</div>
          <div>First publish year: ${selectedBook.first_publish_year}</div>
          <div>Years published: ${selectedBook.publish_year.join(", ")}</div>
          <button id="toReadListBtn">Add book to Read List</button>          
          `;

            const addToReadListBtn = document.getElementById("toReadListBtn");
            addToReadListBtn.addEventListener("click", event => {
                let selectedBooksList = ToReadUI.getFromLocalStorage();
                selectedBook.read = false;
                selectedBooksList.push(selectedBook);

                //ToReadUI.setToLocalStorage(selectedBooksList);
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
            return (
                acc +
                `
          <div id ="${item.id}" class="book-info">${item.title}</div>
          `
            );
        }, "");
        this.searchResultHolder.innerHTML = booksHTML;
    }

    
}