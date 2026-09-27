import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RecipeForm from '../../../components/RecipeForm';
import { getRecipe, updateRecipe } from '../../../lib/api';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the recipe so the form can be pre-filled
  useEffect(() => {
    async function loadRecipe() {
      try {
        setRecipe(await getRecipe(id));
      } catch (err) {
        setError(err.message);
      }
    }
    loadRecipe();
  }, [id]);

  async function handleUpdate(data) {
    try {
      await updateRecipe(id, data);
      router.back();
    } catch (err) {
      setError(err.message);
    }
  }

  // Wait until the recipe has loaded before rendering the form, so
  // RecipeForm gets the correct initial values straight from useState.
  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={error ? styles.error : undefined}>{error ?? 'Laddar…'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Ändra recept' }} />
      <RecipeForm initialValues={recipe} onSubmit={handleUpdate} submitLabel="Spara" error={error} />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  error: { color: 'red' },
});
