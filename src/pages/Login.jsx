import { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Platform,
	ScrollView,
	KeyboardAvoidingView,
	Alert, 
	TouchableWithoutFeedback, 
	Keyboard,
	Dimensions
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { rem, handleCall, NewRem } from "../components/function";
import CbmLogo from "../assets/LogoCBM.svg";
import IconFacebook from "../assets/iconFacebook.svg";
import IconGoogle from "../assets/iconGoogle.svg";
import IconCall from "../assets/call.svg";

import React, { useContext } from "../../node_modules/react";
import { AuthContext, fonts } from "../../App";

import {
	getLocalUser,
	salveLocalExpirationDate,
} from "../components/function";
import InputComplex from "../components/inputComplex";
import InputHidden from "../components/inputHidden";
import { stylesRegistrarse } from "./Registrarse";

export default function Login({ navigation }) {


	const { ip } = useContext(AuthContext)

	const { setIsSignedIn, isSignedIn } = useContext(AuthContext);

	//Para facilitar navegação
	const [isFocused, setIsFocused] = useState(false);
	const scrollRef = useRef(null);
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);

	//variáveis do Email
	const [userEmail, setUserEmail] = useState("");
	const [insightEmail, setInsightEmail] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);

	//Variáveis da senha
	const [userPassword, setUserPassword] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true); //Mostrar ou ocultar senha
	const [insightPassword, setInsightPassword] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);

	function addMarginBottom(porcentagem) {
		const { width, height } = Dimensions.get('window')
		let result = (height * porcentagem) / 100
		console.log('Largura: ', width, ' Altura: ', height, "Resultado: ", result)
		return result
	}

	const scrollToTopConfirm = () => {
		scrollRef.current?.scrollTo({ y: 150, animated: true });
	};


	async function checkLogin() {
		const data = {
			email: userEmail,
			password: userPassword
		}

		fetch(`http://${ip}:3333/login-user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (!response.ok) {
					//console.log(response)
					return response.json().then(err => { // Tenta ler o corpo JSON de erro
						err.status = response.status
						throw err; // Retorna o erro com o corpo JSON
					});
				}
				return response.json();
			})
			.then((data) => {
				console.log("Sucesso conexão: ", Object.entries(data), 'usuário criado');
				// Após a resposta de sucesso do servidor, redirecionar o usuário		
				setIsSignedIn(true);
			})
			.catch((error) => {
				console.error(Object.entries(error))
				console.error(`Erro: Request Status Error: ${error.status}, message: ${error.message}`);
				setInsightPassword(true)
				setErrorPassword(true)
			})
		/*
		const user = await getLocalUser();
		const password = await getLocalPassword();

		if (
			emailRef.current?.value === user &&
			passwordRef.current?.value === password
		) {
			salveLocalExpirationDate(new Date().toISOString());
			handleLogin();
			setErrorLogin(false);
		} else {
			setErrorLogin(true);
		}
			*/
	}

	/*
	useEffect(() => {
		if (emailRef.current) {
			setTimeout(() => {
				emailRef.current.focus();
			}, 5000); // Adiciona um atraso de 100 milissegundos
		}
	}, []);
*/


	return (
		//Usando este componente para controlar a are disponível para o aplicativo
		//sem sobrepor elementos nativos de navegação do android e IOS 
		<SafeAreaProvider>
			<SafeAreaView style={[ stylesMain.containerMain, fonts.roboto]}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={[stylesMain.containerMain, { gap: 10, alignItems: "center", paddingHorizontal: '10%' }]}
						keyboardShouldPersistTaps="handled"

						ref={scrollRef}
					>
						<View style={[stylesMain.flexRow, { height: "15%" }]}>
							<CbmLogo width={rem(4)} height={rem(4)} />
							<Text style={stylesMain.textMain}>Emergências</Text>
							<Text style={stylesMain.textMain}>193</Text>
						</View>
						{/*
					<View style={stylesMain.flexRow}>
						<TouchableOpacity
							onPress={() => {}}
							style={stylesMain.buttonSemiRounded}
						>
							<View style={stylesMain.containerIcon}>
								<IconFacebook width={rem(2.6)} height={rem(2.5)} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {}}
							style={stylesMain.buttonSemiRounded}
						>
							<View style={stylesMain.containerIcon}>
								<IconGoogle width={rem(2.25)} height={rem(2.25)} />
							</View>
						</TouchableOpacity>
					</View>
				<View style={stylesMain.with80}>
					<View style={[stylesMain.containerTextTopInput]}>
						<Text style={stylesMain.textTopInput}>E-mail:</Text>
					</View>
					<TextInput
						style={[stylesMain.input, stylesMain.withFull]}
						onChangeText={(text) => {
							if (emailRef.current) {
								emailRef.current.value = text.toLowerCase();
							}
						}}
						ref={emailRef}
						placeholder="Insira seu e-mail"
						keyboardType="email-address"
					/>

					<View style={stylesMain.containerTextTopInput}>
						<Text style={stylesMain.textTopInput}>Senha:</Text>
					</View>
					<View
						style={[
							stylesMain.input,
							stylesMain.withFull,
							{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							},
						]}
					>
						<TextInput
							style={{ width: "90%" }}
							onChangeText={(text) => {
								if (passwordRef.current) {
									passwordRef.current.value = text;
								}
							}}
							ref={passwordRef}
							placeholder="Insira sua senha"
							secureTextEntry={hiddenPassword}
						/>
						<TouchableOpacity
							onPress={() => {
								setHiddenPassword(!hiddenPassword);
							}}
						>
							{hiddenPassword ? (
								<EyeOn name="onPassword" width={rem(1.5)} height={rem(1.5)} />
							) : (
								<EyeOf name="onPassword" width={rem(1.5)} height={rem(1.5)} />
							)}
						</TouchableOpacity>
					</View>
					<Text
						style={[
							{ display: errorLogin ? "flex" : "none" },
							stylesMain.textRed,
							stylesMain.opacity,
						]}
					>
						Usuário ou senha incorretos, verifique o e-mail e senha.
					</Text>
				</View>
				 */}
						<View style={[{ height: "55%", width: '100%', alignItems: 'center', justifyContent: 'center', }]}>
							<Text style={[stylesMain.textBase]}>Efetue seu Login</Text>
							<InputComplex
								title="E-mail"
								placeholder="Insira seu e-mail."
								insightText=""
								firstRef={firstInputRef}
								secondRef={secondInputRef}
								maxLengthInput={100}
								valueState={userEmail}
								setValueStateOrFunctionMask={setUserEmail}
								insightState={insightEmail}
								setInsightState={setInsightEmail}
								errorState={errorEmail}
								setErrorState={setErrorEmail}
								setFocused={setIsFocused}
								keyboard="email-address"
							/>
							<InputHidden
								title="Senha"
								placeholder="Insira sua senha."
								insightText="Usuário ou senha incorretos, verifique o e-mail e senha."
								firstRef={secondInputRef}
								secondRef={thirdInputRef}
								maxLengthInput={50}
								valueState={userPassword}
								setValueStateOrFunctionMask={setUserPassword}
								insightState={insightPassword}
								setInsightState={setInsightPassword}
								errorState={errorPassword}
								setErrorState={setErrorPassword}
								setFocused={setIsFocused}
								hiddenState={hiddenPassword}
								setHiddenState={setHiddenPassword}
							/>
							<TouchableOpacity
								onPress={() => {
									checkLogin();
								}}
								style={[
									stylesMain.buttonSemiRounded,
									stylesMain.backgroundRed,
									stylesMain.with80,
								]}
							>
								<Text
									style={stylesMain.textoButtonWith}
									ref={thirdInputRef}
								>
									Acessar
								</Text>
							</TouchableOpacity>
						</View>
						<View style={[{ width: '100%', height: "15%", justifyContent: 'center', gap: 5, alignItem: 'center' }]}>
							<TouchableOpacity
								onPress={() => {
									getLocalUser();
								}}
							>
								<Text style={[{ textAlign: 'center' }]}>Esqueceu a senha?</Text>
							</TouchableOpacity>
							<Text style={[stylesMain.textTopInput, { textAlign: 'center' }]}>ou</Text>
							<TouchableOpacity
								accessibilityLabel="Ir para a tela de registro"
								onPress={() => {
									navigation.navigate("Registrar-se");
								}}
							>
								<Text style={[stylesMain.textRed, { textAlign: 'center', fontWeight: 'bold' }]}>Registrar-se</Text>
							</TouchableOpacity>
						</View>
						<View style={[{ height: '10%', justifyContent: 'center', alignItems: 'center', }]}>
							<TouchableOpacity onPress={handleCall} style={[stylesMain.buttonCall,]}>
								<IconCall width={rem(1.5)} height={rem(1.5)} />
								<Text style={[stylesMain.textRed, stylesMain.textBold]}>193</Text>
							</TouchableOpacity>
						</View>
						<View style={[{ display: isFocused ? "flex" : "none", height:addMarginBottom(30), backgroundColor: '#000', }]}><Text> .</Text></View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</SafeAreaView>
		</SafeAreaProvider>

	);
}

export const stylesMain = StyleSheet.create({
	styleTitlePagesColorRedBgWhite: {
		headerStyle: {
			backgroundColor: "#fff",
		},
		headerTintColor: "#ff0000",
		headerTitleStyle: {
			fontWeight: "bold",
		},
	},
	opacity: {
		opacity: 0.4,
		fontWeight: "bold",
	},
	containerMain: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-around",
		padding: rem(1),
		backgroundColor: "#fff",
	},
	flexRow: {
		width: "100%",
		height: '30%',
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	logoMain: {
		width: rem(3.75),
		objectFit: "contain",
	},
	textMain: {
		fontSize: rem(1.9),
		fontWeight: "bold",
		color: "#ff0000",
	},
	backgroundRed: {
		backgroundColor: "#ff0000",
	},
	marginTop20: {
		marginTop: rem(1.25),
	},
	textBase: {
		fontSize: rem(1.5),
		color: "#64748b",
		fontWeight: "bold",
	},
	buttonSemiRounded: {
		width: rem(3),
		height: rem(3),
		borderRadius: rem(3),
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",

		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
	},
	containerTextTopInput: {
		marginLeft: rem(0.75),
		padding: rem(0.25),
		transform: [{ translateY: 13 }],
		backgroundColor: "#fff",
		zIndex: 999,
		width: NewRem(2.5),
		alignItems: "left",
		color: "#94a3b8",
	},
	textTopInput: {
		color: "#64748b",
		fontSize: 16,
	},
	textBold: {
		fontWeight: "bold",
	},
	textRed: {
		color: "#ff0000",
	},
	withFull: {
		width: "100%",
	},
	with80: {
		width: "80%",
	},
	input: {
		borderWidth: 1,
		borderColor: "#94a3b8",
		borderRadius: 4,
		paddingHorizontal: 10,
		paddingTop: 2,
		fontSize: 16,
		height: 45,
		justifyContent: "center",
	},
	textoButtonWith: {
		fontSize: rem(1),
		fontWeight: "bold",
		color: "#fff",
	},
	buttonCall: {
		backgroundColor: "#fff",
		borderWidth: 1,
		padding: rem(0.25),
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		width: rem(7.75),
	},
	containerIcon: {
		padding: rem(1.25),
		backgroundColor: "#fff",
		borderRadius: 100,
		width: rem(5),
		alignItems: "center",
		justifyContent: "center",
		elevation: 5,
	},
	icon: {
		width: rem(2.5),
		height: rem(2.5),
	},
	iconSmall: {
		width: rem(1.5),
		height: rem(1.5),
	},
	textLg: {
		fontSize: rem(1.75),
	},
});
