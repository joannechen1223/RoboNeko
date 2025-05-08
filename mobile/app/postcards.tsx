import { Ionicons } from "@expo/vector-icons";
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

import Postcard from "@/components/PostcardComponent";

import { RootState } from "./store";

const Postcards = () => {
  const router = useRouter();
  const postcards = useSelector(
    (state: RootState) => state.postcards.postcards,
  );
  const isWSConnected = useSelector(
    (state: RootState) => state.webSocket.isConnected,
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

      {isWSConnected && (
        <View style={styles.topStatsContainer}>
          <Image
            source={require("../assets/images/camera-cat.png")}
            style={styles.cameraCat}
          />
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsText}>You've received</Text>
            <Text style={styles.statsTextHighlight}>
              {postcards.filter((postcard) => postcard.isShown).length} /{" "}
              {postcards.length}
            </Text>
            <Text style={styles.statsText}>postcards!</Text>
          </View>
        </View>
      )}

      {isWSConnected ? (
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
      ) : (
        <View style={styles.connectionMessageContainer}>
          <Text style={styles.connectionMessage}>
            Please connect to RoboNeko to see your postcards!
          </Text>
          <Ionicons
            name="wifi-outline"
            size={40}
            color="#695d32"
            style={styles.connectionIcon}
          />
        </View>
      )}
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
    paddingBottom: 80,
    minHeight: "100%",
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
  topStatsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
  },
  statsTextContainer: {
    flexDirection: "column",
    width: "75%",
    alignItems: "center",
  },
  additionalStatsText: {
    fontSize: 18,
    color: "#695d32",
    fontFamily: "CherryBombOne",
    textAlign: "center",
  },
  statsText: {
    fontSize: 24,
    color: "#333",
    fontFamily: "CherryBombOne",
    textAlign: "center",
  },
  statsTextHighlight: {
    color: "#695d32",
    fontFamily: "CherryBombOne",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 30,
    marginVertical: 5,
  },
  cameraCat: {
    width: 90,
    height: 120,
    resizeMode: "contain",
  },
  connectionMessageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#F6EBD9",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E7CD91",
    width: "100%",
  },
  connectionMessage: {
    fontSize: 22,
    fontFamily: "CherryBombOne",
    color: "#695d32",
    textAlign: "center",
    marginBottom: 10,
  },
  connectionIcon: {
    marginTop: 10,
  },
});

export default Postcards;
