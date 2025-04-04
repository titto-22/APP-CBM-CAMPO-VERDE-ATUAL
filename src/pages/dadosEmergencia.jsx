import { useState, useRef, useCallback, memo } from "react";
import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import { stylesMain } from "../pages/Login";
import { getLocalCPF, getLocalName, rem, salveLocalIncident, removeIncident, getLocalIncident, resetLocalIncident } from "../components/function";


function DadosEmergencia({ route, navigation }) {

	const dadosEmergencia = route.params;

	const localName = getLocalName()
	const localCPF = getLocalCPF()

	// Armazena valores sem causar re-renderização
	const localAddressRef = useRef(dadosEmergencia.address || "");
	const localDescrepitionRef = useRef("");

	// Refs para os inputs
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);

	// Funções de mudança de texto (não causam re-renderização)
	const handleAddressChange = useCallback((text) => {
		localAddressRef.current = text;
	}, []);

	const handleDescriptionChange = useCallback((text) => {
		localDescrepitionRef.current = text;
	}, []);

	async function salveIncident(address, descripition) {
		const existingIncidents = await getLocalIncident();
		const newIncident = [localName.value, localCPF.value, dadosEmergencia.tipoEmergencia, address, descripition];

		let updatedIncidents;

		if (existingIncidents === null) {
			// Nenhum incidente salvo, cria um novo array
			updatedIncidents = [newIncident];
		} else {
			// Já existem incidentes, adiciona o novo ao final
			updatedIncidents = [...existingIncidents, newIncident];
		}

		try {
			await salveLocalIncident(updatedIncidents);
			Alert.alert("Sucesso", "Notificação de incidente salva com sucesso")
			navigation.navigate("Emergências");
		} catch (erro) {
			console.error("Erro  ao salvar incidente", error)
			Alert.alert("Erro  ao salvar incidente", error)
		}

	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[{ flex: 1 },]}
		>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
				<View style={stylesDadosEmergencia.containerMain}>
					<Text style={[stylesMain.textBase, { paddingVertical: rem(1) }]}>
						INFORME OS DADOS DA OCORRÊNCIA:
					</Text>

					<Text style={stylesDadosEmergencia.titleInput}>SOLICITANTE:</Text>
					<Text style={stylesDadosEmergencia.inputDesable}>{localName}</Text>

					<Text style={stylesDadosEmergencia.titleInput}>CPF:</Text>
					<Text style={stylesDadosEmergencia.inputDesable}>{localCPF}</Text>

					<Text style={stylesDadosEmergencia.titleInput}>TIPO DA OCORRÊNCIA:</Text>
					<Text style={stylesDadosEmergencia.inputDesable}>{dadosEmergencia.tipoEmergencia}</Text>

					<Text style={stylesDadosEmergencia.titleInput}>ENDEREÇO DA OCORRÊNCIA:</Text>
					<TextInput
						defaultValue={localAddressRef.current}
						onChangeText={handleAddressChange}
						style={stylesDadosEmergencia.inputInsert}
						placeholder="Digite o endereço"
						ref={firstInputRef}
						onSubmitEditing={() => {
							secondInputRef.current.focus(); // Move o foco para o segundo input
						}}
						returnKeyType="next" //define botão no teclado de próximo
					/>

					<Text style={stylesDadosEmergencia.titleInput}>DESCREVA A SITUAÇÃO:</Text>
					<TextInput
						style={[stylesDadosEmergencia.textArea,]}
						onChangeText={handleDescriptionChange}
						defaultValue={localDescrepitionRef.current}
						placeholder="Descreva o incidente"
						multiline={true}
						numberOfLines={4}
						maxLength={500}
						ref={secondInputRef} //define a referencia
						returnKeyType="next" //define botão no teclado de próximo
					/>
					<TouchableOpacity
						onPress={() => {
							salveIncident(localAddressRef.current, localDescrepitionRef.current)
								;
						}}
						style={[
							stylesMain.buttonSemiRounded,
							stylesMain.backgroundRed,
							stylesMain.withFull,
							stylesMain.with80,
							{ marginVertical: rem(0.5) }
						]}
						ref={thirdInputRef}
					>
						<Text style={stylesMain.textoButtonWith}>GERAR OCORRÊNCIA</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

// Usa memo para evitar renderizações desnecessárias quando as props não mudam
export default memo(DadosEmergencia);

const stylesDadosEmergencia = StyleSheet.create({
	titleInput: {
		fontSize: rem(1),
		width: "100%",
		paddingVertical: rem(0.25),
	},
	inputDesable: {
		width: "100%",
		paddingVertical: rem(0.35),
		paddingHorizontal: rem(0.5),
		marginBottom: rem(0.5),
		backgroundColor: "#D9D9D9",
		color: "#64748b",
		borderRadius: 16,
	},
	containerMain: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: rem(1),
		paddingEnd: rem(1),
		alignItems: "center",
		paddingHorizontal: "10%",
	},
	inputInsert: {
		width: "100%",
		paddingVertical: rem(0.35),
		paddingHorizontal: rem(0.5),
		backgroundColor: "#D9D9D9",
		color: "#000",
		borderRadius: 16,
		marginBottom: rem(0.5),
	},
	textArea: {
		width: "100%",
		height: 150,
		justifyContent: "flex-start",
		padding: rem(0.75),
		textAlignVertical: "top",
		backgroundColor: "#D9D9D9",
		color: "#000",
		borderRadius: 16,
	},
});