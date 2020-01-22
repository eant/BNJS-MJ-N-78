const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")

/* INICIO CONFIGS NODEMAILER */

//1) Configurar los datos del servidor de email
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'royal.cruickshank10@ethereal.email',
        pass: 'SWrg9jsmxygGbqDwpW'
    }
})

//2) Verificar conexión con el servidor de email
miniOutlook.verify(function(error, ok){

	if(error){ //<-- Si falló

		console.log("AHHHHHHHHHHHHHH!!!")
		console.log(error.response)

	} else { //<-- Si salió bién

		console.log("Ready Player One")

	}

})

/* FIN DE CONFIGS NODEMAILER */

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
	let datos = {
		rta : "ok",
		consulta : request.body
	}

	// Tarea 1: validar que no esten vacios antes de enviar el email
	// Tarea 2: definir un mensaje si sale biem o si sale mal en el response

	//Envio de mail...
	miniOutlook.sendMail({
		from : datos.consulta.correo,
		to : "silvio.messina@eant.tech",
		subject : datos.consulta.asunto,
		html : "<strong>" + datos.consulta.mensaje + "</strong>"
	})

	response.json( datos )
})