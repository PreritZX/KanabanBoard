let modalCont = document.querySelector('.modal-cont')
let addBtn = document.querySelector('.add-btn')
let removeBtn = document.querySelector('.remove-btn')
let showAllBtn = document.querySelector('.show-all-btn')
let mainCont = document.querySelector('.main-cont')
let textArea = document.querySelector('.textArea-cont')

let addTaskFlag = false
let removeTaskFlag = false

let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'

let colors = ["lightpink", "lightgreen", "lightblue", "black"]

let allPriorityColors = document.querySelectorAll('.priority-colors')
let modalPriorityColor = 'black'
let toolboxColors = document.querySelectorAll('.color')
let ticketArr = []

// LOCAL STORAGE

if(localStorage.getItem('tickets')){
    ticketArr = JSON.parse(localStorage.getItem('tickets'))
    ticketArr.forEach(function(ticket){
        createTicket(ticket.text, ticket.ticketColor, ticket.ticketID)
    })
}

//Making tasks visible according to colors

for(let i=0; i<toolboxColors.length; i++){
    toolboxColors[i].addEventListener('click', function(){
        let selectedToolboxColor = toolboxColors[i].classList[0]

        let filteredTickets = ticketArr.filter(function(ticket){
            return selectedToolboxColor == ticket.ticketColor
        })

        let allTickets = document.querySelectorAll('.ticket-cont')

        for(let i=0; i<allTickets.length; i++){
            allTickets[i].remove()
        }

        filteredTickets.forEach(function(filteredTicket){
            createTicket(filteredTicket.text, filteredTicket.ticketColor, filteredTicket.ticketID)
        })
    })
}


showAllBtn.addEventListener('click', function(){
    showAllTickets()
})


function showAllTickets(){
    // removing from UI
    let allTickets = document.querySelectorAll(".ticket-cont");

    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }

    // fetching from local storage
    ticketArr.forEach(function(ticketObject){
        createTicket(ticketObject.text, ticketObject.ticketColor, ticketObject.ticketID)
    })
}


allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[1]
    })
})


addBtn.addEventListener('click' , function(){
    // Display the model
    showAllTickets()
    addTaskFlag = !addTaskFlag
    if(addTaskFlag == true){
        modalCont.style.display = 'flex'
    }
    else{
        modalCont.style.display = 'none'
    }

})

removeBtn.addEventListener('click', function(){
    removeTaskFlag = !removeTaskFlag
    if(removeTaskFlag == true){
        alert('Delete button has been activated')
        removeBtn.style.color = 'red'
    }
    else{
        removeBtn.style.color = 'white'
    }
    
})

modalCont.addEventListener('keydown', function(e){
    if(e.key == 'Shift'){
        createTicket(textArea.value , modalPriorityColor)
        modalCont.style.display = 'none'
        textArea.value = ''
    }
})

function createTicket(text, ticketColor, ticketID){

    let id = ticketID || shortid()

    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${text}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`

    mainCont.appendChild(ticketCont)

    handleRemoval(ticketCont, id)

    handleLock(ticketCont, id)

    handleColor(ticketCont, id)

    if(!ticketID){
        ticketArr.push({text, ticketColor, ticketID:id})
        localStorage.setItem('tickets',JSON.stringify(ticketArr))
    }

}

function handleRemoval(ticket, id){
    ticket.addEventListener('click', function(){

        if(!removeTaskFlag) return

        let ticketIdx = getTicketIdx(id)
        ticket.remove() // UI removal
        
        let itemToBeDeleted = ticketArr.splice(ticketIdx,1)
        localStorage.setItem('tickets',JSON.stringify(ticketArr))
    })
}

function handleLock(ticket,id){
    
    let ticketLockElem = ticket.querySelector('.ticket-lock')
    let ticketLockIcon = ticketLockElem.children[0]
    let ticketTaskArea = ticket.querySelector('.task-area')

    ticketLockIcon.addEventListener('click', function(){

        let ticketIdx = getTicketIdx(id)
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass)
            ticketLockIcon.classList.add(unlockClass)
            ticketTaskArea.setAttribute('contenteditable' , 'true')
        }
        else{
            ticketLockIcon.classList.remove(unlockClass)
            ticketLockIcon.classList.add(lockClass)
            ticketTaskArea.setAttribute('contenteditable' , 'false')
        }

        ticketArr[ticketIdx].text = ticketTaskArea.innerText
        localStorage.setItem('tickets',JSON.stringify(ticketArr))
    })
}


function handleColor(ticket, id){
    let ticketColorBand = ticket.querySelector('.ticket-color')
    
    ticketColorBand.addEventListener('click', function(){
        let ticketIdx = getTicketIdx(id)

        let currentColor = ticketColorBand.classList[1]
        ticketColorBand.classList.remove(currentColor)
        let index = colors.indexOf(currentColor)

        if(index == 3){
            index = 0
        }
        else{
            index = index + 1
        }
        
        ticketColorBand.classList.add(colors[index])
        ticketArr[ticketIdx].ticketColor = colors[index]
        localStorage.setItem('tickets',JSON.stringify(ticketArr))
    })
}

function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex(function(ticketObj){
          return ticketObj.ticketID === id
    })
    return ticketIdx
 }
