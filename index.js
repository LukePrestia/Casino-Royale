
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon indexaaaaaaaaaaa"
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
var session = require('express-session');
const app = express(); //Inicializo express para el manejo de las peticiones
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Webd
server.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
}); 

app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'debug',
        cookie: { secure: false }
    })
);
//holas
/*server.listen(3000, function() {
        console.log('Servidor corriendo en http://localhost:3000');
    });*/
/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/
var turno = 1
var cantidad = 0
var veces = 0
var persona
app.get('/', function(req, res)
{
    res.render('login', {log:false});
});

app.post('/perfil', async function(req, res)
{
    let usuario = await MySQL.Realizar_Query('select nombre from usuarios where id = '+req.session.user+'')
    let todos = await MySQL.Realizar_Query('select *,(osito + mansion + cupon) as "total" from usuarios')
    for (let i=0; i<todos.lenght; i++){
        todos[i].total=Math.abs(todos[i].total-3)
    }
    let informacion = {
        log:true,
        usuario:usuario,
        todos:todos
       
    }
    
    res.render('profile', informacion);
});

app.post('/back', function(req, res)
{
    res.render('login', {log:false});
});
app.post('/BlackJack', function(req, res)
{
    res.render('blackjack', {log:true});
});

app.post('/login', async function(req, res)
{
    let usuario = await MySQL.Realizar_Query('select * from usuarios') 
    for (let i = 1; i < usuario.length+1; i++) {
        if (req.body.usuario!=="" && req.body.contrasena !==""){
            if (usuario[i-1].nombre==req.body.usuario  && usuario[i-1].contrasena==req.body.contrasena){
                var todolegal=true
                console.log(i)
                var idinsta = i
            }
        }   
    }
    console.log(todolegal)
    if (todolegal){
        console.log("entre")
        let usuarioespec = await MySQL.Realizar_Query('select * from usuarios where id = '+idinsta+'') 
        console.log("soy el tro"+usuarioespec)
        var info={
            usuario:usuarioespec,
            log:true,
            juego:true
        }
    
        req.session.user = idinsta //no usar ID NOMBRE SESSION
        console.log(req.session)
        res.render('recibidor',info); 
    }
    else{
    res.render('login',{log:false});
    }
});
app.post("/Ruleta", async function(req, res)
{  
    console.log(req.session.user)
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user)
    console.log(actplata[0].plata)
    info={
    plata:actplata[0].plata,
    log:true,
    juego:false
    }
    res.render("ruleta",info)
});
app.post("/adduser", async function(req, res)
{   
    console.log(req.body)
    await MySQL.Realizar_Query("INSERT INTO usuarios (nombre,contrasena,mail,img) VALUES ('"+req.body.rusuario+"','"+req.body.rcontrasena+"','"+req.body.rmail+"','"+req.body.rfoto+"');")
    console.log(await MySQL.Realizar_Query('select * from usuarios'))
    res.render('login', {log:false}); 
});

app.post("/register", function(req, res)
{
    res.render("register",null)
});
app.post("/fondos", async function(req, res)
{   
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user+'')
    
    let platafinal= actplata[0].plata
    platafinal=parseInt(platafinal)
    platafinal+=parseInt(req.body.plata.plata)
    console.log("final"+platafinal)
    await MySQL.Realizar_Query('update usuarios set plata='+platafinal+' where id = '+req.session.user+'')
    res.send({platafinal:platafinal})
});
app.post("/menordinero", async function(req, res)
{
    console.log("plata"+req.body.plata)
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user+'')
    await MySQL.Realizar_Query('update usuarios set plata='+req.body.plata+' where id = '+req.session.user+'')
    res.send(null)
});
app.post("/sumardinero", async function(req, res)
{
   console.log("plata"+req.body.plata)
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user+'')
   await MySQL.Realizar_Query('update usuarios set plata='+req.body.plata+' where id = '+req.session.user+'')
    res.send(null)
});
app.post("/mercado", async function (req,res)
{
    messi = await MySQL.Realizar_Query('select * from usuarios where id = '+req.session.user+'')
    osito = await MySQL.Realizar_Query('select osito from usuarios where id = '+req.session.user+'')
    cupon = await MySQL.Realizar_Query('select cupon from usuarios where id = '+req.session.user+'')
    mansion = await MySQL.Realizar_Query('select mansion from usuarios where id = '+req.session.user+'')
    suma = parseInt(osito[0].osito) + parseInt(mansion[0].mansion)+ parseInt(cupon[0].cupon)
    if (suma == 0){
        douman=true
    }
    if (suma != 0){
        douman=false
    }
    info={
        osito:osito[0].osito,
        mansion:mansion[0].mansion,
        cupon:cupon[0].cupon,
        usuario:messi,
        log:true,
        juego:true,
        todocomprado:douman
    }
    res.render("mercado",info)
})
app.post("/sala1", function (req,res)
{
    io.on('connection', function(socket) {
        socket.join('room1');
    });
 res.render("sala")
});
app.post("/sala2", function (req,res)
{
    io.on('connection', function(socket) {
        socket.join('room2');  
    });
 res.render("sala")
});
app.post("/sala3", async function (req,res)
{
    io.on('connection', function(socket) { 
        socket.join('room3');
 });
 /*if (typeof req.session.user !== "undefined") {
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user+'')
    console.log(actplata)
    let platinha= actplata[0].plata
    res.render("sala",{blackjack:true,platinha:platinha});
    console.log("SESION VALIDA")
 } else {
    console.log("SESION INVALIDA")
 }*/
 

 res.render("sala",{log:true});
});

