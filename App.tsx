import React, { createContext, useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";

/** ---------- Types ---------- **/
type Course = "Starters" | "Mains" | "Desserts";
type Dish = { id: string; name: string; description: string; course: Course; price: number };

/** ---------- Seed Data (10 each) ---------- **/
let _id = 1;
const nid = () => String(_id++);

const SEED: Dish[] = [
  // Starters (10)
  { id: nid(), name: "Caprese Salad", description: "Tomato • mozzarella • basil", course: "Starters", price: 85 },
  { id: nid(), name: "Bruschetta", description: "Grilled bread • tomato • garlic", course: "Starters", price: 65 },
  { id: nid(), name: "Calamari", description: "Lightly fried • lemon aioli", course: "Starters", price: 95 },
  { id: nid(), name: "Pumpkin Soup", description: "Creamy • roasted seeds", course: "Starters", price: 70 },
  { id: nid(), name: "Chicken Livers", description: "Peri-peri • toast", course: "Starters", price: 75 },
  { id: nid(), name: "Beetroot Carpaccio", description: "Goat’s cheese • walnuts", course: "Starters", price: 80 },
  { id: nid(), name: "Halloumi Fries", description: "Honey • sesame", course: "Starters", price: 88 },
  { id: nid(), name: "Prawn Cocktail", description: "Marie Rose • avocado", course: "Starters", price: 98 },
  { id: nid(), name: "Garlic Snails", description: "Herb butter • baguette", course: "Starters", price: 89 },
  { id: nid(), name: "Caprese Skewers", description: "Cherry tomato • bocconcini", course: "Starters", price: 60 },
  // Mains (10)
  { id: nid(), name: "Grilled Salmon", description: "Lemon butter sauce", course: "Mains", price: 199.99 },
  { id: nid(), name: "Beef Fillet", description: "Red wine jus • fries", course: "Mains", price: 230 },
  { id: nid(), name: "Roast Chicken", description: "Herb jus • veg", course: "Mains", price: 155 },
  { id: nid(), name: "Lamb Chops", description: "Mint salsa • mash", course: "Mains", price: 220 },
  { id: nid(), name: "Seafood Pasta", description: "Prawns • mussels • cream", course: "Mains", price: 185 },
  { id: nid(), name: "Vegetable Curry", description: "Coconut • basmati rice", course: "Mains", price: 140 },
  { id: nid(), name: "Burger Deluxe", description: "Cheddar • bacon • chips", course: "Mains", price: 135 },
  { id: nid(), name: "Chicken Alfredo", description: "Mushroom • parmesan", course: "Mains", price: 165 },
  { id: nid(), name: "Ribeye Steak", description: "250g • chimichurri", course: "Mains", price: 245 },
  { id: nid(), name: "Butternut Risotto", description: "Sage • pecorino", course: "Mains", price: 165 },
  // Desserts (10)
  { id: nid(), name: "Crème Brûlée", description: "Vanilla custard • caramel top", course: "Desserts", price: 90 },
  { id: nid(), name: "Tiramisu", description: "Espresso • mascarpone", course: "Desserts", price: 95 },
  { id: nid(), name: "Chocolate Fondant", description: "Warm centre • ice cream", course: "Desserts", price: 98 },
  { id: nid(), name: "Cheesecake", description: "Berry compote", course: "Desserts", price: 85 },
  { id: nid(), name: "Malva Pudding", description: "Custard • apricot glaze", course: "Desserts", price: 75 },
  { id: nid(), name: "Panna Cotta", description: "Vanilla • strawberry", course: "Desserts", price: 82 },
  { id: nid(), name: "Apple Crumble", description: "Cinnamon • crème anglaise", course: "Desserts", price: 79 },
  { id: nid(), name: "Lemon Meringue", description: "Buttery crust", course: "Desserts", price: 86 },
  { id: nid(), name: "Banoffee Pie", description: "Banana • toffee • cream", course: "Desserts", price: 89 },
  { id: nid(), name: "Ice-Cream Trio", description: "Vanilla • choc • strawberry", course: "Desserts", price: 60 },
];

/** ---------- Tiny Store (Context in-file) ---------- **/
const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

type Ctx = {
  dishes: Dish[];
  addDish: (d: Omit<Dish, "id">) => void;
  deleteDish: (id: string) => void;
  counts: { total: number; starters: number; mains: number; desserts: number };
  averages: { starters: number; mains: number; desserts: number };
};
const MenuCtx = createContext<Ctx | null>(null);
const useMenu = () => {
  const c = useContext(MenuCtx);
  if (!c) throw new Error("useMenu must be used inside provider");
  return c;
};

function MenuProvider({ children }: { children: React.ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>(SEED);

  const addDish = (d: Omit<Dish, "id">) => setDishes((p) => [{ id: nid(), ...d }, ...p]);
  const deleteDish = (id: string) => setDishes((p) => p.filter((x) => x.id !== id));

  const counts = useMemo(() => {
    const starters = dishes.filter((d) => d.course === "Starters").length;
    const mains = dishes.filter((d) => d.course === "Mains").length;
    const desserts = dishes.filter((d) => d.course === "Desserts").length;
    return { total: dishes.length, starters, mains, desserts };
  }, [dishes]);

  const avg = (arr: Dish[]) =>
    arr.length ? Number((arr.reduce((s, d) => s + d.price, 0) / arr.length).toFixed(2)) : 0;
  const averages = useMemo(() => {
    const S = dishes.filter((d) => d.course === "Starters");
    const M = dishes.filter((d) => d.course === "Mains");
    const D = dishes.filter((d) => d.course === "Desserts");
    return { starters: avg(S), mains: avg(M), desserts: avg(D) };
  }, [dishes]);

  return <MenuCtx.Provider value={{ dishes, addDish, deleteDish, counts, averages }}>{children}</MenuCtx.Provider>;
}

/** ---------- Small UI Helpers ---------- **/
const Yellow = "#FFD54F";
const Soft = "#f7f8fa";

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function DishRow({
  item,
  right,
  onPress,
}: {
  item: Dish;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.itemCard}>
      <View style={styles.itemIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.course} • {item.description}
        </Text>
        <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
      </View>
      {right}
    </Pressable>
  );
}

/** ---------- Details Modal (reusable) ---------- **/
function DishDetailsModal({
  visible,
  dish,
  onClose,
  onDelete,
}: {
  visible: boolean;
  dish: Dish | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalShade}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Item Details</Text>
          {dish ? (
            <>
              <Text style={styles.modalRow}><Text style={styles.modalKey}>Name:</Text> {dish.name}</Text>
              <Text style={styles.modalRow}><Text style={styles.modalKey}>Course:</Text> {dish.course}</Text>
              <Text style={styles.modalRow}><Text style={styles.modalKey}>Price:</Text> R {dish.price.toFixed(2)}</Text>
              <Text style={styles.modalRow}><Text style={styles.modalKey}>Description:</Text> {dish.description}</Text>
            </>
          ) : (
            <Text style={styles.modalRow}>No item selected.</Text>
          )}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            {dish && onDelete && (
              <Button title="Delete" color="#e65d4a" onPress={() => onDelete(dish.id)} />
            )}
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** ---------- Screens (in this file) ---------- **/
function HomeScreen() {
  const { dishes, addDish, counts, averages } = useMenu();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course>("Mains");
  const [priceText, setPriceText] = useState("");
  const [query, setQuery] = useState("");

  // modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Dish | null>(null);

  const add = () => {
    if (!name.trim() || !description.trim() || !priceText.trim()) return alert("All fields are required.");
    const p = Number(priceText);
    if (Number.isNaN(p) || p <= 0) return alert("Enter a valid price greater than 0.");
    addDish({ name: name.trim(), description: description.trim(), course, price: p });
    setName(""); setDescription(""); setCourse("Mains"); setPriceText("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.course.toLowerCase().includes(q)
    );
  }, [dishes, query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.brand}>Christoffel</Text>
      <Text style={styles.subtitle}>Home (Part 2)</Text>

      {/* KPIs */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.kpiLabel}>Total Items</Text>
          <Text style={styles.kpiValue}>{counts.total}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.kpiLabel}>Average Price</Text>
          <Text style={styles.avgRow}>S R {averages.starters.toFixed(2)}</Text>
          <Text style={styles.avgRow}>M R {averages.mains.toFixed(2)}</Text>
          <Text style={styles.avgRow}>D R {averages.desserts.toFixed(2)}</Text>
        </View>
      </View>

      {/* Add form */}
      <Text style={styles.sectionTitle}>Add New Item</Text>
      <View style={styles.form}>
        <TextInput placeholder="Dish name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {COURSES.map((c) => (
            <Chip key={c} label={c} active={course === c} onPress={() => setCourse(c)} />
          ))}
        </View>
        <TextInput
          placeholder="Price (R)"
          keyboardType="numeric"
          value={priceText}
          onChangeText={setPriceText}
          style={styles.input}
        />
        <View style={{ alignItems: "flex-start" }}>
          <Button title="Add" color="#e65d4a" onPress={add} />
        </View>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search by name / description / course"
        value={query}
        onChangeText={setQuery}
        style={[styles.input, { marginBottom: 8 }]}
      />

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <DishRow
            item={item}
            onPress={() => {
              setSelected(item);
              setOpen(true);
            }}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <DishDetailsModal visible={open} dish={selected} onClose={() => setOpen(false)} />
    </ScrollView>
  );
}

