const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")
const joi = require("@hapi/joi")
const hbs = require('nodemailer-express-handlebars')

/* INICIO CONFIGS NODEMAILER */

//1) Configurar los datos del servidor de email
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'theodora58@ethereal.email',
        pass: 'JkXq7mPSYjFqMfDVcz'
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

//3) Asignar motor de plantilla "Handlebars"
const render = {
	viewEngine : {
		layoutsDir : "templates/",
		partialsDir : "templates/",
		defaultLayout : false,
		extName : ".hbs"
	},
	viewPath : "templates/",
	extName : ".hbs"
}
miniOutlook.use("compile", hbs(render) )

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

	//console.log(datos)

	// Tarea: Implementar el sistema de plantillas handlebars + envio del email
	// URL: https://www.npmjs.com/package/nodemailer-express-handlebars

	/******* ACA DEBERIA VALIDAR *******/

	const schema = joi.object({
		nombre : joi.string().min(4).max(25).required(),
		correo : joi.string().email({
			minDomainSegments : 2,
			tlds : {
				allow : ["com", "net", "org"]
			}
		}).required(),
		asunto : joi.string().alphanum().valid("ax45", "ax38", "ax67", "ax14").required(),
		mensaje : joi.string().min(50).max(200).required(),
		fecha : joi.date().timestamp('unix')	
	})

	let validacion = schema.validate(datos.consulta)

	if( validacion.error ){
		response.json( validacion.error )
	} else {
		//Envio de mail...
		miniOutlook.sendMail({
			from : datos.consulta.correo,
			to : "silvio.messina@eant.tech",
			subject : datos.consulta.asunto,
			//html : "<strong>" + datos.consulta.mensaje + "</strong>"
			template : "prueba",
			context : datos.consulta
		}, function(error, info){

			let msg = error ? "Su consulta no pudo ser enviada :(" : "Gracias por su consulta :D"

			response.json({ msg })

		})

	}

	

	/*
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
	*/
	/******* ACA DEBERIA ESTAR VALIDADO *******/


})