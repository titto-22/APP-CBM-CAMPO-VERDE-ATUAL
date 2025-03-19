import { useState, useRef } from "react";
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
} from "../components/function";
import IconFacebook from "../assets/iconFacebook.svg";
import IconGoogle from "../assets/iconGoogle.svg";
import EyeOf from "../assets/eye-slash.svg";
import EyeOn from "../assets/eye.svg";

export default function Registrarse({ navigation }) {
	//Variáveis do nome
	const [userName, setUserName] = useState("");
	const [insightName, setInsightName] = useState(false);
	const [errorName, setErrorName] = useState(false);

	//variáveis do Email
	const [userEmail, setUserEmail] = useState("");
	const [insightEmail, setInsightEmail] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);

	//Variáveis da senha primeiro input
	const [userPassWord, setUserPassWord] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true); //Mostrar ou ocultar senha
	const [insightPassword, setInsightPassword] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);

	//Variáveis da senha confirm input
	const [confirmPassWord, setConfirmPassWord] = useState("");
	const [hiddenConfirm, setHiddenConfirm] = useState(true); //Mostrar ou ocultar senha
	const [insightConfirm, setInsightConfirm] = useState(false);
	const [errorConfirm, setErrorConfirm] = useState(false);

	//Variáveis cpf input
	const [cpf, setCpf] = useState("");
	const [insightCpf, setInsightCpf] = useState(false);
	const [errorCPF, setErrorCPF] = useState(false);

	//variáveis do Endereço
	const [userAddress, setUserAddress] = useState("");
	const [insightAddress, setInsightAddress] = useState(false);
	const [errorAddress, setErrorAddress] = useState(false);

	//variáveis do Telefone
	const [userTelefon, setUserTelefon] = useState("");
	const [insightTelefon, setInsightTelefon] = useState(false);
	const [errorTelefon, setTelefon] = useState(false);

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

	//Validação do endereço
	function isValidateAddress(text) {
		if (text === "" || text.length < 10) {
			return false;
		}
		return true;
	}

	/*
	// Função para aplicar a máscara manualmente
	const applyMask = (text) => {
    textlocal = text.replace(/\D/g, ''); // Remove tudo que não for dígito

    if (textlocal.length <= 10) {
      // Máscara para telefone fixo: (99) 9999-9999
      textlocal = textlocal.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Máscara para celular: (99) 99999-9999
      textlocal = textlocal.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    return textlocal;
  };
	

  // Função para validar o número de telefone
  const validatePhoneNumber = (number) => {
    const cleanedNumber = number.replace(/\D/g, ''); // Remove caracteres especiais
    // Celular (11 dígitos) ou fixo (10 dígitos)
    const isValid = /^(\d{10}|\d{11})$/.test(cleanedNumber);
    return isValid;
  };
	*/

	//Chama função que verifica dados e caso tudo ok grava localmente
	function salveUserInLocalStorage() {
		if (checkInputs()) {
			let localCpf = cpf;
			localCpf = localCpf.replace(/[^\d]+/g, "");
			salveLocalName(userName);
			salveLocalUser(userEmail.toLowerCase());
			salveLocalPassword(userPassWord);
			salveLocalCPF(localCpf);
			salveLocalAdress(userAddress);
			navigation.navigate("Login");
		} else {
		}
	}

	//Função que faz a checagem dos dados para gravar novo usuário
	function checkInputs() {
		setInitialValidation(true);
		let result = true;
		//Caso nome não seja valido retorna true, inverto o resultado
		//para entrar no if de erro e mostrar a ajudo em vermelho e
		//da foco no input
		if (!isValidateAddress(userAddress)) {
			setInsightAddress(true);
			setErrorAddress(true);
			result = false;
			sixthInputRef.current.focus();
		}
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
		//<KeyboardAvoidingView
		//behavior={Platform.OS === "ios" ? "padding" : "height"}
		<ScrollView
			contentContainerStyle={[
				stylesRegistrarse.containerMain,
				{ justifyContent: isFocused ? "flex-start" : "center" }, {marginBottom:isFocused?rem(10):0},
			]}
		>
			<Text style={stylesMain.textBase}>Criar conta</Text>
			<View style={[stylesMain.with80]}>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>Nome:</Text>
				</View>
				<TextInput //Name
					style={[stylesMain.input, stylesMain.withFull]}
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
					]}
				>
					Insira o seu nome completo
				</Text>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>E-mail:</Text>
				</View>
				<TextInput // Email
					style={[stylesMain.input, stylesMain.withFull]}
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
					]}
				>
					E-mail deve ser no formato: exemplo@gmail.com
				</Text>
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
						stylesMain.input,
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
					]}
				>
					As duas senhas devem ser iguais.
				</Text>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>CPF:</Text>
				</View>
				<TextInput //CPF
					style={[stylesMain.input, stylesMain.withFull]}
					type={"cpf"}
					value={cpf}
					maxLength={14}
					onFocus={() => setIsFocused(true)}
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
					]}
				>
					CPF inválido
				</Text>
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>Endereço:</Text>
				</View>
				<TextInput //Endereço
					style={[stylesMain.input, stylesMain.withFull]}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						setIsFocused(false);
						if (!isValidateAddress(userAddress)) {
							setInsightAddress(true);
						} else {
							setInsightAddress(false);
						}
					}}
					ref={sixthInputRef} //define a referencia
					/*onSubmitEditing={() => {
						seventhInputRef.current.focus(); // Move o foco para o segundo input
					}}*/
					returnKeyType="next" //define botão no teclado de proximo
					onChangeText={(text) => {
						setUserAddress(text);
					}}
					value={userAddress}
					placeholder="Insira seu endereço"
					maxLength={255}
				/>
				<Text //insightAddress
					style={[
						{ display: insightAddress ? "flex" : "none" },
						{ color: errorAddress ? "#ff0000" : "#64748b" },
					]}
				>
					Insira o seu endereço
				</Text>
				{/*
				<View style={[stylesMain.containerTextTopInput]}>
					<Text style={stylesMain.textTopInput}>Telefone:</Text>
				</View>
				
				<TextInput 																																										//Telefone
					style={[stylesMain.input, stylesMain.withFull]}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						setIsFocused(false);
						if (userTelefon === "") {
							setInsightTelefon(true);
						} else {
							setInsightTelefon(false);
						}
					}}
					ref={seventhInputRef} //define a referencia
					returnKeyType="next" //define botão no teclado de proximo
					onChangeText={(text) => {
						setUserTelefon(applyMask(text));
					}}
					value={userTelefon}
					placeholder="Insira seu endereço"
					keyboardType="phone-pad"
					maxLength={15}
				/>
				<Text 																																												//insightCPF
					style={[
						{ display: insightTelefon ? "flex" : "none" },
						{ color: errorTelefon ? "#ff0000" : "#64748b" },
					]}
				>
					Insira o seu endereço
				</Text>*/}
			</View>
			<TouchableOpacity
				onPress={() => {
					salveUserInLocalStorage();
				}}
				style={[
					stylesMain.buttonSemiRounded,
					stylesMain.backgroundRed,
					stylesMain.withFull,
					stylesMain.with80,
				]}
			>
				<Text style={stylesMain.textoButtonWith}>Confirmar</Text>
			</TouchableOpacity>
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
		</ScrollView>
	);
}
export const stylesRegistrarse = StyleSheet.create({
	containerMain: {
		alignItems: "center",
		backgroundColor: "#fff",
		gap: 14,
		paddingnTop: 15,
		paddingEnd: 15,
		paddingLeft: "5%",
	},
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
