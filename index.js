const express = require("express")
const bodyParser = require("body-parser")

const server = express()

const port = 80

const public = express.static("public")

const json = bodyParser.json()

const urlencoded = bodyParser.urlencoded({ extended : false })

/* Buscar archivos estaticos en el directorio /public */
server.use( public )
server.use( json )
server.use( urlencoded )

server.listen( port )

/* Ejecutar endpoints customizados */
server.post("/enviar", function(request, response){
	console.log( request.body )
	response.end("Estos son los datos enviados: MIRAR LA CONSOLA")
})