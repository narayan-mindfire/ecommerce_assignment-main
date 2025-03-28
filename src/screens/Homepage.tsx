import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Easing,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProducts } from "../redux/slices/ProductSlice";
import ProductCard from "../components/ProductCard";
import { useTheme } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import { InteractionManager } from "react-native";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.product
  );
  const { colors, dark } = useTheme();
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchProducts());
    });
  }, []);

  const lastScroll = useRef(0);
  const sbPos = useRef(new Animated.Value(0)).current;
  const scrollVal = useRef(new Animated.Value(0)).current;
  const opacity = scrollVal.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const animateSearchBar = (value: number, duration = 300) => {
    Animated.timing(sbPos, {
      toValue: value,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
    }).start();
  };

  // this is going to run whenever a scroll is detected
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScroll = event.nativeEvent.contentOffset.y;
    if (!currentScroll) {
      // currently on top
      animateSearchBar(0);
    } else if (currentScroll > lastScroll.current) {
      // moving down hide the search bar!
      animateSearchBar(-60);
    } else if (currentScroll < lastScroll.current) {
      // moving up show it now
      animateSearchBar(0);
    }
    lastScroll.current = currentScroll; //updating last scroll to current scroll
  };

  return loading ? (
    <SafeAreaView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>loading page</Text>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, zIndex: -10 }}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            transform: [{ translateY: sbPos }],
            backgroundColor: colors.background.replace(/[\d\.]+\)$/g, "0.8)"),
          },
        ]}
      >
        <SearchBar height={40} width={342} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollVal } } }],
          { useNativeDriver: true, listener: handleScroll }
        )}
        // scrollEventThrottle={16}
      >
        <View style={styles.container}>
          <Animated.View style={[styles.catBox, { opacity }]}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.heading, { color: colors.text }]}>
                Categories
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 16, paddingRight: 3, color: colors.text }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categories}>
              <View style={styles.category}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/hoodie.png")}
                />
                <Text style={[styles.cattxt, { color: colors.text }]}>
                  Hoodies
                </Text>
              </View>
              <View style={styles.category}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/Shorts.png")}
                />
                <Text style={[styles.cattxt, { color: colors.text }]}>
                  Shorts
                </Text>
              </View>
              <View style={styles.category}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/Shoes.png")}
                />
                <Text style={[styles.cattxt, { color: colors.text }]}>
                  Shoes
                </Text>
              </View>
              <View style={styles.category}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/Bags.png")}
                />
                <Text style={[styles.cattxt, { color: colors.text }]}>Bag</Text>
              </View>
              <View style={styles.category}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/Accessories.png")}
                />
                <Text style={[styles.cattxt, { color: colors.text }]}>
                  Accessories
                </Text>
              </View>
            </View>
          </Animated.View>
          <View style={styles.topList}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <Text style={[styles.heading, { color: colors.text }]}>
                Top Selling
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 16, paddingRight: 3, color: colors.text }}
                >
                  See New
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={products.slice(0, 10)}
              horizontal={true}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard id={item.id} />}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: "100%",
                      width: 10,
                    }}
                  />
                );
              }}
            />
          </View>
          <View style={[styles.newList, { marginBottom: 15 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <Text style={[styles.heading, { color: colors.primary }]}>
                New In
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 16, paddingRight: 3, color: colors.text }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              nestedScrollEnabled={true}
              data={products.slice(14, 28)}
              horizontal={true}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard id={item.id} />}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: "100%",
                      width: 10,
                    }}
                  />
                );
              }}
            />
          </View>
          <View style={[styles.newList, { marginBottom: 15 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <Text style={[styles.heading, { color: colors.primary }]}>
                New In
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 16, paddingRight: 3, color: colors.text }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              nestedScrollEnabled={true}
              data={products.slice(20, 30)}
              horizontal={true}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard id={item.id} />}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: "100%",
                      width: 10,
                    }}
                  />
                );
              }}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 13,
    justifyContent: "center",
    marginBottom: 35,
    zIndex: -30,
  },
  catBox: {
    paddingTop: 36,
    paddingHorizontal: 24,
    marginVertical: 24,
    height: 116,
    width: "100%",
  },
  heading: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  categories: {
    top: 13,
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    width: 56,
    height: 80,
    flexDirection: "column",
    alignItems: "center",
  },
  cattxt: {
    fontSize: 12,
    lineHeight: 19.2,
    fontWeight: "300",
  },
  topList: {
    height: 282,
    width: "100%",
    paddingHorizontal: 24,
    // borderColor : 'black',
    // borderWidth : 3,
  },
  newList: {
    paddingHorizontal: 24,
    width: "100%",
    height: 300,
  },
  searchBarContainer: {
    position: "absolute",

    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
