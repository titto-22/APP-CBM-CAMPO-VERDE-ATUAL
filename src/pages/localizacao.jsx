import React, { useState, useEffect, useRef } from "react";
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

	//função para solicitar permissão de acesso a localizaçao do usuário
	async function requestLocationPermissions() {
		try {
			const { granted } = await requestForegroundPermissionsAsync();
			if (granted) {
				const currentPosition = await getCurrentPositionAsync();
				setLocation(currentPosition);
				initialRegionRef.current = {
					latitude: currentPosition.coords.latitude,
					longitude: currentPosition.coords.longitude,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005,
				};
			} else {
				Alert.alert(
					"Permissão Negada",
					"O aplicativo precisa da sua localização.",
				);
			}
		} catch (error) {
			console.error("Erro ao obter permissão de localização:", error);
			Alert.alert("Erro", "Não foi possível obter a localização.");
		} finally {
			setLoading(false);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		requestLocationPermissions();
	}, []);

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
					address: formattedAddress,
				});
			} catch (error) {
				console.error("Erro ao obter o endereço:", error);
				Alert.alert("Erro", "Não foi possível obter o endereço.");
				navigation.navigate("Dados da Emergência", {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					tipoEmergencia: tipoEmergencia.tipoEmergencia,
					address: "",
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
						onPress={() => {
							navigation.navigate("Dados da Emergência", {
								latitude: false,
								longitude: false,
								tipoEmergencia: tipoEmergencia.tipoEmergencia,
								address: "",
							});
						}}
					>
						<Text style={styleLocation.textButton}>Não</Text>
					</TouchableOpacity>
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

										if (address.street) {
											formattedAddress += address.street;
											if (address.name && address.name !== address.street) {
												formattedAddress += `, ${address.name}`;
											}
										} else if (address.name) {
											formattedAddress += address.name;
										}

										formattedAddress += `${address.city ? `, ${address.city}` : ""}${address.region ? `, ${address.region}` : ""}${address.country ? `, ${address.country}` : ""}`;

										navigation.navigate("Dados da Emergência", {
											latitude: location.coords.latitude,
											longitude: location.coords.longitude,
											tipoEmergencia: tipoEmergencia.tipoEmergencia,
											address: formattedAddress,
										});
									} else {
										navigation.navigate("Dados da Emergência", {
											latitude: location.coords.latitude,
											longitude: location.coords.longitude,
											tipoEmergencia: tipoEmergencia.tipoEmergencia,
											address: "",
										});
									}
								} catch (error) {
									console.error("Erro ao obter o endereço:", error);
									navigation.navigate("Dados da Emergência", {
										latitude: location.coords.latitude,
										longitude: location.coords.longitude,
										tipoEmergencia: tipoEmergencia.tipoEmergencia,
										address: "",
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
