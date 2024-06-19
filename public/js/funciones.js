var socket = io();
//Cambio
var perdedores= [false,false]
socket.on("empieza",function(data){
    console.log(data);
    document.getElementById("ready").style.display="none";
    document.getElementById("cantjugadores").style.display="none";
    document.getElementById("pedir1").disabled=false;
    document.getElementById("quedarse1").disabled=false;
    alert("Empieza la partida");
    document.getElementById("carta11").src='img/'+data.cartaElegida[0].palo+data.cartaElegida[0].numero+'.png'
    document.getElementById("carta21").src='img/'+data.cartaElegida[1].palo+data.cartaElegida[1].numero+'.png'
    document.getElementById("carta12").src='img/'+data.cartaElegida[2].palo+data.cartaElegida[2].numero+'.png'
    document.getElementById("carta22").src='img/'+data.cartaElegida[3].palo+data.cartaElegida[3].numero+'.png'
    document.getElementById("carta13").src='img/'+data.cartaElegida[4].palo+data.cartaElegida[4].numero+'.png'
    document.getElementById("sumaactual1").value = data.suma[0];
    document.getElementById("sumaactual2").value = data.suma[1];
    document.getElementById("sumaactual3").value = data.suma[2];
    document.getElementById("suma1").innerHTML="Suma: " + data.suma[0];
    document.getElementById("suma2").innerHTML="Suma: " + data.suma[1];
    document.getElementById("suma3").innerHTML="Suma: " + data.suma[2];
});
socket.on("jugadores1",function(data){
    if (data.num==1) {
        document.getElementById("jugador1").innerHTML="J1: " + data.nombre
    } else if (data.num==2){ 
        document.getElementById("jugador2").innerHTML="J2: " + data.nombre
    }
})
function fondos(prueba){
    
    console.log(prueba);
    if (prueba == 0) {
        alert("Especifique los fondos")
    }
    plata={
        plata:prueba,
    }
    ajaxPost("/fondos",{plata},function(data){
        data=JSON.parse(data)
        console.log(data);
        document.getElementById("plata_id").innerHTML="Tu Saldo es: "+data.platafinal
    });
}

function compraste(data,pasta) {
    console.log(data,pasta)
    articulocomprado={
        articulocomprado:data,
        dineros:pasta
    }
    console.log(document.getElementById(data))
    document.getElementById(data).style.display = "none"
    ajaxPost("/comprado",articulocomprado,function(data){
        data=JSON.parse(data)
        console.log(data.platafinal)
        console.log(document.getElementById("plata_id").innerText)
        document.getElementById("plata_id").innerText = "Tu Saldo es " + data.platafinal + "$"
    });
}

function cartas(){
    ajaxPost("/carta",null ,function(data){
        data=JSON.parse(data);
        let numeroElegido=Math.round(Math.floor(Math.random() * (data.length - 0)) + 0);
        console.log(numeroElegido);
        let cartaElegida=data[numeroElegido];
        console.log(cartaElegida);
    });
}

function listo(){
    document.getElementById("ready").disabled="true";
    ajaxPost("/ready",null ,function(data){
    })
}

socket.on("jugadores",function(data){
    document.getElementById("cantjugadores").innerHTML="Jugadores listos: "+data.cantidad 
})

function pedirCarta(suma){
    console.log(suma);
    ajaxPost("/darcartas",{suma:suma},function(info){
    })
}

