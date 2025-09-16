
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Platform, Linking } from "react-native";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
	requestForegroundPermissionsAsync,
	getForegroundPermissionsAsync,
	getCurrentPositionAsync,
	watchPositionAsync,
	LocationAccuracy,
	reverseGeocodeAsync,
} from "expo-location";
import { rem } from "../components/function";
import IconMap from "../assets/map-pin-line-bold.svg";

export default function Localizacao({ route, navigation }) {
	//Tipo de emergência
	const tipoEmergencia = route.params;
	//variável onde será armazenado a localização
	const [location, setLocation] = useState(null);
	//Controla informação de carregamento da localização
	const [loading, setLoading] = useState(true);
	//
	const mapRef = useRef(null);
	const watchIdRef = useRef(null);
	const initialRegionRef = useRef(null); // Referência para a região inicial


	// Novo fluxo de permissão: tenta 2 vezes, se negar, volta para Home


	const requestLocationWithFlow = useCallback(async () => {
		setLoading(true);
		// Primeiro, verifica se já tem permissão
		try {
			const perm = await getForegroundPermissionsAsync();
			if (perm.status === "granted") {
				try {
					const currentPosition = await getCurrentPositionAsync();
					setLocation(currentPosition);
					initialRegionRef.current = {
						latitude: currentPosition.coords.latitude,
						longitude: currentPosition.coords.longitude,
						latitudeDelta: 0.005,
						longitudeDelta: 0.005,
					};
				} catch (locError) {
					console.error("Erro ao obter localização atual:", locError);
					Alert.alert(
						"Localização desativada",
						"Não foi possível obter a localização atual. Verifique se o GPS/serviço de localização está ativado.",
						[
							{
								text: "Abrir configurações",
								onPress: () => {
									if (Platform.OS === "android") {
										Linking.openSettings();
									}
								}
							},
							{ text: "OK" }
						]
					);
				}
				setLoading(false);
				return;
			}
		} catch (error) {
			// Se falhar ao checar permissão, tenta fluxo normal
		}

		// Se não tem permissão, segue fluxo de solicitação
		let attempts = 0;
		let granted = false;
		let blocked = false;
		while (attempts < 2 && !granted && !blocked) {
			if (attempts > 0) {
				await new Promise(resolve => {
					Alert.alert(
						"Permissão necessária",
						"O aplicativo precisa da sua localização para funcionar corretamente. Por favor, permita o acesso.",
						[
							{ text: "OK", onPress: resolve }
						]
					);
				});
			} else {
				await new Promise(resolve => {
					Alert.alert(
						"Permissão necessária",
						"Para continuar, permita que o aplicativo acesse sua localização.",
						[
							{ text: "OK", onPress: resolve }
						]
					);
				});
			}
			try {
				const { status, canAskAgain } = await requestForegroundPermissionsAsync();
				if (status === "granted") {
					try {
						const currentPosition = await getCurrentPositionAsync();
						setLocation(currentPosition);
						initialRegionRef.current = {
							latitude: currentPosition.coords.latitude,
							longitude: currentPosition.coords.longitude,
							latitudeDelta: 0.005,
							longitudeDelta: 0.005,
						};
						granted = true;
					} catch (locError) {
						console.error("Erro ao obter localização atual:", locError);
						Alert.alert(
							"Localização desativada",
							"Não foi possível obter a localização atual. Verifique se o GPS/serviço de localização está ativado.",
							[
								{
									text: "Abrir configurações",
									onPress: () => {
										if (Platform.OS === "android") {
											Linking.openSettings();
										}
									}
								},
								{ text: "OK" }
							]
						);
						break;
					}
				} else if (!canAskAgain && Platform.OS === "android") {
					blocked = true;
				}
			} catch (error) {
				console.error("Erro ao obter permissão de localização:", error);
				Alert.alert("Erro", "Não foi possível obter a permissão de localização.");
			}
			attempts++;
		}
		setLoading(false);
		if (blocked) {
			Alert.alert(
				"Permissão bloqueada",
				"A permissão de localização foi negada permanentemente. Para continuar, abra as configurações do aplicativo e permita o acesso à localização.",
				[
					{
						text: "Abrir configurações",
						onPress: () => Linking.openSettings()
					},
					{
						text: "Voltar para Home",
						style: "cancel",
						onPress: () => navigation.navigate("Emergências")
					}
				]
			);
		} else if (!granted) {
			Alert.alert(
				"Permissão negada",
				"Não foi possível obter a permissão de localização. Você será redirecionado para a tela inicial.",
				[
					{
						text: "OK",
						onPress: () => navigation.navigate("Emergências")
					}
				]
			);
		}
	}, [navigation]);



	// Solicita permissão ao montar a tela
	useEffect(() => {
		requestLocationWithFlow();
	}, [requestLocationWithFlow]);

	// Revalida permissão ao voltar para a tela e limpa location ao perder o foco
	useEffect(() => {
		const onFocus = () => {
			setLocation(null); // Limpa localização para forçar nova verificação
			setLoading(true);
			requestLocationWithFlow();
		};
		const onBlur = () => {
			setLocation(null);
		};
		const unsubscribeFocus = navigation.addListener("focus", onFocus);
		const unsubscribeBlur = navigation.addListener("blur", onBlur);
		return () => {
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, [navigation, requestLocationWithFlow]);

	useEffect(() => {
		if (location && initialRegionRef.current) {
			const startWatching = async () => {
				const watchId = await watchPositionAsync(
					{
						accuracy: LocationAccuracy.Highest,
						timeInterval: 1000,
						distanceInterval: 1,
					},
					(response) => {
						setLocation(response);
						mapRef.current?.animateCamera({
							center: response.coords,
						});
					},
				);
				watchIdRef.current = watchId;
			};
			startWatching();
			return () => {
				if (watchIdRef.current) {
					watchIdRef.current.remove();
					watchIdRef.current = null;
				}
			};
		}
	}, [location]);

	async function handleSim() {
		if (location?.coords) {
			try {
				const [address] = await reverseGeocodeAsync({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});
				const formattedAddress = address
					? `${address.street || address.name || ""}${address.city ? `, ${address.city}` : ""}${address.region ? `, ${address.region}` : ""}${address.country ? `, ${address.country}` : ""}`
					: "";
				navigation.navigate("Dados da Emergência", {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					tipoEmergencia: tipoEmergencia.tipoEmergencia,
					addressFull: formattedAddress,
				});
			} catch (error) {
				console.error("Erro ao obter o endereço:", error);
				Alert.alert("Erro", "Não foi possível obter o endereço.");
				navigation.navigate("Dados da Emergência", {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					tipoEmergencia: tipoEmergencia.tipoEmergencia,
					addressFull: "",
				});
			}
		}
	}

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styleLocation.containerMain}>
			{location &&
				initialRegionRef.current && ( // Renderiza apenas quando ambos existem
					<MapView
						ref={mapRef}
						style={styleLocation.maps}
						initialRegion={initialRegionRef.current} // Usa initialRegionRef aqui
					>
						<Marker coordinate={location.coords} />
					</MapView>
				)}

			<View style={styleLocation.flexAround}>
				<View style={styleLocation.flexRow}>
					<Text style={styleLocation.textBase}>
						Usar a sua localização atual?
					</Text>
					<IconMap height={rem(1)} width={rem(1)} />
				</View>
				<View style={styleLocation.flexRow}>
					<TouchableOpacity
						style={styleLocation.Button}
						onPress={async () => {
							if (location?.coords) {
								// Verifica se location e location.coords existem
								try {
									const addressArray = await reverseGeocodeAsync({
										latitude: location.coords.latitude,
										longitude: location.coords.longitude,
									});

									if (addressArray && addressArray.length > 0) {
										const address = addressArray[0];
										let formattedAddress = "";

										formattedAddress += `${address.street ? `${address.street}` : ""}${address.streetNumber ? `, Numero ${address.streetNumber}` : ""}${address.district ? `, ${address.district}` : ""}${address.city ? `, ${address.city}` : ""}${address.region ? `, ${address.region}` : ""}${address.postalCode ? `, CEP ${address.postalCode}` : ""}${address.country ? `, ${address.country}` : ""}`;

										const dataLocation={
											latitude: location.coords.latitude,
											longitude: location.coords.longitude,
											tipoEmergencia: tipoEmergencia.tipoEmergencia,
											addressFull: formattedAddress,
										}
										
										if(address.street) {
											dataLocation.addressStreet= address.street
										}
										if(address.streetNumber) {
											dataLocation.addressNumber= address.streetNumber
										}
										if(address.district) {
											dataLocation.addressDistrict= address.district
										}
										if(address.city) {
											dataLocation.addressCity= address.city
										}
										if(address.region) {
											dataLocation.addressRegion= address.region
										}
										if(address.postalCode) {
											dataLocation.addressPostalCode= address.postalCode
										}
										navigation.navigate("Dados da Emergência", dataLocation)
									} else {
										navigation.navigate("Dados da Emergência", {
											latitude: location.coords.latitude,
											longitude: location.coords.longitude,
											tipoEmergencia: tipoEmergencia.tipoEmergencia,
											addressFull: "",
										});
									}
								} catch (error) {
									console.error("Erro ao obter o endereço:", error);
									navigation.navigate("Dados da Emergência", {
										latitude: location.coords.latitude,
										longitude: location.coords.longitude,
										tipoEmergencia: tipoEmergencia.tipoEmergencia,
										addressFull: "",
									});
								}
							}
						}}
					>
						<Text style={styleLocation.textButton}>Sim</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export const styleLocation = StyleSheet.create({
	containerMain: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#fff",
		paddingBottom:24
	},
	maps: {
		height: "85%",
		width: "100%",
	},
	Button: {
		width: "35%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#5fa4f8",
		padding: rem(0.5),
		borderRadius: 12,
		marginHorizontal: rem(1),
	},
	flexAround: {
		alignItems: "center",
		justifyContent: "space-around",
		height: "15%",
		width: "100%",
	},
	textButton: {
		color: "#fff",
		fontSize: rem(1.25),
		fontWeight: "bold",
	},
	flexRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	textBase: {
		fontSize: rem(1.25),
		marginRight: rem(0.5),
	},
});
