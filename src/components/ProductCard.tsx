import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { addToWishlist, removeFromWishlist } from "../redux/slices/wishList";
import { useNavigation } from "@react-navigation/native";
interface ProductCardProps {
  id: number;
}
export default function ProductCard({ id }: ProductCardProps) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state: RootState) =>
    state.product.products.find((p) => p.id === id)
  );
  const navigation = useNavigation();
  const wishlistItems = useAppSelector(
    (state: RootState) => state.wishlist.entities
  );
  const isWishlisted = !!wishlistItems[id];
  const helpr = () => {
    navigation.navigate("ProductDetails", { id });
  };
  const handleWishlistToggle = () => {
    if (product) {
      if (isWishlisted) {
        dispatch(removeFromWishlist(id));
      } else {
        dispatch(
          addToWishlist({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.images[0],
          })
        );
      }
    }
  };

  if (!product) return null; // If product not found, return null

  return (
    <TouchableOpacity onPress={helpr}>
      <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.fav} onPress={handleWishlistToggle}>
          <Image
            tintColor={isWishlisted ? "red" : colors.text}
            source={require("../assets/icons/fav-icon.png")}
          />
        </TouchableOpacity>
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: product.images[0] }}
            resizeMode="contain"
            style={styles.imgStyle}
          />
          <View style={styles.details}>
            <Text
              numberOfLines={1}
              style={[styles.productName, { color: colors.text }]}
            >
              {product.title}
            </Text>
            <Text style={[styles.productPrice, { color: colors.text }]}>
              ${product.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 151,
    height: 231,
    position: "relative",
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
    height: 15,
  },
  productPrice: {
    fontSize: 14,
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
