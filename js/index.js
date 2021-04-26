import 'regenerator-runtime/runtime';

import {Api} from './api.js';
import {BooksUI} from './books-ui.js';
import {Variables} from './variables.js';
import {ToReadUI} from './to-read.js'

new BooksUI(new Api());
new ToReadUI();
const booksList = ToReadUI.getFromLocalStorage();
window.addEventListener('load', ToReadUI.renderReadList(booksList));
let readListList = document.getElementById("readListList");
      readListList.addEventListener("click", ToReadUI.markAsRead);
      readListList.addEventListener("click", ToReadUI.removeFromList);
