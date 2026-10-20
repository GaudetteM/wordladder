import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { WordRow } from "../components/WordRow";
import { LetterPicker } from "../components/LetterPicker";
import { starterPuzzle } from "../game/puzzles";
import { dictionary } from "../game/dictionary";
import { validateWord } from "../game/validation";

export function GameScreen() {
  const puzzle = starterPuzzle;

  const [words, setWords] = useState<string[]>([puzzle.start]);

  const [draft, setDraft] = useState(puzzle.start);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [message, setMessage] = useState("Tap a letter to change it.");

  const previousWord = words[words.length - 1];
  const won = previousWord === puzzle.target;
  const moves = words.length - 1;

  const validation = validateWord(previousWord, draft, dictionary);

  function handleLetterSelect(letter: string) {
    if (selectedIndex === null || won) return;

    const next =
      draft.substring(0, selectedIndex) +
      letter +
      draft.substring(selectedIndex + 1);

    setDraft(next);
    setSelectedIndex(null);
    setMessage("Tap another letter or submit your word.");
  }

  function handleSubmit() {
    const result = validateWord(previousWord, draft, dictionary);

    if (!result.valid) {
      setMessage(result.reason);
      return;
    }

    const nextWord = draft;

    setWords((current) => [...current, nextWord]);
    setSelectedIndex(null);

    if (nextWord === puzzle.target) {
      setMessage("Puzzle complete!");
      Alert.alert("You did it!", `Solved in ${moves + 1} moves.`);
    } else {
      setDraft(nextWord);
      setMessage("Nice! Change one more letter.");
    }
  }

  function handleUndo() {
    if (words.length <= 1 || won) return;

    const nextWords = words.slice(0, -1);
    const lastWord = nextWords[nextWords.length - 1];

    setWords(nextWords);
    setDraft(lastWord);
    setSelectedIndex(null);
    setMessage("Last move undone.");
  }

  function handleReset() {
    setWords([puzzle.start]);
    setDraft(puzzle.start);
    setSelectedIndex(null);
    setMessage("Tap a letter to change it.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WORD LADDER</Text>

          <Text style={styles.title}>Puzzle 001</Text>

          <Text style={styles.subtitle}>
            Transform {puzzle.start} into {puzzle.target}
          </Text>

          <Text style={styles.moveCount}>
            {moves} {moves === 1 ? "move" : "moves"}
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.board}
          keyboardShouldPersistTaps="always"
        >
          {words.map((word, index) => (
            <WordRow
              key={index}
              word={word}
              previousWord={index > 0 ? words[index - 1] : undefined}
              label={index === 0 ? "START" : undefined}
            />
          ))}

          {!won && (
            <WordRow
              word={draft}
              editable
              selectedIndex={selectedIndex}
              onLetterPress={setSelectedIndex}
              label="YOUR NEXT WORD"
            />
          )}

          <WordRow word={puzzle.target} label="GOAL" />
        </ScrollView>

        <View style={styles.controls}>
          <Text style={styles.message} accessibilityLiveRegion="polite">
            {message}
          </Text>

          {!won && (
            <>
              <LetterPicker
                onSelect={handleLetterSelect}
                disabled={selectedIndex === null}
              />

              <Pressable
                onPress={handleSubmit}
                disabled={!validation.valid}
                style={[
                  styles.submit,
                  !validation.valid && styles.submitDisabled,
                ]}
              >
                <Text style={styles.submitText}>Submit Word</Text>
              </Pressable>
            </>
          )}

          <View style={styles.actions}>
            {!won && (
              <Pressable onPress={handleUndo} disabled={words.length <= 1}>
                <Text style={styles.actionText}>Undo</Text>
              </Pressable>
            )}

            <Pressable onPress={handleReset}>
              <Text style={styles.actionText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#64748B",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  moveCount: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  scroll: {
    flex: 1,
  },
  board: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 12,
    gap: 14,
    flexGrow: 1,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  message: {
    textAlign: "center",
    fontSize: 13,
    color: "#64748B",
    minHeight: 18,
  },
  submit: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#477BDB",
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
});
