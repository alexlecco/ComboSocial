'use strict';
import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title,
  Content, Grid, Col,
  Row, List, ListItem,
  Card, CardItem, Button,
  Text, View, Spinner,
  Icon, Thumbnail,
} from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla, Item } from './../styles';

class Empleado extends Component {
  constructor(props){
    super(props)

    this.state = { empleado: false, combos: false, donaciones: false }

    Usuario.registrar(this)
    Combo.registrar(this)
    Donacion.registrar(this)
  }

  componentDidMount() {
    const empleado = this.props.id

    Usuario.observar(empleado, 'empleado')
    Usuario.observar(usuario => usuario.esCliente)
    Combo.observar(combo => combo.activo)
    Donacion.observar(donacion => donacion.enCocina(empleado))
  }

  componentWillUnmount(){
    const {empleado} = this.state
    empleado && empleado.detener()

    Usuario.detener()
    Combo.detener()
    Donacion.detener()
  }

  alAceptar = (combo) => {
      const { donaciones } = this.state
      const empleado = this.props.id
      const donacion = donaciones.find(donacion => donacion.combo === combo.id && donacion.estado === Estados.donado)
      donacion && donacion.aceptar(empleado)
  }

  alDisponer = (combo) => {
    const { donaciones } = this.state
    const empleado = this.props.id
    const donacion = donaciones.find(donacion => donacion.combo === combo.id && donacion.estado === Estados.aceptado && donacion.empleado === empleado)
    donacion && donacion.entregar()
  }

  calcularComandaDetallada(){
    const {donaciones, combos, usuarios} = this.state

    return donaciones.sort(Donacion.ordenCronologico).map( donacion => ({
          cliente: usuarios.find( cliente => cliente.id === donacion.cliente ),
          combo:   combos.find( combo => combo.id === donacion.combo ),
          donacion:  donacion })
        )
  }

  render(){
    const {usuario, combos, donaciones}  = this.state
    const hayDatos = usuario && combos && donaciones

    if(!hayDatos) { return <Cargando /> }

    const comanda = this.calcularComandaDetallada()
    return (<AdministrarComanda {...this.props} empleado={usuario} comanda={comanda} alAceptar={this.alAceptar} alDisponer={this.alDisponer} />)
  }
}

const AdministrarComanda = (props) => {
  const { comanda, empleado, alSalir } = props
  return (
    <Container>
      <Header>
        <Title>Comanda para [{empleado.id}]</Title>
        <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
      </Header>
      <Content style={{flex:1}}>
        <List dataArray={comanda} renderRow={(item) => <ItemDonacion {...props} item={item} />} />
      </Content>
    </Container>
  )
}

const ItemDonacion = ({item: {cliente, combo, donacion}, alAceptar, alDisponer}) =>
  <ListItem>

      <Card>
        <CardItem header>
          <Text>{cliente.nombre}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Col>
            <View style={Item.centrar}>
              <Thumbnail source={{uri: cliente.foto}} size={80} />
            </View>
            </Col>
            <Col>
              <View style={Item.centrar}>
                <Image source={{uri: combo.foto}} style={Pantalla.imagen(4/3, 0.3)} />
              </View>
            </Col>
            <Col>
              <View style={Item.centrar}>
                {donacion.estado === Estados.donado && <Button onPress={ () => alAceptar(combo) }> Producir </Button>}
                {donacion.estado === Estados.aceptado && <Button success onPress={ () => alDisponer(combo)}> Entregar </Button>}
                {donacion.estado === Estados.entregado && <Text> Esperando valoración... </Text>}
              </View>
            </Col>
          </Grid>
        </CardItem>
        <CardItem footer>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{combo.descripcion}</Text>
          </View>
        </CardItem>
      </Card>

  </ListItem>

export { Empleado };
