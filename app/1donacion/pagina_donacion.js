// 1ra

'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title,
  Content, Footer, Button,
  Text, View, Spinner, Icon
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Paginas, Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { MostrarCombo } from './Combo';

class PaginaDonacion extends Component {
  render(){
    const { combos, alElegir, alSalir, usuario, presentacion } = this.props
    return (
      <Pagina titulo={"Elegi tu combo"} alSalir={() => alSalir() }>
        <IndicatorViewPager style={Pantalla.pagina} indicator={ this.generarPuntos(combos.length + presentacion ? 1 : 0) }>
          <View><PaginaPresentacion /></View>
          {combos.map( (combo, indice) => <View key={indice}><PaginaProducto combo={combo} alElegir={ () => alElegir(combo) }/></View> )}
        </IndicatorViewPager>
      </Pagina>
    )
  }

  generarPuntos(paginas){
    return <PagerDotIndicator pageCount={paginas} style={{bottom:80}}/>
  }
}

class PaginaPresentacion extends Component {
  render(){
    return (
      <Contenido>
        <View style={{flex: 1, backgroundColor: 'skyblue', alignItems: 'center'}}>
          <Text style={{fontSize:30, marginTop:20, height:100,color:'red'}}> </Text>
          <Image style={{ resizeMode: 'cover' }} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/icono.png?alt=media', width: 200, height: 200}} />
        </View>
        <View style={{height: 50, backgroundColor: 'steelblue', alignItems:'center'}}>
          <Text style={{fontSize: 20}}> Elegí tu combo y ayudá </Text>
         </View>
      </Contenido>
    )
  }
}

class PaginaProducto extends Component {
  render(){
    const { combo, alElegir } = this.props;
    return (
      <Contenido>
        <MostrarCombo combo={combo} />
        <Button onPress={() => alElegir()} style={Pantalla.accion}> Elegir </Button>
      </Contenido>
    )
  }
}

export { PaginaDonacion }
