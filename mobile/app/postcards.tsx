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

import Postcard from "@/components/Postcard";

import { RootState } from "./store";

const Postcards = () => {
  const router = useRouter();
  const postcards = useSelector(
    (state: RootState) => state.postcards.postcards,
  );

  // Animation setup
  const [isFlipped, setIsFlipped] = useState<boolean[]>(
    postcards.map(() => false),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleWrapper}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/images/postcards-icon.png")}
            style={styles.titleIcon}
          />
          <Text style={styles.customTitle}>Postcards</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/close-button.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
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
          <Text style={styles.footerTextHighlight}>
            {postcards.filter((postcard) => postcard.isShown).length}
          </Text>{" "}
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
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
