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
import { Usuario, Pedido, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla, Item } from './../styles';

class Empleado extends Component {
  constructor(props){
    super(props)

    this.state = { empleado: false, combos: false, pedidos: false }

    Usuario.registrar(this)
    Combo.registrar(this)
    Pedido.registrar(this)
  }

  componentDidMount() {
    const empleado = this.props.id

    Usuario.observar(empleado, 'empleado')
    Usuario.observar(usuario => usuario.esCliente)
    Combo.observar(combo => combo.activo)
    Pedido.observar(pedido => pedido.enCocina(empleado))
  }

  componentWillUnmount(){
    const {empleado} = this.state
    empleado && empleado.detener()

    Usuario.detener()
    Combo.detener()
    Pedido.detener()
  }

  alAceptar = (combo) => {
      const { pedidos } = this.state
      const empleado = this.props.id
      const pedido = pedidos.find(pedido => pedido.combo === combo.id && pedido.estado === Estados.pedido)
      pedido && pedido.aceptar(empleado)
  }

  alDisponer = (combo) => {
    const { pedidos } = this.state
    const empleado = this.props.id
    const pedido = pedidos.find(pedido => pedido.combo === combo.id && pedido.estado === Estados.aceptado && pedido.empleado === empleado)
    pedido && pedido.entregar()
  }

  calcularComandaDetallada(){
    const {pedidos, combos, usuarios} = this.state

    return pedidos.sort(Pedido.ordenCronologico).map( pedido => ({
          cliente: usuarios.find( cliente => cliente.id === pedido.cliente ),
          combo:   combos.find( combo => combo.id === pedido.combo ),
          pedido:  pedido })
        )
  }

  render(){
    const {usuario, combos, pedidos}  = this.state
    const hayDatos = usuario && combos && pedidos

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
        <List dataArray={comanda} renderRow={(item) => <ItemPedido {...props} item={item} />} />
      </Content>
    </Container>
  )
}

const ItemPedido = ({item: {cliente, combo, pedido}, alAceptar, alDisponer}) =>
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
                {pedido.estado === Estados.pedido && <Button onPress={ () => alAceptar(combo) }> Producir </Button>}
                {pedido.estado === Estados.aceptado && <Button success onPress={ () => alDisponer(combo)}> Entregar </Button>}
                {pedido.estado === Estados.entregado && <Text> Esperando valoración... </Text>}
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
