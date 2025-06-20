const puzzles = [
  {
    difficulty: 'easy',
    puzzle: [
      [1, null, 2, 4, 5, 9, 7, null, 8],
      [9, null, null, null, 3, 6, 5, 4, 2],
      [3, 4, 5, 8, null, 2, 9, null, null],
      [4, null, null, null, 2, 7, 8, null, 5],
      [5, 7, 8, 9, 4, 1, 2, null, 3],
      [6, 2, 9, null, null, 5, 1, 7, 4],
      [2, 3, 6, null, 1, 8, null, null, 9],
      [7, null, 4, null, null, null, 6, 8, null],
      [null, 9, null, null, 6, 4, 3, null, 7],
    ],
    solution: [
      [1, 6, 2, 4, 5, 9, 7, 3, 8],
      [9, 8, 7, 1, 3, 6, 5, 4, 2],
      [3, 4, 5, 8, 7, 2, 9, 1, 6],
      [4, 1, 3, 6, 2, 7, 8, 9, 5],
      [5, 7, 8, 9, 4, 1, 2, 6, 3],
      [6, 2, 9, 3, 8, 5, 1, 7, 4],
      [2, 3, 6, 7, 1, 8, 4, 5, 9],
      [7, 5, 4, 2, 9, 3, 6, 8, 1],
      [8, 9, 1, 5, 6, 4, 3, 2, 7],
    ],
    portals: [
    [[3,1],[1,3]], // 1
    [[6,7],[7,1]] // 4
  ]
  },

  {
    difficulty: 'easy',
    puzzle: [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ],
    solution: [
      [8, 1, 4, 5, 7, 6, 3, 2, 9],
      [5, 7, 6, 2, 9, 3, 8, 4, 1],
      [9, 3, 2, 4, 8, 1, 7, 5, 6],
      [1, 9, 3, 8, 6, 2, 4, 7, 5],
      [4, 2, 7, 1, 5, 9, 6, 3, 8],
      [6, 8, 5, 3, 4, 7, 9, 1, 2],
      [2, 5, 9, 6, 3, 4, 1, 8, 7],
      [3, 6, 1, 7, 2, 8, 5, 9, 4],
      [7, 4, 8, 9, 1, 5, 2, 6, 3],
    ],
    portals: [
      [[0, 2], [5, 5]], // 4
      [[1, 2], [0, 8]], // 2
    ],
  },
  // Add more puzzles here...
];

export default puzzles;