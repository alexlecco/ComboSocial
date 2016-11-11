'use strict';

import React, { Component } from 'react';

import { AsyncStorage } from 'react-native';

import {
  Container, Header, Title,
  Subtitle, Content, Footer,
  List, ListItem, Thumbnail,
  Button, Text, View,
} from 'native-base';

import { Acciones } from './componentes/acciones.js';
import { Pagina, Contenido, Cargando } from './componentes/pagina';
import { Estilos, Estilo, Pantalla } from './styles';
import { Usuario, Proyecto, Datos } from './datos';

import { Cliente }     from './1donacion/Cliente';
import { Empleado }    from './2validacion/Empleado';
import { Propietario } from './3control/Propietario';

export default class ComboSocial extends Component {

  constructor (props){
    super(props)

    // Datos.cargarPlatos()
    this.state = { usuarios: false, usuario: false, proyectos: false}
    Usuario.registrar(this)
    Proyecto.registrar(this)
  }

  componentDidMount() {
    Usuario.observar()
    Proyecto.observar()
    this.leerUsuario()
  }

  componentWillUnmount(){
    Usuario.detener()
    Proyecto.detener()
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
    // return <Examples />
    const { usuarios, usuario, proyectos } = this.state

    if(!usuarios && !proyectos)  { return <Cargando /> }

    if(!usuario) { return <ElegirUsuario usuarios={usuarios} alElegir={ usuario => this.alIngresar(usuario)} />}

    if(usuario.esCliente )    { return <Cliente     id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esEmpleado)    { return <Empleado    id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esPropietario) { return <Propietario id={usuario.id} alSalir={ () => this.alSalir() }/> }
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
  if(accion==2){ Datos.borrarDonaciones() }
  if(accion==3){ Datos.cargarProyectos() }
}

const ElegirUsuario = (props) => {
  const clientes     = props.usuarios.filter( u => u.esCliente  )
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
        <Acciones titulos={["+ Combos", "+ Usuarios", "- Donaciones", "+ Proyectos"]} alElegir={(nroAccion) => ejecutarAccion(nroAccion)} />
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
