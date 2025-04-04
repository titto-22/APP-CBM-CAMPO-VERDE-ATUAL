import { useState, useRef, useContext } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { stylesMain } from "../pages/Login";
import {
	rem,
	handleCall,
	salveLocalUser,
	salveLocalPassword,
	salveLocalCPF,
	salveLocalAdress,
	salveLocalName,
	vh,
	vw,
	NewRem,
} from "../components/function";
import { AuthContext } from "../../App";
import IconFacebook from "../assets/iconFacebook.svg";
import IconGoogle from "../assets/iconGoogle.svg";
import EyeOf from "../assets/eye-slash.svg";
import EyeOn from "../assets/eye.svg";




export default function Registrarse({ navigation }) {
	//controla o subir da tela ao exibir o teclado
	const scrollRef = useRef(null);
	const scrollToTopCpf = () => {
		scrollRef.current?.scrollTo({ y: 300, animated: true })	;
	};

	const scrollToTopConfirm = () => {
		scrollRef.current?.scrollTo({ y: 150, animated: true })	;
	};

	//Variáveis do nome
	const [userName, setUserName] = useState("humberto caio");
	const [insightName, setInsightName] = useState(false);
	const [errorName, setErrorName] = useState(false);

	//variáveis do Email
	const [userEmail, setUserEmail] = useState("teste@teste.com");
	const [insightEmail, setInsightEmail] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);

	//Variáveis da senha primeiro input
	const [userPassWord, setUserPassWord] = useState("96135151Ab!");
	const [hiddenPassword, setHiddenPassword] = useState(true); //Mostrar ou ocultar senha
	const [insightPassword, setInsightPassword] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);

	//Variáveis da senha confirm input
	const [confirmPassWord, setConfirmPassWord] = useState("96135151Ab!");
	const [hiddenConfirm, setHiddenConfirm] = useState(true); //Mostrar ou ocultar senha
	const [insightConfirm, setInsightConfirm] = useState(false);
	const [errorConfirm, setErrorConfirm] = useState(false);

	//Variáveis cpf input
	const [cpf, setCpf] = useState("04404846185");
	const [insightCpf, setInsightCpf] = useState(false);
	const [errorCPF, setErrorCPF] = useState(false);

	//Variável que controla tentativas de gravar usuário
	const [initialValidation, setInitialValidation] = useState(false);

	//Para facilitar navegação
	const [isFocused, setIsFocused] = useState(false);
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);
	const fourthInputRef = useRef(null);
	const fifthInputRef = useRef(null);
	const sixthInputRef = useRef(null);
	const seventhInputRef = useRef(null);

	//Formata o CPF, coloca mascara
	const formatarCpf = (text) => {
		const numeros = text.replace(/\D/g, ""); // Remove caracteres não numéricos
		let formatted = "";

		if (numeros.length > 0) {
			formatted = numeros.substring(0, 3);
			if (numeros.length > 3) formatted += ".";
		}

		if (numeros.length > 3) {
			formatted += numeros.substring(3, 6);
			if (numeros.length > 6) formatted += ".";
		}

		if (numeros.length > 6) {
			formatted += numeros.substring(6, 9);
			if (numeros.length > 9) formatted += "-";
		}

		if (numeros.length > 9) {
			formatted += numeros.substring(9, 11);
		}

		setCpf(formatted);
	};

	//Validações dos campos
	//Validação nome
	function nameIsValid(text) {
		if (text === "" || text.length < 8) {
			return false;
		}
		return true;
	}

	//Valida formato do email
	function validateUserEmail(email) {
		//Regex para validar email
		const emailRegex = /^[^\s@]+@[^\s@]+\.(com|com\.br)$/;

		// Verifica se o email corresponde à expressão regular
		const isValid = emailRegex.test(email);

		// Seta o estado de acordo com a validação
		setInsightEmail(!isValid);
		return isValid;
	}

	//Valida senha
	function validateUserPassword(password) {
		const passwordRegex =
			/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_-]).{8,}$/;
		// Verifica se o password corresponde à expressão regular
		const isValid = passwordRegex.test(password);

		// Seta o estado de acordo com a validação
		setInsightPassword(!isValid);
		return isValid;
	}

	//verifica se first password é igual a second password
	const isEqualPassword = (ConfirmPassword) => {
		if (userPassWord === ConfirmPassword) {
			return true;
		}
		return false;
	};

	//Valida CPF
	function validateCpf(cpf) {
		text = cpf;
		text = text.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

		if (text.length !== 11) {
			return false;
		}

		if (
			text === "00000000000" ||
			text === "11111111111" ||
			text === "22222222222" ||
			text === "33333333333" ||
			text === "44444444444" ||
			text === "55555555555" ||
			text === "66666666666" ||
			text === "77777777777" ||
			text === "88888888888" ||
			text === "99999999999"
		) {
			return false; // text com todos os dígitos iguais é inválido
		}

		let soma = 0;
		for (let i = 0; i < 9; i++) {
			soma += Number.parseInt(text.charAt(i)) * (10 - i);
		}
		let resto = 11 - (soma % 11);
		const digito1 = resto < 10 ? resto : 0;

		soma = 0;
		for (let i = 0; i < 10; i++) {
			soma += Number.parseInt(text.charAt(i)) * (11 - i);
		}
		resto = 11 - (soma % 11);
		const digito2 = resto < 10 ? resto : 0;

		return (
			Number.parseInt(text.charAt(9)) === digito1 &&
			Number.parseInt(text.charAt(10)) === digito2
		);
	}

	//Chama função que verifica dados e continua
	function checkToContinue() {
		if (checkInputs()) {
			navigation.navigate("EnderecoTelefone", {
				name: userName,
				email: userEmail,
				password: userPassWord,
				cpf: cpf,
			});
		}
	}

	//Função que faz a checagem dos dados para gravar novo usuário
	function checkInputs() {
		setInitialValidation(true);
		let result = true;
		//Caso nome não seja valido retorna true, inverto o resultado
		//para entrar no if de erro e mostrar a ajudo em vermelho e
		//da foco no input

		if (!validateCpf(cpf)) {
			setInsightCpf(true);
			setErrorCPF(true);
			result = false;
			fifthInputRef.current.focus();
		}
		if (!isEqualPassword(confirmPassWord)) {
			setInsightConfirm(true);
			setErrorConfirm(true);
			result = false;
			fourthInputRef.current.focus();
		}

		if (!validateUserPassword(userPassWord)) {
			setInsightPassword(true);
			setErrorPassword(true);
			result = false;
			thirdInputRef.current.focus();
		}
		if (!validateUserEmail(userEmail)) {
			setInsightEmail(true);
			setErrorEmail(true);
			result = false;
			secondInputRef.current.focus();
		}
		if (!nameIsValid(userName)) {
			setInsightName(true);
			setErrorName(true);
			result = false;
			firstInputRef.current.focus();
		}
		return result;
	}



	return (
		<KeyboardAvoidingView
			style={stylesRegistrarse.containerMain}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // Ajuste se necessário
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
				keyboardShouldPersistTaps="handled"
				ref={scrollRef}
			>
				<View style={[stylesMain.withFull, stylesRegistrarse.alignItemsCenter]}>
					<Text style={stylesRegistrarse.title}>Criar conta</Text>
				</View>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>Nome:</Text>
				</View>
				<TextInput //Name
					style={[stylesMain.input, stylesMain.withFull, insightName ? '' : stylesRegistrarse.marginBottom8]}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						setIsFocused(false);
						if (!nameIsValid(userName)) {
							setInsightName(true);
						} else {
							setInsightName(false);
							setErrorName(false);
						}
					}}
					returnKeyType="next" //define botão no teclado de próximo
					ref={firstInputRef} //define a referencia
					onSubmitEditing={() => {
						secondInputRef.current.focus(); // Move o foco para o segundo input
					}}
					onChangeText={(text) => {
						setUserName(text);
					}}
					value={userName}
					placeholder="Insira seu Nome Completo"
					maxLength={45}
				/>
				<Text //insight Name
					style={[
						{ display: insightName ? "flex" : "none" },
						{ color: errorName ? "#ff0000" : "#64748b" },
						insightName ? stylesRegistrarse.marginBottom8 : ''
					]}
				>
					Insira o seu nome completo.
				</Text>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>E-mail:</Text>
				</View>
				<TextInput // Email
					style={[stylesMain.input, insightEmail ? '' : stylesRegistrarse.marginBottom8, stylesMain.withFull]}
					maxLength={45}
					onFocus={() => {
						setIsFocused(true);
						if (userEmail === "") {
							setErrorEmail(false);
						}
					}}
					onBlur={() => {
						setIsFocused(false);
						if (initialValidation) {
							if (!insightEmail) {
								setErrorEmail(false);
							} else {
								setErrorEmail(true);
							}
						} else {
							if (userEmail === "") {
								setInsightEmail(false);
								setErrorEmail(false);
							}
						}
					}}
					returnKeyType="next" //define botão no teclado de proximo
					ref={secondInputRef} //define a referencia
					onSubmitEditing={() => {
						thirdInputRef.current.focus(); // Move o foco para o segundo input
					}}
					onChangeText={(text) => {
						setUserEmail(text.toLowerCase());
						validateUserEmail(text);
					}}
					value={userEmail}
					placeholder="Insira seu e-mail"
					keyboardType="email-address"
				/>
				<Text //insightEmail
					style={[
						{ display: insightEmail ? "flex" : "none" },
						{ color: errorEmail ? "#ff0000" : "#64748b" },
						insightEmail ? stylesRegistrarse.marginBottom8 : ''
					]}
				>
					E-mail deve ser no formato: exemplo@gmail.com
				</Text>
				<View style={stylesMain.containerTextTopInput}>
					<Text style={stylesMain.textTopInput}>Senha:</Text>
				</View>
				<View
					style={[
						stylesMain.input, insightPassword ? '' : stylesRegistrarse.marginBottom8,
						stylesMain.withFull,
						{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						},
					]}
				>
					<TextInput //First Password
						style={{ width: "90%" }}
						onFocus={() => {
							setIsFocused(true);
						}}
						onBlur={() => {
							setIsFocused(false);
							if (initialValidation) {
								if (!insightPassword) {
									setErrorPassword(false);
								} else {
									setErrorPassword(true);
								}
							} else {
								if (userEmail === "") {
									setInsightPassword(false);
									setErrorPassword(false);
								}
							}
						}}
						returnKeyType="next" //define botão no teclado de proximo
						ref={thirdInputRef} //define a referencia
						onSubmitEditing={() => {
							if (!insightPassword) {
								setErrorPassword(false);
								fourthInputRef.current.focus(); // Move o foco para o segundo input
							} else {
								if (initialValidation) {
									setErrorPassword(true);
									fourthInputRef.current.focus();
								} else {
									fourthInputRef.current.focus();
								}
							}
						}}
						onChangeText={(text) => {
							setUserPassWord(text);
							validateUserPassword(text);
						}}
						value={userPassWord}
						placeholder="Insira sua senha"
						maxLength={30}
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
				<Text //insightPasword
					style={[
						{ display: insightPassword ? "flex" : "none" },
						{ color: errorPassword ? "#ff0000" : "#64748b" },
						insightPassword ? stylesRegistrarse.marginBottom8 : ''
					]}
				>
					Senha deve ter pelo menos menos um número, uma letra maiúscula, uma
					minúscula, um carácter especial e pelo menos 8 dígitos.
				</Text>
				<View style={stylesMain.containerTextTopInput}>
					<Text style={stylesMain.textTopInput}>Confirme:</Text>
				</View>
				<View
					style={[
						stylesMain.input, insightConfirm ? '' : stylesRegistrarse.marginBottom8,
						stylesMain.withFull,
						{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						},
					]}
				>
					<TextInput //Confirm Secund Password
						style={{ width: "90%" }}
						onFocus={() => {
							setIsFocused(true);
							scrollToTopConfirm()
						}}
						onBlur={() => {
							setIsFocused(false);
							setInsightConfirm(!isEqualPassword(confirmPassWord));
							//setErrorConfirm(!isEqualPassword(confirmPassWord))
						}}
						returnKeyType="next" //define botão no teclado de proximo
						ref={fourthInputRef} //define a referencia
						onSubmitEditing={() => {
							fifthInputRef.current.focus(); // Move o foco para o segundo input
						}}
						onChangeText={(text) => {
							setConfirmPassWord(text);
						}}
						value={confirmPassWord}
						placeholder="Insira sua senha"
						secureTextEntry={hiddenConfirm}
						maxLength={30}
					/>
					<TouchableOpacity
						onPress={() => {
							setHiddenConfirm(!hiddenConfirm);
						}}
					>
						{hiddenConfirm ? (
							<EyeOn name="onPassword" width={rem(1.5)} height={rem(1.5)} />
						) : (
							<EyeOf name="onPassword" width={rem(1.5)} height={rem(1.5)} />
						)}
					</TouchableOpacity>
				</View>
				<Text //insightConfirmPasword
					style={[
						{ display: insightConfirm ? "flex" : "none" },
						{ color: errorConfirm ? "#ff0000" : "#64748b" },
						insightConfirm ? stylesRegistrarse.marginBottom8 : ''
					]}
				>
					As duas senhas devem ser iguais.
				</Text>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>CPF:</Text>
				</View>
				<TextInput //CPF
					style={[stylesMain.input, insightCpf ? '' : stylesRegistrarse.marginBottom8, stylesMain.withFull]}
					type={"cpf"}
					value={cpf}
					maxLength={14}
					onFocus={() => {
						setIsFocused(true)
						scrollToTopCpf()
					}}
					onBlur={() => {
						setIsFocused(false);
						if (validateCpf(cpf)) {
							setInsightCpf(false);
						} else {
							setInsightCpf(true);
						}
					}}
					ref={fifthInputRef} //define a referencia
					returnKeyType="next" //define botão no teclado de proximo
					onSubmitEditing={() => {
						sixthInputRef.current.focus(); // Move o foco para o segundo input
					}}
					onChangeText={(text) => formatarCpf(text)}
					placeholder="Digite seu CPF"
				/>
				<Text //insightCPF
					style={[
						{ display: insightCpf ? "flex" : "none" },
						{ color: errorCPF ? "#ff0000" : "#64748b" },
						insightCpf ? stylesRegistrarse.marginBottom8 : ''
					]}
				>
					CPF inválido
				</Text>



				<View style={[stylesMain.withFull, stylesRegistrarse.alignItemsCenter]}>
					<TouchableOpacity
						onPress={() => {
							checkToContinue();
						}}
						style={[
							stylesMain.buttonSemiRounded,
							stylesMain.backgroundRed,
							stylesMain.withFull,
							stylesMain.with80,
							{ marginTop: 20 }
						]}
					>
						<Text style={stylesMain.textoButtonWith} ref={sixthInputRef} //define a referencia
						>Confirmar</Text>
					</TouchableOpacity>
				</View>
				{/*
				//===============// ICON GOOGLE E FACE \\================\\
				<Text>ou</Text>
				<View style={[stylesMain.flexRow]}>
					<TouchableOpacity
						onPress={() => {}}
						style={stylesMain.buttonSemiRounded}
					>
						<View style={stylesMain.containerIcon}>
							<IconFacebook width={rem(2.5)} height={rem(2.5)} />
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
				 */}
				 <View style={[{dispaly:isFocused?"flex":"none", marginBottom:'25%'}]}><Text> </Text></View>
			</ScrollView>
		</KeyboardAvoidingView>

	);
}
export const stylesRegistrarse = StyleSheet.create({
	containerMain: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#fff",
		padding: "8%",
	},
	title: {
		fontSize: NewRem(0.7),
		color: '#ff0000',
		fontWeight: 'bold',
		marginVertical: 10
	},
	gap: {
		gap: 5
	},
	alignItemsLeft: {
		alignItems: 'flex-start'
	},
	alignItemsCenter: {
		alignItems: 'center'
	},
	marginBottom8: {
		marginBottom: '8%',
	}
});

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		margin: 10,
		padding: 10,
	},
});
