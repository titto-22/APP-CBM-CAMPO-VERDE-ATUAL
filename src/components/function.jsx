import * as SecureStore from 'expo-secure-store'; //Usa para armazenar informação seguras (login) localmente

import { Linking, Dimensions, PixelRatio } from 'react-native'; //Usado para criar função rem e link



/*  ------------------------ // Solução para usar vh \\ ------------------------  */
/**Função criada para utilizar height view (altura da tela) em porcentagem
 * @param num - Informar o valor da porcentagem sa tela que deseja
 * @returns num - Valor que representa a porcentagem da tela solicitada
 */
export const vh=(valeu)=>{
  const {height} = Dimensions.get('window');
  return  ((height*valeu)/100)
}

/*  ------------------------ // Solução para usar vw \\ ------------------------  */
/**Função criada para utilizar width view (largura da tela) em porcentagem
 * @param num - Informar o valor da porcentagem sa tela que deseja
 * @returns num - Valor que representa a porcentagem da tela solicitada
 */
export const vw=(valeu)=>{
  const {width} = Dimensions.get('window');
  return  ((width*valeu)/100)
}

/*  ------------------------ // Solução para usar rem \\ ------------------------  */
export const rem=(value)=>{
  let baseFont =16
  const { width, height } = Dimensions.get('window');
  if(height<700){
    baseFont =14
  }
  return baseFont*value
}

/*  ------------------------ // Calcula rem em pixel \\ ------------------------  */
export const NewRem = (valorRem) => {
  const { width, height } = Dimensions.get('window');
  const menorDimensao = Math.min(width, height);
  const proporcao = menorDimensao / 320;
  const pixelRatio = PixelRatio.get();
  const valorPixel = valorRem * 16 * proporcao * pixelRatio;
  return valorPixel;
}

