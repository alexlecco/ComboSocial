// 3ra

'use strict';

import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon, Grid, Col, Row,
} from 'native-base';

import { Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';
import { MostrarCombo } from './Combo';

const esCompacto = (Platform) => {
  return Platform.OS == 'ios' ? false : true
}

const Accion = ({donacion}) => {
  switch (donacion.estado) {
    case Estados.iniciada:
        return (<Button block danger style={Pantalla.accion} onPress={ () => donacion.cancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>)
    case Estados.cobrada:
        return (
          <View>
            <Button block style={{backgroundColor: '#3b5998', marginBottom: 5}}> Compartilo en Facebook </Button>
            <Button block style={{backgroundColor: '#dd4b39', marginTop: 5}} > Compartilo en Google + </Button>
            <Button block style={Pantalla.accion} onPress={ () => donacion.valorar() }><Icon name='ios-checkmark' /> Volver </Button>
          </View>
        );
    default:
        return null;
  }
}

const Mostrar = ({texto, demora, faltante, completo}) => {
  return (
    <View style={{position:'absolute', bottom: 70, left:20, right: 20}}>
      <Text style={{fontSize: 20}}>{ texto }</Text>
    </View>
  )
}

const Estado = ({donacion}) => {
  switch (donacion.estado) {
    case Estados.pendiente:
        return <Mostrar texto={"Donacion en curso"} demora={null} faltante={donacion.tiempoFaltante} />

    case Estados.iniciada:
        return <Mostrar texto={"Tu donación fue registrada. cuando te cobremos será validada."} demora={donacion.tiempoDonacion} faltante={donacion.tiempoFaltante} />

    case Estados.tomada:
        return <Mostrar texto={"Estamos preparando tu combo."} demora={donacion.tiempoCoccion} faltante={donacion.tiempoFaltante} />

    case Estados.cobrada:
        return (
            <View>
              <Mostrar texto="Tu donacion fué registrada. Muchas gracias por ayudar. " demora={donacion.tiempoValoracion} faltante={donacion.tiempoFaltante} completo={true}/>
            </View>
        )

    case Estados.finalizada:
        return <Mostrar texto={"Combo entregado"} demora={donacion.tiempoDonacion} faltante={donacion.tiempoFaltante} />

    default:
        return (
          <View style={{position:'absolute', bottom: 100, left:20, right: 20}}>
              <Text style={{fontSize: 20}}>ESTADO: {donacion.estado}</Text>
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
          <Estado {...this.props}  />
          <Accion {...this.props} />
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaSeguimiento }
