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

import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { MostrarCombo } from './Combo';

class PaginaConfirmar extends Component {

  render(){
    const { donacion, combo,  alCancelar, alConfirmar, alSalir, usuario, lugar } = this.props
    const { cadete, estado, cliente } = donacion
    return (
      <Pagina titulo="Confirmar" alSalir={() => alSalir() }>
        <Contenido>
          <MostrarCombo combo={combo} compacto={true}/>
          <List>
            <ListItem>
              <Text style={{fontWeight:'bold', textAlign: 'center'}}> ¿A que proyecto querés contribuir con tu combo? </Text>
            </ListItem>

            <ListItem button onPress={ () => donacion.donarEn('pro001', false) }>
              <Radio selected={ donacion.proyecto === "pro001" } onPress={ () => donacion.donarEn('pro001', false) } />
              <Text> una pc para el comedor don bosco </Text>
            </ListItem>
            <ListItem button onPress={ () => donacion.donarEn('pro002', false) }>
              <Radio selected={ donacion.proyecto === "pro002" } onPress={ () => donacion.donarEn('pro002', false) } />
              <Text> una cocina para el comedor don bosco </Text>
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