function FilterScreen() {
  const { dishes } = useMenu();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byCourse = selectedCourse ? dishes.filter((d) => d.course === selectedCourse) : dishes;
    const q = query.trim().toLowerCase();
    if (!q) return byCourse;
    return byCourse.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [dishes, selectedCourse, query]);

  // modal state
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Dish | null>(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Filter by Course</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Chip label="All" active={!selectedCourse} onPress={() => setSelectedCourse(null)} />
        {COURSES.map((c) => (
          <Chip key={c} label={c} active={selectedCourse === c} onPress={() => setSelectedCourse(c)} />
        ))}
      </View>

      <TextInput
        placeholder="Search in results"
        value={query}
        onChangeText={setQuery}
        style={[styles.input, { marginBottom: 8 }]}
      />

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <DishRow
            item={item}
            onPress={() => {
              setCurrent(item);
              setOpen(true);
            }}
          />
        )}
      />

      <DishDetailsModal visible={open} dish={current} onClose={() => setOpen(false)} />
    </View>
  );
}

function ManageScreen() {
  const { dishes, deleteDish, addDish } = useMenu();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course>("Mains");
  const [priceText, setPriceText] = useState("");
  const [query, setQuery] = useState("");

  // modal state (can delete from modal too)
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Dish | null>(null);

  const add = () => {
    if (!name.trim() || !description.trim() || !priceText.trim()) return alert("All fields are required.");
    const p = Number(priceText);
    if (Number.isNaN(p) || p <= 0) return alert("Enter a valid price.");
    addDish({ name: name.trim(), description: description.trim(), course, price: p });
    setName(""); setDescription(""); setCourse("Mains"); setPriceText("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.course.toLowerCase().includes(q)
    );
  }, [dishes, query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.header}>Add / Manage Items</Text>

      <View style={styles.form}>
        <TextInput placeholder="Dish name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {COURSES.map((c) => (
            <Chip key={c} label={c} active={course === c} onPress={() => setCourse(c)} />
          ))}
        </View>
        <TextInput
          placeholder="Price (R)"
          keyboardType="numeric"
          value={priceText}
          onChangeText={setPriceText}
          style={styles.input}
        />
        <View style={{ alignItems: "flex-start" }}>
          <Button title="Add Item" color="#e65d4a" onPress={add} />
        </View>
      </View>

      <TextInput
        placeholder="Search items to manage"
        value={query}
        onChangeText={setQuery}
        style={[styles.input, { marginBottom: 8 }]}
      />

      <Text style={{ fontWeight: "700", marginBottom: 8 }}>Current Menu Items</Text>
      {filtered.map((item) => (
        <DishRow
          key={item.id}
          item={item}
          onPress={() => {
            setSelected(item);
            setOpen(true);
          }}
          right={
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteDish(item.id)}>
              <Text style={styles.deleteTxt}>Delete</Text>
            </TouchableOpacity>
          }
        />
      ))}
      {filtered.length === 0 && <Text style={styles.empty}>No items match your search.</Text>}

      <DishDetailsModal
        visible={open}
        dish={selected}
        onClose={() => setOpen(false)}
        onDelete={(id) => {
          deleteDish(id);
          setOpen(false);
        }}
      />
    </ScrollView>
  );
}

