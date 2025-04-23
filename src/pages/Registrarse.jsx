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
	salveLocalEmailUser,
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
import InputComplex from "../components/inputComplex";
import InputHidden from "../components/inputHidden";




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
	const [userName, setUserName] = useState("Humberto Caio");
	const [insightName, setInsightName] = useState(false);
	const [errorName, setErrorName] = useState(false);

	//variáveis do Email
	const [userEmail, setUserEmail] = useState("Teste@TESTE.com");
	const [insightEmail, setInsightEmail] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);

	//Variáveis da senha primeiro input
	const [userPassword, setUserPassword] = useState("96135151Ab!");
	const [hiddenPassword, setHiddenPassword] = useState(true); //Mostrar ou ocultar senha
	const [insightPassword, setInsightPassword] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);

	//Variáveis da senha confirm input
	const [confirmPassWord, setConfirmPassWord] = useState("96135151Ab!");
	const [hiddenConfirm, setHiddenConfirm] = useState(true); //Mostrar ou ocultar senha
	const [insightConfirm, setInsightConfirm] = useState(false);
	const [errorConfirm, setErrorConfirm] = useState(false);

	//Variáveis cpf input
	const [cpf, setCpf] = useState("68258849050");
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
		const num = text.replace(/\D/g, ""); // Remove caracteres não numéricos
		let formatted = "";

		if (num.length > 0) {
			formatted = num.substring(0, 3);
			if (num.length > 3) formatted += ".";
		}

		if (num.length > 3) {
			formatted += num.substring(3, 6);
			if (num.length > 6) formatted += ".";
		}

		if (num.length > 6) {
			formatted += num.substring(6, 9);
			if (num.length > 9) formatted += "-";
		}

		if (num.length > 9) {
			formatted += num.substring(9, 11);
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
		if (userPassword === ConfirmPassword) {
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
				password: userPassword,
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
			scrollRef.current?.scrollTo({ y: -vh(200), animated: true })	;
		}
		if (!isEqualPassword(confirmPassWord)) {
			setInsightConfirm(true);
			setErrorConfirm(true);
			result = false;
			fourthInputRef.current.focus();
		}

		if (!validateUserPassword(userPassword)) {
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
				<View style={[stylesMain.withFull, stylesRegistrarse.alignItemsCenter, {marginTop:'8%'}]}>
					<Text style={stylesRegistrarse.title}>Criar conta</Text>
				</View>
				<InputComplex
					title="Nome"
          placeholder="Insira seu Nome Completo."
          insightText="Insira seu nome completo."
          firstRef={firstInputRef}
          secondRef={secondInputRef}
          maxLengthInput={50}
          valueState={userName}
          setValueStateOrFunctionMask={setUserName}
          insightState={insightName}
          setInsightState={setInsightName}
          errorState={errorName}
          setErrorState={setErrorName}
          functionValidate={nameIsValid}
          setFocused={setIsFocused}
				/>
				<InputComplex
					title="E-mail"
          placeholder="Insira seu e-mail."
          insightText="E-mail deve ser no formato: exemplo@exemplo.com"
          firstRef={secondInputRef}
          secondRef={thirdInputRef}
          maxLengthInput={100}
          valueState={userEmail}
          setValueStateOrFunctionMask={setUserEmail}
          insightState={insightEmail}
          setInsightState={setInsightEmail}
          errorState={errorEmail}
          setErrorState={setErrorEmail}
          functionValidate={validateUserEmail}
          setFocused={setIsFocused}
					keyboard="email-address"
				/>
				<InputHidden
					title="Senha"
          placeholder="Insira sua senha."
          insightText="Senha deve ter pelo menos menos um número, uma letra maiúscula, uma minúscula, um carácter especial e pelo menos 8 dígitos."
          firstRef={thirdInputRef}
          secondRef={fourthInputRef}
          maxLengthInput={50}
          valueState={userPassword}
          setValueStateOrFunctionMask={setUserPassword}
          insightState={insightPassword}
          setInsightState={setInsightPassword}
          errorState={errorPassword}
          setErrorState={setErrorPassword}
          functionValidate={validateUserPassword}
          setFocused={setIsFocused}
					hiddenState={hiddenPassword}
					setHiddenState={setHiddenPassword}
				/>
				<InputHidden
					title="Confirme"
          placeholder="Insira sua senha."
          insightText="As duas senhas devem ser iguais."
          firstRef={fourthInputRef}
          secondRef={fifthInputRef}
          maxLengthInput={50}
          valueState={confirmPassWord}
          setValueStateOrFunctionMask={setConfirmPassWord}
          insightState={insightConfirm}
          setInsightState={setInsightConfirm}
          errorState={errorConfirm}
          setErrorState={setErrorConfirm}
          functionValidate={isEqualPassword}
          setFocused={setIsFocused}
					hiddenState={hiddenConfirm}
					setHiddenState={setHiddenConfirm}
				/>
				<InputComplex
					title="CPF"
          placeholder="Digite seu CPF."
          insightText="CPF inválido, favor informar um CFP válido."
          firstRef={fifthInputRef}
          secondRef={sixthInputRef}
          maxLengthInput={14}
          valueState={cpf}
          setValueStateOrFunctionMask={formatarCpf}
          insightState={insightCpf}
          setInsightState={setInsightCpf}
          errorState={errorCPF}
          setErrorState={setErrorCPF}
          functionValidate={validateCpf}
          setFocused={setIsFocused}
					keyboard="numeric"
					actionScroll={scrollToTopCpf}
				/>
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
		paddingHorizontal: "8%",
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
