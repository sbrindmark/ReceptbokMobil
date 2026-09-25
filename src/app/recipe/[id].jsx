import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View, StyleSheet } from 'react-native';
import { API_URL } from '../../lib/api';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadRecipe() {
            try {
                const response = await fetch(`${API_URL}/api/recipes/${id}`);
                if (!response.ok) throw new Error();
                setRecipe(await response.json());
            } catch (err) {
                setError('Kunde inte hämta receptet');
            }
        }
        loadRecipe();
    }, [id]);

    if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text>
    </View>;
    if (!recipe) return <View style={styles.container}><Text>Laddar…</Text></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {recipe.image ? <Image source={{ uri: recipe.image }} style={styles.image} /> : null}
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.desc}>{recipe.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 220, borderRadius: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16 },
  error: { color: 'red' },
});