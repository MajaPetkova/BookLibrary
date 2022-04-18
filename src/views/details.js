import { deleteBook, getAllBooks, getBookById, getLikesByBookId, getMyLikeByBookId } from '../api/data.js';
import { html } from '../lib.js'
import { getUserData } from '../util.js';

const detailsTemplate = (book, isOwner, onDelete, likes, hasLike) => html `
<section id="details-page" class="details">
<div class="book-information">
    <h3>${book.title}</h3>
    <p class="type">Type: ${book.type}</p>
    <p class="img"><img src=${book.imageUrl}></p>
    <div class="actions">
       ${bookControlTemplate(book, isOwner, onDelete)}
       ${likeControlTemplate(isOwner,hasLike)} 
      
        <div class="likes">
            <img class="hearts" src="/images/heart.png">
            <span id="total-likes">Likes: ${likes}</span>
        </div>
       
    </div>
</div>
<div class="book-description">
    <h3>Description:</h3>
    <p>${book.description}</p>
</div>
</section>`;

const bookControlTemplate = (book, isOwner, onDelete) => {
    if (isOwner) {
        return html `<!-- Edit/Delete buttons ( Only for creator of this book )  -->
        <a class="button" href="/edit/${book._id}">Edit</a>
        <a @click=${onDelete} class="button" href="javascript:void(0)">Delete</a>`
    } else {
        return null
    }
};


const likeControlTemplate = (isOwner, hasLike) => {
    if (isOwner || hasLike) {
        return null
    } else {
        return html `<a class="button" href="javascript:void(0)">Like</a>`
    }
}

export async function detailsPage(ctx) {
    // const book = await getBookById(ctx.params.id); //koga ne prajme za bonus
    const userData = getUserData()

    const [book, likes, hasLike] = await Promise.all([
        getBookById(ctx.params.id),
        getLikesByBookId(ctx.params.id),
        userData ? getMyLikeByBookId(ctx.params.id, userData.id) : 0
    ])
    console.log(book, likes, hasLike)
    const isOwner = userData && userData.id == book._ownerId;


    ctx.render(detailsTemplate(book, isOwner, onDelete, likes, hasLike))

    async function onDelete() {
        const choise = confirm(`Sind Sie sicher, dass Sie loeschen wollen ${book.title}?`);
        if (choise) {
            await deleteBook(ctx.params.id);
            ctx.page.redirect('/')
        }
    }
}