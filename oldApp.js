import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';

export default function App() {
  const [pageLogin,setPageLogin]=useState(false)
  const [pageCadastro,setpageCadastro]=useState(false)

  

  return (
    <View style={styles.containerMain}>
      <Text style={styles.textMain}>EMERGÊNCIAS</Text>
      <Text style={styles.textMain}>193</Text>
      <Image source={require("./src/assets/Logo400x400.png")} style={styles.logoMain} alt='Logo do Corpo de bombeiros Militar de Mato Grosso' />
      <TouchableOpacity onPress={()=>{}} style={styles.button}>
        <Text style={styles.textoButton}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{}} style={styles.button}>
        <Text style={styles.textoButton}>CADASTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{}} style={styles.buttonCall}>
        <Image source={require('./src/assets/call.png')} style={styles.icon} />
        <Text style={styles.textoButton}>193</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:"10%",
    borderTopColor: '#000000',
    borderTopWidth:1
  },
  logoMain:{
    width:"60%",
    objectFit: "contain"
  },
  textMain:{
    fontSize:36,
    fontWeight: 'bold',
    color:'#fff'
  },
  button:{
    backgroundColor: '#fff',
    borderWidth:1,
    width:'40%',
    margin:12,
    padding:14,
    borderRadius:8,
    color: '#ff0000',
    justifyContent: 'center',
    alignItems:'center',
  },
  textoButton:{
    fontSize:20,
    fontWeight:'bold',
    color:'#ff0000'
  },
  buttonCall:{
    backgroundColor: '#fff',
    borderWidth:1,
    margin:12,
    padding:5,
    borderRadius:'50%',
    alignItems:'center',
    justifyContent:'center',
    width:150
  },
  icon:{
    width:40,
    height:40,
    margin:5,
  },
});
