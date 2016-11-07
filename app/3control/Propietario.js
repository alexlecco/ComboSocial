'use strict';

import React, { Component } from 'react';
import { Image, } from 'react-native';

import { Container, Header, Title, Content, Grid, Col, Row, List, ListItem, Card, CardItem, Button, Text, View, Spinner, Icon, Thumbnail, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';

import { Usuario, Donacion, Combo, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

class Propietario extends Component {
    constructor(props){
      super(props)

      this.state = { usuario: false, platos: false, donaciones: false }
      Usuario.registrar(this)
      Combo.registrar(this)
      Donacion.registrar(this)
    }

    componentDidMount() {
      const cadete = this.props.id
      Usuario.observar(cadete)
      Usuario.observar(usuario => usuario.esCliente || usuario.esCocinero )

      Combo.observar( plato => plato.activo )
      Donacion.observar( donacion => donacion.enEntrega(cadete) )
    }

    componentWillUnmount(){
      const cadete = this.props.id
      Usuario.detener(cadete)
      Usuario.detener()

      Combo.detener()
      Donacion.detener()
    }

    alElegir = (donacion) => {
      const cadete = this.props.id
      if(donacion.estado == Estados.disponible){
        donacion.retirar(cadete)
      } else {
        donacion.entregar()
      }
    }

    render(){
      const cadete = this.props.id

      const {usuario, platos, donaciones, usuarios}  = this.state
      const hayDatos  = usuario && platos && donaciones

      if(!hayDatos) { return <Cargando /> }

      const donacion  = donaciones[0]
      if(!donacion){ return <Libre {...this.props} />}

      const plato    = platos.find(plato => plato.id === donacion.plato)
      const empleado = usuarios.find(usuario => usuario.id === donacion.empleado)
      const cliente  = usuarios.find(usuario => usuario.id === donacion.cliente)

      return <Envio {...this.props} donacion={donacion} plato={plato} empleado={empleado} cliente={cliente} alElegir={ this.alElegir } />
    }
  }

  const Envio = (props) => {
    const { donacion, plato, cliente, empleado, alElegir, alSalir } = props
    const accion = donacion.estado === Estados.disponible ? 'Retirar ya!' : 'Entregar ya!'

    return (
      <Pagina titulo={"Envio"} alSalir={() => alSalir()}>
      <Contenido>
        <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
          <Precio precio={plato.precio} />
        </Image>
        <View style={{marginTop: Pantalla.separacion}}>
          <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
          <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
          {donacion.estado === Estados.disponible && <Cocinero {...props} />}
          {donacion.estado === Estados.retirado   && <Cliente  {...props} />}
        </View>
        <Button block style={Pantalla.accion} onPress={ () => alElegir(donacion) }><Text>{accion}</Text></Button>
        </Contenido>
      </Pagina>
    )
  }

  const Precio = ({precio}) =>
    <View >
      <Text style={[Estilo.plato.precio, Estilo.plato.ubicarPrecio]}>${precio}</Text>
    </View>

  const Cocinero = ({donacion, empleado}) =>
    <Grid>
      <Col><Thumbnail source={{uri: empleado.foto}} size={100} /></Col>
      <Col>
        <Text style={Estilo.donacion.descripcion}> Cocinero: </Text>
        <Text style={Estilo.donacion.cantidad}>{empleado.nombre}</Text>
        <Text style={Estilo.donacion.descripcion}> Dirección: </Text>
        <Text style={Estilo.donacion.cantidad}>{empleado.domicilio}</Text>
      </Col>
    </Grid>

  const Cliente = ({donacion, cliente}) =>
    <Grid>
      <Col><Thumbnail source={{uri: cliente.foto}} size={100} /></Col>
      <Col>
        <Text style={Estilo.donacion.descripcion}> Cliente: </Text>
        <Text style={Estilo.donacion.cantidad}>{cliente.nombre}</Text>
        <Text style={Estilo.donacion.descripcion}> Dirección: </Text>
        <Text style={Estilo.donacion.cantidad}>{cliente.domicilio}</Text>
      </Col>
    </Grid>



  const Libre = (props) =>
    <Pagina titulo={"Envio"} alSalir={() => props.alSalir()}>
      <Text style={{fontSize: 20, alignSelf: 'center'}}>No hay donaciones</Text>
    </Pagina>

export { Propietario };
