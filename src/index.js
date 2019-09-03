// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", main);

function main(){
    queryQuoteList()
    let quotesForm = document.getElementById("new-quote-form");
    quotesForm.onsubmit = (e) => {
        e.preventDefault();
        let quoteText = e.target[0].value;
        console.log(e.target[0].value)
        console.log(e.target[1].value)

        addQuote(e);
        e.target.reset();
    }   
    
}
queryQuoteList = (quoteText) => {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then( response => response.json())
    .then( results => displayQuotes(results))
}

displayQuotes = (quotesArray) => {
    let quotesList = document.getElementById("quote-list")
    quotesArray.forEach(quote => {
        let li = document.createElement("li")
        li.className = "quote-card"
        let blockquote = document.createElement("blockquote")
        blockquote.id = quote.id
        blockquote.className = "blockquote"
        let quoteContent = document.createElement("p")
        p.className = "mb-0"
        p.innerText = quote.quote
        let footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author
        let docBreak = document.createElement("br")
        let likeBtn = document.createElement("button")
        likeBtn.classList.add = "btn-success"/////////////
        likeBtn.innerText = "Likes:"
        let likeNumber = document.createElement("span")
        likeNumber.innerText = quote.likes.length

        likeBtn.onclick = (e) => {
            //optimistic
            quote.likes.push(1)
            likeNumber.innerText = quote.likes.length    
            quoteID = e.target.parentNode.id
            incrementLikes(quoteID)
        }

        let deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerText = "Delete"
        deleteBtn.onclick = e => {
            e.target.parentNode.parentNode.remove()
        }




        quotesList.appendChild(li)
        li.appendChild(blockquote)
        blockquote.appendChild(quoteContent)
        blockquote.appendChild(footer)
        blockquote.appendChild(docBreak)
        blockquote.appendChild(likeBtn)
        likeBtn.appendChild(likeNumber)
        blockquote.appendChild(deleteBtn)

    })

    function incrementLikes(quoteID){
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteId: parseInt(quoteID),
                createdAt: Date.now()
            })
        })
        // pessimistic
        // .then(response => response.json())
        // .then(results => updateComment(results))
    }

    // updateComment = results => {
    //     update the DOM
    // }
}


