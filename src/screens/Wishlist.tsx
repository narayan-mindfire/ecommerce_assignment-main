import { View, Text, FlatList } from "react-native";
import { useGetProductsQuery } from "../redux/slices/apiSlice";

const ProductScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <Text>Loading screen</Text>;
  if (error) return <Text>Failed to load products</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>
            {item.title} - ${item.price}
          </Text>
        </View>
      )}
    />
  );
};

export default ProductScreen;
