import React, { useRef, useState } from "react";
import { View, Text, Animated, FlatList, StyleSheet } from "react-native";

export default function AnimatedFlatListExample() {
  const scrollY = useState(new Animated.Value(0))[0];

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const data = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

  return (
    <View style={styles.container}>
      {/* Animated Search Bar */}
      <Animated.View
        style={[
          styles.searchBar,
          { transform: [{ translateY: searchBarTranslateY }], opacity },
        ]}
      >
        <Text style={styles.searchText}>Search...</Text>
      </Animated.View>

      {/* Animated FlatList */}
      <Animated.FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 60 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }], // Track Y offset
          { useNativeDriver: true } // Improve performance
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -10,
  },
  searchText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 18,
  },
});
