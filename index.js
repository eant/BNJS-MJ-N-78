const express = require("express")

const server = express()

const port = 80

server.listen( port )

server.post("/enviar", function(request, response){
	console.log( request )
	response.end("Estos son los datos enviados: CONTINUARA")
})