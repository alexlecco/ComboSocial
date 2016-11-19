'use strict';

import React, { Component } from 'react';
import { Image, } from 'react-native';

import {
  Container, Header, Title,
  Content, Grid, Col,
  Row, List, ListItem,
  Card, CardItem, Button,
  Text, View, Spinner,
  Icon, Thumbnail,
} from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';

import { Usuario, Donacion, Combo, Estados, Proyecto } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

class Propietario extends Component {
    constructor(props){
      super(props)

      this.state = { usuario: false, proyectos: false, platos: false, donaciones: false }
      Usuario.registrar(this)
      Combo.registrar(this)
      Donacion.registrar(this)
      Proyecto.registrar(this)
    }

    componentDidMount() {
      const cadete = this.props.id
      Usuario.observar(cadete)
      Usuario.observar(usuario => usuario.esCliente || usuario.esCocinero )

      Combo.observar( plato => plato.activo )
      Donacion.observar( donacion => donacion.enEntrega(cadete) )
      Proyecto.observar()
    }

    componentWillUnmount(){
      const cadete = this.props.id
      Usuario.detener(cadete)
      Usuario.detener()

      Combo.detener()
      Donacion.detener()
      Proyecto.detener()
    }

    render(){
      const cadete = this.props.id

      const {usuario, proyectos, platos, donaciones, usuarios}  = this.state
      const hayDatos  = usuario && proyectos

      if(!hayDatos) { return <Cargando /> }

      const donacion  = donaciones[0]
      if(!donacion){ return <Libre {...this.props} />}

      const plato    = platos.find(plato => plato.id === donacion.plato)
      const empleado = usuarios.find(usuario => usuario.id === donacion.empleado)
      const cliente  = usuarios.find(usuario => usuario.id === donacion.cliente)

      return <Control {...this.props} donacion={donacion} plato={plato} empleado={empleado} cliente={cliente} />
    }
  }

  const Control = (props) => {
    const { proyecto, donacion, plato, cliente, empleado, alElegir, alSalir } = props

    return (
      <Pagina titulo={"Control"} alSalir={() => alSalir()}>
        <Contenido>
          <Image source={{uri: proyecto.foto}} style={Pantalla.imagen(4/3)}>
            <Precio precio={proyecto.nombre} />
          </Image>
          <View style={{marginTop: Pantalla.separacion}}>
            <Text style={Estilo.plato.descripcion}> {proyecto.nombre} </Text>
            <Text style={Estilo.plato.detalle}> {proyecto.nombre} </Text>
          </View>
        </Contenido>
      </Pagina>
    )
  }

  const Precio = ({precio}) =>
    <View >
      <Text style={[Estilo.plato.precio, Estilo.plato.ubicarPrecio]}>${precio}</Text>
    </View>

  const Libre = (props) =>
    <Pagina titulo={"Control"} alSalir={() => props.alSalir()}>
      <Text style={{fontSize: 20, alignSelf: 'center'}}> No hay donaciones </Text>
    </Pagina>

export { Propietario };
