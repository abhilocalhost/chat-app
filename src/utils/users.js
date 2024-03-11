const users=[]

//add, remove, getuser, getUserinRoom

//add user
const addUser = ({id,username,room})=>{
        //alter data
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        //validate the data
        if(!username || !room){
            return{
                error:'Username and room are required'
            }
        }


        //check for existing user
        const check = users.find((user)=>{
            return user.username === username && user.room === room 
        })

        if(check){
            return{
                error:'Username already exist'
            }
        }

        //store

        const user ={id, username, room}
        users.push(user)

        return {user}
}


//remove

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id
    })

    if(index!==-1)
    {
        //remove item in index by items
        return users.splice(index,1)[0]
    }
}


//getUser
const getUser = (id)=>{
    return users.find((user)=>{
        return user.id===id
    })
}

//getuserInRoom
const getUserInRoom =(room)=>{
    room = room.trim().toLowerCase()
   return users.filter((user)=>{
       return user.room === room
   }) 
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}