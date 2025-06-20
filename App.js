import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { calculateScore } from './src/utils/scoring';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  Dimensions,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import styles from './src/styles/styles';
import colors from './src/styles/colors';
import easyPuzzles from './puzzles/easyPuzzles.js';
import medPuzzles from './puzzles/medPuzzles.js';
import hardPuzzles from './puzzles/hardPuzzles.js';
import dailyPuzzles from './puzzles/dailyPuzzles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  mobileAds
} from 'react-native-google-mobile-ads';
// DEVELOPMENT ONLY: TogglePremiumButton component for toggling premium flag
// (Removed as part of in-app purchase cleanup)


// Track which puzzles have been seen per difficulty
const getPuzzleSet = (difficulty, seenSet) => {
  if (difficulty === 'daily') {
    return dailyPuzzles[0];
  }
  const source = difficulty === 'easy' ? easyPuzzles : difficulty === 'medium' ? medPuzzles : hardPuzzles;
  const unseen = source
    .map((p, idx) => ({ ...p, index: idx }))
    .filter((p) => !seenSet.has(p.index));
  if (unseen.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * unseen.length);
  const selected = unseen[randomIndex];
  // Mark as seen (the caller should update state accordingly)
  return selected;
};

// UpgradeModal removed

const modalStyles = StyleSheet.create({
  // Removed modalOverlay: blur is now used as background
  modalContent: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    // Optionally add shadow for modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  // Pill-style buttons
  pillButton: {
    backgroundColor: colors.portal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginVertical: 8,
    alignItems: 'center',
    minWidth: 180,
  },
  pillButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default function App() {
  // Premium gating state removed
  const [completedPuzzles, setCompletedPuzzles] = useState({ easy: [], medium: [], hard: [] });
  // solvedCounts tracks how many puzzles of each type have been solved
  const [solvedCounts, setSolvedCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  // Track how many daily challenges have been completed
  const [dailyCount, setDailyCount] = useState(0);

  // How To Play modal state
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [howToSlideIndex, setHowToSlideIndex] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('completedPuzzles').then(value => {
      if (value) setCompletedPuzzles(JSON.parse(value));
    });
    // Initialize solvedCounts in AsyncStorage on first app launch
    const initializeSolvedCounts = async () => {
      const existing = await AsyncStorage.getItem('solvedCounts');
      if (!existing) {
        await AsyncStorage.setItem('solvedCounts', JSON.stringify({ easy: 0, medium: 0, hard: 0 }));
        setSolvedCounts({ easy: 0, medium: 0, hard: 0 });
      } else {
        setSolvedCounts(JSON.parse(existing));
      }
    };
    initializeSolvedCounts();
    // Initialize dailyCount in AsyncStorage on first app launch
    AsyncStorage.getItem('dailyCount').then(value => {
      if (!value) {
        AsyncStorage.setItem('dailyCount', '0');
      }
    });
    // Initialize AdMob (Google Mobile Ads)
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log("✅ AdMob initialized");
      });
  }, []);

  // Keep solvedCounts and dailyCount in sync with AsyncStorage
  useEffect(() => {
    const fetchCounts = async () => {
      const counts = await AsyncStorage.getItem('solvedCounts');
      if (counts) setSolvedCounts(JSON.parse(counts));
    };
    fetchCounts();
    // Fetch dailyCount from AsyncStorage
    AsyncStorage.getItem('dailyCount').then(value => {
      if (value) setDailyCount(parseInt(value));
    });
  }, [showHome]);
  const [difficulty, setDifficulty] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [board, setBoard] = useState([]);
  const [solutionGrid, setSolutionGrid] = useState([]);
  const [portalPairs, setPortalPairs] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [eraseMode, setEraseMode] = useState(false);
  const [dailyPlayedToday, setDailyPlayedToday] = useState(false);
  const [notes, setNotes] = useState(
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [scorePopups, setScorePopups] = useState([]);
  const [paused, setPaused] = useState(false);
  // New state for held number
  const [heldNumber, setHeldNumber] = useState(null);
  // New state for victory modal
  const [victory, setVictory] = useState(false);
  // Store puzzle sets by difficulty for reuse
  const [savedPuzzles, setSavedPuzzles] = useState({
    easy: null,
    medium: null,
    hard: null,
  });
  // Track seen puzzles per difficulty
  const [seenPuzzles, setSeenPuzzles] = useState({
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
  });
  // Track the current puzzle index for marking as seen on victory
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(null);
  // Store the current puzzle for restart functionality
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const boardSize = Math.min(screenWidth - 20, screenHeight * 0.55);

  // Handler to go Home from victory modal
  const onGoHome = () => {
    setVictory(false);
    setShowHome(true);
  };

  // Pause handler for auto-pause logic
  const handlePause = () => {
    setPaused(true);
    // Optionally, show pause modal or trigger additional pause logic
    // e.g., setShowPausedModal(true); (if using such state)
  };

  // AppState auto-pause logic
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        // 🔒 Auto-pause logic
        if (currentPuzzle && !paused && !victory) {
          handlePause();
        }
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [currentPuzzle, paused, victory]);
useEffect(() => {
  if (gameOver || paused) return;
  const timer = setInterval(() => {
    setTimeElapsed(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [gameOver, paused]);

useEffect(() => {
  checkDailyStatus();
}, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkDailyStatus = async () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const storedDate = await AsyncStorage.getItem('dailyCompletedDate');
  setDailyPlayedToday(storedDate === today);
  };
  const [selected, setSelected] = useState({ row: 4, col: 4 });

  // Handles difficulty selection, no premium gating
  const startGame = useCallback(async (selectedDifficulty) => {
    // Copy seen set for this difficulty
    const seenSet = new Set([...((seenPuzzles && seenPuzzles[selectedDifficulty]) || [])]);
    const puzzleSet = getPuzzleSet(selectedDifficulty, seenSet);
    if (!puzzleSet) {
      alert("No more puzzles left in this difficulty.");
      return;
    }
    const { puzzle, solution, portals, index } = puzzleSet;
    // Store the index for later marking as seen on victory
    setCurrentPuzzleIndex(index);
    setBoard(puzzle.map(row => row.slice()));
    setSolutionGrid(solution);
    setPortalPairs(portals);
    setFixed(puzzle.map(row => row.map(cell => cell !== null)));
    setMistakes(0);
    setSelected({ row: 4, col: 4 });
    setGameOver(false);
    setVictory(false);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setUndoStack([]);
    setHintsRemaining(3);
    setTimeElapsed(0);
    setScore(0);
    setDifficulty(selectedDifficulty);
    setShowHome(false);
    setCurrentPuzzle(puzzle.map(row => row.slice()));
  }, [savedPuzzles, seenPuzzles, solvedCounts]);

  const handleCellPress = (row, col) => {
    setSelected({ row, col });
    if (eraseMode && !fixed[row][col]) {
      const updated = board.map(r => r.slice());
      setUndoStack([...undoStack, { board: board.map(r => r.slice()), notes: JSON.parse(JSON.stringify(notes)) }]);
      updated[row][col] = null;
      setBoard(updated);
      return;
    }
    // If holding a number, insert it here
    if (!fixed[row][col]) {
      const selectedCell = { row, col };
      if (heldNumber) {
        handleNumberPress(heldNumber, false, selectedCell);
      } else {
        setSelected(selectedCell);
      }
      return;
    }
  };

  // Finds all linked portal cells for a given cell (supports pairs, triples, etc.)
  const findLinkedCells = (row, col) => {
    const linked = [];
    for (let group of portalPairs) {
      for (let cell of group) {
        if (cell[0] === row && cell[1] === col) {
          linked.push(...group.filter(c => !(c[0] === row && c[1] === col)));
          break;
        }
      }
    }
    return linked;
  };

  // Returns true if the cell at (row, col) is a portal cell
  const isPortalCell = (row, col) => {
    return portalPairs.some(
      group => group.some(cell => cell[0] === row && cell[1] === col)
    );
  };

  const checkMistake = (row, col, value) => {
    return solutionGrid[row][col] !== value;
  };

// Check if board matches solution (victory)
const checkVictory = async (updatedBoard) => {
  if (JSON.stringify(updatedBoard) === JSON.stringify(solutionGrid)) {
    setVictory(true);
    // Mark puzzle as seen after successful solve
    if (typeof currentPuzzleIndex !== "undefined") {
      setSeenPuzzles(prev => {
        const updatedSet = new Set(prev[difficulty]);
        updatedSet.add(currentPuzzleIndex);
        return {
          ...prev,
          [difficulty]: updatedSet
        };
      });
    }
    // Premium gating: update completedPuzzles and persist
    if (['easy', 'medium', 'hard'].includes(difficulty)) {
      const updated = { ...completedPuzzles };
      if (!updated[difficulty].includes(currentPuzzleIndex)) {
        updated[difficulty] = [...updated[difficulty], currentPuzzleIndex];
        AsyncStorage.setItem('completedPuzzles', JSON.stringify(updated));
        setCompletedPuzzles(updated);
      }
    }
    // Increment solvedCounts in AsyncStorage
    if (['easy', 'medium', 'hard'].includes(difficulty)) {
      try {
        const countsStr = await AsyncStorage.getItem('solvedCounts');
        const counts = countsStr ? JSON.parse(countsStr) : { easy: 0, medium: 0, hard: 0 };
        counts[difficulty] += 1;
        await AsyncStorage.setItem('solvedCounts', JSON.stringify(counts));
        setSolvedCounts(counts);
      } catch (e) {}
    }
    if (difficulty === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem('dailyCompletedDate', today);
      setDailyPlayedToday(true);
      const newDailyCount = dailyCount + 1;
      await AsyncStorage.setItem('dailyCount', newDailyCount.toString());
      setDailyCount(newDailyCount);
    }
  }
};

  // Updated handleNumberPress for toggle held number behavior
  const handleNumberPress = (num, isHeld = false, targetCell = null) => {
    if (isHeld) {
      setHeldNumber(prev => (prev === num ? null : num));
      return;
    }
    if (heldNumber && !isHeld) {
      // If holding, insert number and keep held
      const { row, col } = targetCell || selected;
      if (row !== null && col !== null && !fixed[row][col]) {
        const updated = board.map((r) => r.slice());
        const updatedNotes = notes.map(r => r.map(c => [...c]));
        setUndoStack([...undoStack, { board: board.map(r => r.slice()), notes: JSON.parse(JSON.stringify(notes)) }]);

        updated[row][col] = num;

        let mistakeCount = 0;
        const linkedCells = findLinkedCells(row, col);
        for (const [linkedRow, linkedCol] of linkedCells) {
          if (!fixed[linkedRow][linkedCol]) {
            updated[linkedRow][linkedCol] = num;
            if (checkMistake(linkedRow, linkedCol, num)) {
              mistakeCount = 1;
            }
          }
        }
        if (checkMistake(row, col, num)) {
          mistakeCount = 1;
        }

        const gainedPoints = calculateScore({
          isCorrect: mistakeCount === 0,
          isPortal: linkedCells.length > 0,
          timeElapsed,
          usedHint: false,
          mistake: mistakeCount > 0
        });
        setScore(prev => Math.max(0, prev + gainedPoints));

        const popupKey = `${row}-${col}-${Date.now()}`;
        setScorePopups(prev => [...prev, { row, col, value: gainedPoints, key: popupKey }]);
        setTimeout(() => {
          setScorePopups(prev => prev.filter(p => p.key !== popupKey));
        }, 1000);

        if (mistakeCount === 0) {
          const newFixed = fixed.map(r => r.slice());
          newFixed[row][col] = true;
          for (const [linkedRow, linkedCol] of linkedCells) {
            newFixed[linkedRow][linkedCol] = true;
          }
          setFixed(newFixed);
        }

        const newMistakeCount = mistakes + mistakeCount;
        setMistakes(newMistakeCount);
        if (newMistakeCount === 3) {
          setGameOver(true);
        }
        setBoard(updated);
        // Check for victory after updating board
        checkVictory(updated);
      }
      return;
    }

    // Not in held mode, treat as single-use
    setHeldNumber(null);
    const { row, col } = targetCell || selected;
    if (row !== null && col !== null && !fixed[row][col]) {
      const updated = board.map((r) => r.slice());
      const updatedNotes = notes.map(r => r.map(c => [...c]));
      setUndoStack([...undoStack, { board: board.map(r => r.slice()), notes: JSON.parse(JSON.stringify(notes)) }]);

      if (notesMode) {
        const newNotes = notes.map(r => r.map(c => [...c]));
        const cellNotes = newNotes[row][col];
        if (cellNotes.includes(num)) {
          newNotes[row][col] = cellNotes.filter(n => n !== num);
        } else {
          newNotes[row][col].push(num);
        }
        setNotes(newNotes);
        return;
      }

      updated[row][col] = num;

      let mistakeCount = 0;
      const linkedCells = findLinkedCells(row, col);
      for (const [linkedRow, linkedCol] of linkedCells) {
        if (!fixed[linkedRow][linkedCol]) {
          updated[linkedRow][linkedCol] = num;
          if (checkMistake(linkedRow, linkedCol, num)) {
            mistakeCount = 1;
          }
        }
      }
      if (checkMistake(row, col, num)) {
        mistakeCount = 1;
      }

      const gainedPoints = calculateScore({
        isCorrect: mistakeCount === 0,
        isPortal: linkedCells.length > 0,
        timeElapsed,
        usedHint: false,
        mistake: mistakeCount > 0
      });
      setScore(prev => Math.max(0, prev + gainedPoints));

      const popupKey = `${row}-${col}-${Date.now()}`;
      setScorePopups(prev => [...prev, { row, col, value: gainedPoints, key: popupKey }]);
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.key !== popupKey));
      }, 1000);

      if (mistakeCount === 0) {
        const newFixed = fixed.map(r => r.slice());
        newFixed[row][col] = true;
        for (const [linkedRow, linkedCol] of linkedCells) {
          newFixed[linkedRow][linkedCol] = true;
        }
        setFixed(newFixed);
      }

      const newMistakeCount = mistakes + mistakeCount;
      setMistakes(newMistakeCount);
      if (newMistakeCount === 3) {
        setGameOver(true);
      }
      setBoard(updated);
      // Check for victory after updating board
      checkVictory(updated);
    }
  };

  if (showHome) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#e8f5e9' }]}>
        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('./assets/SudokuPortalsAppIcon.png')}
              style={{
                width: 180,
                height: 180,
                resizeMode: 'contain',
                borderRadius: 30,
                marginTop: 180
              }}
            />
          </View>

          <View style={{ width: '90%', paddingHorizontal: 20 }}>
            {/* Daily Challenge button logic */}
            <TouchableOpacity
              style={{
                backgroundColor: dailyPlayedToday ? colors.highlight : colors.highlight,
                paddingVertical: 15,
                borderRadius: 15,
                marginBottom: 20,
                alignItems: 'center',
                alignSelf: 'center',
                width: Dimensions.get('window').width - 40,
              }}
              onPress={() => {
                if (dailyPlayedToday) return;
                startGame('daily');
              }}
              disabled={dailyPlayedToday}
            >
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                {dailyPlayedToday ? 'Daily Already Played' : 'Daily Challenge'}
              </Text>
            </TouchableOpacity>
            {paused && (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 15,
                  borderRadius: 15,
                  marginBottom: 20,
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: Dimensions.get('window').width - 40,
                }}
                onPress={() => {
                  setPaused(false);
                  setShowHome(false);
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 15,
                borderRadius: 15,
                marginBottom: 20,
                alignItems: 'center',
                alignSelf: 'center',
                width: Dimensions.get('window').width - 40,
                borderWidth: 1,
                borderColor: '#4f94f7'
              }}
              onPress={() => setDifficulty('selecting')}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>New Game</Text>
            </TouchableOpacity>
            {/* DEV: Premium toggle removed */}
          </View>
        </View>

        {/* Modal for selecting difficulty */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={difficulty === 'selecting'}
          onRequestClose={() => setDifficulty(null)}
        >
          <BlurView intensity={50} tint="light" style={{ flex: 1 }}>
            <Pressable
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => setDifficulty(null)}
            >
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 20,
                  width: '90%',
                  maxWidth: 750,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 10
                }}
              >
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', marginBottom: 10, color: 'black' }}>
                  Choose Portal Difficulty
                </Text>
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={{
                      backgroundColor: '#f0f0f0',
                      borderRadius: 12,
                      paddingVertical: 12,
                      marginBottom: 10,
                      alignItems: 'center'
                    }}
                    onPress={() => startGame(level.toLowerCase())}
                  >
                    <Text style={{ color: '#333', fontSize: 16 }}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </Pressable>
            </Pressable>
          </BlurView>
        </Modal>
        {/* AdMob Banner Ad */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <BannerAd
            unitId="ca-app-pub-4938841494068925/6994482240"
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#e8f5e9' }]}>
      {/* Utility Bar */}
      <View style={{ width: '100%', height: 44, marginBottom: 6, position: 'relative', justifyContent: 'center' }}>
        <TouchableOpacity
          style={{ position: 'absolute', left: 20 }}
          onPress={() => {
            if (paused) {
              setShowHome(true); // preserve puzzle if paused
            } else {
              setDifficulty(null); // reset if not paused
              setShowHome(true);
            }
          }}>
          <MaterialCommunityIcons name="home-outline" size={28} color="black" />
        </TouchableOpacity>
        {/* How to Play Icon */}
        <TouchableOpacity
          onPress={() => setShowHowToPlayModal(true)}
          style={{ position: 'absolute', right: 60}}
        >
          <MaterialCommunityIcons name="help-circle-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', right: 20 }}
          onPress={() => setPaused(!paused)}>
          <MaterialCommunityIcons
            name={paused ? 'play-circle-outline' : 'pause-circle-outline'}
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Text style={{fontSize: 30, color: '#FFA726', fontWeight: 'bold', marginBottom: 10}}>{score}</Text>

      {/* Mistakes / Difficulty / Timer Row */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: boardSize,
        paddingHorizontal: boardSize * 0.02,
        marginBottom: 8
      }}>
        <View style={{ width: boardSize / 3, alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 13, color: 'black' }}>Mistakes: {mistakes} / 3</Text>
        </View>
        <View style={{ width: boardSize / 3, alignItems: 'center' }}>
          {difficulty && (
            <Text style={{ fontSize: 13, fontWeight: '500', color: 'black' }}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          )}
        </View>
        <View style={{ width: boardSize / 3, alignItems: 'flex-end', paddingRight: boardSize * 0.03 }}>
          <Text style={{ fontSize: 13, color: 'black' }}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={{ paddingHorizontal: 5, width: '100%', alignItems: 'center' }}>
        <View style={[
          styles.grid,
          {
            width: boardSize,
            height: boardSize,
            borderColor: 'transparent',
            borderWidth: 0
          }
        ]}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selected.row === rowIndex && selected.col === colIndex;
              const isFixed = fixed[rowIndex][colIndex];

              // Highlight logic: highlight all cells in same row, col, or box as selected cell (including non-empty/fixed)
              const inSameRow = rowIndex === selected.row;
              const inSameCol = colIndex === selected.col;
              const inSameBox =
                Math.floor(rowIndex / 3) === Math.floor(selected.row / 3) &&
                Math.floor(colIndex / 3) === Math.floor(selected.col / 3);
              const isRelated = (inSameRow || inSameCol || inSameBox) && !isSelected;

              const linkedCells = isPortalCell(selected.row, selected.col) ? findLinkedCells(selected.row, selected.col) : [];
              const isPortalLinked =
                linkedCells.some(([lr, lc]) => lr === rowIndex && lc === colIndex) ||
                (isPortalCell(selected.row, selected.col) && selected.row === rowIndex && selected.col === colIndex);
              const isMistaken = !isFixed && cell && checkMistake(rowIndex, colIndex, cell);
              const sameNumber =
                board[selected.row]?.[selected.col] &&
                board[rowIndex][colIndex] === board[selected.row][selected.col] &&
                !(selected.row === rowIndex && selected.col === colIndex);

              // Apply lighter highlight color for related cells in row/col/box
              let cellBackgroundColor = undefined;
              if (isPortalLinked) {
                // Portal linked cell color via styles.portalCell
                cellBackgroundColor = undefined;
              } else if (isSelected) {
                // Selected cell color via styles.selectedCell
                cellBackgroundColor = undefined;
              } else if (isRelated) {
                cellBackgroundColor = '#90e5e5';
              } else if (isFixed) {
                cellBackgroundColor = '#e0e0e0';
              }

              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    styles.cellBorder(rowIndex, colIndex),
                    isPortalLinked
                      ? styles.portalCell
                      : isSelected
                      ? styles.selectedCell
                      : null,
                    sameNumber ? styles.sameNumberCell : null,
                    cellBackgroundColor ? { backgroundColor: cellBackgroundColor } : null
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                >
                  {cell ? (
                    <Text
                      style={[
                        styles.cellText,
                        isMistaken && { color: 'red', fontWeight: 'bold' },
                        !isMistaken && { color: 'black' },
                        !fixed[rowIndex][colIndex] && { fontWeight: 'bold' }
                      ]}
                    >
                      {cell}
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        padding: 2,
                      }}
                    >
                      {Array.from({ length: 9 }, (_, i) => (
                        <View
                          key={i}
                          style={{
                            width: '33.33%',
                            height: '33.33%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              opacity: notes[rowIndex][colIndex].includes(i + 1) ? 1 : 0,
                              color: 'black',
                            }}
                          >
                            {i + 1}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {/* Score Popup */}
                  {scorePopups
                    .filter(p => p.row === rowIndex && p.col === colIndex)
                    .map(p => (
                      <View
                        key={p.key}
                        style={{
                          position: 'absolute',
                          top: -18,
                          left: '50%',
                          transform: [{ translateX: -15 }],
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: 8,
                          paddingHorizontal: 5,
                          paddingVertical: 2,
                          zIndex: 10,
                          elevation: 10,
                          // Optional shadow for iOS
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                        }}
                      >
                        <Text style={{
                          color: p.value > 0 ? '#4CAF50' : '#f44336',
                          fontSize: 10,
                          fontWeight: 'bold'
                        }}>
                          {p.value > 0 ? `+${p.value}` : p.value}
                        </Text>
                      </View>
                  ))}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, width: '100%', marginBottom: 15 }}>
        {[
          { label: 'Undo', icon: 'undo-variant' },
          { label: 'Erase', icon: 'eraser' },
          { label: 'Notes', icon: 'pencil-outline' },
          { label: 'Hint', icon: 'lightbulb-on-outline' },
        ].map(({ label, icon }) => (
          <TouchableOpacity
            key={label}
            style={{ alignItems: 'center' }}
            onPress={() => {
              if (label === 'Undo') {
                if (undoStack.length > 0) {
                  const last = undoStack[undoStack.length - 1];
                  // Only allow undo if the last action doesn't revert a cell that is now fixed
                  const isSafeToUndo = board.every((row, rowIndex) =>
                    row.every((cell, colIndex) =>
                      fixed[rowIndex][colIndex] ? cell === last.board[rowIndex][colIndex] : true
                    )
                  );
                  if (isSafeToUndo) {
                    setBoard(last.board);
                    setNotes(last.notes);
                    setUndoStack(undoStack.slice(0, -1));
                  }
                }
              } else if (label === 'Erase') {
                setEraseMode(!eraseMode);
              } else if (label === 'Notes') {
                setNotesMode(!notesMode);
              } else {
                if (hintsRemaining === 0) return;

                let hintCell = null;
                for (let i = 0; i < 100; i++) {
                  const row = Math.floor(Math.random() * 9);
                  const col = Math.floor(Math.random() * 9);
                  if (!fixed[row][col] && !board[row][col]) {
                    const linked = findLinkedCells(row, col);
                    if (
                      linked.length === 0 ||
                      linked.some(
                        ([lr, lc]) => !fixed[lr][lc] && !board[lr][lc]
                      )
                    ) {
                      hintCell = { row, col };
                      break;
                    }
                  }
                }
                if (!hintCell) return;

                const { row, col } = hintCell;
                const num = solutionGrid[row][col];
                const updated = board.map(r => r.slice());
                updated[row][col] = num;

                const linked = findLinkedCells(row, col);
                if (linked.length > 0) {
                  for (const [linkedRow, linkedCol] of linked) {
                    updated[linkedRow][linkedCol] = num;
                  }
                }

                setBoard(updated);
                setHintsRemaining(hintsRemaining - 1);
              }
            }}
          >
            {label === 'Hint' ? (
              <>
                <View style={{ position: 'relative' }}>
                  <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color={
                      hintsRemaining > 0 ? colors.portal : colors.disabled
                    }
                  />
                  <View style={{
                    position: 'absolute',
                    top: -6,
                    right: -12,
                    backgroundColor: hintsRemaining > 0 ? colors.portal : colors.disabled,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {hintsRemaining}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, marginTop: 4, color: 'black' }}>{label}</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name={icon}
                  size={30}
                  color={
                    (label === 'Notes' && notesMode) ||
                    (label === 'Erase' && eraseMode) ||
                    (label === 'Undo' && undoStack.length > 0)
                      ? colors.portal
                      : colors.disabled
                  }
                />
                <Text style={{ fontSize: 12, marginTop: 4, color: 'black' }}>{label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Number Pad */}
      <View style={[styles.numberPadContainer]}>
        <View style={styles.numberPadRow}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numButton,
                heldNumber === num && { backgroundColor: '#FFA726' }
              ]}
              onPress={() => {
                if (heldNumber === num) {
                  setHeldNumber(null); // tap again to disable multi-cell
                } else {
                  if (heldNumber !== null && heldNumber !== num) {
                    setHeldNumber(null); // clear previously held number
                  }
                  handleNumberPress(num); // single tap behavior
                }
              }}
              onLongPress={() => handleNumberPress(num, true)}
            >
              <Text style={[
                styles.numText,
                { color: 'black' }
              ]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numberPadRow}>
          {[6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numButton,
                heldNumber === num && { backgroundColor: '#FFA726' }
              ]}
              onPress={() => {
                if (heldNumber === num) {
                  setHeldNumber(null); // tap again to disable multi-cell
                } else {
                  if (heldNumber !== null && heldNumber !== num) {
                    setHeldNumber(null); // clear previously held number
                  }
                  handleNumberPress(num); // single tap behavior
                }
              }}
              onLongPress={() => handleNumberPress(num, true)}
            >
              <Text style={[
                styles.numText,
                { color: 'black' }
              ]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    {/* Game Over Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={gameOver}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{
          backgroundColor: 'white',
          padding: 30,
          borderRadius: 15,
          alignItems: 'center',
          width: 300,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 10
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>Game Over</Text>
          <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: 'black' }}>
            You lost the game because you made 3 mistakes
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>
            Final Score: {score}
          </Text>
          <Pressable
            style={{
              backgroundColor: '#4f94f7',
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 25,
              marginBottom: 10,
              minWidth: 180,
              alignItems: 'center'
            }}
            onPress={() => {
              if (!currentPuzzle) return;
              setBoard(currentPuzzle.map(row => row.slice()));
              setFixed(currentPuzzle.map(row => row.map(cell => cell !== null)));
              setMistakes(0);
              setSelected({ row: 4, col: 4 });
              setGameOver(false);
              setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
              setUndoStack([]);
              setHintsRemaining(3);
              setTimeElapsed(0);
              setScore(0);
            }}
          >
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Restart</Text>
          </Pressable>
        </View>
      </View>
    </Modal>

    {/* Pause Modal */}
    <Modal
      animationType="fade"
      transparent={true}
      visible={paused}
    >
      <BlurView intensity={50} tint="light" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          backgroundColor: 'white',
          padding: 30,
          borderRadius: 15,
          alignItems: 'center',
          width: 300,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 10
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>Paused</Text>
          <Pressable
            style={{
              backgroundColor: colors.highlight,
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 25,
              marginTop: 20,
              minWidth: 180,
              alignItems: 'center'
            }}
            onPress={() => setPaused(false)}
          >
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Resume</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: colors.highlight,
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 25,
              marginTop: 10,
              minWidth: 180,
              alignItems: 'center'
            }}
            onPress={() => {
              setShowHome(true);
            }}
          >
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Home</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
    {/* Victory Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={victory}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{
          backgroundColor: colors.cream,
          padding: 30,
          borderRadius: 15,
          alignItems: 'center',
          width: 300,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 10
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 25, color: 'black' }}>
            Congratulations!
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {/* Star 1: No Mistakes */}
            <MaterialCommunityIcons
              name={mistakes === 0 ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
              style={{ marginHorizontal: 5 }}
            />
            {/* Star 2: Perfect Match */}
            <MaterialCommunityIcons
              name={JSON.stringify(board) === JSON.stringify(solutionGrid) ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
              style={{ marginHorizontal: 5 }}
            />
            {/* Star 3: Time Bonus */}
            <MaterialCommunityIcons
              name={timeElapsed < 600 ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
              style={{ marginHorizontal: 5 }}
            />
          </View>
          <Text style={{ fontSize: 18, marginTop: 15, marginBottom: 10, color: 'black' }}>
            Final Score: {score}
          </Text>
          {/* Victory Modal Bottom Buttons */}
          {/* Victory Modal Bottom Buttons */}
          <>
            <TouchableOpacity
              style={{
                backgroundColor: colors.highlight,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                marginBottom: 10,
                minWidth: 180,
                alignItems: 'center'
              }}
              onPress={() => {
                if (!currentPuzzle) return;
                setBoard(currentPuzzle.map(row => row.slice()));
                setFixed(currentPuzzle.map(row => row.map(cell => cell !== null)));
                setMistakes(0);
                setSelected({ row: 4, col: 4 });
                setGameOver(false);
                setVictory(false);
                setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
                setUndoStack([]);
                setHintsRemaining(3);
                setTimeElapsed(0);
                setScore(0);
              }}
            >
              <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colors.highlight,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                minWidth: 180,
                alignItems: 'center'
              }}
              onPress={async () => {
                // If difficulty is daily, only one per day
                if (difficulty === 'daily') {
                  alert("Only one daily puzzle per day.");
                  return;
                }
                setVictory(false);
                // Existing logic to load next puzzle
                const seenSet = new Set([...seenPuzzles[difficulty]]);
                const next = getPuzzleSet(difficulty, seenSet);
                if (!next) {
                  alert("No more puzzles left in this difficulty.");
                  return;
                }
                const { puzzle, solution, portals, index } = next;
                if (typeof index !== "undefined") {
                  seenSet.add(index);
                }
                setSeenPuzzles(prev => ({
                  ...prev,
                  [difficulty]: seenSet
                }));
                setBoard(puzzle.map(row => row.slice()));
                setSolutionGrid(solution);
                setPortalPairs(portals);
                setFixed(puzzle.map(row => row.map(cell => cell !== null)));
                setMistakes(0);
                setSelected({ row: 4, col: 4 });
                setGameOver(false);
                setVictory(false);
                setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
                setUndoStack([]);
                setHintsRemaining(3);
                setTimeElapsed(0);
                setScore(0);
                setCurrentPuzzle(puzzle.map(row => row.slice()));
              }}
            >
              <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
                New Puzzle
              </Text>
            </TouchableOpacity>
            {/* Home Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.highlight,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                marginTop: 10,
                marginBottom: 10,
                minWidth: 180,
                alignItems: 'center'
              }}
              onPress={onGoHome}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>Home</Text>
              </View>
            </TouchableOpacity>
          </>
        </View>
      </View>
    </Modal>
    {/* How To Play Modal */}
    <Modal visible={showHowToPlayModal} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: Dimensions.get('window').width * 0.85,
          height: Dimensions.get('window').height * 0.75,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          justifyContent: 'space-between'
        }}>
          <View style={{ flex: 1 , justifyContent: 'center', alignItems: 'center' }}>
            {[
              {
                key: 'basic',
                title: 'How to Play Sudoku: Portals',
                text: 'Fill every row, column, and 3x3 box with digits 1 through 9.',
                image: require('./assets/portal-board.png'),
              },
              {
                key: 'portals',
                title: 'How to Play Sudoku: Portals',
                text: 'Portal cells are linked and Triple portals link three cells together.',
                image: require('./assets/linked-portal.png'),
              },
              {
                key: 'strategy',
                title: 'How to Play Sudoku: Portals',
                text: `Be careful!\n\n Entering a number in one portal\n affects the others.`,
                image: require('./assets/entered-portal.png'),
              },
            ].map((slide, index) => (
              howToSlideIndex === index && (
                <View
                  key={index}
                  style={{ width: Dimensions.get('window').width * 0.85, alignItems: 'center', flex: 1 }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, paddingTop: 15 }}>
                    {slide.title}
                  </Text>
                  <Image
                    source={slide.image}
                    style={{ width: 300, height: 260, resizeMode: 'contain', marginBottom: 10 }}
                  />
                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 20, width: '100%' }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        textAlign: 'center',
                        color: 'black',
                        width: '100%',
                        maxWidth: 280,
                        alignSelf: 'center',
                        marginHorizontal: 'auto'
                      }}
                    >
                      {slide.text}
                    </Text>
                  </View>
                </View>
              )
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
            {/* Conditionally render Back button */}
            {howToSlideIndex > 0 && (
              <TouchableOpacity
                onPress={() => setHowToSlideIndex(howToSlideIndex - 1)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: colors.primary,
                  borderRadius: 15,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
              </TouchableOpacity>
            )}
            {/* Spacer if only one button is shown */}
            <View style={{ flex: 1 }} />
            {/* Conditionally render Next button */}
            {howToSlideIndex < 2 && (
              <TouchableOpacity
                onPress={() => setHowToSlideIndex(howToSlideIndex + 1)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: colors.highlight,
                  borderRadius: 15
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
          <Pressable
            style={{
              backgroundColor: colors.highlight,
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 15,
              marginBottom: 10,
              minWidth: 180,
              alignItems: 'center',
              marginTop: 15
            }}
            onPress={() => setShowHowToPlayModal(false)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}