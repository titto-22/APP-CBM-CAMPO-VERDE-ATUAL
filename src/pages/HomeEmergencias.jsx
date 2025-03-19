import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { stylesMain } from '../pages/Login';

import IconFire from '../assets/fire.svg'
import IconCall from '../assets/call.svg';
import IconParadaRespiratoria from '../assets/Vector.svg';
import IconEngasgamento from '../assets/engasgo.svg';
import IconAfogamento from '../assets/afogamento.svg';
import IconAtropelamento from '../assets/atropelamento.svg';
import IconAcidente from '../assets/acidente.svg';

import { rem, handleCall } from '../components/function';

export default function HomeEmergencias({navigation}){

  
  return(
    <View style={stylesHome.containerMain}>
      <Text style={stylesHome.textTitle}>
        SELECIONE A EMERGÊNICA
      </Text>
      <View style={stylesHome.containerFlexRow}>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Incêndio'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
          <View style={stylesHome.boderIcon}>
            <IconFire height={rem(3.75)} width={rem(3.75)} />
          </View>
          <Text style={stylesHome.textIcon}>
            Incêndio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Parada Respiratória'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
           <View style={stylesHome.boderIcon}>
            <IconParadaRespiratoria height={rem(3.75)} width={rem(3.75)}/>
           </View>
          <Text style={stylesHome.textIcon}>
            Parada Respiratória
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Engasgamento'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
           <View style={stylesHome.boderIcon}>
            <IconEngasgamento height={rem(3.75)} width={rem(3.75)}/>
           </View>
          <Text style={stylesHome.textIcon}>
            Engasgamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Afogamento'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
           <View style={stylesHome.boderIcon}>
            <IconAfogamento height={rem(3.75)} width={rem(3.75)}/>
           </View>
          <Text style={stylesHome.textIcon}>
            Afogamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Atropelamento'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
           <View style={stylesHome.boderIcon}>
            <IconAtropelamento height={rem(3.75)} width={rem(3.75)}/>
           </View>
          <Text style={stylesHome.textIcon}>
            Atropelamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={
            ()=>{
              navigation.navigate(
                'Localização',{
                  tipoEmergencia:'Acidente de Trânsito'
                }
              )
            }
          }
          style={stylesHome.containerTouchableOpacity}
        >
           <View style={stylesHome.boderIcon}>
            <IconAcidente height={rem(3.75)} width={rem(3.75)}/>
           </View>
          <Text style={stylesHome.textIcon}>
            Acidente de Trânsito
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={stylesHome.textCinzaClaro}>
        Outros
      </Text>
      <TouchableOpacity onPress={handleCall} style={stylesMain.buttonCall}>
        <IconCall width={rem(2.25)} height={rem(2.25)}/>
        <Text 
          style={[stylesMain.textRed,stylesMain.textBold]}
        >
          193
        </Text>
      </TouchableOpacity>
      <Text style={stylesHome.textCinzaClaro}>
        LIGUE PARA EMERGÊNCIA
      </Text>
      
    </View>
  )
}

export const stylesHome = StyleSheet.create({
  containerMain:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding:rem(1),
    backgroundColor:'#fff'
  },
  textTitle:{
    fontSize: rem(1.65),
    color:'#5e6165',
    borderWidth: 1,
    borderColor:'#5e6165',
    borderRadius:8,
    paddingHorizontal:10,
    paddingVertical:5,
  },
  containerFlexRow:{
    flexDirection: 'row',
    gap:rem(1.25),
    flexWrap:'wrap',
    justifyContent: 'space-around',
    marginVertical:rem(1),
  },
  image:{
    width:rem(7),
    height:rem(7),
    objectFit:'contain',
    padding:rem(.25),
    borderWidth:.5,
    borderColor:'#ff0000',
    borderRadius:12
  },
  containerTouchableOpacity:{
    borderWidth:1,
    borderColor:'#5e6165',
    borderRadius:12,
    paddingHorizontal:rem(.5),
    paddingVertical:rem(.5),
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center',
  },
  textIcon:{
    fontSize: rem(1),
    color:'#5e6165',
    flexWrap:'wrap',
    width: rem(8.5),
    textAlign: 'center',
  },
  boderIcon:{
    borderWidth:.5,
    borderColor:'#ff0000',
    borderRadius:12,
    paddingVertical:rem(.25),
    paddingHorizontal:rem(.5),
    marginBottom:rem(.25),
  },
  textCinzaClaro:{
    color:'#94a3b8',
  }
})