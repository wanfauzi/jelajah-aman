import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DetailKota() {
    const { kota } = useLocalSearchParams<{ kota: string }>();
    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Detail: {kota}</Text>
        </View>
    );
}
