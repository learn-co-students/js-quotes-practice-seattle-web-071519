// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded',main)

function main(){

    sortById()

    document.getElementById('new-quote-form').onsubmit = e => {
        e.preventDefault()
        newQuote()
    }

    document.getElementById('sort').onclick = e => {toggleSort(e)}
}

function sortById(){
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(json => {
        for(let i = 0; i < json.length; i++){
            renderQuote(json[i])
        }
    })
    .then(()=>{document.getElementById('sort').textContent = 'Sort: id'})
}

function toggleSort(event){
    let quoteList = document.getElementById("quote-list")
    while (quoteList.firstChild){
        quoteList.removeChild(quoteList.firstChild)
    }

    let alphaSort = event.target.parentElement.getAttribute('alphaSort')
    if (alphaSort == 'true'){
        event.target.parentElement.setAttribute('alphaSort','false')
        sortById()
    } else{
        event.target.parentElement.setAttribute('alphaSort','true') 
        alphabetSort()
    }
}

function alphabetSort(){
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(json => {
        json = json.sort(function(a,b){ return a.author.localeCompare(b.author)})
        for(let i = 0; i < json.length; i++){
            renderQuote(json[i])
        }
    })
    .then(()=>{document.getElementById('sort').textContent = 'Sort: Alphabet'})
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

    
    let editButton = document.createElement("button")
    editButton.textContent = "Edit"
    editButton.onclick = e => {showEditForm(e)}
    blockquote.appendChild(editButton)
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

function showEditForm(event){
    event.target.style.display = 'none'
    let container = event.target.parentElement.parentElement
    console.log(container)
    let quoteEditForm = document.createElement('input')
    quoteEditForm.value = container.firstChild.firstChild.textContent
    quoteEditForm.setAttribute('id','quoteEditForm')
    quoteEditForm.setAttribute('class',"form-control")
    container.appendChild(quoteEditForm)

    let authorEditForm = document.createElement('input')
    authorEditForm.setAttribute('id','authorEditForm')
    authorEditForm.setAttribute('class',"form-control")
    authorEditForm.value = container.firstChild.children[1].textContent
    
    container.appendChild(authorEditForm)

    let submitButton = document.createElement('button')
    submitButton.innerText = 'Submit'
    submitButton.setAttribute('id','submitEdit')
    container.appendChild(submitButton)


    let quoteId = container.getAttribute("quote-id")

    submitButton.onclick = e => {
        completeEdit(quoteId, e.target,event.target)
    }
}

function completeEdit(quoteId,submitButton,editButton){
    editButton.style.display = 'inline'

    let authorDisplay = submitButton.previousSibling 
    let quoteDisplay = authorDisplay.previousSibling

    let quoteOnPage = submitButton.parentElement.firstChild.children[0]
    let authorOnPage = submitButton.parentElement.firstChild.children[1]

    fetch(`http://localhost:3000/quotes/${quoteId}`,{
        method: "PATCH",
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'quote': quoteDisplay.value,
            'author': authorDisplay.value

        })
    })
    .then(response => response.json())
    .then(json => {
       quoteOnPage.innerText = json.quote
        authorOnPage.textContent = json.author
        
    })



    authorDisplay.style.display = 'none'
    quoteDisplay.style.display = 'none'
    submitButton.style.display = 'none'
}