const socket = io('http://4.204.24.46:8000')
let username = ""
username = prompt("Please enter your name")
let l1=[]
let l2=[]

if (username != null){
    l1 = username.split("")
    l2 = l1.filter((element)=>{
        if (element !== "" || element !== " "){
            return true
        }
        return false
    })
    
    
}


while (username == null || l2.length === 0){
    username = prompt("Please enter a valid name")
    if (username != null){
        l1 = username.split("")
        l2 = l1.filter((element)=>{
            if (element !== " "){
                return true
            }
            return false
        })
        
    }
}
        

const addSideEntry = (Name,id)=>{
    document.querySelector(".side").insertAdjacentHTML("beforeend", `<div class="entry" id = ${id}>${Name} <span class="hide"> (typing...)</div>`)
}

addSideEntry(`${username} : You`, socket.id)
socket.emit('new-user-joined', username)

socket.on("users-update",  users=>{
    for (const key in users) {
            const element = users[key];
            addSideEntry(element,key)
        }   
    })
    
    const addJoin = (Name, customMessage)=>{
        document.querySelector(".container").insertAdjacentHTML("beforeend", `<div class="custom"><div class="msg">${Name} ${customMessage}</div></div>`)
       
    }
        
    

const addComingMessage = (Name, message)=>{
    document.querySelector(".container").insertAdjacentHTML("beforeend", `<div class="coming"><div class="message left">${Name}: ${message}</div></div>`)
   
}

const addYourMessage = (message)=>{
    document.querySelector(".container").insertAdjacentHTML("beforeend", `<div class="going"><div class="message right">You: ${message}</div></div>`)
}



socket.on("user-joined", details=>{
    addJoin(details[0], "joined the chat")
    addSideEntry(details[0],details[1])
})


socket.on("user-disconnect", details=>{
    addJoin(details[0], "left the chat")
    document.getElementById(details[1]).remove()
})

document.querySelector("form").addEventListener("submit", (e)=>{
    e.preventDefault()
    let message = document.querySelector("input").value
    addYourMessage(message)
    socket.emit("send", document.querySelector("input").value)
    document.querySelector("input").value = ""
})


socket.on("receive", (details)=>{ 
    addComingMessage(`${details.Name}`,`${details.msg}`)
})


document.querySelector(".speak").addEventListener("click", async()=>{
    try{
        const useraudio = await navigator.mediaDevices.getUserMedia({audio : true})
        document.getElementById("audioplayback").srcObject = useraudio;
        document.getElementById("audioplayback").play()

    }catch{
        console.log("Microphone access denied!")
    }

})


document.querySelector(".users").addEventListener("click", (e)=>{
    e.stopPropagation()
    document.querySelector(".side").classList.toggle("show")
    document.body.classList.add("dark")
}
)

document.addEventListener("click", ()=>{
    document.querySelector(".side").classList.remove("show")
    document.body.classList.remove("dark")
})

document.querySelector(".side").addEventListener("click", (e)=>{
    e.stopPropagation()
})

// Select the container element
const container = document.querySelector('.container');

// Function to scroll to the bottom of the container
function scrollToBottom() {
    container.scrollTop = container.scrollHeight;
}

// Set up the MutationObserver to detect when a new child is added
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // New element(s) added, scroll to the bottom
            scrollToBottom();
        }
    }
});

// Configure the observer to listen for child nodes being added
observer.observe(container, { childList: true });


document.getElementById("messageInp").addEventListener("input" ,()=>{
    socket.emit("focused",socket.id)
})

socket.on("typing", (ids)=>{
    console.log(ids)
    document.getElementById(ids).firstElementChild.classList.remove("hide")
})
    




