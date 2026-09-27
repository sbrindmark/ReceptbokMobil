import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';

// Shared form for both create and edit. The screen decides what happens
// on submit (onSubmit) and what the button says (submitLabel).
export default function RecipeForm({ initialValues, onSubmit, submitLabel = 'Spara', error }) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [image, setImage] = useState(initialValues?.image ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Titel"
        placeholderTextColor={colors.muted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Bild-URL"
        placeholderTextColor={colors.muted}
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Beskrivning"
        placeholderTextColor={colors.muted}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable style={styles.button} onPress={() => onSubmit({ title, image, description })}>
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: colors.background },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  textarea: { height: 120, textAlignVertical: 'top' },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: colors.error },
});
