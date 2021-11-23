const http = require('http')

const myArray = [
    {id:1, name:"ayoub", age:"22"},
    {id:2, name:"hafidi", age:"23"},
    {id:3, name:"alaoui", age:"24"},
]
const server = http.createServer((req,res)=>{
    const { url, method} = req
    // Get all users
    if(url=='/' && method == 'GET') {
        res.write(JSON.stringify(myArray))
        res.end()
    }
    // get all user reversed
    if(url=='/reversed' && method == 'GET') {
        res.write(JSON.stringify(myArray.reverse()))
        res.end()
    }

    // add user 
    else if( url =="/addUser" && method == "POST") {
        let bodyData = []
        req.on("data",(chunk)=>{
            bodyData.push(chunk)
        })
        req.on("end",()=>{
            let bufferBody = JSON.parse(bodyData)
            console.log(bufferBody);
            const findUser = myArray.find((user)=>{
                return user.id == bufferBody.id
            })
            if(findUser) {
                res.write("user already exist"); 
                res.end()
            } else {
                myArray.push(bufferBody)
                console.log(myArray);
                res.end("done")
            }
        })
    }
    // update user by id
    else if(url == "/updateUser" && method == "PATCH") {
        let bodyData
        req.on("data",(user)=>{
            bodyData=user
        })   
        req.on("end",()=>{
            let convertBody = JSON.parse(bodyData)
            console.log(convertBody);
            let findUser = false;
            for(let i = 0; i < myArray.length; i++) {
                if(myArray[i].id == convertBody.id){
                    myArray[i].name = convertBody.name;
                    findUser = true
                }
            }
            if(!findUser){
                res.write("user does not exist")
            } 
            res.write(JSON.stringify(myArray));
            res.end()
        })
    }
    // DeleteById
    else if(url == "/deleteUser" && method == "DELETE") {
        let bodyData;
        req.on("data",(user)=>{
            bodyData = user
        })
        req.on('end',()=>{
            let convertBody = JSON.parse(bodyData)
            for(let i = 0; i < myArray.length; i++) {
                if(myArray[i].id == convertBody.id) {
                    myArray.splice(i,1)
                }
            }
            res.write(JSON.stringify(myArray))
            res.end()
           
        })
    }
    // Get user by id
    else if(url =="/:id" && method =="GET") {
    }
    else {
        res.write("404 not found")
        console.log(url,method)
        res.end()
    }
})

server.listen(3000,()=>{
    console.log("running");
})