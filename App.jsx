import * as React from "react";
import { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store"; //Usa para armazenar informação seguras (login) localmente
import { StyleSheet, Linking, Alert, Modal, View, Text } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "react-native-gesture-handler";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";

import Login from "./src/pages/Login";
import HomeEmergencias from "./src/pages/HomeEmergencias";
import Registrarse from "./src/pages/Registrarse";
import DadosEmergencia from "./src/pages/dadosEmergencia";
import Localizacao from "./src/pages/localizacao";
import {
	createLoginInSecureStoreTest,
	getLocalName,
	getLocalUser,
	getLocalPassword,
	getLocalExpirationDate,
	resetLocalIncident,
} from "./src/components/function";
import EnderecoTelefone from "./src/pages/EnderecoTelefone";

//Cria usuário para teste, tem que excluir depois quando for para produção
createLoginInSecureStoreTest();

////////////////////////////////////////////////////////////
/////   Validade do login/token armazenado localmente  /////
////////////////////////////////////////////////////////////
const validationTokenLogin = 30;

/**
 * Contexto de autenticação, sempre iniciando em *false*
 * 
 * Utilizado para controlar se usuário esta logado ou não
 * 
 * Responsável por permitir que outros componentes 
 * modifiquem o estado local `isSignedIn`e modifiquem seu valor com `setIsSignedIn`
 */
export const AuthContext = createContext({
	isSignedIn: false,
	setIsSignedIn: () => { },	
});

/**
 * Contexto Ip de conexão com o banco de dados
 */
export const ipContext = createContext('192.168.0.94')

export default function App({ navigation }) {
	const [modalVisible, setModalVisible] = React.useState(false);

	// Função para ação de ajuda
	const handleAjuda = async () => {
		const email = "devhumbertoqueiroz@gmail.com";
		await Clipboard.setStringAsync(email);
		setModalVisible(true);
		setTimeout(() => {
			setModalVisible(false);
			Linking.openURL(`mailto:${email}`);
		}, 1500);
	};
	///////////////////////////////////////////////////////////
	/////    Estado que controla se esta logado ou não  /////
	///////////////////////////////////////////////////////////
	const [isSignedIn, setIsSignedIn] = useState(false);

	/**
	 * **Function handleSetIsSignedIn**
	 *
	 * Função que é passada para os componentes através do contexto para manipular 
	 * ou atualiza o estado do login nesta e em outras páginas
	 * @param {boolean} value valor que sera setado para `IsSignedIn`
	 */
	const handleSetIsSignedIn = (value) => setIsSignedIn(value);

	/**
	 * **Function InitialService**
	 *
	 * Função que faz validação de usuário. Esta função recupera a data de armazenamento
	 * do login/token com a função `getLocalExpirationDate()` e verifica se a diferença
	 * entre a data recuperada e data atual `differenceInDay` é maior que `validationToken`.
	 *
	 * Caso `differenceInDay` menor que `validationToken` faz login automaticamente.
	 *
	 * Caso não, será necessário fazer login.
	 * @async `function`
	 * @param {number} validationToken *Type: number* - Este valor será usado como prazo do login/token
	 * @returns void
	 */
	async function InitialService(validationToken) {
		resetLocalIncident()
		const getValidation = await getLocalExpirationDate(); //recupera a data de expiração do login/token
		const validation = new Date(getValidation); //formata como data
		const dateNow = new Date(); //cria variável da data atual
		const differenceMilliseconds = dateNow - validation; //Verifica a diferença em milissegundos
		const differenceInDay = Math.floor(
			differenceMilliseconds / (1000 * 60 * 60 * 24),
		); //Converte em dias
		//Caso  não tenha expirado o token
		// Validade de 30 dias
		if (differenceInDay < validationToken) {
			setIsSignedIn(true);
		}
	}

	//////////////////////////////////////////////////
	/////    Inicia Biblioteca de Navegação      /////
	//////////////////////////////////////////////////
	const Drawer = createDrawerNavigator();

	////////////////////////////////////////////
	/////    Inicia o serviço de validação  /////
	////////////////////////////////////////////
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		InitialService(validationTokenLogin);
	}, []);

	/**
	 * **Function Logout**
	 *
	 *  Função de logout, seta o `isSignedIn` para *false*
	 */
	function Logout(navigation) {
		setIsSignedIn(false);
		navigation.closeDrawer();
	}

	return (
		<AuthContext.Provider
			value={{
				isSignedIn,
				setIsSignedIn: handleSetIsSignedIn,
				ip: React.useContext(ipContext)
			}}
		>

			<NavigationContainer>
				<Drawer.Navigator
					initialRouteName='Login'
					screenOptions={styles.styleTitlePagesColorRedBgWhite}
					drawerContent={(props) => (
						<DrawerContentScrollView {...props}>
							<DrawerItemList {...props} />
													<DrawerItem
														label="Ajuda"
														onPress={handleAjuda}
														activeTintColor="#fff"
														inactiveTintColor="#e7e7e7"
													/>
							{isSignedIn && (
								<DrawerItem
									label="Sair"
									onPress={() => Logout(props.navigation)}
									activeTintColor="#fff"
									inactiveTintColor="#e7e7e7"
								/>
							)}
						</DrawerContentScrollView>
					)}
				>
					{isSignedIn ? (
						<>
							<Drawer.Screen
								name="Emergências"
								component={HomeEmergencias}
								options={{ headerBackVisible: false }}
							/>
							<Drawer.Screen
								name="Localização"
								component={Localizacao}
								options={{
									drawerItemStyle: { display: "none" }, // Oculta no menu lateral
									headerShown: false, // Oculta o título no cabeçalho
								}}
							/>
							<Drawer.Screen
								name="Dados da Emergência"
								component={DadosEmergencia}
								options={{
									drawerItemStyle: { display: "none" }, // Oculta no menu lateral
									//headerShown: false, // Oculta o título no cabeçalho
								}}
							/>
						</>
					) : (
						<>
							<Drawer.Screen
								name="Login"
								component={Login}
							//options={{ gestureEnabled: false }}
							/>
							<Drawer.Screen name="Registrar-se" component={Registrarse} />
							<Drawer.Screen name="EnderecoTelefone" component={EnderecoTelefone} options={{
									drawerItemStyle: { display: "none" }, // Oculta no menu lateral
									//headerShown: false, // Oculta o título no cabeçalho
								}}/>
						</>
					)}
				</Drawer.Navigator>
			</NavigationContainer>
			{/* Modal temporário para feedback de cópia */}
			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)' }}>
								<View style={{ backgroundColor:'#fff', padding:24, borderRadius:12, elevation:4 }}>
									<Text style={{ fontSize:16, color:'#333' }}>E-mail copiado para a área de transferência!📋</Text>
								</View>
				</View>
			</Modal>
		</AuthContext.Provider>
	);
}

export const styles = StyleSheet.create({
	styleTitlePagesColorRedBgWhite: {
		headerStyle: {
			backgroundColor: "#ff0000",
		},
		headerTintColor: "#fff",
		headerTitleStyle: {
			fontWeight: "bold",
			textAlign: "center",
		},
		gestureEnabled: false,
		drawerStyle: {
			backgroundColor: "#ff0000",
			width: 240,
		},
		drawerActiveTintColor: "#ffffff",
		drawerInactiveTintColor: "#e7e7e7",
	},
});

export const fonts = StyleSheet.create({
	roboto:{
		fontFamily:'Roboto-Medium'
	}
})