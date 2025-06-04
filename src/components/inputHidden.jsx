import { View, Text, TextInput,TouchableOpacity } from "react-native";
import { useState, useRef, useContext } from "react";
import { stylesRegistrarse } from "../pages/Registrarse";
import { stylesMain } from "../pages/Login";
import { NewRem, vh } from "./function";
import EyeOf from "../assets/eye-slash.svg";
import EyeOn from "../assets/eye.svg";
import { rem } from "./function";


export default function InputHidden({
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
  hiddenState,
  setHiddenState,
  functionValidate,
  setFocused,
  actionScroll
}) {
  return (
    <View style={{ width: '100%' }}>
      <View style={
        { 
          width: '100%', 
          backgroundColor: 'transparent', 
          transform: [{ translateY: vh(1) }], 
          marginLeft: 8, alignItems: 'flex-start', 
        }}>
        <Text style={[stylesMain.textTopInput, { backgroundColor: "#fff", zIndex: 999, }]}> {title}: </Text>
      </View>
      <View
        style={[
          stylesMain.input, insightState ? '' : stylesRegistrarse.marginBottom8,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding:0, 
            width:'99%'
          },
          { zIndex: -1, fontSize: 16 },
        ]}
      >
        <TextInput
          style={[
            {width:"90%", justifyContent:"center",},
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
            if (functionValidate) {
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
          secureTextEntry={hiddenState}
          keyboardType="default" 
        />
        <TouchableOpacity
          style={{marginRight:10}}
          onPress={() => {           
            setHiddenState(!hiddenState);
          }}
        >
          {hiddenState ? (
            <EyeOn name="onPassword" width={rem(1.5)} height={rem(1.5)} />
          ) : (
            <EyeOf name="onPassword" width={rem(1.5)} height={rem(1.5)} />
          )}
        </TouchableOpacity>
      </View>
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