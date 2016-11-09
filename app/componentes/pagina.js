import React, { Component } from 'react';
import { Image } from 'react-native';
import {
  Container, Header, Title,
  Content, Button, View,
  Icon, Spinner,
} from 'native-base';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Pantalla, Item, Combo} from './../styles';

const Pagina = ({titulo, alSalir, children}) =>
  <Container>
      <Header>
        <Title>{titulo}</Title>
        {!!alSalir && <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>}
      </Header>
    <Content>
      <View style={Pantalla.pagina}>{children}</View>
    </Content>
  </Container>

const Contenido = ({children}) =>
  <View style={Pantalla.contenido}>{children}</View>

const Cargando = ({color}) =>
  <View style={{flex:1, alignItems: 'stretch'}}>
    <Image style={{ marginTop: 100, width: 350, height: 100, flex: 1, justifyContent: 'center', alignSelf: 'center',}} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/combo-social.appspot.com/o/icono.png?alt=media', width: 250, height: 250}} />
    <Spinner style={{flex:1}} color={color} />
  </View>

export { Pagina, Contenido, Cargando}
