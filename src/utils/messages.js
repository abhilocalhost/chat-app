const generateMessage = (text,name)=>{
    return{
        text,
        createdAt: new Date().getTime(),
        name
    }
}

const generateURL = (url,name) =>{
    return{
        url,
        createdAt:new Date().getTime(),
        name
    }
}
module.exports = {
    generateMessage,
    generateURL
}