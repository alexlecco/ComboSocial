'use strict';

import * as firebase from 'firebase';

const dbconfig = {
  apiKey:        "AIzaSyDEriYiHfdPb0TKWlGBkRj66XMh_RkFHu4",
  authDomain:    "combo-social.firebaseapp.com",
  databaseURL:   "https://combo-social.firebaseio.com",
  storageBucket: "combo-social.appspot.com",
};

export const ListaEstados = 'pendiente | iniciada | tomada | disponible | retirado | cobrada | finalizada | cancelada'.split(' | ')
export const Estados      = ListaEstados.reduce( (h, x) => Object.assign(h, {[x]:x}), {} )

const base = firebase.initializeApp(dbconfig);
const raiz = base.database().ref()

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

    static cargarProyectos(){
      const datos = require('./datos.json')
      raiz.child('proyectos').set(datos.proyectos)
    }

    static cargarUsuarios(){
      const datos = require('./datos.json')
      raiz.child('usuarios').set(datos.usuarios)
    }

    static cargarBares() {
      const datos = require('./datos.json')
      raiz.child('bares').set(datos.bares)
    }

    static cargar(){
      this.cargarCombos()
      this.cargarProyectos()
      this.cargarUsuarios()
      this.cargarBares()
    }

    static borrarDonaciones(){
      raiz.child('donaciones').set(null)
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

export class Combo extends Registro {
  get foto(){return `https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/combos%2F${this.id}.jpg?alt=media`}
  get detalle(){ return `Comprando este combo estás donando $${this.contribución}`}
}

export class Proyecto extends Registro {
  get foto(){return `https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/proyectos%2F${this.id}.jpg?alt=media`}

  actualizarMontoActual(combo){
    this.monto_actual += combo.contribución
    this.escribir()
  }
}

export class Bar extends Registro {
  get foto(){return `https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/bares%2F${this.id}.jpg?alt=media`}
}

export class Donacion extends Registro {
    static get EsperaMaxima(){ return 5 * 60 } // 30 minutos o GRATIS

    static ordenCronologico(a, b) {
      const horaA = a.horas[Estados.iniciada]
      const horaB = b.horas[Estados.iniciada]
      return horaA && horaB ? horaA - horaB : 0
    }

    get horas(){
      var horas = {}
      values(this.historia).forEach( ({estado, hora}) => horas[estado] = new Date(hora) )
      return horas
    }

    tiempoEntre(desde, hasta){
      const tiempoDesde = this.horas[desde]
      const tiempoHasta = this.horas[hasta] || (new Date())
      return (tiempoDesde && tiempoHasta) ? (tiempoHasta - tiempoDesde) / 1000 : null
    }

    get tiempoDonacion(){
      return this.tiempoEntre(Estados.iniciada, Estados.finalizada)
    }

    get tiempoValoracion(){
      return this.tiempoEntre(Estados.cobrada, Estados.finalizada)
    }

    get tiempoCoccion(){
      return this.tiempoEntre(Estados.tomada, Estados.cobrada)
    }

    get tiempoFaltante(){
      return Donacion.EsperaMaxima - this.tiempoEntre(Estados.iniciada, Estados.cobrada)
    }

    // get salio(){
    //   const retirado = this.horas[Estados.retirado]
    //   return retirado ? (new Date() - retirado) / 1000 : null
    // }
    //
    // get duracion(){
    //   const iniciada    = this.horas[Estados.iniciada]
    //   const cobrada = this.horas[Estados.cobrada]
    //   return iniciada && cobrada ? (cobrada - iniciada) / 1000 : null
    // }

    get activo(){ return this.estado != Estados.cancelada && this.estado != Estados.pendiente && this.estado != Estados.finalizada }

    enDonacion(cliente){
      return this.cliente === cliente && !(this.estado == Estados.finalizada || this.estado == Estados.cancelada)
    }

    enCocina(empleado){
      return this.estado === Estados.iniciada || this.empleado === empleado && (this.estado === Estados.tomada || this.estado === Estados.disponible || this.estado === Estados.cobrada)
    }

    enEntrega(cadete){
      return this.estado === Estados.disponible || this.cadete === cadete && this.estado === Estados.retirado
    }

    get enEspera(){
      return [Estados.tomada, Estados.disponible, Estados.retirado].includes(this.estado)
    }

    get combo(){
      return this.combos[0].id
    }

    // ACCIONES
    static pedir(cliente, combo){
      // const iniciada = new Donacion({cliente: cliente.id, {combos: {combo: {id: combo.id, cantidad: 1}}})
      const iniciada = new Donacion({cliente: cliente.id})
      iniciada.agregar(combo.id)
      iniciada.cambiarEstado(Estados.pendiente)
    }

    donarEn(proyecto, forzar = true){
      if(forzar){
        this.proyecto = proyecto
      } else {
        this.proyecto = (this.proyecto === proyecto ? null : proyecto)
      }
      this.escribir()
    }

    cambiarEstado(estado){
      if(this.estado != estado){
        this.estado = estado
        this.historia = this.historia || []
        this.historia.push({ estado, hora: new Date().toString() })
      }
      this.escribir()
    }

    agregar(combo){
      this.combos = this.combos || []
      let actual = this.combos.find( p => p.id == combo)
      if(actual){
        actual.cantidad += 1
      } else {
        this.combos.push({ id: combo, cantidad: 1, valoracion: 0 })
      }
      this.escribir()
    }

    quitar(combo){
      this.combos = this.combos || []
      let actual = this.combos.find( p => p.id == combos)
      if(actual){
        actual.cantidad -= 1
      }
      this.combos = this.combos.filter( p => p.cantidad > 0)
      this.escribir()
    }

    aceptar(empleado){
      this.empleado = empleado
      this.cambiarEstado(Estados.tomada)
    }

    disponer(){
      this.cambiarEstado(Estados.disponible)
    }

    confirmar(){
      this.cambiarEstado(Estados.iniciada)
    }

    cancelar(){
      this.cambiarEstado(Estados.cancelada)
    }

    retirar(cadete){
      this.cadete = cadete
      this.cambiarEstado(Estados.retirado)
    }

    entregar(){
      this.cambiarEstado(Estados.cobrada)
    }

    get valoracion(){
      return this.combos[0].valoracion || 0
    }

    ponerValoracion(valor){
      if(valor >= 0 || valor <= 5){
        this.combos[0].valoracion = valor
      }
    }

    valorar(){
      if(this.valoracion >= 0){
        this.cambiarEstado(Estados.finalizada)
      }
    }

}
