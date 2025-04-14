import {
  useFonts,
  CherryBombOne_400Regular as CherryBombOne,
} from "@expo-google-fonts/cherry-bomb-one";
import { SourGummy_400Regular as SourGummy } from "@expo-google-fonts/sour-gummy";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";

import Postcard from "@/components/postcard";

import { RootState } from "./store";

const Postcards = () => {
  const router = useRouter();
  const postcards = useSelector(
    (state: RootState) => state.postcards.postcards,
  );
  // Load the Google fonts
  const [fontsLoaded] = useFonts({
    CherryBombOne: CherryBombOne,
    SourGummy: SourGummy,
  });

  // Animation setup
  const [isFlipped, setIsFlipped] = useState<boolean[]>(
    postcards.map(() => false),
  );

  // Show loading or the actual content
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/close-button.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.customTitle}>Postcards</Text>
          <Image
            source={require("../assets/images/postcards-icon.png")}
            style={styles.titleIcon}
          />
        </View>
      </View>
      <View style={styles.postcardContainer}>
        {postcards.map((postcard, index) => (
          <Postcard
            key={postcard.id}
            isFlipped={isFlipped[index]}
            setIsFlipped={(flipped) => {
              const newIsFlipped = [...isFlipped];
              newIsFlipped[index] = flipped;
              setIsFlipped(newIsFlipped);
            }}
            postcard={postcard}
          />
        ))}
      </View>
      <View style={styles.footerContainer}>
        <Image
          source={require("../assets/images/camera-cat.png")}
          style={styles.cameraCat}
        />
        <Text style={styles.footerText}>
          You've received{" "}
          <Text style={styles.footerTextHighlight}>{postcards.length}</Text>{" "}
          postcards!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9D9B6",
    flexDirection: "column",
    padding: 20,
    gap: 30,
    paddingTop: 60,
  },
  backButton: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customTitle: {
    fontSize: 30,
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
    fontFamily: "CherryBombOne", // Using Cherry Bomb One font
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleIcon: {
    height: 45,
    resizeMode: "contain",
    maxWidth: 60,
  },
  postcardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 20,
  },
  cardWrapper: {
    width: "100%",
    height: 250,
  },
  postcardFront: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  postcardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  postcardBack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  postcardText: {
    fontSize: 20,
    color: "#333",
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
  },
  cameraCat: {
    width: 90,
    height: 120,
    resizeMode: "contain",
  },
  footerText: {
    fontSize: 24,
    color: "#333",
    fontFamily: "CherryBombOne",
    width: "80%",
    textAlign: "center",
  },
  footerTextHighlight: {
    color: "#695d32",
    fontFamily: "CherryBombOne",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 30,
  },
});

export default Postcards;
