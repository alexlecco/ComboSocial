'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Footer, Button, Text, View, Spinner, Icon, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { PaginaConfirmar } from './pagina_confirmar';
import { PaginaSeguimiento } from './pagina_seguimiento';
import { PaginaPedido } from './pagina_donacion';
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
    this.state = { usuario: false }

    // BINDING
    Usuario.registrar(this)
    this.timer = null
  }

  componentDidMount() {
    const cliente = this.props.id

    Usuario.observar(cliente)
  }

  componentWillUnmount(){
    const { usuario } = this.state
    usuario && usuario.detener()
  }

  render(){
    const {usuario}  = this.state

    const hayDatos   = usuario

    return < Cargando />
  }
}

/*
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
        <Text style={{fontSize: 10, color: 'gray'}}>{detalle}</Text>
      </View>
    )
  }
}
*/

export { Cliente }
