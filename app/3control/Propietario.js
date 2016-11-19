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

      if(!proyectos){ return <Libre {...this.props} />}

      return <Control {...this.props} proyectos={proyectos} />
    }
  }

  const Control = (props) => {
    const { proyectos, proyecto, donacion, plato, cliente, empleado, alElegir, alSalir } = props

    return (
      <Pagina titulo={"Control de proyectos"} alSalir={() => alSalir()}>
        <Contenido>

          <List dataArray={proyectos}
                renderRow={(proyecto) =>
                  <ListItem>
                    <Card>
                      <CardItem header>
                        <Text >{proyecto.nombre}</Text>
                      </CardItem>
                      <CardItem>
                        <Thumbnail source={{uri: proyecto.foto}} size={75} />
                      </CardItem>

                      <CardItem>
                        <Text> Monto que se busca: {proyecto.monto_meta} </Text>
                      </CardItem>
                      <CardItem>
                        <Text> Monto actual: {proyecto.monto_actual} </Text>
                      </CardItem>

                    </Card>
                  </ListItem>
                }>
          </List>
        </Contenido>
      </Pagina>
    )
  }

  const Libre = (props) =>
    <Pagina titulo={"Control"} alSalir={() => props.alSalir()}>
      <Text style={{fontSize: 20, alignSelf: 'center'}}> No hay donaciones </Text>
    </Pagina>

export { Propietario };
