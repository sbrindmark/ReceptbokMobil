import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRecipe, deleteRecipe } from '../../../lib/api';
import { colors } from '../../../constants/colors';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function loadRecipe() {
        try {
          setRecipe(await getRecipe(id));
        } catch (err) {
          setError(err.message);
        }
      }
      loadRecipe();
    }, [id])
  );

  async function handleDelete() {
    try {
      await deleteRecipe(id);
      router.back();
    } catch (err) {
      setError(err.message);
    }
  }

  function confirmDelete() {
    Alert.alert('Ta bort recept', 'Är du säker?', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Ta bort', style: 'destructive', onPress: handleDelete },
    ]);
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!recipe) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: recipe.title }} />
      {recipe.image ? <Image source={{ uri: recipe.image }} style={styles.image} /> : null}
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.desc}>{recipe.description}</Text>

      <Pressable style={[styles.button, styles.editButton]} onPress={() => router.push(`/recipe/${id}/edit`)}>
        <Text style={styles.buttonText}>Ändra</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
        <Text style={styles.buttonText}>Ta bort</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  image: { width: '100%', height: 240, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 8 },
  desc: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: 24 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  editButton: { backgroundColor: colors.primary },
  deleteButton: { backgroundColor: colors.error },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: colors.error, fontSize: 16, textAlign: 'center', padding: 20 },
});
