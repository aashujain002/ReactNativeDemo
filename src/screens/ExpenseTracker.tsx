import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { RootStackNavigationProp } from '../navigation/NavTypes';
import { addExpense, categoryTotals, listExpenses, deleteExpense, backupDatabase, restoreDatabase, openDb } from '../db/expenseDb';
import ExpensePieChart from '../components/ExpensePieChart';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props { navigation: RootStackNavigationProp<'ExpenseTracker'> }

const CATEGORIES = ['food', 'transport', 'shopping', 'health', 'utilities', 'entertainment', 'travel', 'other'];

const ExpenseTracker: React.FC<Props> = () => {
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [totals, setTotals] = useState<{ category: string; total: number; }[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState('food');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [backingUp, setBackingUp] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);
    const scaleAnim = useState(new Animated.Value(0))[0];

    const toggleFab = () => {
        const toValue = fabOpen ? 0 : 1;
        setFabOpen(!fabOpen);
        Animated.timing(scaleAnim,{ toValue, duration:220, easing:Easing.out(Easing.quad), useNativeDriver:true }).start();
    };

    const load = async () => {
        try {
            setLoading(true);
            await openDb();
            const [exp, catTotals] = await Promise.all([
                listExpenses(200, 0),
                categoryTotals()
            ]);
            setExpenses(exp);
            setTotals(catTotals);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onAdd = async () => {
        if (!amount) return;
        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) return Alert.alert('Invalid', 'Enter a valid amount');
        try {
            setSaving(true);
            await addExpense(category, num, note.trim() || undefined);
            setShowModal(false);
            setAmount(''); setNote('');
            await load();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Could not save');
        } finally { setSaving(false); }
    };

    const onDelete = async (id: number) => {
        Alert.alert('Delete', 'Delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteExpense(id); await load(); } catch (e: any) { Alert.alert('Error', e.message); } } }
        ]);
    };

    const onBackup = async () => {
        try {
            setBackingUp(true);
            const path = await backupDatabase();
            Alert.alert('Backup complete', `File saved: ${path}`);
        } catch (e: any) {
            Alert.alert('Backup failed', e.message);
        } finally { setBackingUp(false); }
    };

    const onRestore = async () => {
        Alert.alert('Restore', 'This will overwrite current data. Provide a path manually in code or implement a picker.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK', onPress: async () => {
                    try {
                        Alert.alert('Info', 'Implement a file picker to choose backup file.');
                    } catch (e: any) { Alert.alert('Restore failed', e.message); }
                }
            }
        ]);
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.expenseItem} onLongPress={() => onDelete(item.id)}>
            <View style={{ flex: 1 }}>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                {item.note ? <Text style={styles.expenseNote}>{item.note}</Text> : null}
            </View>
            <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator style={{ marginTop: 40 }} /> : (
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    {totals.length === 0 ? <Text style={styles.empty}>No data yet</Text> : <ExpensePieChart data={totals} styleVariant="performance" />}
                    <Text style={styles.sectionTitle}>Recent Expenses</Text>
                    {expenses.length === 0 ? <Text style={styles.empty}>No expenses</Text> : (
                        <FlatList data={expenses} renderItem={renderItem} keyExtractor={i => String(i.id)} scrollEnabled={false} />
                    )}
                </ScrollView>
            )}

            {fabOpen && <Pressable style={styles.backdrop} onPress={toggleFab} />}
            <View style={styles.fabRoot} pointerEvents="box-none">
                <View style={styles.fabMenuContainer} pointerEvents={fabOpen? 'auto':'none'}>
                    <Animated.View style={[styles.fabMenu, { transform:[{scale:scaleAnim}], opacity: scaleAnim }]}> 
                        <TouchableOpacity style={[styles.miniFab,{backgroundColor:'#3478f6'}]} onPress={()=>{ toggleFab(); setShowModal(true); }}>
                            <Icon name="add" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.miniFab,{backgroundColor:'#6b5'}]} disabled={backingUp} onPress={()=>{ toggleFab(); onBackup(); }}>
                            <Icon name="cloud-upload-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.miniFab,{backgroundColor:'#a55'}]} onPress={()=>{ toggleFab(); onRestore(); }}>
                            <Icon name="cloud-download-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <TouchableOpacity style={styles.mainFab} onPress={toggleFab} activeOpacity={0.85}>
                    <Animated.View style={{ transform:[{rotate: scaleAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','45deg']})}]}}>
                        <Icon name="add" size={30} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Add Expense</Text>
                        <ScrollView>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.categoryRow}>
                                {CATEGORIES.map(c => (
                                    <TouchableOpacity key={c} style={[styles.catPill, c === category && styles.catPillActive]} onPress={() => setCategory(c)}>
                                        <Text style={[styles.catPillText, c === category && styles.catPillTextActive]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput keyboardType="decimal-pad" value={amount} onChangeText={setAmount} style={styles.input} placeholder="$" placeholderTextColor="#777" />
                            <Text style={styles.label}>Note (optional)</Text>
                            <TextInput value={note} onChangeText={setNote} style={[styles.input, { height: 70 }]} multiline placeholder="Note" placeholderTextColor="#777" />
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.btn, styles.btnGhost]}><Text style={styles.btnGhostText}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={onAdd} style={[styles.btn]} disabled={saving}><Text style={styles.btnText}>{saving ? 'Saving...' : 'Save'}</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121821', padding: 12 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginVertical: 12 },
    empty: { color: '#aaa', fontStyle: 'italic', marginBottom: 20 },
    expenseItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#2a313d' },
    expenseCategory: { color: '#fff', fontSize: 14, textTransform: 'capitalize' },
    expenseNote: { color: '#8892a0', fontSize: 12, marginTop: 2 },
    expenseAmount: { color: '#fff', fontWeight: '600' },
    backdrop:{ position:'absolute', left:0, top:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.3)' },
    fabRoot:{ position:'absolute', right:16, bottom:24, alignItems:'center' },
    mainFab:{ width:60, height:60, borderRadius:30, backgroundColor:'#3478f6', justifyContent:'center', alignItems:'center', elevation:4 },
    fabMenuContainer:{ position:'absolute', bottom:76, right:0, alignItems:'flex-end' },
    fabMenu:{ backgroundColor:'rgba(18,24,33,0.9)', padding:10, borderRadius:16, flexDirection:'row', alignItems:'center', gap:12 },
    miniFab:{ width:46, height:46, borderRadius:23, justifyContent:'center', alignItems:'center' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
    modalCard: { backgroundColor: '#1f2530', borderRadius: 14, padding: 16, maxHeight: '90%' },
    modalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 },
    label: { color: '#fff', marginTop: 12, marginBottom: 6, fontSize: 13, fontWeight: '500' },
    input: { backgroundColor: '#2a313d', borderRadius: 8, padding: 10, color: '#fff', marginBottom: 4 },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap' },
    catPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#2a313d', margin: 4 },
    catPillActive: { backgroundColor: '#3478f6' },
    catPillText: { color: '#9aa4b1', fontSize: 12, textTransform: 'capitalize' },
    catPillTextActive: { color: '#fff' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
    btn: { backgroundColor: '#3478f6', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 22 },
    btnText: { color: '#fff', fontWeight: '600' },
    btnGhost: { backgroundColor: 'transparent' },
    btnGhostText: { color: '#8892a0', fontWeight: '500' }
});

export default ExpenseTracker;
