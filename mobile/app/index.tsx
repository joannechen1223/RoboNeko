import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [catImage, setCatImage] = useState(
    require("../assets/images/personality-1.png"),
  );

  const handleCatClick = () => {
    setCatImage(require("../assets/images/personality-2.png"));
    setTimeout(() => {
      router.push("/personality");
      setCatImage(require("../assets/images/personality-1.png"));
    }, 500);
  };

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleCatClick}
        >
          <Image
            source={catImage}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postcardsButton}
          onPress={() => router.push("/postcards")}
        >
          <Image
            source={require("../assets/images/postcards-button.png")}
            style={styles.postcardsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  settingsIcon: {
    width: 60,
    height: 60,
  },
  postcardsButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  postcardsIcon: {
    width: 200,
    height: 70,
  },
});

export default Home;
