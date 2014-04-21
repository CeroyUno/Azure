/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var myScroll;
function loaded() {
	myScroll = new iScroll('wrapperListado');
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

/* * * * * * * *
 *
 * Use this for high compatibility (iDevice + Android)
 *
 */
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        mostrar();
    }
};

var client = new WindowsAzure.MobileServiceClient(
    "https://phonegapspain.azure-mobile.net/",
    "HnvvPkJGBAPHQVLbgTXfeVSwCfdGDQ48"
);

function insertar(){
    var item = { text: $( "#valor" ).val() };
    client.getTable("Item").insert(item).done(function (results) {
        volver();
        mostrar();
    }); 
}

function mostrar(){
    $('#placeToInsert').html("");
    client.getTable("Item").read().then(function (todoItems) {
        var li=''; 
        for (var i = 0; i < todoItems.length; i++) {
            li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
        }
        $('#placeToInsert').append(li);
        myScroll.refresh();
    }).read().done(function (results) {
            alert(JSON.stringify(results));
    }, function (err) {
           alert("Error: " + err);
    });   
}

function busqueda(texto){
    alert(texto);
    $('#placeToInsert').html("");
    client.getTable("Item").where({
        text: texto
    }).read().then(function (todoItems) {
        var li=''; 
        for (var i = 0; i < todoItems.length; i++) {
            li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
        }
        $('#placeToInsert').append(li);
        myScroll.refresh();
    }).read().done(function (results) {
         alert(JSON.stringify(results));
    }, function (err) {
           alert("Error: " + err);
    });   
}

function mostrarFormulario(){
    $("#scrollerFormulario").html('<input id="valor" type="text" placeholder="Valor del item"><div class="boton" onclick="insertar()">Enviar</div>');
    $( "#formulario" ).removeClass( "right" );
    $( "#formulario" ).addClass( "center" );
}

function volver(){
    $( "#formulario" ).removeClass( "center" );
    $( "#formulario" ).addClass( "right" );
}

function modificar(id){
    var item = { text: $( "#valor" ).val() };
    client.getTable("Item").update({
        id: id,
        text: $( "#valor" ).val()
    }).done(function (result) {
        volver();
        mostrar();
    });
}

function eliminar(id){
    client.getTable("Item").del({ id: id }).then(function (todoItems) {   
        volver();
        mostrar();  
    });
}

function ficha(id){
    $("#scrollerFormulario").html('<input id="valor" type="text" placeholder="Valor del item"><div class="boton" onclick="modificar(\''+id+'\')">Modificar</div><div class="boton" onclick="eliminar(\''+id+'\')">Eliminar</div>');
    
    client.getTable("Item").where({
        id: id
    }).read().then(function (todoItems) {
        $("#valor").val(todoItems[0].text);
    });
 
    $( "#formulario" ).removeClass( "right" );
    $( "#formulario" ).addClass( "center" );
}