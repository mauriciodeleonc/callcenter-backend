const mysqlssh = require('mysql-ssh');
const readXlsxFile = require('read-excel-file/node');
const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch');
let db;

mysqlssh.connect(
  {
    host: '198.54.120.152',
    user:'thenyynw',
    password:'#zad2020',
    port: 21098
  },
  {
    host:'127.0.0.1',
    user:'thenyynw_mauricio',
    password:"'M4ur1c10130199'",
    database:'thenyynw_callcenter_dev',
  }
).then(client => {
  db = client;
}).catch(err => {
  console.log(err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// handle incoming connections from clients
io.sockets.on('connection', (socket) => {
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  //let socketRoom;
  socket.on('room', (room) => {
      socket.join(room);
      console.log(' joined room: ' + room);
  });
  socket.on('message', (data) =>{
    io.to(data.room).emit('message', {estadoBoton: data.estadoBoton, room: data.room, idUsuario: data.idUsuario});
  });
  socket.on('message-disconnect', (data) =>{
    io.to(data.room).emit('message-disconnect', {estadoBoton: data.estadoBoton, room: data.room, idUsuario: data.idUsuario});
  });
  socket.on('llamada', (data) => {
    io.to(data.room).emit('llamada', {room: data.room, idUsuario: data.idUsuario, minutosLlamada: data.minutosLlamada, segundosLlamada: data.segundosLlamada});
  });
});


//Un solo empleado (para el login)
app.get('/getEmpleado', (req,res) => {
  db.query(`CALL getEmpleado('${req.query.usuario}', '${req.query.contrasena}')`, function (err, result) {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//Todos los empleados (para la pantalla de admin)
app.get('/getEmpleados', (req,res) => {
  db.query(`Select * from Empleado`, function (err, result) {
    console.log('result');
    if(err) throw err;    
    res.send(result);
  });
});

//Para la pantalla de admin
app.post('/insertEmpleado', (req, res) => {
  db.query(`CALL insertEmpleado('${req.query.nombre}', '${req.query.rol}', '${req.query.usuario}', '${req.query.contrasena}', ${req.query.estado})`, 
  function (err, result) {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//Para la pantalla de admin
app.post('/updateEmpleado', (req, res) => {
  db.query(`CALL updateEmpleado(${req.query.idEmpleado}, '${req.query.nombre}', '${req.query.rol}', '${req.query.usuario}', '${req.query.contrasena}', ${req.query.estado})`, function (err, result) {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//Para la pantalla de admin
app.post('/deleteEmpleado', (req, res) => {
  db.query(`CALL deleteEmpleado('${req.query.usuario}')`, function (err, result) {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//Pantalla carteras
app.get('/getCarteras', (req,res) => {
  db.query(`CALL getCarteras()`, function (err, result) {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//
app.get('/getIdEmpleado', (req, res) => {
  db.query(`CALL getIdEmpleado('${req.query.usuario}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

//Insertar un nuevo titulo de productox
app.post('/insertProducto', (req, res) => {
  db.query(`CALL insertProducto('${req.query.titulo}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertReferencia', (req, res) => {
  db.query(`CALL insertReferencia(${req.query.idCliente}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCel}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertCliente', (req,res) => {
  //console.log(`CALL insertCliente(${req.query.idProducto}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCel}')`);
  db.query(`CALL insertCliente(${req.query.idProducto}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCel}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertCredito', (req,res) => {
  console.log(`CALL insertCredito(
    ${req.query.numCredito}, 
    ${req.query.idCliente}, 
    ${req.query.estado}, 
    '${req.query.fechaOtorgado}', 
    ${req.query.bucketMin}, 
    ${req.query.bucketMax},
    ${req.query.cuota},
    ${req.query.vencido},
    ${req.query.vencidoCuota},
    ${req.query.total},
    ${req.query.liqActual},
    ${req.query.plazo},
    '${req.query.ultimoPago}'
  )`);
  db.query(`CALL insertCredito(
      ${req.query.numCredito}, 
      ${req.query.idCliente}, 
      ${req.query.estado}, 
      '${req.query.fechaOtorgado}', 
      ${req.query.bucketMin}, 
      ${req.query.bucketMax},
      ${req.query.cuota},
      ${req.query.vencido},
      ${req.query.vencidoCuota},
      ${req.query.total},
      ${req.query.liqActual},
      ${req.query.plazo},
      '${req.query.ultimoPago}'
    )`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertClienteEjecutivo', (req, res) => {
  db.query(`CALL insertClienteEjecutivo(${req.query.idCliente}, ${req.query.idEjecutivo})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertDireccion', (req, res) => {
  db.query(`CALL insertDireccion(${req.query.idCliente}, '${req.query.calle}', '${req.query.colonia}', '${req.query.municipio}', '${req.query.estado}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getEjecutivosEmpleados', (req, res) => {
  db.query(`CALL getEmpleadosEjecutivos()`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getProductoEmpleado', (req, res) => {
  db.query(`CALL getProductoEmpleado(${req.query.idEmpleado})`, (err, result) =>{
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getCarteraProducto', (req, res) => {
  db.query(`CALL getCarteraProducto(${req.query.idProducto})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updateCliente', (req, res) => {
  db.query(`CALL updateCliente(${req.query.idProducto}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCel}')`, (err, result) => {
    console.log(result);
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updateClienteEjecutivo', (req, res) => {
  db.query(`CALL updateClienteEjecutivo(${req.query.idCliente}, ${req.query.idEjecutivo})`, (err, result) => {
    console.log(result);
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updateDireccion', (req, res) => {
  db.query(`CALL updateDireccion(${req.query.idCliente}, '${req.query.calle}', '${req.query.colonia}', '${req.query.municipio}', '${req.query.estado}')`, (err, result) => {
    console.log(result);
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updateCredito', (req,res) => {
  db.query(`CALL updateCredito(
      ${req.query.numCredito},
      ${req.query.estado},
      ${req.query.bucketMin}, 
      ${req.query.bucketMax},
      ${req.query.cuota},
      ${req.query.vencido},
      ${req.query.vencidoCuota},
      ${req.query.total},
      ${req.query.liqActual},
      ${req.query.plazo},
      '${req.query.ultimoPago}'
    )`, (err, result) => {
    console.log('updated credito');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updateReferencia', (req, res) => {
  db.query(`CALL updateReferencia(${req.query.idCliente}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCel}')`, (err, result) => {
    console.log('updated referencia');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getClientesEjecutivo', (req, res) => {
  db.query(`CALL getClientesEjecutivo(${req.query.idEmpleado})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getEmpleadosProducto', (req, res) => {
  db.query(`CALL getEmpleadosProducto(${req.query.idProducto})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getCantEmpleadosProducto', (req, res) => {
  db.query(`CALL getCantEmpleadosProducto()`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getCantGestionesProducto', (req, res) => {
  db.query(`CALL getCantGestionesProducto()`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getReferenciasCliente', (req, res) => {
  db.query(`CALL getReferenciasCliente(${req.query.idCliente})`, (err, result) => {
    console.log(result);
    if(err) throw err;
    res.send(result);
  });
});

app.get('/getInfoClientes', async (req, res) => { 
  //traer clientes
  let clientes = await db.promise().query(`CALL getClientesEjecutivo(${req.query.idEmpleado})`);
  //console.log(clientes[0][0]);
  //res.send(clientes);
  
  //Traer por cada cliente referencias y creditos
  const promisesReferencias = [];
  const promisesCreditos = [];
  clientes[0][0].forEach((cliente) => {
      //console.log(cliente.idCliente);
      
      //traer referencias
      const promiseReferencia = db.promise().query(`CALL getReferenciasCliente(${cliente.idCliente})`);
      
      
      promiseReferencia.then((referencias) => {
          cliente.referencias = referencias[0][0];
          //console.log(referencias[0][0]);
          //console.log(cliente[0]);
      })
      //console.log(cliente);
      
      //traer creditos
      const promiseCreditos = db.promise().query(`CALL getCreditoCliente(${cliente.idCliente})`);
      promiseCreditos.then((credito) => {
          cliente.credito = credito[0][0][0];
          //console.log(cliente.credito.numCredito);
          const promiseGestion = db.promise().query(`CALL getGestionesCredito(${cliente.credito.numCredito})`);
          promiseGestion.then((gestion) => {
            //console.log(gestion[0][0][0]);
            cliente.gestion = gestion[0][0];
            //console.log(cliente);
            //console.log('otro cliente');
          });
          //console.log('ahi va otro');
      })

      promisesReferencias.push(promiseReferencia);
      promisesCreditos.push(promiseCreditos);
      
  });
  
  const creditos = await Promise.all(promisesCreditos)
  //console.log(creditos[0]);
  
  //Obtener gestiones por credito
  const promisesGestiones = [];
  creditos[0][0][0].forEach((credito) => {
      //traer gestion
      //console.log(credito.numCredito);
      const promiseGestion = db.promise().query(`CALL getGestionesCredito(${credito.numCredito})`);
      promisesGestiones.push(promiseGestion);
  });
  
  const gestiones = await Promise.all(promisesGestiones);
  
  res.send(clientes)
});

app.get('/getClienteCredito', async (req, res) => {
  
  //Traer por cada cliente referencias y creditos
  const promisesReferencias = [];
  const promisesCreditos = [];
  
  //console.log(cliente.idCliente);
  let cliente = {};

  //traer info de cliente
  const promiseInfo = db.promise().query(`CALL getInfoClienteCredito(${req.query.numCredito})`);
  promiseInfo.then((info) => {
    //console.log(info);
    cliente.idCliente = info[0][0][0].idCliente;
    cliente.idProducto = info[0][0][0].idProducto;
    cliente.nombre = info[0][0][0].nombre;
    cliente.telCasa = info[0][0][0].telCasa;
    cliente.telCelular = info[0][0][0].telCelular;
  });
  //traer referencias
  const promiseReferencia = db.promise().query(`CALL getReferenciasCredito(${req.query.numCredito})`);
  promiseReferencia.then((referencias) => {
    cliente.referencias = referencias[0][0];
    //console.log(referencias[0][0]);
    //console.log(cliente[0]);
    //res.send(cliente);
  })
  //console.log(cliente);

  //traer creditos
  const promiseCreditos = db.promise().query(`CALL getInfoCredito(${req.query.numCredito})`);
  promiseCreditos.then((credito) => {
      cliente.credito = []
      cliente.credito[0] = credito[0][0][0];
      //console.log(cliente.credito.numCredito);
      const promiseGestion = db.promise().query(`CALL getGestionesCredito(${cliente.credito[0].numCredito})`);
      promiseGestion.then((gestion) => {
        //console.log(gestion[0][0][0]);
        cliente.gestion = gestion[0][0];
        //console.log(cliente);
        //console.log('otro cliente');
        res.send(cliente);
      });
      //console.log('ahi va otro');
  })
  /*
  promisesReferencias.push(promiseReferencia);
  promisesCreditos.push(promiseCreditos);
      
  
  const creditos = await Promise.all(promisesCreditos)
  //console.log(creditos[0]);
  
  //Obtener gestiones por credito
  const promisesGestiones = [];
  creditos[0][0][0].forEach((credito) => {
      //traer gestion
      //console.log(credito.numCredito);
      const promiseGestion = db.promise().query(`CALL getGestionesCredito(${credito.numCredito})`);
      promisesGestiones.push(promiseGestion);
  });
  
  const gestiones = await Promise.all(promisesGestiones);
  */
  //res.send(cliente);
});

app.get('/getGestiones', (req, res) => {
  db.query(`CALL getGestiones(${req.query.idProducto})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/insertGestion', (req, res) => {
  console.log(`CALL insertGestion(
    ${req.query.idEmpleadoAsignado},
    ${req.query.idEmpleadoAtendido},
    ${req.query.numCredito},
    '${req.query.fechaHoraGestion}',
    '${req.query.numeroContacto}',
    '${req.query.comentarios}',
    '${req.query.codigoAccion}',
    '${req.query.codigoResultado}',
    '${req.query.codigoContacto}'
    )`);
  db.query(`CALL insertGestion(
    ${req.query.idEmpleadoAsignado},
    ${req.query.idEmpleadoAtendido},
    ${req.query.numCredito},
    '${req.query.fechaHoraGestion}',
    '${req.query.numeroContacto}',
    '${req.query.comentarios}',
    '${req.query.codigoAccion}',
    '${req.query.codigoResultado}',
    '${req.query.codigoContacto}'
    )`, (err, result) => {
      console.log('result');
      if(err) throw err;
      res.send(result);
    });
});

app.post('/updateGestion', (req, res) => {
  db.query(`CALL updateGestion(
    ${req.query.idGestion},
    ${req.query.idEmpleadoAsignado},
    ${req.query.idEmpleadoAtendido},
    ${req.query.numCredito},
    '${req.query.fechaHoraGestion}',
    '${req.query.numeroContacto}',
    '${req.query.comentarios}',
    '${req.query.codigoAccion}',
    '${req.query.codigoResultado}',
    '${req.query.codigoContacto}'
    )`, (err, result) => {
      console.log('result');
      if(err) throw err;
      res.send(result);
    });
});

app.post('/insertPromesa', (req, res) => {
  db.query(`CALL insertPromesa(${req.query.idGestion}, '${req.query.fechaPromesa}', ${req.query.montoPromesa})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});

app.post('/updatePromesa', (req, res) => {
  db.query(`CALL updatePromesa(${req.query.idGestion}, '${req.query.fechaPromesa}', ${req.query.montoPromesa})`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});


app.post('/insertTelefonoNuevo', (req, res) => {
  db.query(`CALL insertReferencia(${req.query.idCliente}, '${req.query.nombre}', '${req.query.telCasa}', '${req.query.telCelular}')`, (err, result) => {
    console.log('result');
    if(err) throw err;
    res.send(result);
  });
});


http.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});

