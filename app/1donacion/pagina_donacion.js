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
import { Estilos, Estilo, Pantalla, Item } from './../styles';

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
        <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/restaurant.jpg?alt=media'}} style={{flex: 1, alignItems: 'center'}}>
          <Image style={{ resizeMode: 'cover', backgroundColor: '#ffffff99', margin: 20, width: 300 }} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/icono.png?alt=media', width: 250, height: 250}} />
          <Button success style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                            top: 30,
                            width: 200,
                            height: 50,
                            marginBottom: 5, }}
                  onPress={() => {console.log("conocenos")}}> Conocenos
          </Button>
          <Button success style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                            top: 30,
                            width: 200,
                            height: 50,
                            marginTop: 5, }}
                  onPress={() => {console.log("conocenos")}}> Mirá los proyecto
          </Button>
        </Image>
        <View style={{height: 50, backgroundColor: 'steelblue', alignItems:'center'}}>
          <Text style={{fontSize: 20, color: 'white', top: 10}}> Desplazá a la derecha </Text>
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
