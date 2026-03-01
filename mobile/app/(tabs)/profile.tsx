import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseConfig";

interface UserProfile {
  full_name: string;
  xp: number;
  level: number;
  streak_days: number;
  study_hours: number;
}

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("users")
      .select("full_name, xp, level, streak_days, study_hours")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const displayName = profile?.full_name || "Student";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {profile?.level ?? 1}</Text>
          </View>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.subtitle}>Pro Learner • Mastering STEM</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTop}>
            <Text style={styles.levelLabel}>Level {profile?.level ?? 1}</Text>
            <Text style={styles.xpText}>{profile?.xp ?? 0} / 1000 XP</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(((profile?.xp ?? 0) / 1000) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.remainingXP}>
            {1000 - (profile?.xp ?? 0)} XP until Level {(profile?.level ?? 1) + 1}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="schedule" size={24} color="#9cd21f" />
          <Text style={styles.statNumber}>{profile?.study_hours ?? 0}h</Text>
          <Text style={styles.statLabel}>Study Time</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="local-fire-department" size={24} color="#f97316" />
          <Text style={styles.statNumber}>{profile?.streak_days ?? 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="task-alt" size={24} color="#22c55e" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <TouchableOpacity
          style={styles.activityCard}
          onPress={() => router.push("/course")}
        >
          <MaterialIcons name="science" size={24} color="#9cd21f" />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>Physics: Quantum Basics</Text>
            <Text style={styles.activitySubtitle}>Completed Quiz • 95%</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.activityCard}>
          <MaterialIcons name="emoji-events" size={24} color="#f97316" />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>Daily Goal Reached</Text>
            <Text style={styles.activitySubtitle}>+50 Bonus XP</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8f6" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  avatarSection: { alignItems: "center", padding: 24, backgroundColor: "white" },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#9cd21f",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 40, color: "white", fontWeight: "bold" },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#9cd21f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 12 },
  name: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#666", marginBottom: 16 },
  progressContainer: { width: "100%" },
  progressTop: { flexDirection: "row", justifyContent: "space-between" },
  levelLabel: { fontWeight: "bold", color: "#9cd21f" },
  xpText: { color: "#666" },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginVertical: 6,
  },
  progressBarFill: { height: 10, backgroundColor: "#9cd21f", borderRadius: 20 },
  remainingXP: { textAlign: "center", fontSize: 12, color: "#888" },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#f7f8f6",
  },
  statCard: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#666" },
  activitySection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityText: { marginLeft: 10 },
  activityTitle: { fontWeight: "bold" },
  activitySubtitle: { fontSize: 12, color: "#666" },
});