app.post('/comprado', async function(req, res)
{
    console.log(req.session.user)
    console.log(req.body.dineros)
    console.log(req.body.articulocomprado)
    messi = await MySQL.Realizar_Query('select ' + req.body.articulocomprado + ' from usuarios where id = ' + req.session.user)
    await MySQL.Realizar_Query('update usuarios set '+ req.body.articulocomprado +'=false where id = '+req.session.user)
    let actplata = await MySQL.Realizar_Query('select plata from usuarios where id = '+req.session.user+'')
    console.log(actplata)

    let platafinal= actplata[0].plata
    platafinal=parseInt(platafinal)
    platafinal-=parseInt(req.body.dineros)
    
    await MySQL.Realizar_Query('update usuarios set plata='+platafinal+' where id = '+req.session.user+'')
    res.send({platafinal:platafinal})
})
app.post('/darcartas', async function(req,res){
    console.log(req.body.suma);
    veces+=1;
    console.log(veces);
    let cartas= await MySQL.Realizar_Query('select * from cartas');
    let numeroElegido=Math.round(Math.floor(Math.random() * (cartas.length - 0)) + 0);
    let cartaElegida= cartas[numeroElegido];
    await MySQL.Realizar_Query('insert into cartasmesa (palo,numero,usuario) values ("'+ cartaElegida.palo + '","' + cartaElegida.numero +'", '+turno+')')
    await MySQL.Realizar_Query('delete from cartas where palo = "' + cartaElegida.palo + '" and numero= "' + cartaElegida.numero+'"');
    let cartasNueva
    if (cartaElegida.numero=="K" || cartaElegida.numero=="Q" || cartaElegida.numero=="J"){
        cartasNueva=10;
    } else if (cartaElegida.numero=="A"){
        cartasNueva=11
    } else {
        cartasNueva=parseInt(cartaElegida.numero)
    }
    let sumaFinal=parseInt(req.body.suma)+cartasNueva;
    let info = {
        cartaElegida:cartaElegida,
        sumaFinal:sumaFinal,
        turno:turno,
        perdio:false,
        veces:veces
    }
    if (sumaFinal>21 && turno==1){
        info.perdio=true
        veces=0;
        turno = 2;
    } else if (sumaFinal>21 && turno==2){
        info.perdio=true
        turno= 3;
        veces=0;
    }
    io.to("room3").emit("cargarcartas",info);
    res.send(info);
})

