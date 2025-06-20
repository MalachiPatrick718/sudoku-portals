function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num)
      return false;
  }

  const startRow = row - row % 3;
  const startCol = col - col % 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num)
        return false;
    }
  }

  return true;
}

function solve(grid, row = 0, col = 0) {
  if (row === 9) return true;
  if (col === 9) return solve(grid, row + 1, 0);
  if (grid[row][col] !== 0) return solve(grid, row, col + 1);

  const nums = [...Array(9).keys()].map(n => n + 1).sort(() => Math.random() - 0.5);
  for (let num of nums) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solve(grid, row, col + 1)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
}

function generateSudokuSolution() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(grid);
  return grid;
}

// Helper function to print the grid in a formatted way
function printGrid(grid) {
  grid.forEach(row => {
    console.log(`[${row.map(v => v === null || v === 0 ? 'null' : v).join(', ')}],`);
  });
}

function generatePuzzleFromSolution(solution, difficulty) {
  const puzzle = solution.map(row => [...row]); // deep copy
  const positions = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Fisher-Yates shuffle for better randomness
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let cellsToRemove;
  if (difficulty === 'easy') {
    cellsToRemove = 25 + Math.floor(Math.random() * 6); // 25 to 30
  } else if (difficulty === 'medium') {
    cellsToRemove = 35 + Math.floor(Math.random() * 6); // 35 to 40
  } else {
    cellsToRemove = 45 + Math.floor(Math.random() * 6); // 45 to 50
  }

  const rowNullCount = Array(9).fill(0);
  let removed = 0;

  for (let i = 0; i < positions.length && removed < cellsToRemove; i++) {
    const [row, col] = positions[i];
    if (rowNullCount[row] < 5) {
      puzzle[row][col] = null;
      rowNullCount[row]++;
      removed++;
    }
  }

  return puzzle;
}

function generatePortals(puzzle, solution, difficulty) {
  const nullPositions = [];

  // Gather all null positions
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === null) {
        nullPositions.push([row, col]);
      }
    }
  }

  // Shuffle null positions
  for (let i = nullPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nullPositions[i], nullPositions[j]] = [nullPositions[j], nullPositions[i]];
  }

  const countPairs = 2;
  let countTriples = 0;
  if (difficulty === 'medium') {
    countTriples = 1;
  } else if (difficulty === 'hard') {
    countTriples = 2;
  }

  const usedValues = new Set();
  const pairs = [];
  const triples = [];

  // Helper to check if value is used
  function isValueUsed(value) {
    return usedValues.has(value);
  }

  // Find pairs
  for (let i = 0; i < nullPositions.length - 1 && pairs.length < countPairs; i++) {
    const [row1, col1] = nullPositions[i];
    const [row2, col2] = nullPositions[i + 1];
    const value1 = solution[row1][col1];
    const value2 = solution[row2][col2];

    if (value1 === value2 && !isValueUsed(value1)) {
      pairs.push([[row1, col1], [row2, col2]]);
      usedValues.add(value1);
      i++; // Skip next to avoid overlapping portals
    }
  }

  // Find triples
  // Look for three distinct null positions with the same solution value and unused
  for (let i = 0; i < nullPositions.length - 2 && triples.length < countTriples; i++) {
    for (let j = i + 1; j < nullPositions.length - 1; j++) {
      for (let k = j + 1; k < nullPositions.length; k++) {
        const [r1, c1] = nullPositions[i];
        const [r2, c2] = nullPositions[j];
        const [r3, c3] = nullPositions[k];
        const val1 = solution[r1][c1];
        const val2 = solution[r2][c2];
        const val3 = solution[r3][c3];

        if (val1 === val2 && val2 === val3 && !isValueUsed(val1)) {
          triples.push([[r1, c1], [r2, c2], [r3, c3]]);
          usedValues.add(val1);
          // Remove these positions from nullPositions to avoid reuse
          nullPositions.splice(k, 1);
          nullPositions.splice(j, 1);
          nullPositions.splice(i, 1);
          i = -1; // Restart outer loop after splice
          break;
        }
      }
      if (i === -1) break;
    }
    if (i === -1) continue;
  }

  return { pairs, triples };
}

const fs = require('fs');
const path = require('path');

function appendPuzzleToFile(difficulty, puzzle, solution, portals) {
  const filename = {
    easy: 'easyPuzzles.js',
    medium: 'medPuzzles.js',
    hard: 'hardPuzzles.js',
    daily: 'dailyPuzzles.js',
  }[difficulty];

  const filepath = path.join(__dirname, 'puzzles', filename);

  const puzzleEntry = `{
  difficulty: '${difficulty}',
  puzzle: [
${puzzle.map(row => `    [${row.map(v => v === null ? 'null' : v).join(', ')}],`).join('\n')}
  ],
  solution: [
${solution.map(row => `    [${row.map(v => v === null ? 'null' : v).join(', ')}],`).join('\n')}
  ],
  portals: [
${portals.map(pairOrTriple => {
    if (pairOrTriple.length === 2) {
      const [[r1, c1], [r2, c2]] = pairOrTriple;
      const value = solution[r1][c1];
      return `    [${JSON.stringify([r1, c1])}, ${JSON.stringify([r2, c2])}], // ${value}`;
    } else if (pairOrTriple.length === 3) {
      const [[r1, c1], [r2, c2], [r3, c3]] = pairOrTriple;
      const value = solution[r1][c1];
      return `    [${JSON.stringify([r1, c1])}, ${JSON.stringify([r2, c2])}, ${JSON.stringify([r3, c3])}], // ${value}`;
    }
  }).join('\n')}
  ]
},\n`;

  fs.appendFileSync(filepath, puzzleEntry);
}

// Generate and append 14 puzzles
const difficulty = 'daily';
for (let i = 0; i < 14; i++) {
  const solution = generateSudokuSolution();
  const puzzle = generatePuzzleFromSolution(solution, difficulty);
  const { pairs, triples } = generatePortals(puzzle, solution, difficulty);
  const portals = [...pairs, ...triples];

  appendPuzzleToFile(difficulty, puzzle, solution, portals);
}