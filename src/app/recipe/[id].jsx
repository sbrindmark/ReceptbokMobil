import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, ScrollView, Text, View, StyleSheet } from 'react-native';
import { API_URL } from '../../lib/api';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
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

    async function handleDelete() {
        try {
            const response = await fetch(`${API_URL}/api/recipes/${id}`, {
                method: 'DELETE' });
                if (!response.ok) throw new Error();
                router.back();
            } catch (err) {
                setError('Kunde inte ta bort receptet');
        }
    }

    function confirmDelete() {
        Alert.alert('Ta bort recept', 'Är du säker?', [
            { text: 'Avbryt', style: 'cancel'},
            { text: 'Ta bort', style: 'destructive', onPress: handleDelete },
        ]);
    }

    if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text>
    </View>;
    if (!recipe) return <View style={styles.container}><Text>Laddar…</Text></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {recipe.image ? <Image source={{ uri: recipe.image }} style={styles.image} /> : null}
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.desc}>{recipe.description}</Text>
            <Button title="Ta bort" color="red" onPress={confirmDelete} />
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