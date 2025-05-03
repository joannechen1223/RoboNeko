import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  setName,
  setActionPreferences,
  setIsPreferencesSecret,
} from "@/features/Personality/personalitySlice";

import { RootState } from "./store";

const Personality = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.personality.name);
  const actionPreferences = useSelector(
    (state: RootState) => state.personality.actionPreferences,
  );
  const isPreferencesSecret = useSelector(
    (state: RootState) => state.personality.isPreferencesSecret,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedActionPreferences, setEditedActionPreferences] =
    useState(actionPreferences);
  const [editedIsPreferencesSecret, setEditedIsPreferencesSecret] =
    useState(isPreferencesSecret);

  const handleSave = () => {
    // Dispatch action to update name in Redux store
    let randomActionPreferences = {};
    dispatch(setName(editedName));
    if (editedIsPreferencesSecret) {
      randomActionPreferences = generateRandomActionPreferences();
      setEditedActionPreferences(randomActionPreferences);
      dispatch(setActionPreferences(randomActionPreferences));
    } else {
      dispatch(setActionPreferences(editedActionPreferences));
    }
    dispatch(setIsPreferencesSecret(editedIsPreferencesSecret));
    setModalVisible(false);
  };

  const handlePreferenceUpdate = (bodyPart: string, newScore: number) => {
    setEditedActionPreferences((prevPreferences) => ({
      ...prevPreferences,
      [bodyPart]:
        editedActionPreferences[bodyPart] === 1 && newScore === 1
          ? 0
          : newScore,
    }));
  };

  const handleToggleIsPreferencesSecret = () => {
    if (editedIsPreferencesSecret) {
      // reset all values to 1
      setEditedActionPreferences(
        Object.fromEntries(
          Object.keys(actionPreferences).map((key) => [key, 1]),
        ),
      );
    }
    setEditedIsPreferencesSecret(!editedIsPreferencesSecret);
  };

  const generateRandomActionPreferences = () => {
    const bodyParts = Object.keys(actionPreferences);
    const randomActionPreferences: Record<string, number> = {};

    // Create an array with values 0, 1, 2, 3
    const values = [0, 1, 2, 3];

    // Shuffle the values array
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]]; // Swap elements
    }

    // Assign each shuffled value to a body part
    bodyParts.forEach((bodyPart, index) => {
      randomActionPreferences[bodyPart] = values[index];
    });
    console.log(randomActionPreferences);

    return randomActionPreferences;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/close-button.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.customTitle}>Catsonality</Text>
          <Image
            source={require("../assets/images/casonality-icon.png")}
            style={styles.titleIcon}
          />
        </View>
      </View>
      <View style={styles.personalityContainer}>
        <Image
          source={require("../assets/images/catsonality-cat.png")}
          style={styles.personalityCatAvatar}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.text}>My name is</Text>
          <Text style={styles.textHighlight}>{" " + name}</Text>
        </View>
        <View style={styles.personalityTextContainer}>
          <Text style={styles.text}>I'd love be petted on...</Text>
          <View style={styles.actionsPreferenceContainer}>
            {Object.entries(actionPreferences).map(([bodyPart, data]) => (
              <View key={bodyPart} style={styles.preferenceItem}>
                <Text style={styles.bodyPartText}>{bodyPart}</Text>
                <View style={styles.heartsContainer}>
                  {[...Array(3)].map((_, i) => {
                    if (isPreferencesSecret) {
                      return (
                        <Image
                          key={i}
                          source={require("../assets/images/question-mark-icon.png")}
                          style={styles.questionMarkIcon}
                        />
                      );
                    }
                    return (
                      <Ionicons
                        key={i}
                        name={i < data ? "heart" : "heart-outline"}
                        size={35}
                        color={i < data ? "#D76B33" : "#7E7E7E"}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require("../assets/images/pencil-icon.png")}
              style={styles.editIcon}
            />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Image
                  source={require("../assets/images/pencil-icon.png")}
                  style={styles.modalTitleIcon}
                />
                <Text style={styles.modalTitle}>Edit Catsonality</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#695d32" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name:</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter cat's name"
                  placeholderTextColor="#999"
                  maxLength={20}
                />
              </View>

              <View style={styles.preferencesContainer}>
                <View style={styles.preferencesHeader}>
                  <Text style={styles.preferencesTitle}>
                    Petting Preferences:
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.randomButton,
                      {
                        backgroundColor: editedIsPreferencesSecret
                          ? "#9d9d9d"
                          : "#F4C732",
                      },
                    ]}
                    onPress={handleToggleIsPreferencesSecret}
                  >
                    <Text style={styles.randomButtonText}>
                      {editedIsPreferencesSecret ? "Cancel" : "Secret"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {Object.keys(editedActionPreferences).map((bodyPart) => (
                  <View key={bodyPart} style={styles.preferenceEditItem}>
                    <Text style={styles.preferenceLabel}>{bodyPart}</Text>
                    <View style={styles.heartsEditContainer}>
                      {[1, 2, 3].map((score) => {
                        if (editedIsPreferencesSecret) {
                          return (
                            <Image
                              key={score}
                              source={require("../assets/images/question-mark-icon.png")}
                              style={styles.questionMarkIcon}
                            />
                          );
                        }
                        return (
                          <TouchableOpacity
                            key={score}
                            onPress={() =>
                              handlePreferenceUpdate(bodyPart, score)
                            }
                          >
                            <Ionicons
                              name={
                                score <= editedActionPreferences[bodyPart]
                                  ? "heart"
                                  : "heart-outline"
                              }
                              size={30}
                              color={
                                score <= editedActionPreferences[bodyPart]
                                  ? "#D76B33"
                                  : "#7E7E7E"
                              }
                              style={styles.heartIcon}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9D9B6",
    flexDirection: "column",
    padding: 20,
    gap: 30,
    paddingTop: 60,
    height: "100%",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    gap: 5,
    justifyContent: "flex-end",
  },
  backButton: {
    width: 60,
    height: 60,
  },
  titleIcon: {
    height: 60,
    resizeMode: "contain",
    maxWidth: 60,
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
  personalityContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  personalityCatAvatar: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    color: "#333",
    fontFamily: "CherryBombOne",
    textAlign: "center",
  },
  textHighlight: {
    color: "#695d32",
    fontFamily: "CherryBombOne",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 30,
  },
  personalityTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingLeft: 20,
    width: "100%",
    paddingTop: 20,
  },
  actionsPreferenceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 15,
    paddingLeft: 10,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  bodyPartText: {
    fontSize: 24,
    fontFamily: "CherryBombOne",
    color: "#695d32",
    marginBottom: 5,
    marginRight: 10,
    width: 100,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  button: {
    backgroundColor: "#F6EBD9",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: "#E7CD91",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    color: "#695E34",
    fontFamily: "CherryBombOne",
    fontSize: 25,
  },
  editIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },

  // Modal styles
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

  // Preference edit styles
  preferencesContainer: {
    marginTop: 20,
    width: "100%",
  },
  preferencesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  preferencesTitle: {
    fontSize: 20,
    fontFamily: "CherryBombOne",
    color: "#695d32",
  },
  randomButton: {
    backgroundColor: "#F4C732",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    gap: 5,
  },
  randomButtonText: {
    color: "#fff",
    fontFamily: "CherryBombOne",
    fontSize: 14,
  },
  preferenceEditItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E7CD91",
  },
  preferenceLabel: {
    fontSize: 20,
    fontFamily: "CherryBombOne",
    color: "#333",
    width: 80,
    paddingLeft: 10,
  },
  heartsEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    marginHorizontal: 5,
  },
  questionMarkIcon: {
    marginHorizontal: 5,
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default Personality;
