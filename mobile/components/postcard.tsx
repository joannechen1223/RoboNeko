import React, { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

import { getStamp } from "@/features/Postcards/Stamps";

import VerticalLine from "./VerticalLine";

const Postcard = ({
  isFlipped,
  setIsFlipped,
  postcard,
}: {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  postcard: {
    id: number;
    image: ImageSourcePropType;
    stampId: number;
    content: string;
    date: string;
    isShown: boolean;
  };
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const flipCard = () => {
    if (!postcard.isShown) return;

    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const Stamp = getStamp({ id: postcard.stampId });
  return (
    <TouchableOpacity onPress={flipCard} disabled={!postcard.isShown}>
      <View
        style={[styles.cardWrapper, !postcard.isShown && styles.disabledCard]}
      >
        <Animated.View
          style={[
            styles.postcardFront,
            frontAnimatedStyle,
            { backfaceVisibility: "hidden" },
          ]}
        >
          <Image source={postcard.image} style={styles.postcardImage} />

          {!postcard.isShown && (
            <>
              <BlurView intensity={25} style={styles.blurOverlay} tint="dark" />
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={50} color="white" />
              </View>
            </>
          )}
        </Animated.View>
        <Animated.View
          style={[
            styles.postcardBack,
            backAnimatedStyle,
            { backfaceVisibility: "hidden" },
          ]}
        >
          <View style={styles.postcardTextContainer}>
            <Text style={styles.postcardText}>Hi Hooman,</Text>
            <Text style={styles.postcardText}>{postcard.content}</Text>
            <Text style={styles.postcardText}>Meow,</Text>
            <Text style={styles.postcardText}>Your Traveling Neko 🐾</Text>
            <Text style={styles.postcardText}>{postcard.date}</Text>
          </View>
          <VerticalLine length={180} />
          <View style={styles.postcardStampAndAddressContainer}>
            <Stamp width={80} height={80} style={{ marginBottom: 30 }} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.postcardText}>Neko Rd. Apt. 34-8</Text>
            </View>
            <View style={styles.addressTextContainer}>
              <Text style={styles.postcardText}>New York, NY, USA</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    padding: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  postcardTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
    paddingRight: 15,
    width: "50%",
  },
  postcardText: {
    fontSize: 10,
    lineHeight: 16,
    color: "#333",
    fontFamily: "SourGummy",
  },
  postcardStampAndAddressContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    width: "50%",
    gap: 10,
  },
  addressTextContainer: {
    borderBottomWidth: 1,
    width: "80%",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  disabledCard: {
    opacity: 0.3,
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(60, 60, 60, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Postcard;
