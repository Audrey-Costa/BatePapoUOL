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
    let intervalIDLogin = setInterval(loginMaintenance, 4000)
    console.log(intervalIDLogin)
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(renderMessages)
    let intervalIDLoadMessages = setInterval(callMessages, 3000)
    console.log(intervalIDLoadMessages)
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

function renderMessages(answer){
    document.querySelector("ul").innerHTML = ""
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

function callMessages(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(compareMessages)
}

function compareMessages(answer){
    //console.log(answer.data[99].time)
    //console.log(messages[99].time)
    //console.log(answer.data[99].time !== messages[99].time)
    if (answer.data[99].time !== messages[99].time){
        renderMessages(answer)
    }
}

function sendMessage(){
    let message = {
        from: `${document.querySelector("input").value}`,
        to: "Todos",
        text: `${document.querySelector(".bottom input").value}`,
        type: "message"
    }
    let promisePost = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message)
    let promiseGet
    promisePost.then(promiseGet = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages"))
    promisePost.then(document.querySelector(".bottom input").value = "")
    promisePost.catch(fail)
    promiseGet.then(console.log)
    promiseGet.then(renderMessages)
}