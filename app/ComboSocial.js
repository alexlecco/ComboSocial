'use strict';

import React, { Component } from 'react';

import { AsyncStorage, StyleSheet, } from 'react-native';

import {
  Container, Header, Title,
  Subtitle, Content, Footer,
  List, ListItem, Thumbnail,
  Button, Text, View,
} from 'native-base';

import { Acciones } from './componentes/acciones.js';
import { Pagina, Contenido, Cargando } from './componentes/pagina';
import { Estilos, Estilo, Pantalla } from './styles';
import { Usuario, Datos } from './datos';

import { Cliente }  from './donacion/Cliente';

export default class ComboSocial extends Component {
  constructor(props) {
    super(props)

    this.state = { usuarios: false, usuario: false }
    Usuario.registrar(this)
  }

  componentDidMount() {
    Usuario.observar()
    this.leerUsuario()
  }

  componentWillUnmount(){
    Usuario.detener()
    // Usuario.detener(this.state.usuario.id);
  }

  //ACCIONES DEL SISTEMA
  alIngresar(usuario) {
    this.setState({ usuario: usuario })
    this.escribirUsuario(usuario.id)
  }

  recuperarUsuario(id){
  }

  leerUsuario(){
    AsyncStorage.getItem('@usuario:id')
      .then( valor => Usuario.leer(valor) )
      .catch( error => console.log("ERROR leerUsuario", error) )
  }

  escribirUsuario(id){
    AsyncStorage.setItem('@usuario:id', id)
      .then( () => console.log("USUARIO GUARDADO") )
      .catch( error => console.log("USUARIO CON ERROR", error))
    // if(id==null){
    //
    // } else {
      // AsyncStorage.setItem('@usuario:id', id, (aux) => console.log("USUARIO GUARDADO", aux));
    // }
  }

  alSalir() {
     this.setState({ usuario: null })
     AsyncStorage.removeItem('@usuario:id');
  }

  render() {
    const { usuarios, usuario } = this.state

    if(!usuarios)  { return <Cargando/> }

    if(!usuario) { return <ElegirUsuario usuarios={usuarios} alElegir={ usuario => this.alIngresar(usuario)} />}

    if(usuario.esCliente ) { return <Cliente id={usuario.id} alSalir={ () => this.alSalir() }/> }
  }
}

const ejecutarAccion = (accion) => {
  if(accion==0){ Datos.cargarCombos() }
  if(accion==1){
    Datos.cargarUsuarios();
    AsyncStorage.getItem('@usuario:id')
      .then( valor => console.log("OK Probando getItem : ", valor) )
      .catch( error => console.log("ERROR Probando getItem", error) )
      // .done()
  }
  if(accion==2){ Datos.borrarCombos() }
}

const ElegirUsuario = (props) => {
  const clientes     = props.usuarios.filter( u => u.esCliente )
  const empleados    = props.usuarios.filter( u => u.esEmpleado )
  const propietarios = props.usuarios.filter( u => u.esPropietario )
  const { alEjecutar } = props

  return (
    <Container>
      <Header>
        <Title> Combo Social - Panel de control </Title>
      </Header>
      <Content>
        <ListarUsuarios titulo="Clientes"     {...props} usuarios={clientes} />
        <ListarUsuarios titulo="Empleados"    {...props} usuarios={empleados} />
        <ListarUsuarios titulo="Propietarios" {...props} usuarios={propietarios} />
      </Content>
      <Footer>
        <Acciones titulos={["+ Combos", "+ Usuarios", "- Combos"]} alElegir={(nroAccion) => ejecutarAccion(nroAccion)} />
      </Footer>
    </Container>
  )
}

const ListarUsuarios = (props) => {
  const { titulo, usuarios } = props
  return (
   <View style={{}}>
      <Text style={{ height: 20, marginLeft:10, marginTop:10 }}>{titulo}</Text>
      <List dataArray={usuarios}
            renderRow={(usuario) =>
              <ListItem style={{ height:80 }} button onPress={() => props.alElegir(usuario)}>
                <Thumbnail source={{uri: usuario.foto}} size={75} />
                <Text style={Estilo.usuario.nombre}>{usuario.nombre}</Text>
                <Text style={Estilo.usuario.id}>id:{usuario.id}</Text>
              </ListItem>
            }>
      </List>
   </View>
 )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5991c',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#5A5A5A',
    marginBottom: 5,
  },
});
