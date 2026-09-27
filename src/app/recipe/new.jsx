import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import RecipeForm from '../../components/RecipeForm';
import { createRecipe } from '../../lib/api';

export default function NewRecipeScreen() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleCreate(data) {
    try {
      await createRecipe(data);
      router.back();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Nytt recept' }} />
      <RecipeForm onSubmit={handleCreate} submitLabel="Lägg till" error={error} />
    </>
  );
}
