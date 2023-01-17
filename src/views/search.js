import { searchBooks } from "../api/data.js";
import {html } from "../lib.js";
import { bookPreview } from "./common.js";

const searchTemplate= (books, onSearch, params = "") => html `<section id="search-page" class="dashboard">
<h1>Search results</h1>

<form @submit=${onSearch} class="search-form">
    <input type="text" name="search" .value=${params} />
    <input class="search-btn" type="submit" value="Search" />
</form>
${books.length == 0
    ? html`<p class="no-books">No books found!</p>`
    : html`<ul class="other-books-list">
   ${books.map(bookPreview)}
     </ul>`}
</section>`;


export async function searchPage(ctx){
const params= ctx.querystring.split("=")[1];
let books= [];

if(params){
   books= await searchBooks(decodeURIComponent(params))
}

ctx.render(searchTemplate(books, onSearch, params));

function onSearch(ev){
    ev.preventDefault();
    const formData= new FormData(ev.target);
    const searchInput= formData.get("search");

    if(searchInput){
        ctx.page.redirect("/search?query=" + encodeURIComponent(searchInput));
    }
}

}