/*  ------------------------ // Ligação \\ ------------------------  */
export const handleCall = () => {
  Linking.openURL("tel:193");
  };

  /*  ------------------------ // Funções de gravação e recuperação de Login \\ ------------------------  */

  //Sets

 async function createLoginInSecureStoreTest () {
    await SecureStore.setItemAsync('appCbmUser','admin')
    await SecureStore.setItemAsync('appCbmPassword','123')
    await SecureStore.setItemAsync('appCbmExpirationDate','2024-08-29T01:52:09.302Z')
    await SecureStore.setItemAsync('appCbmName','João da Silva')
    await SecureStore.setItemAsync('appCbmCPF','01234567890')
    await SecureStore.setItemAsync('appCbmCPF','00000000000')
    await SecureStore.setItemAsync('appCbmTelefon','5566999999999')
    await SecureStore.setItemAsync('appCbmAddress','Avenida Brasil, 001, Bairro Centro, Campo Verde Mato-Grosso, Brazil zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    console.log('Create data teste')
  }
  export {createLoginInSecureStoreTest}

  async function salveLocalLogin(user, password) {
    await SecureStore.setItemAsync('appCbmUser',user)
    await SecureStore.setItemAsync('appCbmPassword',password)
    await SecureStore.setItemAsync('appCbmExpirationDate',date)
    console.log('Login salve, user, password and expiration date')
  }
  export {salveLocalLogin}

  async function salveLocalEmailUser(user) {
    await SecureStore.setItemAsync('appCbmUser',user)
    console.log('User salve')
  }
  export{salveLocalEmailUser}

  async function salveLocalPassword(password) {
    await SecureStore.setItemAsync('appCbmPassword',password)
    console.log('Password salve')
  }
  export{salveLocalPassword}

  async function salveLocalExpirationDate(date){
    await SecureStore.setItemAsync('appCbmExpirationDate',date)
    console.log('ExpirationDate salve')
  }  
  export {salveLocalExpirationDate}

  async function salveLocalName(name){
    await SecureStore.setItemAsync('appCbmName',name)
    console.log('Name salve')
  }
  export {salveLocalName}

  async function salveLocalCPF(cpf) {
    await SecureStore.setItemAsync('appCbmCPF',cpf)
    console.log('CPF salve')
  }
  export{salveLocalCPF}

  async function salveLocalPhone(phone){
    await SecureStore.setItemAsync('appCbmPhone', phone)
    console.log('Phone salve')
  }
  export{salveLocalPhone}

  async function salveLocalStreet(text) {
    await SecureStore.setItemAsync('appCbmStreet', text)
    console.log('Street salve')
  }
  export {salveLocalStreet}

  async function salveLocalAddressNumber(text) {
    await SecureStore.setItemAsync('appCbmAddressNumber', text)
    console.log('AddressNumber salve')
  }
  export {salveLocalAddressNumber}

  async function salveLocalComplementAddress(text) {
    await SecureStore.setItemAsync('appCbmComplementAddress', text)
    console.log('ComplementAddress salve')
  }
  export {salveLocalComplementAddress}

  async function salveLocalDistrict(text) {
    await SecureStore.setItemAsync('appCbmDistrict', text)
    console.log('District salve')
  }
  export {salveLocalDistrict}

  async function salveLocalCity(text) {
    await SecureStore.setItemAsync('appCbmCity', text)
    console.log('City salve')
  }
  export {salveLocalCity}

  async function salveLocalState(text) {
    await SecureStore.setItemAsync('appCbmState', text)
    console.log('State salve')
  }
  export {salveLocalState}

  async function salveLocalIbge(text) {
    await SecureStore.setItemAsync('appCbmIbge', text)
    console.log('Ibge salve')
  }
  export {salveLocalIbge}

  async function salveLocalCEP(text) {
    await SecureStore.setItemAsync('appCbmCEP', text)
    console.log('CEP salve')
  }
  export {salveLocalCEP}

  /**
 * Essa função obrigatoriamente deve receber um array para salvar no SecureStore.
 * @param {array} incident *Type: Array* - recebe um array que contém internamente
 * um segundo array com 5 itens (somente o valor) em ordem, sendo: 1º nome, 
 * 2º cpf, 3º tipo da emergência, 4º endereço da ocorrência e 5º descrição da ocorrência.
 */
  async function salveLocalIncident(incident) {
    try {
      const arrayString = JSON.stringify(incident);
      await SecureStore.setItemAsync('appCbmIncident',arrayString)
      console.log('Incident salve')
    } catch (error) {
      console.error('Error saving incident:', error);
    }
  }
  export {salveLocalIncident}


  //Gets

  async function getLocalLogin() {
    const result1 = await SecureStore.getItemAsync('appCbmUser')
    const result3 = await SecureStore.getItemAsync('appCbmExpirationDate')
    if(result1 && result3){
      console.log('Login get user, password and expiration date')
    } else{
      console.log('Error get Login')
    }
    return [result1, result3]
  }
  export {getLocalLogin}

  async function getLocalUser() {
    const result = await SecureStore.getItemAsync('appCbmUser')
    if(result){
      console.log('User get:',result)
    } else{
      console.log('Error get User')
    }
    return result
  }
  export{getLocalUser}

  async function getLocalExpirationDate(){
    const result = await SecureStore.getItemAsync('appCbmExpirationDate')
    if(result){
      console.log('ExpirationDate get')
    } else{
      console.log('Error get Expiration Date')
    }
    return result
  }  
  export {getLocalExpirationDate}

  async function getLocalName(){
    const result = await SecureStore.getItemAsync('appCbmName')
   if(result){
     console.log('Name get')
    } else{
      console.log('Error get Name')
    }
    return result
  }
  export {getLocalName}

  async function getLocalCPF() {
    const result = await SecureStore.getItemAsync('appCbmCPF')
    if(result){
      console.log('CPF get')
    } else{
      console.log('Error get CPF')
    }
    return result
  }
  export{getLocalCPF}

  async function getLocalPhone(){
    const result = await SecureStore.getItemAsync('appCbmTelefon')
    if(result){
      console.log('Telefon get')
    } else{
      console.log('Error get Telefon')
    }
    return result
  }
  export{getLocalPhone}

  async function getLocalAdress() {
    const result = await SecureStore.getItemAsync('appCbmAddress')
    if(result){
      console.log('Adress get')
    } else{
      console.log('Error get Adress')
    }
    return result
  }
  export {getLocalAdress}

async function getLocalIncident() {
  try {
    const arrayString = await SecureStore.getItemAsync("appCbmIncident");
    if (arrayString) {
      const array = JSON.parse(arrayString);
      console.log("Array recuperado:", array);
      return array;
    // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      console.log("Nenhum array encontrado com a chave:", "appCbmIncident");
      return null;
    }
  } catch (error) {
    console.error("Erro ao recuperar o array:", error);
    return null;
  }
}
  export {getLocalIncident}





//Não iremos utilizar delete por hora
  async function removeLogin(params) {
    await SecureStore.deleteItemAsync('appCbmUser')
    console.log('Apagado','Apagado o Login' )
  }
  
  async function removeIncident(params) {
    await SecureStore.deleteItemAsync('appCbmIncident')
    console.log('Apagado','Apagado o Login' )
  }


  //zera array local de incidentes
  async function resetLocalIncident() {
    try {
      await SecureStore.setItemAsync('appCbmIncident',JSON.stringify([[null,null,null,null,null]]))
      console.log('Incident reset')
    } catch (error) {
      console.error('Error saving incident:', error);
    }
  }
  export {resetLocalIncident}
  
