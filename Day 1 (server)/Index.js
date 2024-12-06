const http = require("http")
const port = 1008 

const handleServer=(req , res)=>{
    res.write(`<h1 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Hello World</h1>`)
    res.end()
}

const server = http.createServer(handleServer)

server.listen(port , (err)=>{
    err ? console.log(err) : console.log("server started : " + port)
})
