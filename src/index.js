// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", main)

function main(event){
    event.preventDefault()
    listQuotes()
    newQuote()
}

const embedLink = "http://localhost:3000/quotes?_embed=likes"
const baseURL = 'http://localhost:3000'

function listQuotes(){
    let ul = document.getElementById('quote-list')
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
    fetch(embedLink)
        .then(response => response.json())
        .then(quotes => {
            quotes.forEach(quote => {
                let card = createQuoteCard(quote)
                ul.appendChild(card)
            })
        })
}

function createQuoteCard(quote){

    let li = document.createElement("li")
    li.setAttribute('class', 'quote-card')
    li.setAttribute("id", quote.id)
    let block = document.createElement("blockquote")
    li.appendChild(block)
    

    let p = document.createElement("p")
    p.setAttribute("class", "mb-0")
    p.textContent = quote.quote
    block.appendChild(p)

    let footer = document.createElement("footer")
    footer.setAttribute("class", "blockquote-footer")
    footer.textContent = quote.author
    block.appendChild(footer)
    block.appendChild(document.createElement("br"))

    createLikeBtn(quote, block)


    let btnDanger = document.createElement("button")
    btnDanger.setAttribute('class', 'btn-danger')
    btnDanger.setAttribute('id', quote.id)
    btnDanger.textContent = "Delete"
    btnDanger.addEventListener("click", deleteQuote)
    block.appendChild(btnDanger)


    return li
    
}

function createLikeBtn(quote, block){
    let likeBtn = document.createElement("button")
    likeBtn.setAttribute('class', 'btn-success')
    likeBtn.setAttribute("id", quote.id)
    likeBtn.textContent = "Likes: "
    likeBtn.addEventListener("click", likeQuote)
    
    let span = document.createElement("span")
    span.setAttribute("id", `span${quote.id}`)
    
    likeBtn.appendChild(span)
    block.appendChild(likeBtn)
    listLikes(quote)
}


function listLikes(quote){
    let spanId = `span${quote.id}`
    console.log(quote.id)
    let span = document.getElementById('span'+quote.id)
    
    fetch("http://localhost:3000/likes")
        .then(response => response.json())
        .then(likes => {
            let myLikes = 0
            for (i in likes){
                if (likes[i].quoteId == quote.id) {
                    myLikes++
                }
            }
            span.textContent = myLikes
        })
}


function deleteQuote(event){
    fetch(`http://localhost:3000/quotes/${event.target.id}`, {
        method: "DELETE",
    })
    let lis = document.querySelectorAll("li")
    let i = 0
    let li;
    while (!li) {
        if (lis[i].id == event.target.id){
            li = lis[i]
        }
        i++
    }
    li.parentNode.removeChild(li)
}

function newQuote(){
    let submitBtn = document.getElementById('submit-btn')
    submitBtn.addEventListener("click", event => {
        event.preventDefault()
        let quoteText = document.getElementById('new-quote').value
        let auth = document.getElementById('author').value
        let newQuote = {
            quote: quoteText,
            author: auth
        }
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                        'Content-Type': 'application/json'
                    },
            body: JSON.stringify(newQuote) 
        })
        document.getElementById('author').value = ""
        document.getElementById('new-quote').value = ""
        location.reload()
    })
}

function likeQuote(event){
    event.preventDefault()
    fetch(`${baseURL}/quotes/${event.target.id}`)
        .then(response => response.json())
        .then(quote => createLike(quote))
}

function createLike(quote){
    fetch(`${baseURL}/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id,
            createdAt: Date.now()
        })
    })
    listLikes(quote)
}
