// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", main)

function main() {
    fetchQuotes()
    // add event listener to form
    let quoteForm = document.querySelector("#new-quote-form")
    quoteForm.onsubmit = (e) => {
        e.preventDefault()
        addNewQuote(e)
    }
}

fetchQuotes = () => {
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(response => response.json())
    .then(quotesData => displayQuotes(quotesData))
    .catch(error => console.log(error))
}

displayQuotes = (quotesData) => {
    let ul = document.querySelector("#quote-list")
    let sortBtn = document.createElement("button")
    let div = document.querySelector("#div")
    div.prepend(sortBtn)

    if (sortBtn.innerText == "") {
        // debugger
        sortBtn.innerText = "Sort Alphabetically By Author: Off"
    } else {
        div.removeChild(sortBtn)
    }
    sortBtn.addEventListener("click", sortQuotes(quotesData))
    

    while (ul.firstChild) {
        ul.firstChild.remove()
    }

    // debugger
    // create li with class "quote-card"
    // create blockquote tag with class "blockquote"
    // create p tag with class mb-0?
    // create footer with class "blockquote-footer"
    // add line break
    // create likes button with class "btn-success"
    // create delete button with class "btn-danger"
    // end li tag
    quotesData.forEach( quote => {
        let liQuote = document.createElement("li")
        liQuote.className = "quote-card"

        let quoteHolder = document.createElement("blockquote")
        quoteHolder.className = "blockquote"

        let quoteText = document.createElement("p")
        quoteText.className = "mb-0"
        quoteText.textContent = quote.quote 

        let quoteFooter = document.createElement("footer")
        quoteFooter.className = "blockquote-footer"
        quoteFooter.textContent = quote.author

        let quoteHr = document.createElement("hr")

        let likesBtn = document.createElement("button")
        likesBtn.className = "btn-success"
        likesBtn.textContent = "Likes: "
        likesBtn.addEventListener("click", likeQuote(quote))

        let likesCount = document.createElement("span")
        likesCount.innerText = quote.likes.length
        

        let deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.textContent = "Delete"
        deleteBtn.addEventListener("click", deleteQuote(quote))

        //edit quote button
        let editBtn = document.createElement("button")
        editBtn.className = "btn-info"
        editBtn.textContent = "Edit Quote"
        editBtn.addEventListener("click", editQuote(quote))

        // append stuff
        likesBtn.appendChild(likesCount)
        quoteHolder.appendChild(quoteText)
        quoteHolder.appendChild(quoteFooter)
        quoteHolder.appendChild(quoteHr)
        quoteHolder.appendChild(likesBtn)
        quoteHolder.appendChild(deleteBtn)
        quoteHolder.appendChild(editBtn)

        liQuote.appendChild(quoteHolder)

        ul.appendChild(liQuote)

    })
}

function sortQuotes(quotesData) {
    return function(e) {
        // debugger
        if (e.target.innerText == "Sort Alphabetically By Author: Off") {
            e.target.innerText = "Sort Alphabetically By Author: On"
            let authors = []
            let sortedAuthors = quotesData.sort(function (quoteA, quoteB) {
                if (quoteA.author < quoteB.author) {
                    return -1
                } else if (quoteA.author > quoteB.author) {
                    return 1
                } else {
                    return 0
                }
            })
            displayQuotes(sortedAuthors)
        } else {
            e.target.innerText = "Sort Alphabetically By Author: Off"
            fetchQuotes()
        }
        // console.log(quotesData)
        //gets rid of extra sort button that gets added when displayQuotes is called!
        e.target.parentElement.firstChild.remove()

        // debugger
    }
}

function addNewQuote(e) {
    let newQuoteText = e.target.children[0].children[1].value
    let newQuoteAuthor = e.target.children[1].children[1].value
    // debugger
    fetch(`http://localhost:3000/quotes`, {
        method: `POST`,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quote: newQuoteText,
            author: newQuoteAuthor
        })
    }).catch(errors => console.log(errors))
    .then(response => console.log(response))
    .then(quoteData => {
        fetchQuotes()
    })
    // debugger
}

function likeQuote(quote) {
    return function(e) {
        let quoteId = parseInt(quote.id)
        let numLikes = e.target.children[0]
        let spanText = numLikes.textContent
        spanText = (parseInt(spanText) + 1).toString()
        numLikes.textContent = spanText
        let rightNow = Date.now()
        // debugger
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteId: quoteId,
                createdAt: rightNow
            })
        }).catch(errors => console.log(errors))
        .then(response => console.log(response))
        .then(quoteData => {
            fetchQuotes()
        })
    }
}

function deleteQuote(quote) {
    return function(e) {
        let quoteId = quote.id
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE"
        }).catch(errors => console.log(errors))
        .then(test => {
            fetchQuotes()
        })
    }
}

function editQuote(quote) {
    return function(e) {
        // debugger
        // populate edit form
        let editForm = document.createElement("form")
        editForm.className = "edit-form"
        let quoteInput = document.createElement("input")
        quoteInput.type = "text"
        quoteInput.placeholder = "Edit quote here"
        let submitBtn = document.createElement("button")
        submitBtn.textContent = "Submit"
        editForm.addEventListener("submit", updateQuote(quote))

        //append stuff
        let blockQuote = e.target.parentElement.children[0]
        editForm.appendChild(quoteInput)
        editForm.appendChild(submitBtn)
        blockQuote.appendChild(editForm)
    }
}

function updateQuote(quote) {
    return function(e) {
        e.preventDefault()
        let newQuote = e.target.children[0].value
        let quoteId = quote.id
        debugger
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quote: newQuote
            })
        }).catch(errors => console.log(errors))
        .then(response => {
            fetchQuotes()
        })
    }
}