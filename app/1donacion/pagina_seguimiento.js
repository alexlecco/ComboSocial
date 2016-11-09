// 3ra

'use strict';

import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon,
  Grid, Col, Row,
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';
import { MostrarCombo } from './Combo';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24

  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

const esCompacto = (Platform) => {
  return Platform.OS == 'ios' ? false : true
}

const Accion = ({donacion}) => {
  switch (donacion.estado) {
    case Estados.iniciada:
        return (<Button block danger style={Pantalla.accion} onPress={ () => donacion.cancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>)
    case Estados.cobrada:
        return (<Button block style={Pantalla.accion} onPress={ () => donacion.valorar() }><Icon name='ios-checkmark' /> Volver </Button>);
    default:
        return null;
  }
}

const Mostrar = ({texto, demora, faltante, completo}) => {
  const mensajeRapido = completo ? "Misión cumplida. Nos sobró " + humanizeHora(faltante) : "Te lo entregamos en "+humanizeHora(faltante)
  const mensajeLento  = (completo ? "Fallamos por " + humanizeHora(-faltante) : "Estamos " + humanizeHora(-faltante) +" atrazados") + " pero..."
  const ofertaRapido  = completo ? "" : "o comes gratis"
  const ofertaLento   = "¡HOY " + (completo ? "COMISTE" : "COMES") +" GRATIS!"
  return (
    <View style={{position:'absolute', bottom: 70, left:20, right: 20}}>
      <Text style={{fontSize: 20}}>{texto}</Text>
    </View>
  )
}

const Estado = ({donacion}) => {
  switch (donacion.estado) {
    case Estados.pendiente:
        return <Mostrar texto={"Donacion en curso"} demora={null} faltante={donacion.tiempoFaltante} />

    case Estados.iniciada:
        return <Mostrar texto={"Tu donación fue registrada. cuando te cobren será validada."} demora={donacion.tiempoDonacion} faltante={donacion.tiempoFaltante} />

    case Estados.tomada:
        return <Mostrar texto={"Estamos preparando tu combo."} demora={donacion.tiempoCoccion} faltante={donacion.tiempoFaltante} />

    case Estados.cobrada:
        return (
            <View>
              <Mostrar texto="Tu donacion fué registrada. Muchas gracias por ayudar. " demora={donacion.tiempoValoracion} faltante={donacion.tiempoFaltante} completo={true}/>
              <View style={{position:'absolute', bottom: 100, left:20, right: 20}}>
              </View>
            </View>
        )

    case Estados.finalizada:
        return <Mostrar texto={"Combo entregado"} demora={donacion.tiempoDonacion} faltante={donacion.tiempoFaltante} />

    default:
        return (
          <View style={{position:'absolute', bottom: 100, left:20, right: 20}}>
              <Text style={{fontSize: 20}}>ESTADO: {donacion.estado}</Text>
              <Text style={{fontSize: 20}}> ⏳ PEDIDO   : {humanizeHora(donacion.tiempoDonacion)}</Text>
              <Text style={{fontSize: 20}}> ⏳ ACEPTADO : {humanizeHora(donacion.tiempoCoccion)}</Text>
              <Text style={{fontSize: 20}}> ⏳ ENTREGADO: {humanizeHora(donacion.tiempoFaltante)}</Text>
           </View>
      )
  }
}

class PaginaSeguimiento extends Component {
  render(){
    const { donacion, combo, alSalir, usuario } = this.props
    const { cadete, estado, cliente } = donacion
    return (
      <Pagina titulo="Seguimiento de donacion" alSalir={() => alSalir() }>
        <Contenido>
          <MostrarCombo combo={combo} compacto={esCompacto(Platform)} />
          <Estado {...this.props} />
          <Accion {...this.props} />
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaSeguimiento }
