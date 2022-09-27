'use strict';

const http = require('request');
const config = require('../config/env');

exports.sendEmail = (to, firstname, code, cb) => {
  let emailto = {};
      emailto[to] = firstname;

  let html = `Recibimos una solicitud para recuperar tu contraseña, hace
              <a href="${config.watcha.web}/recuperar.html?code=${code}">
              click acá </a>para crear una nueva contraseña. </br>/n</br>/n 
              Si el link no funciona, copia esta url y pegala en tu navegador: 
              <b>${config.watcha.web}/recuperar.html?code=${code}</b> </br>/n</br>/n
              Si recibiste este email por error, o no solicitaste un cambio de contraseña, 
              descartá este mensaje.  </br>/n </br>/nSaludos! </br>/n <b>El equipo de Watcha.</b> </br>`;

  const data = {  
   'to': emailto,
   'from':[  
      'bienvenido@watcha.live',
      'Watcha Live'
   ],
   'subject': 'Recuperar Contrasena Watcha',
   'html': html
  };
  
  const obj = {
    url : 'https://api.sendinblue.com/v2.0/email',
    method: 'POST',
    headers: {
      'api-key' : 'CdHq1LWvpfTOE0nG'
    },
    json: data
  };

  http(obj, (err, res, body) => {
    if(err) cb(err);
    console.log(`respuesta desde la api de email => ${JSON.stringify(body, null, 2)}`);
    cb(null);
  });
};
