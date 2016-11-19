'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title,
  Content, Footer, Button,
  Text, View, Spinner, Icon,
} from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Donacion, Combo, Estados, Bar } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { PaginaBares } from './pagina_bares';
import { PaginaConfirmar } from './pagina_confirmar';
import { PaginaSeguimiento } from './pagina_seguimiento';
import { PaginaDonacion } from './pagina_donacion';
import { Donar } from './Donar';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

class Cliente extends Component {
  constructor(props){
    super(props)
    this.state = { usuario: false, combos: false, donaciones: false, bares: false}

    // BINDING
    Usuario.registrar(this)
    Donacion.registrar(this)
    Combo.registrar(this)
    Bar.registrar(this)
    this.timer = null
  }

  alContar = () => {
    const {contar} = this.state
    this.setState({contar: (contar ||0)+1})
  }

  activarReloj(){
    const {donaciones} = this.state
    // if(donaciones && donaciones[0].enEspera){
      if(!this.timer){
        console.log("Activando el reloj")
        this.timer = setInterval( this.alContar , 1000)
      }
    // } else {
    //   this.detenerReloj()
    // }
  }

  detenerReloj(){
    console.log("Desactivando el reloj")
    clearInterval(this.timer)
    this.timer = null
  }

  componentDidMount() {
    const cliente = this.props.id

    Usuario.observar(cliente)
    Donacion.observar(donacion => donacion.enDonacion(cliente))
    Combo.observar(combo => combo.activo)
    Bar.observar()
    this.activarReloj()
  }

  componentWillUnmount(){
    const { usuario } = this.state
    usuario && usuario.detener()
    Combo.detener()
    Donacion.detener()
    Bar.detener()
    this.detenerReloj()
  }

  render(){
    const {usuario, combos, donaciones, bares}  = this.state


    const hayDonaciones = combos  && donaciones && donaciones.length > 0
    const hayCombos     = combos  && combos.length  > 0
    const hayBares      = bares

    if(hayBares) {
      var bar = bares[0]
      return <PaginaBares />
    }

    if(hayDonaciones){
      var donacion = donaciones[0]
      var combo  = combos.find(combo => combo.id === donacion.combo)

      if(donacion.estado === Estados.pendiente ){
        return <PaginaConfirmar {...this.props}
                  usuario={usuario}
                  donacion={donacion}
                  combo={combo}
                  alConfirmar ={ () => donacion.confirmar() }
                  alCancelar ={ () => donacion.cancelar() } />
      } else {
        return <PaginaSeguimiento {...this.props}
                  usuario={usuario}
                  donacion={donacion}
                  combo={combo} />
      }
    }

    if(hayCombos){

      return <PaginaDonacion {...this.props}
                  usuario={usuario}
                  combos={combos}
                  alElegir={ combo => Donacion.pedir(usuario, combo) } />
    }

    return <Cargando />
  }
}

class Pago extends Component {
  render(){
    const {demora, precio} = this.props
    const esTarde = demora > EsperaMaxima
    const total   = esTarde ? `Hoy comes GRATIS` : `Total a pagar $${precio}`
    const detalle = esTarde ? 'Lo sentimos... no llegamos a tiempo' : `Si demoramos más de ${humanizeHora(EsperaMaxima - demora)} es GRATIS`
    const color   = esTarde ? 'red' : 'blue'
    return (
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize: 24, color, fontWeight: 'bold', marginTop:10}}>{total}</Text>
        <Text style={{fontSize: 10, color: 'gray'}}> {detalle} </Text>
      </View>
    )
  }
}

export { Cliente }
