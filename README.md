# APP-CBM-CAMPO-VERDE

Projeto de desenvolvimento de um aplicativo para emergências do corpo de bombeiros militar de Campo verde, onde será possível informar incidentes através do celular

## Linguagem de programação

`React.Native`

Criando arquitetura do projeto React.Native
`npx create-expo-app MUDEAQUINOME --template blank`

## Bibliotecas

#### Biblioteca de Navegação

https://reactnavigation.org/

`npm install @react-navigation/native`

`npx expo install react-native-screens react-native-safe-area-context`

#### Biblioteca para uso de SVG

https://docs.expo.dev/versions/latest/sdk/svg/

`npx expo install react-native-svg`

`yarn add --dev react-native-svg-transformer -D` 

#### Biblioteca para localização

`npm install @react-native-community/geolocation --save`

https://www.youtube.com/watch?v=7DY1tHHudtM


## Manual de orientações do Projeto

### Registro e identificação de operações

* Toda operação de **inclusão**  realizada dentro do sistema tem que ter registro da data e usuário que incluíu
* Toda operação de **alteração** deve registrar data e usuário que realizou a alteração.

#### Atenção!!!

Os campos de registro de inclusão `date`e `user` **não devem jamais ser alterados**.

Os dados de alteração serão registrados em campos diferentes
