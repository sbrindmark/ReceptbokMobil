import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getRecipes } from '../lib/api';

// Owns the recipe list for the list screen: data, loading, error and refresh.
// Re-fetches every time the screen regains focus (after create/edit/delete).
export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      setRecipes(await getRecipes());
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
      load();
    }, [])
  );

  function refresh() {
    setRefreshing(true);
    load();
  }

  return { recipes, error, loading, refreshing, refresh };
}
