let messages = [];
let userName = "Todos";
let privacy = "message"
let userListIntervalID;
const inputLogin = document.querySelector("input")
const inputMessage = document.querySelector(".bottom input")

inputLogin.addEventListener("keyup", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        document.querySelector(".container-1 button").click()
    }
})

inputMessage.addEventListener("keyup", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        document.querySelector(".bottom ion-icon").click()
    }
})

function logIn(){
    let user = {
        name: `${document.querySelector("input").value}`
    }
    document.querySelector("input").classList.add("hide")
    document.querySelector("button").classList.add("hide")
    document.querySelector(".load").classList.remove("hide")
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    promise.then(logon)
    promise.catch(fail)
}

function logon(){
    let intervalIDLogin = setInterval(loginMaintenance, 4000)
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(renderMessages)
    let intervalIDLoadMessages = setInterval(callMessages, 3000)
}

function loginMaintenance(){
    let user ={
        name: `${document.querySelector("input").value}`
    }
    let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status`, user)
    promise.catch(fail)
}

function fail(error){
    document.querySelector("input").value = ""
    document.querySelector(".bottom input").value = ""
    if (error.response.status === 400){
        alert("Nome já em uso! Por favor escolha outro nome.")
    }
    if (error.response.status === 500){
        alert("Perda de comunicação com o servidor.")
    }
    window.location.reload()
}

function fail2(error){
    if (error.response.status === 400){
        return
    }
}

function renderMessages(answer){
    document.querySelector("ul").innerHTML = ""
    messages = answer.data
    document.querySelector(".container-1").classList.add("hide")
    document.querySelector(".container-2").classList.remove("hide")
    for (let i = 0; i < messages.length; i++){
        if ((messages[i].type) === "status"){
            document.querySelector("ul").innerHTML += "<li><div class='messages status'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
        }
        if((messages[i].type) === "message"){
            if (messages[i].to === "Todos"){
                document.querySelector("ul").innerHTML += "<li><div class='messages all'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
            else{
                document.querySelector("ul").innerHTML += "<li><div class='messages all'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
        }
        if ((messages[i].type) === "private_message"){
            if (messages[i].to === "Todos" && messages[i].from !== document.querySelector("input").value){
                document.querySelector("ul").innerHTML += "<li><div class='messages reserved'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
            if (messages[i].to === document.querySelector("input").value){
                document.querySelector("ul").innerHTML += "<li><div class='messages reserved'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "reservadamente para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
            if (messages[i].from === document.querySelector("input").value && messages[i] !== "Todos"){
                document.querySelector("ul").innerHTML += "<li><div class='messages reserved'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "reservadamente para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
        }
    }
    document.querySelector(".center").scrollIntoView(false)
}

function callMessages(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(compareMessages)
}

function compareMessages(answer){
    if (answer.data[99].time !== messages[99].time){
        renderMessages(answer)
    }
}

function sendMessage(){
    let message = {
        from: `${document.querySelector("input").value}`,
        to: `${userName}`,
        text: `${document.querySelector(".bottom input").value}`,
        type: `${privacy}`
    }
    console.log(message)
    let promisePost = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message)
    let promiseGet
    promisePost.then(promiseGet = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages"))
    promisePost.then(document.querySelector(".bottom input").value = "")
    promisePost.catch(fail2)
    promiseGet.then(renderMessages)
}

function menuOpen(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    document.querySelector(".menu").classList.toggle("open")
    document.querySelector(".backgroundMenu").classList.toggle("hide")
    userName = "Todos"
    promise.then(gerarUsersList)
    userListIntervalID = setInterval(userListReload, 9000)
}

function menuClose(){
    document.querySelector(".menu").classList.toggle("open")
    document.querySelector(".backgroundMenu").classList.toggle("hide")
    console.log(privacy)
    clearInterval(userListIntervalID)
}

function gerarUsersList(answer){
    let listMenu = document.querySelector(".pessoas ul")
    let listUsers = answer.data
    listMenu.innerHTML = `<li><div onclick="selectUser(this)"><ion-icon name="people"></ion-icon><p>Todos</p><ion-icon class="check" name="checkmark-outline" ></ion-icon></div></li>`
    for (let i = 0; i < listUsers.length; i++){
        if (listUsers[i].name !== document.querySelector("input").value){
            listMenu.innerHTML += `<li><div onclick="selectUser(this)"><ion-icon name="people"></ion-icon><p>${listUsers[i].name}</p><ion-icon class="check hide" name="checkmark-outline" ></ion-icon></div></li>`
        }
    }
}

function userListReload(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(gerarUsersList)
}

function selectUser(element){
    clearInterval(userListIntervalID)
    userListIntervalID = setInterval(userListReload, 5000)
    let listUserSelectors = document.querySelectorAll(".pessoas .check")
    for (let i = 0; i < listUserSelectors.length; i++){
        listUserSelectors[i].classList.add("hide")
    }
    element.childNodes[2].classList.remove("hide")
    userName = element.childNodes[1].innerHTML
    return userName
}

function selectPrivacy(element){
    let listPrivacy = document.querySelectorAll(".options .check")
    listPrivacy[0].classList.add("hide")
    listPrivacy[1].classList.add("hide")
    element.childNodes[2].classList.remove("hide")
    if (listPrivacy[0].classList.contains("hide")){
        return privacy = "private_message"
    } else{
        return privacy = "message"
    }
}

function logout(){
    document.querySelector("input").value = ""
    document.querySelector(".bottom input").value = ""
    alert("Você foi desconectado, volte sempre!")
    window.location.reload()
}