function quedarse(suma){
    //si es 1 haga el turno 1
    //si es 2 pasa al crupier
    if (suma==document.getElementById("sumaactual1").value){
        
        ajaxPost("/quedarse",null,function(info){
            perdedores[0]=false;
        })
    }
    if (suma==document.getElementById("sumaactual2").value){
       
        ajaxPost("/quedarse",null,function(info){
            perdedores[1]=false;
        })
        let suma3= document.getElementById("sumaactual3").value;
        ajaxPost("/crupier",{suma3:suma3},function(info){
            let sumaResultados=[]
            sumaResultados[0]=document.getElementById("sumaactual1").value
            sumaResultados[1]=document.getElementById("sumaactual2").value
            sumaResultados[2]=document.getElementById("sumaactual3").value
            sumaResultados.push(perdedores);
            console.log(sumaResultados);
            ajaxPost("/resultados",{sumaResultados:sumaResultados},function(info){
            })
        })
    }
}
socket.on("turno2",function(info){
    document.getElementById("pedir1").disabled=true;
    document.getElementById("quedarse1").disabled=true;
    document.getElementById("pedir2").disabled=false;
    document.getElementById("quedarse2").disabled=false;
});
socket.on("turno3",function(info){
document.getElementById("pedir2").disabled=true;
document.getElementById("quedarse2").disabled=true;
document.getElementById("pedir1").disabled=true;
document.getElementById("quedarse1").disabled=true;
});
socket.on("resultados",function(info){
    let sumaResultados=[]
        sumaResultados[0]=document.getElementById("sumaactual1").value
        sumaResultados[1]=document.getElementById("sumaactual2").value
        sumaResultados[2]=document.getElementById("sumaactual3").value
        sumaResultados.push(perdedores);
    ajaxPost("/resultados2",{sumaResultados:sumaResultados},function(resultado){
        resultado=JSON.parse(resultado);
        console.log(resultado);
        alert("Sos un " + resultado.resultado);
        document.getElementById("sumaactual1").value=0
        document.getElementById("sumaactual2").value=0
        document.getElementById("sumaactual3").value=0
        document.getElementById("ready").style.display="block";
        document.getElementById("ready").disabled=false
        document.getElementById("cantjugadores").innerHTML="Jugadores listos: 0"
        document.getElementById("cantjugadores").style.display="block";
        document.getElementById("suma1").innerHTML="Suma: 0";
        document.getElementById("suma2").innerHTML="Suma: 0";
        document.getElementById("suma3").innerHTML="Suma: 0";
        document.getElementById("carta11").src='img/atras.png'
        document.getElementById("carta21").src='img/atras.png'
        document.getElementById("carta31").src='img/atras.png'
        document.getElementById("carta41").src='img/atras.png'
        document.getElementById("carta51").src='img/atras.png'
        document.getElementById("carta12").src='img/atras.png'
        document.getElementById("carta22").src='img/atras.png'
        document.getElementById("carta32").src='img/atras.png'
        document.getElementById("carta42").src='img/atras.png'
        document.getElementById("carta52").src='img/atras.png'
        document.getElementById("carta13").src='img/atras.png'
        document.getElementById("carta23").src='img/atras.png'
        document.getElementById("carta33").src='img/atras.png'
        document.getElementById("carta43").src='img/atras.png'
        document.getElementById("carta53").src='img/atras.png'
    })
})
socket.on("cargarcartas",function(info){
    console.log(info);
    if (info.turno==1){
        if (info.veces==1){
            document.getElementById("carta31").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==2){
            document.getElementById("carta41").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==3){
            document.getElementById("carta51").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        }
        document.getElementById("sumaactual1").value=info.sumaFinal
        document.getElementById("suma1").innerHTML="Suma: "+ info.sumaFinal
        if (info.perdio==true){
            document.getElementById("pedir1").disabled=true;
            document.getElementById("quedarse1").disabled=true;
            document.getElementById("pedir2").disabled=false;
            document.getElementById("quedarse2").disabled=false;
            perdedores[0]=true
            alert("Ha perdido el jugador 1!");           
        }
    } else if (info.turno==2){
        
        if (info.veces==1){
            document.getElementById("carta32").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==2){
            document.getElementById("carta42").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==3){
            document.getElementById("carta52").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        }
        document.getElementById("sumaactual2").value=info.sumaFinal
        document.getElementById("suma2").innerHTML="Suma: "+ info.sumaFinal
        if (info.perdio==true){
            document.getElementById("pedir2").disabled=true;
            document.getElementById("quedarse2").disabled=true;
            alert("Ha perdido el jugador 1!");
            let suma3= document.getElementById("sumaactual3").value;
            console.log(suma3);
            perdedores[0]=true
            ajaxPost("/crupier",{suma3:suma3},function(info){
                let sumaResultados=[]
                sumaResultados[0]=document.getElementById("sumaactual1").value
                sumaResultados[1]=document.getElementById("sumaactual2").value
                sumaResultados[2]=document.getElementById("sumaactual3").value
                sumaResultados.push(perdedores);
                console.log(sumaResultados);
                ajaxPost("/resultados",{sumaResultados:sumaResultados},function(info){
                })
            })
        }} 
    if (info.turno==3){
        console.log("entre al turno")
        if (info.veces==1){
            document.getElementById("carta23").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
         } else if (info.veces==2){
            document.getElementById("carta33").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==3){
            document.getElementById("carta43").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        } else if (info.veces==4){
            document.getElementById("carta53").src='img/'+info.cartaElegida.palo+info.cartaElegida.numero+'.png';
        }
        document.getElementById("sumaactual3").value=info.sumaFinal
        document.getElementById("suma3").innerHTML="Suma: "+ info.sumaFinal
        if (info.perdio==true){
            perdedores[1]=true
        }
    }

});
