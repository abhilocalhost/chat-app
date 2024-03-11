const socket = io() // called io to connect to the server

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//template [grabing the html]
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

//options(conataing quesry sting as object)
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

 const autoscroll = () =>{

    //new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height screen height 
    const visibleHeight = $messages.offsetHeight

    //height of the message container
    const containerHeight = $messages.scrollHeight

    //how far I have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight


    if(containerHeight - newMessageHeight<=scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

 }

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm A'),
        name: url.name
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
   
})




//receiving
socket.on('message',(welcomeString)=>{
    console.log(welcomeString)
    const html = Mustache.render(messageTemplate,{
        welcomeString : welcomeString.text,
        createdAt:moment(welcomeString.createdAt).format('h:mm A'),
        name : welcomeString.name
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})



socket.on('roomData',({room,users})=>{

    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })
   $sidebar.innerHTML = html
    // console.log(room)
    // console.log(users,'h')
})



$messageForm.addEventListener('submit',(e)=>{
    
    e.preventDefault()
    //disabling form
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.messageName.value
    //third argument ie function will run when it get ackowledgement 
    socket.emit('formSubmission',message,(error)=>{
        //enabling form
        $messageFormButton.removeAttribute('disabled')

        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error)
        return console.log(error)

        console.log('delivered')
    })
})




$sendLocation.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    else
    navigator.geolocation.getCurrentPosition((position)=>{
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            $sendLocation.setAttribute('disabled','disabled')
         //third argument ie function will run when it get ackowledgement 
            socket.emit('sendLocation',{
                latitude,
                longitude
            },()=>{
                $sendLocation.removeAttribute('disabled')
              console.log('location delivered')  
            })

        })
})



socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})