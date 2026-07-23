import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { useGoals } from '@/hooks/use-goals';
import { addGoal, deleteGoals } from '@/lib/goals';
import { GoalItem } from '@/components/goal-item';

export default function GoalsScreen() {
  const { user } = useAuth();
  const { goals, loading, error } = useGoals();
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed || !user) return;
    setAdding(true);
    try {
      await addGoal(user.uid, trimmed);
      setTitle('');
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a goal…"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={handleAdd} disabled={adding}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No goals yet. Add one above.</Text>}
          renderItem={({ item }) => (
            <GoalItem
              goal={item}
              onDelete={async (g) => { try { await deleteGoals(g.id); } catch (e) { console.error(e); } }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  addBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginTop: 32 },
  errorText: { color: '#dc2626', fontSize: 13, marginBottom: 8 },
});