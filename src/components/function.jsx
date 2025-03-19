import * as SecureStore from 'expo-secure-store'; //Usa para armazenar informação seguras (login) localmente

import { Linking, Dimensions } from 'react-native'; //Usado para criar função rem e link


/*  ------------------------ // Solução para usar rem \\ ------------------------  */
export const rem=(value)=>{
  let baseFont =16
  const { width, height } = Dimensions.get('window');
  if(height<700){
    baseFont =14
  }
  return baseFont*value
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

  async function salveLocalUser(user) {
    await SecureStore.setItemAsync('appCbmUser',user)
    console.log('User salve')
  }
  export{salveLocalUser}

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

  async function salveLocalTelefon(telefon){
    await SecureStore.setItemAsync('appCbmTelefon',telefon)
    console.log('Telefon salve')
  }
  export{salveLocalTelefon}

  async function salveLocalAdress(adress) {
    await SecureStore.setItemAsync('appCbmAddress',adress)
    console.log('Adress salve')
  }
  export {salveLocalAdress}

  /**
 * Essa função obrigatóriamente deve receber um array para salvar no SecureStore.
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
    const result2 = await SecureStore.getItemAsync('appCbmPassword')
    const result3 = await SecureStore.getItemAsync('appCbmExpirationDate')
    if(result1 && result2 && result3){
      console.log('Login get user, password and expiration date')
    } else{
      console.log('Error get Login')
    }
    return [result1,result2, result3]
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

  async function getLocalPassword() {
    const result = await SecureStore.getItemAsync('appCbmPassword')
    if(result){
      console.log('Password get')
    } else{
      console.log('Error get Password')
    }
    return result
  }
  export{getLocalPassword}

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

  async function getLocalTelefon(){
    const result = await SecureStore.getItemAsync('appCbmTelefon')
    if(result){
      console.log('Telefon get')
    } else{
      console.log('Error get Telefon')
    }
    return result
  }
  export{getLocalTelefon}

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





//Não iremos utilizar delet por hora
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
  
