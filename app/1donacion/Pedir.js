'use strict';

import React, { Component } from 'react';
// import { Image } from 'react-native';

// import { Container, Header, Title, Content, Footer, Button, Text, View, Spinner, Icon } from 'native-base';
//
// import StarRating from 'react-native-star-rating';
// import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Paginas, Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Pedido, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { Screen, View, Card, Image, Subtitle, Caption, Icon, Button, Text, ListView} from '@shoutem/ui';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

class Pedir extends Component {
  render(){
    const { combos, alElegir, alSalir, usuario, presentacion } = this.props
    return (
      <View styleName="full-screen">
        <Caption>Holis</Caption>
        <Text>Esta es una pantalla </Text>
        <ListView data={combos}
          renderRow={(combo)=><Text>{combo.id}</Text>}
        />
      </View>
      // <Pagina titulo={"Realizar Pedidos"} alSalir={() => alSalir() }>
      //   <IndicatorViewPager style={Pantalla.pagina} indicator={ this.generarPuntos(combos.length + presentacion ? 1 : 0) }>
      //     {!!presentacion &&<View><PaginaPresentacion /></View>}
      //     {combos.map( (combo, indice) => <View key={indice}><PaginaProducto combo={combo} alElegir={ () => alElegir(combo) }/></View> )}
      //   </IndicatorViewPager>
      // </Pagina>
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
        <View style={{height: 140, backgroundColor: 'powderblue'}} />
        <View style={{flex: 1, backgroundColor: 'skyblue', alignItems: 'center'}}>
          <Text style={{fontSize:30, marginTop:20, height:100,color:'red'}}>El combo del dia</Text>
        </View>
        <View style={{height: 50, backgroundColor: 'steelblue', alignItems:'center'}}>
          <Text style={{fontSize: 20}}>Tu combo en 30 minutos o gratis</Text>
         </View>
      </Contenido>
    )
  }
}

class PaginaProducto extends Component {
  render(){
    const {combo, alElegir} = this.props
    return (
      <Contenido>
        <Image source={{uri: combo.foto}} style={Pantalla.imagen(4/3)} >
          <Precio Precio={combo.Precio} />
        </Image>
        <View style={{marginTop: Pantalla.separacion}}>
            <Text style={Estilo.combo.descripcion}> {combo.descripcion} </Text>
            <Text style={Estilo.combo.detalle}> {combo.detalle} </Text>
        </View>
        <Button onPress={() => alElegir()} style={Pantalla.accion}> ¡Pedir Ya! </Button>
      </Contenido>
    )
  }
}

const Precio = ({precio}) =>
  <View style={Estilo.combo.ubicarPrecio}>
    <Text style={Estilo.combo.precio}>u$s{precio}</Text>
  </View>


export { Pedir }
