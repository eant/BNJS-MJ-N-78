const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")

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

const urlencoded = bodyParser.urlencoded({ extended : true })

const upload = multer()

/* Buscar archivos estaticos en el directorio /public */
server.use( public )
server.use( json )
server.use( urlencoded )
server.use( upload.array() )

server.listen( port )

/* Ejecutar endpoints customizados */
server.post("/enviar", function(request, response){
	let datos = {
		rta : "ok",
		consulta : request.body
	}

	console.log(datos)

	// Tarea: Implementar el modulo JOI para validar "esquemas" de datos
	// URL: https://github.com/hapijs/joi

	/******* ACA DEBERIA VALIDAR *******/
	if( datos.consulta.nombre == "" || datos.consulta.nombre == null ){

		response.json({
			rta : "error",
			msg : "El nombre no puede quedar vacio"
		})

	} else if( datos.consulta.correo == "" || datos.consulta.correo == null || datos.consulta.correo.indexOf("@") == -1 ){

		response.json({
			rta : "error",
			mgs : "Ingrese un correo valido"
		})

	} else if( datos.consulta.asunto == "" || datos.consulta.asunto == null ){

		response.json({
			rta : "error",
			mgs : "Elija un asunto"
		})

	} else if( datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200 ){

		response.json({
			rta : "error",
			mgs : "Ingrese un mensaje entre 50 y 200 caracteres"
		})

	} else {

		//Envio de mail...
		miniOutlook.sendMail({
			from : datos.consulta.correo,
			to : "silvio.messina@eant.tech",
			subject : datos.consulta.asunto,
			html : "<strong>" + datos.consulta.mensaje + "</strong>"
		})

		response.json( datos )		
	}

	/******* ACA DEBERIA ESTAR VALIDADO *******/


})