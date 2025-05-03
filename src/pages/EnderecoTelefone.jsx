import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../App";
import {
  rem,
  handleCall,
  salveLocalEmailUser,
  salveLocalCPF,
  salveLocalName,
  vh,
  vw,
  NewRem,
  salveLocalPhone,
  salveLocalStreet,
  salveLocalAddressNumber,
  salveLocalComplementAddress,
  salveLocalDistrict,
  salveLocalCity,
  salveLocalState,
  salveLocalCEP,
  salveLocalIbge,
  salveLocalExpirationDate,
} from "../components/function";
import { stylesRegistrarse } from "./Registrarse";
import { stylesMain } from "./Login";
import InputComplex from "../components/inputComplex";


export default function EnderecoTelefone({ route, navigation }) {
  //dados da página anterior
  const dataUser = route.params;

  //ip de conexão com o banco de dados
  const { ip } = useContext(AuthContext)

  //Responsável por realizar o login
  const { setIsSignedIn } = useContext(AuthContext);

  //Controla verificação do CEP correto
  const [isValidateCep, setIsValidateCEP] = useState(false)

  //Variáveis do Telefone
  const [userPhone, setPhone] = useState("");
  const [insightPhone, setInsightPhone] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);

  //Variáveis do CEP
  const [userCEP, setUserCEP] = useState("");
  const [insightCEP, setInsightCEP] = useState(false);
  const [errorCEP, setErrorCEP] = useState(false);

  //Variáveis do Logradouro
  const [userStreet, setUserStreet] = useState("");
  const [insightStreet, setInsightStreet] = useState(false);
  const [errorStreet, setErrorStreet] = useState(false);
  const [disableInputStreet, setDisableInputStreet] = useState(false)

  //Variáveis do Numero do endereço
  const [userNumber, setUserNumber] = useState("");
  const [insightNumber, setInsightNumber] = useState(false);
  const [errorNumber, setErrorNumber] = useState(false);

  //Variáveis do Bairro
  const [userDistrict, setUserDistrict] = useState("");
  const [insightDistrict, setInsightDistrict] = useState(false);
  const [errorDistrict, setErrorDistrict] = useState(false);
  const [disableInputDistrict, setDisableInputDistrict] = useState(false)

  //Variáveis do Complemento
  const [userComplementAddress, setUserComplementAddress] = useState("");
  const [insightComplementAddress, setInsightComplementAddress] = useState(false);
  const [errorComplementAddress, setErrorComplementAddress] = useState(false);
  const [disableInputComplementAddress, setDisableInputComplementAddress] = useState(false)

  //Variáveis do Cidade
  const [userCity, setUserCity] = useState("");
  const [insightCity, setInsightCity] = useState(false);
  const [errorCity, setErrorCity] = useState(false);
  const [disableInputCity, setDisableInputCity] = useState(false)
  const [ibge, setIbge] = useState("")

  //Variáveis do Estado
  const [userState, setUserState] = useState("");
  const [insightState, setInsightState] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [disableInputState, setDisableInputState] = useState(false)

  //Controla um marginBootom condicional para facilitar a navegação
  const [isFocused, setIsFocused] = useState(false);

  //Controla o mapeamento de "tab" / "next" / "próximo"
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);
  const fourthInputRef = useRef(null);
  const fifthInputRef = useRef(null);
  const sixthInputRef = useRef(null);
  const seventhInputRef = useRef(null);
  const eighthInputRef = useRef(null);
  const ninthInputRef = useRef(null);

  //Faz um scrol na tela para facilitar visualização
  const scrollRef = useRef(null);
  const scrollToTopBig = () => {
    scrollRef.current?.scrollTo({ y: vh(50), animated: true });
  };

  const scrollToTopSmall = () => {
    scrollRef.current?.scrollTo({ y: vh(15), animated: true });
  };

  //função para ter apenas numero
  const onlyNumber = (text) => {
    const result = text.replace(/\D/g, '');
    return result
  }

  // Função para aplicar a máscara manualmente no phone 
  const applyMaskPhone = (text) => {
    const textLocal = onlyNumber(text)
    let formatted = "";
    if (textLocal.length > 10) {
      formatted = `(${textLocal.substring(0, 2)}) ${textLocal.substring(2, 3)}.${textLocal.substring(3, 7)}-${textLocal.substring(7, 11)}`;
    } else if (textLocal.length > 6) {
      formatted = `(${textLocal.substring(0, 2)}) ${textLocal.substring(2, 6)}-${textLocal.substring(6, 10)}`;
    } else if (textLocal.length > 2) {
      formatted = `(${textLocal.substring(0, 2)}) ${textLocal.substring(2, 6)}`;
    } else if (textLocal.length > 0) {
      formatted = textLocal.substring(0, 2)
    } else {
      formatted = '';
    }
    setPhone(formatted);
  };

  //Função para aplicar a máscara manualmente no CEP 
  const applyMaskCEP = (text) => {
    const textLocal = onlyNumber(text)
    let formatted = "";
    if (textLocal.length > 5) {
      formatted = `${textLocal.substring(0, 5)}-${textLocal.substring(5, 8)}`;
    } else if (textLocal.length > 0) {
      formatted = textLocal.substring(0, 5)
    } else {
      formatted = '';
    }
    setUserCEP(formatted);
  };


  /**Função apiCEP
   * 
   * Função responsável por chamar API VIACEP, carregando dados: logradouro, 
   * bairro, cidade, estado e código ibge da cidade.
   * @description Seta os valores dos estados logradouro, bairro, cidade, estado e 
   * código ibge da cidade, depois seta os "setDisableInput***" como true, onde o 
   * componente inputComplex altera a exibição de um textInput para um text.
   * @param cep - Type Number - Recebe uma sequencia de 8 dígitos para consultar cep
   * @returns void 
   * */
  const apiCEP = (cep) => {
    const clearCEP = onlyNumber(cep)
    if (clearCEP.length === 8) {
      fetch(`https://viacep.com.br/ws/${onlyNumber(clearCEP)}/json/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            setIsValidateCEP(false)
            throw new Error(`Erro na requisição: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Sucesso conexão com Api VIACEP", data);
          if (data.erro) {
            setInsightCEP(true)
            setDisableInputStreet(false)
            setDisableInputDistrict(false)
            setDisableInputComplementAddress(false)
            setDisableInputCity(false)
            setDisableInputState(false)
            setUserStreet("")
            setUserDistrict("")
            setUserComplementAddress("")
            setUserCity("")
            setUserState("")
            setIsValidateCEP(false)
          } else {
            setInsightCEP(false)
            setIsValidateCEP(true)
            if (data.logradouro) {
              setInsightStreet(false)
              setDisableInputStreet(true)
              setUserStreet(data.logradouro)
            }
            if (data.bairro) {
              setInsightDistrict(false)
              setDisableInputDistrict(true)
              setUserDistrict(data.bairro)
            }
            if (data.complemento) {
              setInsightComplementAddress(false)
              setUserComplementAddress(data.complemento)
            }
            if (data.localidade) {
              setInsightCity(false)
              setDisableInputCity(true)
              setUserCity(data.localidade)
            }
            if (data.ibge) {
              setIbge(data.ibge)
            }
            if (data.uf) {
              setInsightState(false)
              setDisableInputState(true)
              setUserState(data.uf)
            }
            fourthInputRef.current.focus()
          }
        })
        .catch((error) => {
          console.error("Erro:", error);
          // Lide com erros de requisição
        })
        .finally(() => { });
    }
  }

  // -------------------/////  VALIDAÇÕES  \\\\\\-------------------------------

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
    apiCEP(number)
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

  // -------------------/////  CHECAGEM FINAL ANTES DE FAZER A REQUISIÇÃO  \\\\\\-------------------------------

  const checkToContinue = () => {
    let result = true
    let error = false
    let textError = "Favor conferir os seguintes dados na tela de registro: "
    if (!validateState(userState)) {
      result = false
      setInsightState(true)
      setErrorState(true)
      seventhInputRef.current.focus()
    }
    if (!validateCity(userCity)) {
      result = false
      setInsightCity(true)
      setErrorCity(true)
      seventhInputRef.current.focus()
    }
    if (!validateDistrict(userDistrict)) {
      result = false
      setInsightDistrict(true)
      setErrorDistrict(true)
      fifthInputRef.current.focus()
    }
    if (!validateNumber(userNumber)) {
      result = false
      setInsightNumber(true)
      setErrorNumber(true)
      fourthInputRef.current.focus()
    }
    if (!validateStreet(userStreet)) {
      result = false
      setInsightStreet(true)
      setErrorStreet(true)
      thirdInputRef.current.focus()
    }
    if (!isValidateCep) {
      result = false
      setInsightCEP(true)
      setErrorCEP(true)
      secondInputRef.current.focus()
    }
    if (!validatePhoneNumber(userPhone)) {
      result = false
      setInsightPhone(true)
      setErrorPhone(true)
      firstInputRef.current.focus()
    }
    if (!dataUser.name) {
      result = false
      error = true
      textError += 'nome, '
    }
    if (!dataUser.email) {
      result = false
      error = true
      textError += 'e-mail, '
    }
    if (!dataUser.password) {
      result = false
      error = true
      textError += 'senha, '
    }
    if (!dataUser.cpf) {
      result = false
      error = true
      textError += 'CPF, '
    }
    //Monta o texto com ponto final
    textError = `${textError.substring(0, (textError.length - 2))}.`

    //Após validar todos os dados preenchidos vai fazer requisição para back-end
    // para o backend da criação do usuário 
    if (result) {
      connectionFrontBack(
        dataUser.name,
        dataUser.cpf,
        userPhone,
        dataUser.email,
        dataUser.password,
        userStreet,
        userNumber,
        userComplementAddress,
        userDistrict,
        userCity,
        userState,
        ibge,
        userCEP
      )

    }
    //Caso tenha algum erro nos dados da tela anterior retorna um alerta 
    // indicando qual o campo com erro.
    else {
      if (error) {
        Alert.alert(textError)
      }
    }
  }

  // ---------------------  CONEXÃO BACKEND -------------------------------

  function connectionFrontBack(name, cpf, telephone, email, password, street, number, complementAddress, district, city, state, ibge, cep) {
    const userData = {
      userName: name,
      cpf: onlyNumber(cpf),
      addressStreet: street,
      addressNumber: number,
      addressDistrict: district,
      addressCity: city,
      addressState: state,
      addressCEP: cep,
      addressIbge: ibge,
      phone: onlyNumber(telephone),
      email: email,
      password: password
    };
    if (complementAddress) {
      userData.addressComp = complementAddress
    }
    const baseURL = `http://${ip}:3333`;

    fetch(`${baseURL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
        gravaLocal()
        // Depois exibe mensagem de sucesso e redirecionar o usuário para tela Home
        Alert.alert("Sucesso", "Usuário criado com sucesso.", [
          {
            text: "OK", onPress: () => {
              console.log("Logado com sucesso: OK")
              setIsSignedIn(true);
            }
          },
        ],
          { cancelable: false }
        )
      })
      .catch((error) => {
        console.error(Object.entries(error))
        console.error(`Erro: Request Status Error: ${error.status}, message: ${error.message}`);
        Alert.alert("Atenção", `${error.message}, volte para tela de login ou verifique os dados e tente novamente.`)

      })
  }
 
  function gravaLocal() {
    salveLocalName(dataUser.name);
    salveLocalCPF(onlyNumber(dataUser.cpf));
    salveLocalPhone(onlyNumber(userPhone));
    salveLocalEmailUser(dataUser.userEmail);
    salveLocalStreet(userStreet);
    salveLocalAddressNumber(userNumber);
    salveLocalComplementAddress(userComplementAddress);
    salveLocalDistrict(userDistrict);
    salveLocalCity(userCity);
    salveLocalState(userState);
    salveLocalCEP(userCEP);
    salveLocalIbge(ibge)
    salveLocalExpirationDate(new Date().toISOString())
  }


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
          disableInput={disableInputStreet}
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
          disableInput={disableInputDistrict}
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
          actionScroll={scrollToTopBig}
          disableInput={disableInputComplementAddress}
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
          actionScroll={scrollToTopBig}
          disableInput={disableInputCity}
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
          disableInput={disableInputState}
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