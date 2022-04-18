let messages = [];

function logIn(){
    let user = {
        name: `${document.querySelector("input").value}`
    }
    console.log(user)
    document.querySelector("input").classList.add("hide")
    document.querySelector("button").classList.add("hide")
    document.querySelector(".load").classList.remove("hide")
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    promise.then(logon)
    promise.catch(fail)
}

function logon(){
    let intervalID = setInterval(loginMaintenance, 4000)
    console.log(intervalID)
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(renderMessages)
}

function loginMaintenance(){
    let user ={
        name: `${document.querySelector("input").value}`
    }
    let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status`, user)
}

function fail(error){
    if (error.response.status === 400){
        alert("Nome já em uso! Por favor escolha outro nome.")
        document.querySelector("input").value = ""
        window.location.reload()
    }
}

function renderMessages(answer){
    messages = answer.data
    console.log(messages)
    document.querySelector(".container-1").classList.add("hide")
    document.querySelector(".container-2").classList.remove("hide")
    for (let i = 0; i < messages.length; i++){
        if ((messages[i].type) === "status"){
            document.querySelector("ul").innerHTML += "<li><div class='messages status'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
        }
        if((messages[i].type) === "message"){
            if (messages[i].to === "Todos"){
                document.querySelector("ul").innerHTML += "<li><div class='messages all'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "para" + "&nbsp" + "<h1>Todos:</h1>" + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
            else{
                document.querySelector("ul").innerHTML += "<li><div class='messages reserved'>" + `${messages[i].time}` + "&nbsp" + `<h1>${messages[i].from}</h1>` + "&nbsp" + "reservadamente para" + "&nbsp" + `<h1>${messages[i].to}:</h1>` + "&nbsp" + `${messages[i].text}` + "</div></li>"
            }
        }
    }
    document.querySelector(".center").scrollIntoView(false)
}