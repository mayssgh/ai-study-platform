import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRIMARY = "#9cd21f";

export default function Settings() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(30);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setFullName(data.full_name);
      });
  }, [user]);

  const saveName = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    try {
      setSavingName(true);
      const { error } = await supabase
        .from("users")
        .update({ full_name: fullName.trim() })
        .eq("id", user?.id);
      if (error) throw error;
      setEditingName(false);
      Alert.alert("Success", "Name updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    await AsyncStorage.removeItem("onboarding_complete");
    Alert.alert("Done", "Onboarding reset! Restart the app to see it again.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8f6" }}>
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.card}>

            {/* Full Name */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: PRIMARY + "20" }]}>
                  <Ionicons name="person" size={18} color={PRIMARY} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Full Name</Text>
                  {editingName ? (
                    <TextInput
                      style={styles.nameInput}
                      value={fullName}
                      onChangeText={setFullName}
                      autoFocus
                      placeholder="Enter your name"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.settingSubtitle}>{fullName || "Student"}</Text>
                  )}
                </View>
              </View>
              {editingName ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveName}
                  disabled={savingName}
                >
                  {savingName ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setEditingName(true)}>
                  <Ionicons name="pencil" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#3b82f620" }]}>
                  <Ionicons name="mail" size={18} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Email</Text>
                  <Text style={styles.settingSubtitle}>{user?.email}</Text>
                </View>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedText}>Locked</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Change Password */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert("Coming Soon", "Password change will be available soon!")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#ef444420" }]}>
                  <Ionicons name="lock-closed" size={18} color="#ef4444" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Change Password</Text>
                  <Text style={styles.settingSubtitle}>Update your password</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Study Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STUDY PREFERENCES</Text>
          <View style={styles.card}>
            <Text style={styles.goalLabel}>Daily Study Goal</Text>
            <View style={styles.goalRow}>
              {[15, 30, 60, 90].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.goalChip,
                    dailyGoal === mins && styles.goalChipActive,
                  ]}
                  onPress={() => setDailyGoal(mins)}
                >
                  <Text
                    style={[
                      styles.goalChipText,
                      dailyGoal === mins && styles.goalChipTextActive,
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.goalHint}>
              You'll earn +50 XP when you reach your daily goal
            </Text>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APP PREFERENCES</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#f9731620" }]}>
                  <Ionicons name="notifications" size={18} color="#f97316" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Study reminders & updates</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#e5e7eb", true: PRIMARY }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Integrations */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTEGRATIONS</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/(tabs)/moodle" as any)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: PRIMARY + "20" }]}>
                  <Ionicons name="school" size={18} color={PRIMARY} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Moodle</Text>
                  <Text style={styles.settingSubtitle}>Manage university connection</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#22c55e20" }]}>
                  <Ionicons name="information-circle" size={18} color="#22c55e" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>App Version</Text>
                  <Text style={styles.settingSubtitle}>v1.0.0 Beta</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleResetOnboarding}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#8b5cf620" }]}>
                  <Ionicons name="refresh" size={18} color="#8b5cf6" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Replay Onboarding</Text>
                  <Text style={styles.settingSubtitle}>See the intro screens again</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert("Terms", "Coming soon!")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#3b82f620" }]}>
                  <Ionicons name="document-text" size={18} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Terms of Service</Text>
                  <Text style={styles.settingSubtitle}>Read our terms</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert("Privacy", "Coming soon!")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#8b5cf620" }]}>
                  <Ionicons name="shield-checkmark" size={18} color="#8b5cf6" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Privacy Policy</Text>
                  <Text style={styles.settingSubtitle}>How we use your data</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Branding */}
        <View style={styles.branding}>
          <Ionicons name="sparkles" size={20} color={PRIMARY} />
          <Text style={styles.brandingText}>AiStudy</Text>
          <Text style={styles.brandingSubtext}>Made with ❤️ for students</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
    elevation: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: { color: "#333", fontWeight: "600", fontSize: 15 },
  settingSubtitle: { color: "#999", fontSize: 12, marginTop: 2 },
  nameInput: {
    color: PRIMARY,
    fontSize: 13,
    borderBottomWidth: 1,
    borderBottomColor: PRIMARY,
    paddingVertical: 2,
    minWidth: 150,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 13 },
  lockedBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lockedText: { color: "#999", fontSize: 11, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 14 },
  goalLabel: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
    padding: 14,
    paddingBottom: 10,
  },
  goalRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,
  },
  goalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  goalChipActive: { backgroundColor: PRIMARY + "20", borderColor: PRIMARY },
  goalChipText: { color: "#999", fontWeight: "bold" },
  goalChipTextActive: { color: PRIMARY },
  goalHint: { color: "#999", fontSize: 12, paddingHorizontal: 14, paddingBottom: 14 },
  logoutButton: {
    backgroundColor: "#ef4444",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  logoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
  branding: { alignItems: "center", paddingBottom: 40, gap: 4 },
  brandingText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  brandingSubtext: { color: "#999", fontSize: 12 },
});