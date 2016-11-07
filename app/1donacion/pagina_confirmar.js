// 2da

'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon, List, ListItem, Radio,
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Pedido, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { MostrarCombo } from './Combo';

class PaginaConfirmar extends Component {

  render(){
    const { pedido, combo,  alCancelar, alConfirmar, alSalir, usuario, lugar } = this.props
    const { cadete, estado, cliente } = pedido
    console.log("PaginasConfirmar", typeof(pedido), pedido.entregarEn)
    return (
      <Pagina titulo="Confirmar" alSalir={() => alSalir() }>
        <Contenido>
          <MostrarCombo combo={combo} compacto={true}/>
          <List>
            <ListItem>
              <Text style={{fontWeight:'bold'}}> ¿Estás seguro que querés este combo? </Text>
            </ListItem>
          </List>
          <Button block danger style={Pantalla.accion1} onPress={ () => alCancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>
          <Button block style={Pantalla.accion2} onPress={ () => alConfirmar() }><Icon name='ios-checkmark' /> Confirmar!</Button>
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaConfirmar }
