// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const QUOTES = 'http://localhost:3000/quotes?_embed=likes'

document.addEventListener("DOMContentLoaded", main)

function main(){
    getQuotes()
}

getQuotes = () => {
    let quotePane = document.getElementById("quote-list")
    while (quotePane.hasChildNodes()){
        quotePane.removeChild(quotePane.lastChild)
    }
    fetch(QUOTES)
    .then(response => response.json())
    .then(quotes => displayQuotes(quotes))
}

displayQuotes = quotes => {
    quotes.forEach(quote => buildQuoteContent(quote))
}

buildQuoteContent = quote => {
    let quotePane = document.getElementById("quote-list")
    
    let quoteCard = document.createElement('li')
    quoteCard.id = quote.id
    quoteCard.classList.add('quote-card')
    
    let blockQuote = document.createElement('blockquote')
    blockQuote.classList.add('blockquote')
    
    let quoteContent = document.createElement('p')
    quoteContent.innerText = quote.quote
    
    let quoteFooter = document.createElement('footer')
    quoteFooter.classList.add('blockquote-footer')
    quoteFooter.innerText = quote.author
    
    let docBreak = document.createElement('br')
    
    let likeButton = document.createElement('button')
    likeButton.classList.add('btn-success')
    likeButton.innerText = "Likes:"
    
    let likeCount = document.createElement("span")
    likeCount.innerText = quote.likes.length

    likeButton.onclick = (e) => {
        console.log(e.target.lastChild)
        // debugger
        quote.likes.push(1)
        likeCount.innerText = quote.likes.length
        quoteID = e.target.parentNode.id
        console.log(quote.id)
        incrementLikes(quote.id)
        
    }
    
    let deleteButton = document.createElement('button')
    deleteButton.classList.add('btn-danger')
    deleteButton.innerText = "Delete"


    deleteButton.onclick = (e) => {
        
        console.log(e)
        let id = e.target.parentNode.parentNode.id
        console.log(id)
        fetch(`http://localhost:3000/quotes/${id}`,{
            method: "DELETE"
        })
        // quoteCard.remove()
        e.target.parentNode.parentNode.remove()
    }

    


    quotePane.appendChild(quoteCard)
    quoteCard.appendChild(blockQuote)
    blockQuote.appendChild(quoteContent)
    blockQuote.appendChild(quoteFooter)
    blockQuote.appendChild(docBreak)
    blockQuote.appendChild(likeButton)
    likeButton.appendChild(likeCount)
    blockQuote.appendChild(deleteButton)

    
}

let newQuoteForm = document.getElementById("new-quote-form")
newQuoteForm.onsubmit = e =>{
    e.preventDefault()
    console.log(e.target[0].value)
    console.log(e.target[1].value)
    fetch('http://localhost:3000/quotes',{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            // id: '',
            quote: e.target[0].value,
            author: e.target[1].value
        })
    }).then(resp => getQuotes())

   
    
}
incrementLikes = quoteID => {
    console.log(quoteID)
    fetch('http://localhost:3000/likes',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(quoteID),
            createdAt: Date.now()
        })
    })
}
