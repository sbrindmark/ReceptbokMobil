import { getRecipes } from '../lib/api';
import { Link, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function RecipeListScreen() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadRecipes() {
    try {
      const data = await getRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  function onRefresh() {
    setRefreshing(true);
    loadRecipes();
  }

  const header = (
    <Stack.Screen
      options={{
        title: 'Recept',
        headerRight: () => (
          <Link href="/recipe/new">
            <Text style={styles.plus}>＋</Text>
          </Link>
        ),
      }}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        {header}
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        {header}
        <Text style={styles.error}>{error}</Text>
        <Button title="Försök igen" onPress={loadRecipes} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {header}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.empty}>Inga recept än. Tryck ＋ för att lägga till ett!</Text>
        }
        renderItem={({ item }) => (
          <Link href={`/recipe/${item.id}`} asChild>
            <Pressable style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Text style={styles.placeholderText}>🍽</Text>
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.background },
  list: { padding: 16 },
  row: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { width: '100%', aspectRatio: 1 },
  placeholder: { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 40 },
  info: { padding: 10 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40, fontSize: 16 },
  error: { color: colors.error, fontSize: 16, marginBottom: 12, textAlign: 'center' },
  plus: { fontSize: 28, color: colors.primary, paddingHorizontal: 8 },
});
