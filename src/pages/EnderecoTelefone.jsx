import { View, Text, ScrollView, TextInput } from "react-native";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../App";
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
import { stylesRegistrarse } from "./Registrarse";
import { stylesMain } from "./Login";


export default function EnderecoTelefone({ route, navigation }) {

  const dataUser = route.params;

  //ip de conexão com o banco de dados
  const { ip } = useContext(AuthContext)

  //variáveis do Endereço
  const [userAddress, setUserAddress] = useState("");
  const [insightAddress, setInsightAddress] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);

  //variáveis do Telefone
  const [userTelefon, setUserTelefon] = useState("");
  const [insightTelefon, setInsightTelefon] = useState(false);
  const [errorTelefon, setTelefon] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
	const firstInputRef = useRef(null);
	const secondInputRef = useRef(null);
	const thirdInputRef = useRef(null);
	const fourthInputRef = useRef(null);
	const fifthInputRef = useRef(null);
	const sixthInputRef = useRef(null);
	const seventhInputRef = useRef(null);

  //Variáveis do Telefone
	const [phone, setPhone] = useState(""); //Mostrar ou ocultar senha
	const [insightPhone, setInsightPhone] = useState(false);
	const [errorPhone, setErrorPhone] = useState(false);

  // ---------------------  TESTE CONEXÃO -------------------------------

  function testeConexaoFrontBack() {
    const userData = {
      userName: "Teste",
      cpf: "04404846185",
      telephone: "06645232",
      email: "teste@teste.com",
      password: "123456",
      addressFull: 'rua teste, numeor teste, bairro teste, complemente completamete incompleto, city: starcity, Mato Grande, Minas unicas, brazil com z de zorrrrrro'
    };

    const baseURL = `http://${ip}:3333`;

    fetch(`${baseURL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sucesso:", data);
        // Faça algo com a resposta do servidor
      })
      .catch((error) => {
        console.error("Erro:", error);
        // Lide com erros de requisição
      })
      .finally(() => {
        setLoadingTeste(false);
      });
  }

  // ---------------------  TESTE CONEXÃO -------------------------------



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
  	
    function gravaLocal(){
    let localCpf = cpf;
        localCpf = localCpf.replace(/[^\d]+/g, "");
        salveLocalName(userName);
        salveLocalUser(userEmail.toLowerCase());
        salveLocalPassword(userPassWord);
        salveLocalCPF(localCpf);
        }
  
    // Função para validar o número de telefone
    const validatePhoneNumber = (number) => {
      const cleanedNumber = number.replace(/\D/g, ''); // Remove caracteres especiais
      // Celular (11 dígitos) ou fixo (10 dígitos)
      const isValid = /^(\d{10}|\d{11})$/.test(cleanedNumber);
      return isValid;
    };
    */
  return (
    <View style={stylesRegistrarse.containerMain}>
      <ScrollView showsVerticalScrollIndicator={false}
				contentContainerStyle={[{ gap: 10 }
				]}>
          <View style={[stylesMain.containerTextTopInput]}>
                    <Text style={stylesMain.textTopInput}>Telefone:</Text>
                  </View>
                  <TextInput //Phone
                    style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setIsFocused(false);
                     
                    }}
                    returnKeyType="next" //define botão no teclado de próximo
                    ref={firstInputRef} //define a referencia
                    onSubmitEditing={() => {
                      secondInputRef.current.focus(); // Move o foco para o segundo input
                    }}
                    onChangeText={(text) => {
                      setPhone(text);
                    }}
                    value={phone}
                    placeholder="Insira seu Telefone"
                    maxLength={13}
                  />
                  <Text //insight Phone
                    style={[
                      { display: insightPhone ? "flex" : "none" },
                      { color: errorPhone ? "#ff0000" : "#64748b" },
                    ]}
                  >
                    Insira o seu nome completo.
                  </Text>
        <Text>{dataUser.name}</Text>

        {/*
                <View style={[stylesMain.containerTextTopInput]}>
                  <Text style={stylesMain.textTopInput}>Telefone:</Text>
                </View>
                
                <TextInput 																																										//Telefone
                  style={[stylesMain.input, {marginBottom: "8%"}, stylesMain.withFull]}
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
                </Text>
                */}

      </ScrollView>
    </View>
  )
}