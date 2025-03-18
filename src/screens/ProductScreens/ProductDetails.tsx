import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import { RootState, useAppSelector } from "../../redux/store";

interface ProductDetailsProps {
  route: { params: { id: number } };
}

export default function ProductDetails({ route }: ProductDetailsProps) {
  const { id } = route.params;
  const { colors } = useTheme();

  const product = useAppSelector((state: RootState) =>
    state.product.products.find((p) => p.id === id)
  );

  if (!product) return <Text style={styles.errorText}>Product not found</Text>;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image
        source={{ uri: product.images[0] }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {product.title}
        </Text>
        <Text style={[styles.price, { color: colors.text }]}>
          ${product.price.toFixed(2)}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {product.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
