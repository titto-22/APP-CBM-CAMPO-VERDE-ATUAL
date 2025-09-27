import { useEffect } from "react";
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
	const localAddressRef = useRef(dadosEmergencia.addressFull || "");
  // Removido localDescriptionRef
  
	// Refs para os inputs
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);
  
  // Estado para armazenar se há vítimas (null = não selecionado, true = sim, false = não)
  const [hasVictims, setHasVictims] = useState(false);
  // Estados para os campos adicionais (apenas se hasVictims for true)
  const [numberOfVictims, setNumberOfVictims] = useState(0);
  const [victimCondition, setVictimCondition] = useState('');
  const [descricao, setDescricao] = useState("");
  
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
  
	
  const handleToggle = (value) => {
    setHasVictims(value);
    // Limpa os campos adicionais se o usuário mudar de "Sim" para "Não"
    if (!value) {
      setNumberOfVictims(0);
      setVictimCondition('');
    }
  };
  
  const handleNumberOfVictimsChange = (text) => {
    // Permite apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    setNumberOfVictims(numericText);
  }
  
  async function salveOccurrence() {
    const dataOccurrence = {
      user:  await getLocalUser(),
      natOco: dadosEmergencia.tipoEmergencia,
      addressFull: localAddressRef.current,
      description: descricao,
      hasVictim: hasVictims,
    };
    
    if(dadosEmergencia.latitude && dadosEmergencia.longitude){
      dataOccurrence.geoLat = dadosEmergencia.latitude
      dataOccurrence.geoLong = dadosEmergencia.longitude
    }
    if(dadosEmergencia.addressStreet){
      dataOccurrence.addressLog= dadosEmergencia.addressStreet
    }
    if(dadosEmergencia.addressNumber){
      dataOccurrence.addressNum= dadosEmergencia.addressNumber
    }
    if(dadosEmergencia.addressDistrict){
      dataOccurrence.addressBairro= dadosEmergencia.addressDistrict
    }
    if(dadosEmergencia.addressCity){
      dataOccurrence.addressCity= dadosEmergencia.addressCity
    }
    if(dadosEmergencia.addressRegion){
      dataOccurrence.addressState= dadosEmergencia.addressRegion
    }
    if(dadosEmergencia.addressPostalCode){
      dataOccurrence.addressCEP= dadosEmergencia.addressPostalCode
    }
    if(hasVictims === true){
      dataOccurrence.victimsQuantity = Number(numberOfVictims);
      dataOccurrence.conditionVictim = victimCondition;
      if(!numberOfVictims || numberOfVictims <= 0){
        Alert.alert("Atenção", "Por favor, informe o número de vítimas.");
        return; // Sai da função sem enviar os dados
      }
      if(!victimCondition){
        Alert.alert("Atenção", "Por favor, selecione a condição da vítima.");
        return; // Sai da função sem enviar os dados
      }
    }
    
    const baseURL = `https://${ip}`;
    
    fetch(`${baseURL}/create-occurrence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataOccurrence),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { // Tenta ler o corpo JSON de erro
            err.status = response.status
            throw err; // Rejoga o erro com o corpo JSON
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sucesso conexão: ", Object.entries(data), 'Ocorrência Registrada');
        // Após a resposta de sucesso do servidor, grava dados localmente para posterior recuperação        
        // Depois exibe mensagem de sucesso e redirecionar o usuário para tela Home
        Alert.alert("Sucesso", "Ocorrência criado com sucesso.", [
          {
            text: "OK", onPress: () => {
              navigation.navigate("Emergências");
            }
          },
        ],
        { cancelable: false }
      )
    })
    .catch((error) => {
      console.error(`Erro: Request Status Error: ${error.status}, message: ${error.message}`);
      if(error.message.slice(0, 5) === "body/"){
        Alert.alert("Atenção", `${error.message.split(' ').slice(1).join(' ')}`)
      } else{
        Alert.alert("Atenção Erro:", `${error.message}`)
      }
      
    })
	}
  // Reseta campos ao entrar na tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setHasVictims(false);
      setNumberOfVictims(0);
      setVictimCondition('');
  setDescricao("");
    });
    return unsubscribe;
  }, [navigation]);
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[{ flex: 1 },]}
		>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
				<View style={[stylesDadosEmergencia.containerMain, {paddingBottom:24}]}>
					<Text style={[stylesMain.textBase, { paddingTop: rem(1), fontSize: rem(1.2) },]}>
						Ocorrência:
					</Text>	
					<Text style={[stylesMain.textBase, { paddingBottom: rem(1) }]}>
            {dadosEmergencia.tipoEmergencia}
					</Text>	
          <Text style={stylesDadosEmergencia.titleInput}>Informações sobre vítima(s):</Text>
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
                onChangeText={handleNumberOfVictimsChange}
                maxLength={4}
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
          {dadosEmergencia.addressFull ? (
             <View style={{width: '100%'}}>
              <Text style={stylesDadosEmergencia.titleInput}>Endereço informado da ocorrência:</Text>
              <Text style={[styles.input, {color:'#64748b', paddingVertical:4, paddingHorizontal:8, height:'auto'}]}>{dadosEmergencia.addressFull}</Text>
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
            onChangeText={(text) => setDescricao(text)}
            value={descricao}
            placeholder="Descreva o incidente"
            multiline={true}
            maxLength={1000}
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
		paddingEnd: 24,
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
  conditionOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
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
  conditionButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
  conditionButtonSelected: {
    backgroundColor: '#28a745', // Cor de destaque para a condição selecionada
    borderColor: '#28a745',
  },
  
  conditionButtonTextSelected: {
    color: '#fff',
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
});
