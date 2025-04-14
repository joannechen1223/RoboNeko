import { View, StyleSheet } from "react-native";

const VerticalLine = ({
  length,
  color = "#000",
}: {
  length: number;
  color?: string;
}) => {
  return (
    <View
      style={[styles.verticalLine, { height: length, backgroundColor: color }]}
    />
  );
};

const styles = StyleSheet.create({
  verticalLine: {
    width: 1,
    height: "100%",
    backgroundColor: "black",
  },
});

export default VerticalLine;
