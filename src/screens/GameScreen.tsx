import React, { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { WordRow } from "../components/WordRow";
import { LetterPicker } from "../components/LetterPicker";
import { dictionary } from "../game/dictionary";
import { validateWord } from "../game/validation";
import type { Puzzle } from "../game/types";
import { calculateScore } from "../game/scoring";
import { savePuzzleCompletion } from "../game/progress";

type GameScreenProps = {
  puzzle: Puzzle;
  progressId?: string;
  onNextPuzzle?: () => void;
  onBack: () => void;
};

export function GameScreen({
  puzzle,
  progressId,
  onNextPuzzle,
  onBack,
}: GameScreenProps) {
  const [words, setWords] = useState<string[]>([puzzle.start]);
  const [draft, setDraft] = useState(puzzle.start);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("Tap a letter to change it.");

  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const shouldScrollRef = useRef(false);

  const previousWord = words[words.length - 1];
  const moves = words.length - 1;
  const won = previousWord === puzzle.target;
  const validation = validateWord(previousWord, draft, dictionary);

  const score = won ? calculateScore(moves, puzzle.expectedMoves) : null;

  function handleLetterPress(index: number) {
    if (won) return;

    setSelectedIndex(index);
    setMessage("Choose a replacement letter.");
  }

  function handleLetterSelect(letter: string) {
    if (selectedIndex === null || won) return;

    void Haptics.selectionAsync();

    const next =
      previousWord.slice(0, selectedIndex) +
      letter +
      previousWord.slice(selectedIndex + 1);

    setDraft(next);
    setSelectedIndex(null);

    const result = validateWord(previousWord, next, dictionary);

    setMessage(result.valid ? "Valid word! Ready to submit." : result.reason);
  }

  function handleSubmit() {
    const result = validateWord(previousWord, draft, dictionary);

    if (!result.valid || won) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setMessage(result.valid ? "Puzzle already complete." : result.reason);
      return;
    }

    const nextWord = draft;

    shouldScrollRef.current = true;
    setWords((current) => [...current, nextWord]);
    setSelectedIndex(null);

    if (nextWord === puzzle.target) {
      const finalScore = calculateScore(moves + 1, puzzle.expectedMoves);

      void savePuzzleCompletion(progressId ?? puzzle.id, finalScore).catch(
        (error) => {
          console.error("Failed to save puzzle completion:", error);
        },
      );

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage("Puzzle complete!");
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDraft(nextWord);
      setMessage("Tap a letter to change it.");
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

    void Haptics.selectionAsync();
  }

  function handleReset() {
    setWords([puzzle.start]);
    setDraft(puzzle.start);
    setSelectedIndex(null);
    setMessage("Tap a letter to change it.");

    shouldScrollRef.current = false;
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WORD LADDER</Text>

          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹ Puzzle List</Text>
          </Pressable>

          <Text style={styles.title}>Puzzle {puzzle.id.split("-").pop()}</Text>

          <Text style={styles.moveCount}>
            {moves} {moves === 1 ? "move" : "moves"}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.board}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (shouldScrollRef.current) {
              scrollRef.current?.scrollToEnd({ animated: true });
              shouldScrollRef.current = false;
            }
          }}
        >
          {words.map((word, index) => (
            <WordRow
              key={`${index}-${word}`}
              word={word}
              previousWord={index > 0 ? words[index - 1] : undefined}
              label={index === 0 ? "START" : undefined}
            />
          ))}

          {!won && (
            <WordRow
              key={`draft-${words.length}`}
              word={draft}
              editable
              selectedIndex={selectedIndex}
              onLetterPress={handleLetterPress}
            />
          )}
        </ScrollView>

        <View style={styles.goalContainer}>
          <Text style={styles.goalLabel}>YOUR GOAL</Text>
          <WordRow word={puzzle.target} animate={false} celebrating={won} />
        </View>

        {won && score && (
          <Animated.View
            entering={ZoomIn.duration(350).springify()}
            style={styles.result}
          >
            <Text style={styles.resultTitle}>Puzzle Complete!</Text>

            <Text style={styles.resultSubtitle}>
              {score.moves} moves · {puzzle.expectedMoves} expected
            </Text>

            <Text style={styles.resultEfficiency}>
              {score.extraMoves === 0
                ? "Perfect!"
                : `+${score.extraMoves} extra ${
                    score.extraMoves === 1 ? "move" : "moves"
                  }`}
            </Text>
          </Animated.View>
        )}

        <View style={styles.controls}>
          {!won && (
            <>
              <Text style={styles.message} accessibilityLiveRegion="polite">
                {message}
              </Text>

              <LetterPicker
                onSelect={handleLetterSelect}
                disabled={selectedIndex === null}
              />

              <Pressable
                onPress={handleSubmit}
                disabled={!validation.valid}
                style={({ pressed }) => [
                  styles.submit,
                  !validation.valid && styles.submitDisabled,
                  pressed && validation.valid && styles.submitPressed,
                ]}
              >
                <Text style={styles.submitText}>Submit Word</Text>
              </Pressable>
            </>
          )}

          <View style={styles.actions}>
            {!won && (
              <Pressable
                onPress={handleUndo}
                disabled={words.length <= 1}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.actionText,
                    words.length <= 1 && styles.actionDisabled,
                  ]}
                >
                  Undo
                </Text>
              </Pressable>
            )}

            <Pressable onPress={handleReset} accessibilityRole="button">
              <Text style={styles.actionText}>Restart</Text>
            </Pressable>

            {won && onNextPuzzle && (
              <Pressable onPress={onNextPuzzle} accessibilityRole="button">
                <Text style={styles.actionText}>Next Puzzle →</Text>
              </Pressable>
            )}
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
    paddingTop: 18,
    paddingBottom: 16,
    gap: 5,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 12,
    zIndex: 1,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#477BDB",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#64748B",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  moveCount: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  scroll: {
    flex: 1,
  },
  board: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 12,
  },
  goalContainer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
    backgroundColor: "#F1F5F9",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#64748B",
  },
  result: {
    alignItems: "center",
    paddingVertical: 18,
    gap: 6,
    backgroundColor: "#FFFFFF",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  resultSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  resultEfficiency: {
    fontSize: 13,
    fontWeight: "600",
    color: "#477BDB",
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  message: {
    minHeight: 18,
    textAlign: "center",
    fontSize: 13,
    color: "#64748B",
  },
  submit: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#477BDB",
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitPressed: {
    backgroundColor: "#3769C4",
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
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  actionDisabled: {
    opacity: 0.35,
  },
});
