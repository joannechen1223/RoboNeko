import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch } from "react-redux";

import { useWebSocket } from "@/features/WebSocket/WebSocketContext";
import { setIpAddress } from "@/features/WebSocket/webSocketSlice";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [catImage, setCatImage] = useState(
    require("../assets/images/personality-1.png"),
  );
  const { isConnected } = useWebSocket();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editIpAddress, setEditIpAddress] = useState("");

  const handleCatClick = () => {
    setCatImage(require("../assets/images/personality-2.png"));
    setTimeout(() => {
      router.push("/personality");
      setCatImage(require("../assets/images/personality-1.png"));
    }, 500);
  };

  const handleSaveSettings = () => {
    // Save IP address logic here
    dispatch(setIpAddress(editIpAddress));
    // setSettingsModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.personalityButton}
          onPress={handleCatClick}
        >
          <Image
            source={catImage}
            style={styles.personalityIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postcardsButton}
          onPress={() => router.push("/postcards")}
        >
          <Image
            source={require("../assets/images/postcards-icon.png")}
            style={styles.postcardsIcon}
            resizeMode="contain"
          />
          <Text style={styles.postcardsText}>Postcards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Image
            source={require("../assets/images/settings-button.png")}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Image
                  source={require("../assets/images/settings-icon.png")}
                  style={styles.modalTitleIcon}
                />
                <Text style={styles.modalTitle}>Settings</Text>
              </View>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#695d32" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>WebSocket IP:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editIpAddress}
                  onChangeText={setEditIpAddress}
                  placeholder="Enter WebSocket IP address"
                  placeholderTextColor="#999"
                />
                <View style={styles.connectionStatusContainer}>
                  <View
                    style={[
                      styles.connectionIndicator,
                      { backgroundColor: isConnected ? "#4CAF50" : "#F44336" },
                    ]}
                  />
                  <Text style={styles.connectionStatusText}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSettings}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  personalityButton: {
    position: "absolute",
    top: 60,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  personalityIcon: {
    width: 60,
    height: 60,
  },
  postcardsButton: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#E7CD91",
    borderColor: "#F6EBD9",
    borderWidth: 5,
    borderRadius: 30,
    height: 60,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postcardsIcon: {
    width: 30,
    height: 30,
  },
  postcardsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6B5F34",
    fontFamily: "CherryBombOne",
  },
  settingsButton: {
    position: "absolute",
    left: 90,
    top: 60,
  },
  settingsIcon: {
    width: 60,
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fefefe",
    borderRadius: 20,
    padding: 20,
    borderWidth: 10,
    borderColor: "#E7CD91",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitleIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "CherryBombOne",
    color: "#333",
  },
  modalBody: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: "CherryBombOne",
    color: "#695d32",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F6EBD9",
    borderWidth: 2,
    borderColor: "#E7CD91",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontFamily: "CherryBombOne",
    color: "#333",
  },
  modalFooter: {
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#695d32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "CherryBombOne",
    fontSize: 18,
  },
  connectionStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionStatusText: {
    fontFamily: "CherryBombOne",
    fontSize: 14,
    color: "#695d32",
  },
});

export default Home;
