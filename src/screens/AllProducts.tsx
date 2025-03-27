import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProducts } from "../redux/slices/ProductSlice";
import ProductCard from "../components/ProductCard";
import dark from "../Themes/dark";
import { useTheme } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";

export default function AllProducts(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.product
  );
  const { colors } = useTheme();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const lastScrollY = useRef(0);
  const direction = useRef<"up" | "down">("down");

  const sbPos = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY === 0) {
      direction.current = "down";
      Animated.timing(sbPos, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (
      currentScrollY > lastScrollY.current &&
      direction.current !== "up"
    ) {
      direction.current = "up";
      Animated.timing(sbPos, {
        toValue: -60,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (
      currentScrollY < lastScrollY.current &&
      direction.current !== "down"
    ) {
      direction.current = "down";
      Animated.timing(sbPos, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  return loading ? (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={{ color: "#fff" }}>Loading...</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, zIndex: -10 }}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={dark ? "light-content" : "dark-content"}
      />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.searchBarContainer,
            { transform: [{ translateY: sbPos }] },
          ]}
        >
          <SearchBar height={40} width={342} />
        </Animated.View>
        <Animated.FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductCard id={item.id} />
            </View>
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={[styles.listContainer, { paddingTop: 60 }]}
          onScroll={handleScroll}
          // scrollEventThrottle={16}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productWrapper: {
    flex: 1,
    marginBottom: 15,
    alignItems: "center",
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    zIndex: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
