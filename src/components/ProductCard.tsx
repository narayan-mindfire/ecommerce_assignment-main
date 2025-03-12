import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishList";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  id: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  const { colors } = useTheme();

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(
    (state: RootState) => state.wishlist.entities
  );

  const isWishlisted = !!wishlistItems[id];

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist({ id, name, price, image }));
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
      <TouchableOpacity style={styles.fav} onPress={handleWishlistToggle}>
        <Image
          tintColor={isWishlisted ? "red" : colors.text}
          source={require("../assets/icons/fav-icon.png")}
        />
      </TouchableOpacity>
      <View style={[styles.cardContainer]}>
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          style={styles.imgStyle}
        />
        <View style={styles.details}>
          <Text
            numberOfLines={1}
            style={[styles.productName, { color: colors.text }]}
          >
            {name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.text }]}>
            ${price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 151,
    height: 231,
    position: "relative",
    // padding: 5,
    borderRadius: 10,
  },
  cardContainer: {
    width: "100%",
    height: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imgStyle: {
    width: "100%",
    height: 190,
  },
  productName: {
    // color: "#272727",
    height: 15,
  },
  productPrice: {
    fontSize: 14,
    // color: "#272727",
    fontWeight: "700",
    height: 14,
  },
  fav: {
    position: "absolute",
    top: 5,
    right: 10,
    height: 24,
    width: 24,
    zIndex: 10,
  },
  details: {
    paddingHorizontal: 10,
  },
});
