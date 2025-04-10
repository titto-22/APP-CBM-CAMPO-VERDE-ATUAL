import { View, Text, TextInput } from "react-native";
import { useState, useRef, useContext } from "react";
import { stylesRegistrarse } from "../pages/Registrarse";
import { stylesMain } from "../pages/Login";
import { vh } from "./function";


export default function InputComplex({
    title, 
    placeholder, 
    insightText, 
    firstRef, 
    secondRef, 
    maxLengthInput, 
    valueState, 
    setValueStateOrFunctionMask, 
    insightState, 
    setInsightState, 
    errorState, 
    setErrorState,
    functionValidate, 
    setFocused,
    actionScroll, 
    keyboard, 
    disableInput 
  }) {
  return (
    <View style={{ width: '100%' }}>
      <View style={[{width:'100%', backgroundColor:'transparent', transform:[{translateY:vh(1)}], marginLeft:8, alignItems:'flex-start', },]}>
        <Text style={[stylesMain.textTopInput, {backgroundColor:"#fff", zIndex: 999,}]}> {title}: </Text>
      </View>
      {disableInput ? (
        <Text 
        ref={firstRef}>
          teste
        </Text>
      ):(
        <TextInput 
        style={[
          stylesMain.input, 
          stylesMain.withFull, 
          insightState ? '' : stylesRegistrarse.marginBottom8,
          {zIndex: -1, fontSize:16},
        ]}
        onFocus={() => {
          setFocused(true)
          if (actionScroll) {
            actionScroll(); // Chama a função actionScroll se ela existir
          }
        }}
        onBlur={() => {
          setFocused(false);
          //Valida se foi passado uma função de validação
          //Caso sim executa
          if(functionValidate){
            if (!functionValidate(valueState)) {
              setInsightState(true)
            } else {
              setInsightState(false)
              setErrorState(false)
            }
          }

        }}
        returnKeyType="next" //define botão no teclado de próximo
        ref={firstRef} //define a referencia
        onSubmitEditing={() => {
          secondRef.current.focus(); // Move o foco para o segundo input
        }}
        onChangeText={(text) => {
          setValueStateOrFunctionMask(text);
        }}
        value={valueState}
        placeholder={placeholder}
        {...(maxLengthInput ? { maxLength: maxLengthInput } : {})}
        {...(keyboard ? { keyboardType: keyboard } : {})}
      />
      )}
      <Text //insight 
        style={[
          { display: insightState ? "flex" : "none" },
          { color: errorState ? "#ff0000" : "#64748b" },
          insightState ? stylesRegistrarse.marginBottom8 : ''
        ]}
      >
        {insightText}
      </Text>
      
    </View>
  )
}