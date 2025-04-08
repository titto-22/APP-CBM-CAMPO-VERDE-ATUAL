import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
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
  //dados da página anterior
  const dataUser = route.params;

  //ip de conexão com o banco de dados
  const { ip } = useContext(AuthContext)

  //variáveis do Telefone
  const [userTelefon, setUserTelefon] = useState("");
  const [insightTelefon, setInsightTelefon] = useState(false);
  const [errorTelefon, setTelefon] = useState(false);
  
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

  //Variáveis do Cidade
  const [userCity, setUserCity] = useState("");
  const [insightCity, setInsightCity] = useState(false);
  const [errorCity, setErrorCity] = useState(false);



  const [isFocused, setIsFocused] = useState(false);

  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);
  const fourthInputRef = useRef(null);
  const fifthInputRef = useRef(null);
  const sixthInputRef = useRef(null);
  const seventhInputRef = useRef(null);

  //Variáveis do Telefone
  const [phone, setPhone] = useState(""); 
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

  

  //função para ter apenas numero
  const onlyNumber = (text) =>{
    let result= text.replace(/\D/g, '');
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
    //criar validação;
    return true;
  };

  const validateStreet =(text) =>{
    if(text.length<1){
      return false
    }
    return true
  }

  const validateNumber =(text) =>{
    if(text.length<1){
      return false
    }
    return true
  }

  const validateDistrict =(text) =>{
    if(text.length<1){
      return false
    }
    return true
  }

  const validateCity =(text) =>{
    if(text.length<1){
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
      >
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>Telefone:</Text>
        </View>
        <TextInput //Phone
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validatePhoneNumber(phone)) {
              setInsightPhone(true)
            } else {
              setInsightAddress(false)
              setErrorPhone(false)
            }

          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={firstInputRef} //define a referencia
          onSubmitEditing={() => {
            secondInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            applyMaskPhone(text);
          }}
          value={phone}
          placeholder="Insira seu Telefone"
          maxLength={16}
        />
        <Text //insight Phone
          style={[
            { display: insightPhone ? "flex" : "none" },
            { color: errorPhone ? "#ff0000" : "#64748b" },
          ]}
        >
          Insira o telefone com o formato do telefone correto, exemplo: (33)3333-3333 ou (99)99999-9999.
        </Text>
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>CEP:</Text>
        </View>
        <TextInput //CEP
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validateCEP(userCEP)) {
              setInsightCEP(true)
            } else {
              setInsightCEP(false)
              setErrorCEP(false)
            }
          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={secondInputRef} //define a referencia
          onSubmitEditing={() => {
            thirdInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            applyMaskCEP(text);
          }}
          value={userCEP}
          placeholder="Insira seu CEP"
          maxLength={11}
        />
        <Text //insight CEP
          style={[
            { display: insightCEP ? "flex" : "none" },
            { color: errorCEP ? "#ff0000" : "#64748b" },
          ]}
        >
          CEP inválido, favor fornecer um CEP válido.
        </Text>
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>Logradouro:</Text>
        </View>
        <TextInput //Street
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validateStreet(userStreet)) {
              setInsightStreet(true)
            } else {
              setInsightStreet(false)
              setErrorStreet(false)
            }

          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={thirdInputRef} //define a referencia
          onSubmitEditing={() => {
            fourthInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            setUserStreet(text);
          }}
          value={userStreet}
          placeholder="Insira o nome da rua ou avenida"
          maxLength={255}
        />
        <Text //insight Street
          style={[
            { display: insightStreet ? "flex" : "none" },
            { color: errorStreet ? "#ff0000" : "#64748b" },
          ]}
        >
          Insira o logradouro, nome da rua ou avenida.
        </Text>
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>Numero:</Text>
        </View>
        <TextInput //Number
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validateNumber(userNumber)) {
              setInsightNumber(true)
            } else {
              setInsightNumber(false)
              setErrorNumber(false)
            }

          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={fourthInputRef} //define a referencia
          onSubmitEditing={() => {
            fifthInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            setUserNumber(text);
          }}
          value={userNumber}
          placeholder="Insira o numero da casa."
        />
        <Text //insight Number
          style={[
            { display: insightNumber ? "flex" : "none" },
            { color: errorNumber ? "#ff0000" : "#64748b" },
          ]}
        >
          Insira o numero da casa.
        </Text>
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>Bairro:</Text>
        </View>
        <TextInput //District
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validateDistrict(userDistrict)) {
              setInsightDistrict(true)
            } else {
              setInsightDistrict(false)
              setErrorDistrict(false)
            }

          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={fifthInputRef} //define a referencia
          onSubmitEditing={() => {
            sixthInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            setUserDistrict(text);
          }}
          value={userDistrict}
          placeholder="Insira o nome do bairro."
        />
        <Text //insight District
          style={[
            { display: insightDistrict ? "flex" : "none" },
            { color: errorDistrict ? "#ff0000" : "#64748b" },
          ]}
        >
          Insira o nome do bairro.
        </Text>
        <View style={[stylesMain.containerTextTopInput,]}>
          <Text style={stylesMain.textTopInput}>Cidade:</Text>
        </View>
        <TextInput //City
          style={[stylesMain.input, { marginBottom: "8%" }, stylesMain.withFull]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!validateCity(userCity)) {
              setInsightCity(true)
            } else {
              setInsightCity(false)
              setErrorCity(false)
            }

          }}
          returnKeyType="next" //define botão no teclado de próximo
          ref={fifthInputRef} //define a referencia
          onSubmitEditing={() => {
            sixthInputRef.current.focus(); // Move o foco para o segundo input
          }}
          onChangeText={(text) => {
            setUserCity(text);
          }}
          value={userDistrict}
          placeholder="Insira o nome da cidade."
        />
        <Text //insight District
          style={[
            { display: insightDistrict ? "flex" : "none" },
            { color: errorDistrict ? "#ff0000" : "#64748b" },
          ]}
        >
          Insira o nome da cidade.
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
    </KeyboardAvoidingView>
  )
}