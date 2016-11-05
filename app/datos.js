'use strict';

import * as firebase from 'firebase';

const dbconfig = {
  apiKey:        "AIzaSyDEriYiHfdPb0TKWlGBkRj66XMh_RkFHu4",
  authDomain:    "combo-social.firebaseapp.com",
  databaseURL:   "https://combo-social.firebaseio.com",
  storageBucket: "combo-social.appspot.com",
};

export const ListaEstados = 'pendiente | aceptada | cancelada'.split(' | ')
export const Estados      = ListaEstados.reduce( (h, x) => Object.assign(h, {[x]:x}), {} )

const base = firebase.initializeApp(dbconfig);
const raiz = base.database().ref()
const almacenamiento = firebase.storage()
const almacenamientoRef = almacenamiento.ref()
const usuariosRef = almacenamientoRef.child('usuarios')
const usu001Ref = usuariosRef.child('usu001.png')

firebase.storage().ref('Images/image1.jpg');

const values = objeto => Object.keys(objeto || []).map(clave => objeto[clave])

const Plurales   = [ [/n$/, 'nes'], [/z$/, 'ces'], [/([aeiou])$/, '$1s'],]
const Singulares = [ [/nes$/, 'n'], [/ces$/, 'z'], [/([aeiou])s$/, '$1'],]

String.prototype.plural = function() { return Plurales.reduce( (tmp, [r, s]) => tmp.replace(r, s), this) }
String.prototype.singular = function() { return Singulares.reduce( (tmp, [r, s]) => tmp.replace(r, s), this) }

const FormatoID = /^\w+$/
const esString = item => typeof(item) === 'string'
const esID     = item => esString(item) && FormatoID.test(item)
const esFuncion= item => typeof(item) === 'function'

// CAPA DE DATOS
const normalizar = camino => (Array.isArray(camino) ? camino : [camino]).filter(campo => !!campo)
const url        = camino => camino.join('/').toLowerCase()

const esColeccion = camino => normalizar(camino).length == 1
// const esRegistro  = camino => normalizar(camino).length == 2
// const esValor     = camino => normalizar(camino).length == 3

export class Datos {
    static cargarCombos(){
      const datos = require('./datos.json')
      raiz.child('combos').set(datos.combos)
    }

    static cargarUsuarios(){
      const datos = require('./datos.json')
      raiz.child('usuarios').set(datos.usuarios)
    }

    static cargar(){
      this.cargarCombos()
      this.cargarUsuarios()
    }

    static borrarCombos(){
      raiz.child('combos').set(null)
    }

    static referencia(camino) {
      return raiz.child( url( normalizar(camino) ) )
    }

    static leer(camino, alConvertir, alTraer) {
      const convertir = esColeccion(camino) ? this.valores : this.valor
      this.referencia(camino).once('value', datos => alTraer( alConvertir( convertir(datos)) ))
    }

    static observar(camino, alConvertir, alTraer) {
      const convertir = esColeccion(camino) ? this.valores : this.valor
      this.referencia(camino).on('value', datos => alTraer( alConvertir( convertir(datos) ) ))
    }

    static detener(camino){
      this.referencia(camino).off('value')
    }

    static valor(origen){ return origen.val() || {} }
    static valores(origen) { return values(origen.val()) }
}

class Registro {
  static registrar(componente){ this.componente = componente }
  static informar(nombre, valor){
    this.componente && this.componente.setState( {[nombre]: valor} )
  }

  get registro() { return this.constructor.name.toLowerCase() }
  get coleccion(){ return this.registro.plural() }

  static get registro(){ return new this().registro }
  static get coleccion(){ return new this().coleccion }

  constructor(datos){
    Object.assign(this, datos)
  }

  referencia(campo=null){
    return Datos.referencia([this.coleccion, this.id, campo])
  }

  detener(){
    Datos.detener([this.coleccion, this.id])
  }

  escribir(){
    this.id = this.id || Datos.referencia(this.coleccion).push().key
    Datos.referencia([this.coleccion, this.id]).set(this)
  }

  static observar(condicion, destino=false){
    const {registro, coleccion} = this
    destino = destino || esID(condicion) ? registro : coleccion

    this.informar(destino, false)
    if(esID(condicion)){
      const id = condicion
      Datos.observar([coleccion, id],
        datos => new this(datos),
        datos => this.informar(destino, datos)
      )
    } else {
      condicion = condicion || (x => true)
      Datos.observar(coleccion,
        datos => datos.map(item => new this(item)),
        datos => this.informar(destino, datos.filter( condicion ) )
      )
    }
  }

  static leer(condicion, destino=false){
    const {registro, coleccion} = this
    destino = destino || esID(condicion) ? registro : coleccion

    this.informar(destino, false)
    if(esID(condicion)){
      const id = condicion
      Datos.leer([coleccion, id],
        datos => new this(datos),
        datos => this.informar(destino, datos)
      )
    } else {
      condicion = condicion || (x => true)
      Datos.leer(coleccion,
        datos => datos.map(item => new this(item)),
        datos => this.informar(destino, datos.filter( condicion ) )
      )
    }
  }

  static detener(id = null){
    Datos.detener([this.coleccion, id])
  }
}

export class Usuario extends Registro {
  get foto(){return `https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/usuarios%2F${this.id}.png?alt=media` }

  get esCliente()     {return this.tipo === 'cliente' }
  get esEmpleado()    {return this.tipo === 'empleado' }
  get esPropietario() {return this.tipo === 'propietario' }
}

export class Bar extends Registro {
  get foto(){return `https://dl.dropboxusercontent.com/u/1086383/platos/${this.id}.jpg`}
  get detalle(){ return `El bar: ${this.nombre} ofrece el mejor servicio`}
}