/** ---------- Single-file Tab Shell ---------- **/
type TabKey = "Home" | "Filter" | "Manage";

function Tabs() {
  const [tab, setTab] = useState<TabKey>("Home");

  const TabButton = ({ t }: { t: TabKey }) => {
    const active = tab === t;
    return (
      <TouchableOpacity onPress={() => setTab(t)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
        <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{t}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TabButton t="Home" />
        <TabButton t="Filter" />
        <TabButton t="Manage" />
      </View>
      <View style={{ flex: 1 }}>
        {tab === "Home" && <HomeScreen />}
        {tab === "Filter" && <FilterScreen />}
        {tab === "Manage" && <ManageScreen />}
      </View>
    </SafeAreaView>
  );
}

/** ---------- App (single file) ---------- **/
export default function App(): JSX.Element {
  return (
    <MenuProvider>
      <Tabs />
    </MenuProvider>
  );
}

/** ---------- Styles ---------- **/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Soft },
  tabBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8eaef",
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: "#eef1f6", alignItems: "center" },
  tabBtnActive: { backgroundColor: Yellow },
  tabTxt: { color: "#444", fontWeight: "600" },
  tabTxtActive: { color: "#111", fontWeight: "800" },

  screen: { flex: 1, backgroundColor: Soft, padding: 16 },
  brand: { fontSize: 22, fontWeight: "800", color: "#111" },
  subtitle: { color: "#555", marginBottom: 10 },

  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 },
  kpiLabel: { color: "#666", marginBottom: 2 },
  kpiValue: { fontSize: 26, fontWeight: "800" },
  avgRow: { color: "#333" },

  sectionTitle: { marginTop: 6, marginBottom: 6, fontWeight: "700", color: "#333" },
  form: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  input: { backgroundColor: "#f0f1f4", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },

  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: "#e9ecf1" },
  chipActive: { backgroundColor: Yellow },
  chipTxt: { color: "#444" },
  chipTxtActive: { color: "#111", fontWeight: "700" },

  itemCard: { flexDirection: "row", gap: 10, padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5 },
  itemIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Yellow },
  itemTitle: { fontWeight: "700", fontSize: 15 },
  itemMeta: { color: "#666", marginTop: 2 },
  price: { marginTop: 6, fontWeight: "700", backgroundColor: "#f0f3f7", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  header: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  deleteBtn: { backgroundColor: "#e65d4a", alignSelf: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  deleteTxt: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", color: "#666", marginTop: 24, fontStyle: "italic" },

  modalShade: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  modalRow: { marginBottom: 6, color: "#333" },
  modalKey: { fontWeight: "700" },
});
