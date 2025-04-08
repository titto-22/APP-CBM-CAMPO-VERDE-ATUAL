import { View, Text, TextInput } from "react-native";
export default function InputComplex({title, placeholder, value, insightText, firstRef, secondRef}) {
  return (
    <View>
      <View style={[stylesMain.containerTextTopInput,]}>
        <Text style={stylesMain.textTopInput}>{title}:</Text>
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
        ref={firstRef} //define a referencia
        onSubmitEditing={() => {
          secondRef.current.focus(); // Move o foco para o segundo input
        }}
        onChangeText={(text) => {
          applyMaskPhone(text);
        }}
        value={value}
        placeholder={placeholder}
        maxLength={16}
      />
      <Text //insight 
        style={[
          { display: insightPhone ? "flex" : "none" },
          { color: errorPhone ? "#ff0000" : "#64748b" },
        ]}
      >
        {insightText}
      </Text>
    </View>
  )
}