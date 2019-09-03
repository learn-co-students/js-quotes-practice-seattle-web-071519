// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded',main)

function main(){
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(json => {
        for(let i = 0; i < json.length; i++){
            renderQuote(json[i])
        }
    })

    document.getElementById('new-quote-form').onsubmit = e => {
        e.preventDefault()
        newQuote()
    }
}

function renderQuote(quote){
    console.log(quote)
    let quoteList = document.getElementById("quote-list")

    let li = document.createElement("li")
    li.setAttribute('class','quote-card')
    li.setAttribute('quote-id',quote.id)
    quoteList.appendChild(li)
    
    let blockquote = document.createElement("blockquote")
    blockquote.setAttribute('class','blockquote')
    li.appendChild(blockquote)

    let p = document.createElement("p")
    p.textContent = quote.quote
    p.setAttribute('class','mb-0')
    blockquote.appendChild(p)
    
    let footer = document.createElement("footer")
    footer.setAttribute('class','blockquote-footer')
    footer.textContent = quote.author
    blockquote.appendChild(footer)
    
    let br = document.createElement("br")
    blockquote.appendChild(br)
    
    let sucButton = document.createElement("button")
    sucButton.setAttribute('class','btn-success')
    sucButton.textContent = 'Likes: '
    sucButton.onclick = e => {likeQuote(e)}
    blockquote.appendChild(sucButton)

    let span = document.createElement("span")
    span.textContent = 0
    sucButton.appendChild(span)
    fetch('http://localhost:3000/likes')
    .then(response => response.json())
    .then(json => {
        for (let like of json){
            if (like.quoteId == quote.id){
                span.textContent++
            }
        }
    })

    let danButton = document.createElement("button")
    danButton.setAttribute('class','btn-danger')
    danButton.textContent = "Delete"
    danButton.onclick = e => {deleteQuote(e)}

    blockquote.appendChild(danButton)
}

function newQuote(){
    let quoteField = document.getElementById('new-quote')
    let authorField = document.getElementById('author')

    if (quoteField.value !== ''){
        if (authorField.value == ''){
            authorField.value = 'Anonymous'
        }

        fetch('http://localhost:3000/quotes',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'quote': quoteField.value,
                'author': authorField.value
            })
        })
        .then(res => res.json())
        .then(json => renderQuote(json))
    }
}

function deleteQuote(event){
    let deleteId = event.target.parentElement.parentElement.getAttribute('quote-id')
    
    fetch(`http://localhost:3000/quotes/${deleteId}`,{
        method: "DELETE"
    })
    .then( () => {
    let quoteList = document.getElementById("quote-list")
    quoteList.removeChild(event.target.parentElement.parentElement)
    })
}

function likeQuote(event){
    let likeId = event.target.parentElement.parentElement.getAttribute('quote-id')
    
    fetch('http://localhost:3000/likes',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'quoteId': likeId
        })
    })
    .then(updateLikes(likeId))
}

function updateLikes(quoteId){
    let card = document.getElementById("quote-list").firstChild.nextSibling
    while (card.nodeName != 'LI' || card.getAttribute('quote-id') != quoteId){
        card = card.nextSibling
    }

    let button = card.firstChild.firstChild
    while (button.nodeName!= 'BUTTON' || button.getAttribute('class') != 'btn-success'){
        button = button.nextSibling
    }
    let span = button.firstChild.nextSibling
    span.textContent = 0
    fetch('http://localhost:3000/likes')
    .then(response => response.json())
    .then(json => {
        for (let like of json){
            if (like.quoteId == quoteId){
                span.textContent++
            }
        }
    })
}