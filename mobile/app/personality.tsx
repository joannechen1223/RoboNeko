import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const Personality = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Personality</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Personality;
