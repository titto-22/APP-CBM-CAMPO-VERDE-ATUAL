import { useState, useRef, useCallback, memo, useContext } from "react";
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
  Switch
} from "react-native";
import { stylesMain } from "../pages/Login";
import { getLocalCPF, getLocalName, rem, salveLocalIncident, removeIncident, getLocalIncident, resetLocalIncident, getLocalUser } from "../components/function";
import { AuthContext, fonts } from "../../App";


function DadosEmergencia({ route, navigation }) {

  const { ip } = useContext(AuthContext)


	const dadosEmergencia = route.params;

	// Armazena valores sem causar re-renderização
	const localAddressRef = useRef(dadosEmergencia.address || "");
	const localDescrepitionRef = useRef("");

	// Refs para os inputs
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);

   // Estado para armazenar se há vítimas (null = não selecionado, true = sim, false = não)
  const [hasVictims, setHasVictims] = useState(null);
  // Estados para os campos adicionais (apenas se hasVictims for true)
  const [numberOfVictims, setNumberOfVictims] = useState('');
  const [victimCondition, setVictimCondition] = useState('');

  // Opções de condição da vítima para o campo de seleção
  const victimConditions = [
    'Ilesa',
    'Ferida (Leve)',
    'Ferida (Moderada)',
    'Ferida (Grave)',
    'Fatal',
    'Desconhecido',
  ];

	// Funções de mudança de texto (não causam re-renderização)
	const handleAddressChange = useCallback((text) => {
		localAddressRef.current = text;
	}, []);

	const handleDescriptionChange = useCallback((text) => {
		localDescrepitionRef.current = text;
	}, []); 

  const handleToggle = (value) => {
    setHasVictims(value);
    // Limpa os campos adicionais se o usuário mudar de "Sim" para "Não"
    if (!value) {
      setNumberOfVictims('');
      setVictimCondition('');
    }
  };

  	async function salveOccurrence() {
		const dataOccurrence = {
      user:  await getLocalUser(),
      
      /*
      address: localAddressRef.current,
      description: localDescrepitionRef.current,
      tipoEmergencia: dadosEmergencia.tipoEmergencia,
      hasVictims: hasVictims,
      numberOfVictims: numberOfVictims,
      victimCondition: victimCondition,
      */
    };

    const baseURL = `http://${ip}:3333`;

    fetch(`${baseURL}/create-occurrence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataOccurrence),
    })
      .then((response) => {
        if (!response.ok) {
          //console.log(response)
          return response.json().then(err => { // Tenta ler o corpo JSON de erro
            err.status = response.status
            throw err; // Rejoga o erro com o corpo JSON
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sucesso conexão: ", Object.entries(data), 'usuário criado');
        // Após a resposta de sucesso do servidor, grava dados localmente para posterior recuperação        
        // Depois exibe mensagem de sucesso e redirecionar o usuário para tela Home
        Alert.alert("Sucesso", "Usuário criado com sucesso.", [
          {
            text: "OK", onPress: () => {
              console.log("Logado com sucesso: OK")
            }
          },
        ],
          { cancelable: false }
        )
      })
      .catch((error) => {
        console.error(Object.entries(error))
        console.error(`Erro: Request Status Error: ${error.status}, message: ${error.message}`);
        Alert.alert("Atenção", `${error.message}`)

      })

	}
	

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[{ flex: 1 },]}
		>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
				<View style={[stylesDadosEmergencia.containerMain, {paddingBottom:24}]}>
					<Text style={[stylesMain.textBase, { paddingVertical: rem(1) }]}>
						INFORME OS DADOS DA OCORRÊNCIA: {dadosEmergencia.tipoEmergencia}
					</Text>		
          <View style={[{flexDirection:'row', alignItems:'center',justifyContent:'space-between',width:'100%',}, stylesDadosEmergencia.borderContainer]}>
            <Text style={stylesDadosEmergencia.questionText}>Há vítimas no local da ocorrência?</Text>
            <Switch 
              value={hasVictims} 
              onValueChange={(value) => handleToggle(value)}
            />
          </View>

          {/* Campos adicionais são mostrados somente se 'hasVictims' for true */}
          {hasVictims === true && (
            <View style={stylesDadosEmergencia.borderContainer}>
              <Text style={styles.sectionTitle}>Detalhes das Vítimas</Text>
              <Text style={[stylesDadosEmergencia.questionText, {textAlign:'left'}]}>Número de Vítimas:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 1, 2, 3..."
                value={numberOfVictims}
                onChangeText={setNumberOfVictims}
              />

              <Text style={styles.label}>Condição da Vítima Principal (ou mais grave):</Text>
              <View style={styles.conditionOptionsContainer}>
                {victimConditions.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionButton,
                      victimCondition === condition && styles.conditionButtonSelected,
                    ]}
                    onPress={() => setVictimCondition(condition)}
                  >
                    <Text
                      style={[
                        styles.conditionButtonText,
                        victimCondition === condition && styles.conditionButtonTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}      
          {dadosEmergencia.address ? (
             <View style={{width: '100%'}}>
              <Text style={stylesDadosEmergencia.titleInput}>Endereço informado da ocorrência:</Text>
              <Text style={[styles.input, {color:'#64748b', padding:4, height:'auto'}]}>{dadosEmergencia.address}</Text>
            </View>
          ) : (
            <View style={{width: '100%'}}>
              <Text style={stylesDadosEmergencia.titleInput}>Informe o endereço da ocorrência:</Text>
              <TextInput
                defaultValue={localAddressRef.current}
                onChangeText={handleAddressChange}
                style={styles.input}
                placeholder="Digite o endereço"
                ref={firstInputRef}
                onSubmitEditing={() => {
                  secondInputRef.current.focus(); // Move o foco para o segundo input
                }}
                returnKeyType="next" //define botão no teclado de próximo
              />
            </View>
          )}
					

					<Text style={stylesDadosEmergencia.titleInput}>Descreva sobre a ocorrência:</Text>
					<TextInput
						style={[stylesDadosEmergencia.textArea, stylesDadosEmergencia.borderContainer]}
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
							salveOccurrence();
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
  borderContainer:{
    marginBottom:20, 
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    borderRadius:8
  },
   questionText: {
    fontSize: rem(1),
    textAlign: 'center',
    color: '#333',
    justifyContent:'center'
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
		color: "#000",
		borderRadius: 16,
	},
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  
 
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  buttonSelected: {
    backgroundColor: '#007bff', // Cor de destaque para o botão selecionado
    borderColor: '#007bff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  buttonTextSelected: {
    color: '#fff', // Cor do texto para o botão selecionado
  },
  additionalFieldsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  conditionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  conditionButton: {
    width: '48%', // Duas colunas
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  conditionButtonSelected: {
    backgroundColor: '#28a745', // Cor de destaque para a condição selecionada
    borderColor: '#28a745',
  },
  conditionButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
  conditionButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
