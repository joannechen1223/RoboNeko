import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const Postcards = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Postcards</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Postcards;
