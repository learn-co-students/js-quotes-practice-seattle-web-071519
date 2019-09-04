document.addEventListener("DOMContentLoaded", main)

const baseURL = 'http://localhost:3000'
const embedLink = "http://localhost:3000/quotes?_embed=likes"


function main(event){
    event.preventDefault()
    listQuotes()
    newQuote()
}

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
    
    let p = document.createElement("p")
    p.setAttribute("class", "mb-0")
    p.setAttribute("id", `quote-${quote.id}`)
    p.textContent = quote.quote
    
    let footer = document.createElement("footer")
    footer.setAttribute("class", "blockquote-footer")
    footer.setAttribute("id", `auth-${quote.id}`)

    footer.textContent = quote.author
    
    let likeBtn = createLikeBtn(quote)
    
    let btnDanger = document.createElement("button")
    btnDanger.setAttribute('class', 'btn-danger')
    btnDanger.setAttribute('id', quote.id)
    btnDanger.textContent = "Delete"
    btnDanger.addEventListener("click", deleteQuote)
    
    let editBtn = document.createElement("button")
    editBtn.setAttribute('id', quote.id)
    editBtn.textContent = "Edit"
    editBtn.addEventListener("click", hideForm)
    
    let editForm = createEditForm(quote)

    let editDiv = document.createElement('div')
    editDiv.appendChild(editForm)
    editDiv.appendChild(editBtn)

    
    li.appendChild(block)
    block.appendChild(p)
    block.appendChild(footer)
    block.appendChild(likeBtn)
    block.appendChild(document.createElement("br"))
    block.appendChild(btnDanger)
    block.appendChild(editDiv)
    return li
    
}

function createLikeBtn(quote){
    let span = document.createElement("span")
    span.textContent = quote.likes.length
    
    let likeBtn = document.createElement("button")
    likeBtn.setAttribute('class', 'btn-success')
    likeBtn.setAttribute("id", quote.id)
    likeBtn.textContent = "Likes: "
    likeBtn.onclick = e => {
        quote.likes.push(1);
        span.textContent = quote.likes.length
        createLike(quote)
    }
    
    likeBtn.appendChild(span)
    return likeBtn
    
}

function createEditForm(quote){
    let form = document.createElement("form")

    let quoteDiv = document.createElement("div")
    let quoteLabel = document.createElement("label")
    quoteLabel.setAttribute('for', 'edit-quote')

    let quoteField = document.createElement('input')
    quoteField.setAttribute('type', 'text-area')
    quoteField.classList.add('form-control')
    quoteField.setAttribute('for', 'edit-quote')
    quoteField.setAttribute('placeholder', quote.quote)
    quoteField.setAttribute('id', `edit-quote-${quote.id}`)

    quoteDiv.appendChild(quoteLabel)
    quoteDiv.appendChild(quoteField)



    let authDiv = document.createElement("div")
    let authLabel = document.createElement("label")
    authLabel.setAttribute('for', 'edit-auth')

    let authField = document.createElement('input')
    authField.setAttribute('type', 'text')
    authField.classList.add('form-control')
    authField.setAttribute('for', 'edit-auth')
    authField.setAttribute('placeholder', quote.author)
    authField.setAttribute('id', `edit-auth-${quote.id}`)

    authDiv.appendChild(authLabel)
    authDiv.appendChild(authField)
    
    let submitBtn = document.createElement("button")
    submitBtn.classList.add('btn', 'btn-primary')
    submitBtn.setAttribute('type', 'submit')
    submitBtn.textContent = 'Submit Change'
    submitBtn.addEventListener('click', event => {
        hideForm(event)

        let newText = event.target.parentNode.children[0].children[1].value
        console.log(newText)
        quote.quote = newText
        let p = document.getElementById(`quote-${quote.id}`)
        p.textContent = newText

        let newAuth = event.target.parentNode.children[1].children[1].value
        console.log(newAuth)
        quote.author = newAuth
        let footer = document.getElementById(`auth-${quote.id}`)
        footer.textContent = newAuth
    
        
        fetch(`${baseURL}/quotes/${quote.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type':'application/json',
                Accept: "application/json"
              },
              body: JSON.stringify({
                  'quote': newText,
                  'author': newAuth
              })
        })


    })
 
    form.appendChild(quoteDiv)
    form.appendChild(authDiv)
    form.appendChild(submitBtn)
    form.style.display="none"

    return form

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

function createLike(quote){
    fetch(`${baseURL}/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: parseInt(quote.id),
            createdAt: Date.now()
        })
    })
}


function hideForm(event) {
    event.preventDefault
    let editForm = event.target.parentNode.firstChild
    if (event.target.textContent == "Hide Form") {
        event.target.textContent = "Edit"
      editForm.style.display = 'none'
    } else if (event.target.textContent == "Edit") {
        console.log('hit')
        event.target.textContent = "Hide Form"
      editForm.style.display = 'block'
    }

} 

const sortBtn = document.getElementById('sort-btn')
sortBtn.addEventListener('click', event => {
    let ul = document.getElementById('quote-list')
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
    fetch(embedLink)
        .then(response => response.json())
        .then(quotes => {
            sortedQuotes = quotes.sort((a, b) => {
                return a.author.localeCompare(b.author)
            })
            console.log(sortedQuotes)
            sortedQuotes.forEach(quote => {
                let card = createQuoteCard(quote)
                ul.appendChild(card)
            })
        })
})

