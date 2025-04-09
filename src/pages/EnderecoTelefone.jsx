import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform
} from "react-native";
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
import InputComplex from "../components/inputComplex";


export default function EnderecoTelefone({ route, navigation }) {
  //dados da página anterior
  const dataUser = route.params;

  //ip de conexão com o banco de dados
  const { ip } = useContext(AuthContext)

  //Variáveis do Telefone
  const [userPhone, setPhone] = useState("");
  const [insightPhone, setInsightPhone] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);

  //Variáveis do CEP
  const [userCEP, setUserCEP] = useState("");
  const [insightCEP, setInsightCEP] = useState(false);
  const [errorCEP, setErrorCEP] = useState(false);

  //Variáveis do Endereço
  const [userStreet, setUserStreet] = useState("");
  const [insightStreet, setInsightStreet] = useState(false);
  const [errorStreet, setErrorStreet] = useState(false);

  //Variáveis do Numero
  const [userNumber, setUserNumber] = useState("");
  const [insightNumber, setInsightNumber] = useState(false);
  const [errorNumber, setErrorNumber] = useState(false);

  //Variáveis do Bairro
  const [userDistrict, setUserDistrict] = useState("");
  const [insightDistrict, setInsightDistrict] = useState(false);
  const [errorDistrict, setErrorDistrict] = useState(false);
  
  //Variáveis do Complemento
  const [userComplementAddress, setUserComplementAddress] = useState("");
  const [insightComplementAddress, setInsightComplementAddress] = useState(false);
  const [errorComplementAddress, setErrorComplementAddress] = useState(false);

  //Variáveis do Cidade
  const [userCity, setUserCity] = useState("");
  const [insightCity, setInsightCity] = useState(false);
  const [errorCity, setErrorCity] = useState(false);

  //Variáveis do Estado
  const [userState, setUserState] = useState("");
  const [insightState, setInsightState] = useState(false);
  const [errorState, setErrorState] = useState(false);

  //Controla um marginBootom condicional para facilitar a navegação
  const [isFocused, setIsFocused] = useState(false);

  //Controla o mapeamento de "tab"
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);
  const fourthInputRef = useRef(null);
  const fifthInputRef = useRef(null);
  const sixthInputRef = useRef(null);
  const seventhInputRef = useRef(null);
  const eighthInputRef = useRef(null);
  const ninthInputRef = useRef(null);

  const scrollRef = useRef(null);
  const scrollToTopBig = () => {
    scrollRef.current?.scrollTo({ y: vh(50), animated: true });
  };

  const scrollToTopSmall = () => {
    scrollRef.current?.scrollTo({ y: vh(15), animated: true });
  };


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

  //função para ter apenas numero
  const onlyNumber = (text) => {
    let result = text.replace(/\D/g, '');
    return result
  }

  // Função para aplicar a máscara manualmente no phone 
  const applyMaskPhone = (text) => {
    let textlocal = onlyNumber(text)
    let formatted = "";
    if (textlocal.length > 10) {
      formatted = `(${textlocal.substring(0, 2)}) ${textlocal.substring(2, 3)}.${textlocal.substring(3, 7)}-${textlocal.substring(7, 11)}`;
    } else if (textlocal.length > 6) {
      formatted = `(${textlocal.substring(0, 2)}) ${textlocal.substring(2, 6)}-${textlocal.substring(6, 10)}`;
    } else if (textlocal.length > 2) {
      formatted = `(${textlocal.substring(0, 2)}) ${textlocal.substring(2, 6)}`;
    } else if (textlocal.length > 0) {
      formatted = textlocal.substring(0, 2)
    } else {
      formatted = '';
    }
    setPhone(formatted);
  };

  //Função para aplicar a máscara manualmente no CEP 
  const applyMaskCEP = (text) => {
    let textlocal = onlyNumber(text)
    let formatted = "";
    if (textlocal.length > 5) {
      formatted = `${textlocal.substring(0, 5)}-${textlocal.substring(5, 8)}`;
    } else if (textlocal.length > 0) {
      formatted = textlocal.substring(0, 5)
    } else {
      formatted = '';
    }
    setUserCEP(formatted);
  };

  // ---------------------  Validações  -------------------------------

  const validatePhoneNumber = (number) => {
    const cleanedNumber = onlyNumber(number); // Remove caracteres especiais
    // Celular (11 dígitos) ou fixo (10 dígitos)
    const isValid = /^(\d{10}|\d{11})$/.test(cleanedNumber);
    return isValid;
  };

  const validateCEP = (number) => {
    const cleanedNumber = onlyNumber(number); // Remove caracteres especiais
    if (cleanedNumber.length < 8) {
      return false
    }
    return true
  };

  const validateStreet = (text) => {
    if (text.length < 1) {
      return false
    }
    return true
  }

  const validateNumber = (text) => {
    if (text.length < 1) {
      return false
    }
    return true
  }

  const validateDistrict = (text) => {
    if (text.length < 1) {
      return false
    }
    return true
  }

  const validateCity = (text) => {
    if (text.length < 1) {
      return false
    }
    return true
  }

  const validateState = (text) => {
    if (text.length < 1) {
      return false
    }
    return true
  }

  /*

  function gravaLocal(){
  let localCpf = cpf;
      localCpf = localCpf.replace(/[^\d]+/g, "");
      salveLocalName(userName);
      salveLocalUser(userEmail.toLowerCase());
      salveLocalPassword(userPassWord);
      salveLocalCPF(localCpf);
      }
 
  // Função para validar o número de telefone
  
  */
  return (
    <KeyboardAvoidingView
      style={stylesRegistrarse.containerMain}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // Ajuste se necessário
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, width: vw(84) }}
        keyboardShouldPersistTaps="handled"
        ref={scrollRef}
      >
        <InputComplex 
          title="Telefone"
          placeholder="Insira seu telefone"
          insightText="Insira o telefone com o formato do telefone correto, exemplo: (33)3333-3333 ou (99)99999-9999."
          firstRef={firstInputRef}
          secondRef={secondInputRef}
          maxLengthInput={16}
          valueState={userPhone}
          setValueStateOrFunctionMask={applyMaskPhone}
          insightState={insightPhone}
          setInsightState={setInsightPhone}
          errorState={errorPhone}
          setErrorState={setErrorPhone}
          functionValidate={validatePhoneNumber}
          setFocused={setIsFocused}
        />

        <InputComplex 
          title="CEP"
          placeholder="Insira seu CEP"
          insightText="CEP inválido, favor fornecer um CEP válido."
          firstRef={secondInputRef}
          secondRef={thirdInputRef}
          maxLengthInput={11}
          valueState={userCEP}
          setValueStateOrFunctionMask={applyMaskCEP}
          insightState={insightCEP}
          setInsightState={setInsightCEP}
          errorState={errorCEP}
          setErrorState={setErrorCEP}
          functionValidate={validateCEP}
          setFocused={setIsFocused}
        />
        <InputComplex 
          title="Logradouro"
          placeholder="Insira o nome da rua ou avenida."
          insightText="Insira o logradouro, nome da rua ou avenida."
          firstRef={thirdInputRef}
          secondRef={fourthInputRef}
          maxLengthInput={255}
          valueState={userStreet}
          setValueStateOrFunctionMask={setUserStreet}
          insightState={insightStreet}
          setInsightState={setInsightStreet}
          errorState={errorStreet}
          setErrorState={setErrorStreet}
          functionValidate={validateStreet}
          setFocused={setIsFocused}
        />
        <InputComplex 
          title="Numero"
          placeholder="Insira o numero da casa."
          insightText="Insira o numero da casa."
          firstRef={fourthInputRef}
          secondRef={fifthInputRef}
          maxLengthInput={50}
          valueState={userNumber}
          setValueStateOrFunctionMask={setUserNumber}
          insightState={insightNumber}
          setInsightState={setInsightNumber}
          errorState={errorNumber}
          setErrorState={setErrorNumber}
          functionValidate={validateNumber}
          setFocused={setIsFocused}
        />
        <InputComplex 
          title="Bairro"
          placeholder="Insira o nome do bairro."
          insightText="Insira o nome do bairro."
          firstRef={fifthInputRef}
          secondRef={sixthInputRef}
          maxLengthInput={255}
          valueState={userDistrict}
          setValueStateOrFunctionMask={setUserDistrict}
          insightState={insightDistrict}
          setInsightState={setInsightDistrict}
          errorState={errorDistrict}
          setErrorState={setErrorDistrict}
          functionValidate={validateDistrict}
          setFocused={setIsFocused}
          actionScroll={scrollToTopSmall}
        />
        <InputComplex 
          title="Complemento"
          placeholder="Insira complemento para seu endereço."
          insightText="Insira complemento para seu endereço."
          firstRef={sixthInputRef}
          secondRef={seventhInputRef}
          maxLengthInput={255}
          valueState={userComplementAddress}
          setValueStateOrFunctionMask={setUserComplementAddress}
          insightState={insightComplementAddress}
          setInsightState={setInsightComplementAddress}
          errorState={errorComplementAddress}
          setErrorState={setErrorComplementAddress}
          setFocused={setIsFocused}
          actionScroll={scrollToTopSmall}
        />
        <InputComplex 
          title="Cidade"
          placeholder="Insira o nome da cidade."
          insightText="Insira o nome da cidade."
          firstRef={seventhInputRef}
          secondRef={eighthInputRef}
          maxLengthInput={255}
          valueState={userCity}
          setValueStateOrFunctionMask={setUserCity}
          insightState={insightCity}
          setInsightState={setInsightCity}
          errorState={errorCity}
          setErrorState={setErrorCity}
          functionValidate={validateCity}
          setFocused={setIsFocused}
          actionScroll={scrollToTopSmall}
        />
        <InputComplex
          title="Estado"
          placeholder="Insira o estado"
          insightText="Insira o seu estado"
          firstRef={eighthInputRef}
          secondRef={ninthInputRef}
          valueState={userState}
          setValueStateOrFunctionMask={setUserState}
          insightState={insightState}
          setInsightState={setInsightState}
          errorState={errorState}
          setErrorState={setErrorState}
          functionValidate={validateState}
          setFocused={setIsFocused}
          actionScroll={scrollToTopBig}
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
            <Text
              style={stylesMain.textoButtonWith}
              ref={ninthInputRef} //define a referencia
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[{ dispaly: isFocused ? "flex" : "none", marginBottom: '25%' }]}><Text> </Text></View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}