app.post('/ready', async function(req,res){
    cantidad+=1
    req.session.player=cantidad
    console.log("Personas actuales " + cantidad)
    let nombrecito = await MySQL.Realizar_Query('select nombre from usuarios where id = '+req.session.user+'')
        let nombre=nombrecito[0].nombre
        let objeto ={
            num:req.session.player,
            nombre:nombre,
        }
    io.to("room3").emit("jugadores1",objeto)
    if (cantidad==2){
        let cartaElegida=[];
        let numeroUsuario;
        let suma=[]
        let raros=[]
        for (let i=0; i<5; i++){
            let cartas= await MySQL.Realizar_Query('select * from cartas');
            let numeroElegido=Math.round(Math.floor(Math.random() * (cartas.length - 0)) + 0);
            cartaElegida.push(cartas[numeroElegido]);
            if (i<2){
                numeroUsuario=1;
            } else if (i<4 && i>=2){
                numeroUsuario=2
            }else {
                numeroUsuario=3};
        await MySQL.Realizar_Query('insert into cartasmesa (palo,numero,usuario) values ("'+ cartaElegida[i].palo + '","' + cartaElegida[i].numero +'", '+numeroUsuario+')')
        await MySQL.Realizar_Query('delete from cartas where palo = "' + cartaElegida[i].palo + '" and numero= "' + cartaElegida[i].numero+'"');
        }
        let cartasNueva=[]
        for (let e=0; e<5; e++){
            if (cartaElegida[e].numero=="K" || cartaElegida[e].numero=="Q" || cartaElegida[e].numero=="J"){
                cartasNueva[e]=10;
            } else if (cartaElegida[e].numero=="A"){
                cartasNueva[e]=11
            } else {
                cartasNueva[e]=parseInt(cartaElegida[e].numero)
            }
        }
        suma[0]=cartasNueva[0]+cartasNueva[1];
        suma[1]=cartasNueva[2]+cartasNueva[3];
        suma[2]=cartasNueva[4];
        let info ={
            cartaElegida:cartaElegida,
            cartasNueva:cartasNueva,
            suma:suma
        }
        let devolverCartas= await MySQL.Realizar_Query('select * from cartasmesa')
        console.log(devolverCartas);
        for (let i=0; i<devolverCartas.length; i++){
        await MySQL.Realizar_Query('insert into cartas (palo,numero) values ("'+ devolverCartas[i].palo + '","' + devolverCartas[i].numero +'")')
        await MySQL.Realizar_Query('delete from cartasmesa where palo = "' + devolverCartas[i].palo + '" and numero= "' + devolverCartas[i].numero+'"');
        } 
        console.log(info);
        io.to("room3").emit("empieza",info)
        cantidad=0
        turno = 1;
        veces = 0;
        cantidad = 0;
        res.send(cartaElegida);
        
    } else {
        let info ={
            cantidad:cantidad,
        }
        io.to("room3").emit("jugadores",info);
        res.send(null);
    }
});

app.post('/crupier', async function(req,res){
    console.log(req.body.suma3);
    let sumaFinal= parseInt(req.body.suma3);
    veces=0;
    while (sumaFinal<17){
    veces+=1;
    let cartas= await MySQL.Realizar_Query('select * from cartas');
    let numeroElegido=Math.round(Math.floor(Math.random() * (cartas.length - 0)) + 0);
    let cartaElegida= cartas[numeroElegido];
    console.log(cartaElegida)
    await MySQL.Realizar_Query('insert into cartasmesa (palo,numero,usuario) values ("'+ cartaElegida.palo + '","' + cartaElegida.numero +'", '+turno+')')
    await MySQL.Realizar_Query('delete from cartas where palo = "' + cartaElegida.palo + '" and numero= "' + cartaElegida.numero+'"');
    let cartasNueva
    if (cartaElegida.numero=="K" || cartaElegida.numero=="Q" || cartaElegida.numero=="J"){
        cartasNueva=10;
    } else if (cartaElegida.numero=="A"){
        cartasNueva=11
    } else {
        cartasNueva=parseInt(cartaElegida.numero)
    }
    if (veces==1){
        sumaFinal=sumaFinal+parseInt(cartasNueva);
        console.log("primera vez")
    }
    if (veces>1){
        sumaFinal=sumaFinal+parseInt(cartasNueva);
        console.log("segunda/tercera vez")
    }
    let info = {
        cartaElegida:cartaElegida,
        sumaFinal:sumaFinal,
        perdio:false,
        veces:veces,
        turno:turno
    }
    console.log(info);
    io.to("room3").emit("cargarcartas",info);
    }
    res.send(null);4
})

app.post('/quedarse', async function(req,res){
    turno+=1;
    veces=0;
    if (turno==2){ // termina el turno 1
        io.to('room3').emit('turno2');
    }
    if(turno==3){ // termina el turno 2
        io.to('room3').emit('turno3');
    }
    res.send(null)
})

app.post('/resultados', async function(req,res){
    io.to('room3').emit('resultados');
})
app.post("/resultados2", async function(req,res){
    console.log(req.body.sumaResultados);
    console.log(req.session);
    console.log(req.body.sumaResultados[3][1])
    let plata = await MySQL.Realizar_Query('select plata from usuarios where id = ' + req.session.user)
    console.log(plata)
    if(req.body.sumaResultados[req.session.player-1]>21 || (req.body.sumaResultados[req.session.player-1]<req.body.sumaResultados[2] && req.body.sumaResultados[2]<=21)){
    plata[0].plata-=150
    resultado="hijo de flavio mendoza"
    }else if(req.body.sumaResultados[req.session.player-1]<=21 && req.body.sumaResultados[req.session.player-1]>
    req.body.sumaResultados[2] || req.body.sumaResultados[2]>21){
    plata[0].plata+=150
    resultado="descendiente natural de Ricardo Fort"
    } else if (req.body.sumaResultados[req.session.player-1]==req.body.sumaResultados[2]){
        resultado="tibio"  
    }
    console.log(plata)
    await MySQL.Realizar_Query('update usuarios set plata='+plata[0].plata+' where id = '+req.session.user+'')
    res.send({resultado:resultado})
})
