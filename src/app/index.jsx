import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { API_URL } from '../lib/api';
import { Link, useFocusEffect } from 'expo-router';


export default function RecipeListScreen() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  async function loadRecipes() {
    try {
      const response = await fetch(`${API_URL}/api/recipes`);
      if (!response.ok) throw new Error('Kunde inte hämta recept');
      const data = await response.json();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Kunde inte hämta recept. Är backend igång?');
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Link href={`/recipe/${item.id}`} asChild>
          <Pressable style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center' },
});
