const hardPuzzles = [

{
  difficulty: 'hard',
  puzzle: [
    [null, null, 6, null, null, 2, 5, 8, null],
    [null, 5, 2, null, 8, null, 6, null, null],
    [9, null, null, null, 6, 5, null, null, 2],
    [null, 1, null, 2, null, null, null, 5, 9],
    [2, 9, 5, null, null, null, null, null, 8],
    [null, null, 4, null, 9, 8, null, 2, null],
    [null, 3, null, null, 4, null, 2, null, 6],
    [4, 6, null, 3, null, null, 8, null, null],
    [8, 2, null, null, null, 7, null, 3, null],
  ],
  solution: [
    [1, 4, 6, 9, 3, 2, 5, 8, 7],
    [7, 5, 2, 1, 8, 4, 6, 9, 3],
    [9, 8, 3, 7, 6, 5, 1, 4, 2],
    [3, 1, 8, 2, 7, 6, 4, 5, 9],
    [2, 9, 5, 4, 1, 3, 7, 6, 8],
    [6, 7, 4, 5, 9, 8, 3, 2, 1],
    [5, 3, 7, 8, 4, 9, 2, 1, 6],
    [4, 6, 9, 3, 2, 1, 8, 7, 5],
    [8, 2, 1, 6, 5, 7, 9, 3, 4],
  ],
  portals: [
    [[7,5], [4,4]], // 1
    [[8,6], [6,5]], // 9
    [[5,1], [4,6], [0,8]], // 7
    [[2,7], [8,8], [4,3]], // 4
  ]
},

{
  difficulty: 'hard',
  puzzle: [
    [null, null, 6, 4, null, 7, null, 9, null],
    [7, null, null, null, 8, 3, 5, null, null],
    [null, 8, null, null, 6, null, 7, 4, null],
    [null, null, null, null, 9, 1, 6, null, 4],
    [null, null, 4, null, null, null, 9, 8, 5],
    [9, null, null, null, 5, null, 1, 3, null],
    [null, 1, null, null, 4, 5, null, 7, null],
    [null, 9, null, 1, 7, null, null, 5, null],
    [4, 5, null, null, null, 8, 2, null, null],
  ],
  solution: [
    [5, 2, 6, 4, 1, 7, 3, 9, 8],
    [7, 4, 9, 2, 8, 3, 5, 1, 6],
    [3, 8, 1, 5, 6, 9, 7, 4, 2],
    [8, 3, 5, 7, 9, 1, 6, 2, 4],
    [1, 7, 4, 3, 2, 6, 9, 8, 5],
    [9, 6, 2, 8, 5, 4, 1, 3, 7],
    [2, 1, 3, 6, 4, 5, 8, 7, 9],
    [6, 9, 8, 1, 7, 2, 4, 5, 3],
    [4, 5, 7, 9, 3, 8, 2, 6, 1],
  ],
  portals: [
    [[1,7], [4,0]], // 1
    [[6,2], [7,8]], // 3
    [[1,8], [5,1], [8,7]], // 6
    [[3,0], [7,2], [0,8]], // 8
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [4, null, null, null, null, null, 5, 8, 3],
    [3, 8, null, null, 1, null, null, null, 6],
    [9, 2, null, null, null, null, null, 7, 1],
    [null, null, 8, 1, 7, null, null, 4, null],
    [2, 1, 7, null, null, null, null, null, 8],
    [null, 9, 4, null, null, null, 7, 1, null],
    [null, null, null, null, 2, 5, 8, null, 4],
    [null, null, null, 9, 3, null, null, 5, 7],
    [7, 5, 3, null, null, null, 1, null, null],
  ],
  solution: [
    [4, 7, 1, 2, 9, 6, 5, 8, 3],
    [3, 8, 5, 4, 1, 7, 2, 9, 6],
    [9, 2, 6, 8, 5, 3, 4, 7, 1],
    [6, 3, 8, 1, 7, 2, 9, 4, 5],
    [2, 1, 7, 5, 4, 9, 3, 6, 8],
    [5, 9, 4, 3, 6, 8, 7, 1, 2],
    [1, 6, 9, 7, 2, 5, 8, 3, 4],
    [8, 4, 2, 9, 3, 1, 6, 5, 7],
    [7, 5, 3, 6, 8, 4, 1, 2, 9],
  ],
  portals: [
    [[6,2], [1,7]], // 9
    [[5,3], [3,1]], // 3
    [[5,0], [2,4], [3,8]], // 5
    [[6,1], [8,3], [5,4]], // 6
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, null, 6, 7, 9, null, 3, null],
    [null, 3, 6, null, null, null, 9, 2, null],
    [null, null, 7, null, null, 3, 1, null, 6],
    [null, null, 4, null, null, 2, null, 1, 9],
    [6, null, null, null, 9, null, null, 7, 2],
    [null, 9, 2, null, null, null, null, 4, 8],
    [null, null, null, 2, 1, null, 7, null, 3],
    [null, null, null, 9, 4, null, 8, 6, null],
    [8, null, null, 7, 3, 6, null, null, null],
  ],
  solution: [
    [2, 1, 8, 6, 7, 9, 4, 3, 5],
    [5, 3, 6, 1, 8, 4, 9, 2, 7],
    [9, 4, 7, 5, 2, 3, 1, 8, 6],
    [3, 7, 4, 8, 5, 2, 6, 1, 9],
    [6, 8, 5, 4, 9, 1, 3, 7, 2],
    [1, 9, 2, 3, 6, 7, 5, 4, 8],
    [4, 6, 9, 2, 1, 8, 7, 5, 3],
    [7, 2, 3, 9, 4, 5, 8, 6, 1],
    [8, 5, 1, 7, 3, 6, 2, 9, 4],
  ],
  portals: [
    [[2,7], [1,4]], // 8
    [[8,2], [0,1]], // 1
    [[1,8], [7,0], [5,5]], // 7
    [[5,3], [3,0], [4,6]], // 3
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [5, 4, null, null, null, 3, null, null, 7],
    [1, 8, null, null, null, null, 3, 4, null],
    [3, 2, 7, null, null, null, null, null, 5],
    [7, null, 8, null, null, null, 5, 3, null],
    [null, 5, null, 3, null, 6, null, null, 8],
    [null, null, 3, 8, 5, 4, null, null, null],
    [null, 3, null, 1, null, null, 6, null, 9],
    [null, null, null, 6, null, null, 4, 7, 1],
    [6, 7, null, null, 4, 9, null, null, null],
  ],
  solution: [
    [5, 4, 6, 2, 1, 3, 8, 9, 7],
    [1, 8, 9, 7, 6, 5, 3, 4, 2],
    [3, 2, 7, 4, 9, 8, 1, 6, 5],
    [7, 6, 8, 9, 2, 1, 5, 3, 4],
    [2, 5, 4, 3, 7, 6, 9, 1, 8],
    [9, 1, 3, 8, 5, 4, 7, 2, 6],
    [4, 3, 2, 1, 8, 7, 6, 5, 9],
    [8, 9, 5, 6, 3, 2, 4, 7, 1],
    [6, 7, 1, 5, 4, 9, 2, 8, 3],
  ],
  portals: [
    [[4,6], [7,1]], // 9
    [[3,5], [5,1], [8,2]], // 1
    [[3,4], [0,3], [5,7]], // 2
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, null, 5, 4, 7, 1, null, null],
    [1, 4, 7, null, null, null, null, 3, null],
    [null, 8, 5, 3, null, 1, null, null, null],
    [null, 1, 9, null, null, null, null, 7, 6],
    [null, 7, 4, null, 5, null, 9, null, null],
    [null, null, null, 1, null, 9, null, 8, 4],
    [null, null, null, 8, null, 4, 3, null, 2],
    [null, null, null, null, 1, null, 8, 4, 9],
    [null, null, 8, null, 3, 2, null, 5, null],
  ],
  solution: [
    [3, 6, 2, 5, 4, 7, 1, 9, 8],
    [1, 4, 7, 9, 2, 8, 6, 3, 5],
    [9, 8, 5, 3, 6, 1, 4, 2, 7],
    [2, 1, 9, 4, 8, 3, 5, 7, 6],
    [8, 7, 4, 2, 5, 6, 9, 1, 3],
    [5, 3, 6, 1, 7, 9, 2, 8, 4],
    [7, 5, 1, 8, 9, 4, 3, 6, 2],
    [6, 2, 3, 7, 1, 5, 8, 4, 9],
    [4, 9, 8, 6, 3, 2, 7, 5, 1],
  ],
  portals: [
    [[1,6], [8,3]], // 6
    [[5,0], [6,1]], // 5
    [[2,6], [3,3], [8,0]], // 4
    [[4,8], [3,5], [7,2]], // 3
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [8, 9, 1, 5, null, null, null, null, null],
    [null, 2, null, 3, 1, null, 9, null, null],
    [6, 3, null, null, 2, 4, null, null, null],
    [null, null, null, 6, 9, null, 2, 8, null],
    [null, null, null, 7, null, 3, 1, 4, null],
    [null, null, 8, 2, 4, null, null, 7, null],
    [5, null, null, 4, null, 2, 7, null, null],
    [null, null, 4, null, 5, null, 6, 3, null],
    [null, 7, null, 1, 6, null, null, 5, null],
  ],
  solution: [
    [8, 9, 1, 5, 7, 6, 4, 2, 3],
    [4, 2, 5, 3, 1, 8, 9, 6, 7],
    [6, 3, 7, 9, 2, 4, 5, 1, 8],
    [7, 4, 3, 6, 9, 1, 2, 8, 5],
    [2, 5, 9, 7, 8, 3, 1, 4, 6],
    [1, 6, 8, 2, 4, 5, 3, 7, 9],
    [5, 8, 6, 4, 3, 2, 7, 9, 1],
    [9, 1, 4, 8, 5, 7, 6, 3, 2],
    [3, 7, 2, 1, 6, 9, 8, 5, 4],
  ],
  portals: [
    [[2,2], [1,8]], // 7
    [[0,5], [6,2]], // 6
    [[7,1], [2,7], [6,8]], // 1
    [[6,7], [4,2], [8,5]], // 9
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [3, null, null, 8, null, null, 9, null, 1],
    [5, null, 2, 7, 9, null, null, null, null],
    [7, null, null, null, 4, 1, null, 5, null],
    [null, null, 1, null, null, null, 5, 9, 3],
    [9, null, null, 5, null, 8, null, 6, null],
    [2, null, 5, 9, 6, null, null, null, null],
    [1, null, null, null, 3, 9, null, 2, null],
    [null, 2, 3, 6, null, null, null, 1, null],
    [null, null, 7, null, null, 2, null, 4, 5],
  ],
  solution: [
    [3, 4, 6, 8, 2, 5, 9, 7, 1],
    [5, 1, 2, 7, 9, 6, 4, 3, 8],
    [7, 8, 9, 3, 4, 1, 6, 5, 2],
    [8, 6, 1, 2, 7, 4, 5, 9, 3],
    [9, 3, 4, 5, 1, 8, 2, 6, 7],
    [2, 7, 5, 9, 6, 3, 1, 8, 4],
    [1, 5, 8, 4, 3, 9, 7, 2, 6],
    [4, 2, 3, 6, 5, 7, 8, 1, 9],
    [6, 9, 7, 1, 8, 2, 3, 4, 5],
  ],
  portals: [
    [[5,5], [2,3]], // 3
    [[0,5], [7,4]], // 5
    [[5,6], [1,1], [8,3]], // 1
    [[0,4], [3,3], [2,8]], // 2
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, 2, 1, null, 7, null, null, 8],
    [null, null, null, 5, null, 6, null, 2, 7],
    [9, null, null, null, null, 4, null, 1, 5],
    [3, 2, null, null, 8, 1, null, null, null],
    [7, null, null, 6, null, 3, 2, null, null],
    [null, 5, null, null, null, null, 1, 8, 3],
    [null, null, null, 3, 1, null, 7, 5, null],
    [null, 7, null, null, null, 9, null, 3, 1],
    [1, null, null, 2, null, 5, null, 9, null],
  ],
  solution: [
    [5, 4, 2, 1, 3, 7, 9, 6, 8],
    [8, 3, 1, 5, 9, 6, 4, 2, 7],
    [9, 6, 7, 8, 2, 4, 3, 1, 5],
    [3, 2, 4, 9, 8, 1, 5, 7, 6],
    [7, 1, 8, 6, 5, 3, 2, 4, 9],
    [6, 5, 9, 7, 4, 2, 1, 8, 3],
    [4, 9, 6, 3, 1, 8, 7, 5, 2],
    [2, 7, 5, 4, 6, 9, 8, 3, 1],
    [1, 8, 3, 2, 7, 5, 6, 9, 4],
  ],
  portals: [
    [[5,3], [3,7]], // 7
    [[8,6], [6,2]], // 6
    [[2,3], [7,6], [1,0]], // 8
    [[3,6], [7,2], [0,0]], // 5
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, 2, null, 3, 7, 1, null, null],
    [null, 1, 3, null, null, null, 2, null, 7],
    [null, 7, null, 2, null, null, 4, 3, null],
    [null, null, null, 5, 9, 6, null, 7, null],
    [null, null, 4, 1, null, 8, null, 2, null],
    [null, null, 7, null, 2, null, 5, 8, null],
    [null, null, null, 9, null, 2, 8, 6, null],
    [null, null, null, null, null, 5, 7, 1, 2],
    [1, null, 6, 7, null, null, 9, null, null],
  ],
  solution: [
    [8, 5, 2, 4, 3, 7, 1, 9, 6],
    [4, 1, 3, 8, 6, 9, 2, 5, 7],
    [6, 7, 9, 2, 5, 1, 4, 3, 8],
    [2, 8, 1, 5, 9, 6, 3, 7, 4],
    [5, 3, 4, 1, 7, 8, 6, 2, 9],
    [9, 6, 7, 3, 2, 4, 5, 8, 1],
    [7, 4, 5, 9, 1, 2, 8, 6, 3],
    [3, 9, 8, 6, 4, 5, 7, 1, 2],
    [1, 2, 6, 7, 8, 3, 9, 4, 5],
  ],
  portals: [
    [[1,3], [8,4]], // 8
    [[4,0], [8,8]], // 5
    [[0,8], [1,4], [7,3]], // 6
    [[1,5], [4,8], [2,2]], // 9
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, null, 6, null, null, 5, 9, 8],
    [null, null, 9, 4, null, null, 3, 1, null],
    [2, 1, null, null, 8, null, null, 6, null],
    [6, 7, null, null, null, 1, null, 5, null],
    [null, 9, 8, 2, 5, null, null, null, null],
    [5, null, 3, null, null, 4, 1, null, null],
    [null, 3, 1, null, 6, 7, null, null, null],
    [9, null, null, null, null, 3, 6, 7, null],
    [null, null, 6, null, 2, null, 9, null, 4],
  ],
  solution: [
    [3, 4, 7, 6, 1, 2, 5, 9, 8],
    [8, 6, 9, 4, 7, 5, 3, 1, 2],
    [2, 1, 5, 3, 8, 9, 4, 6, 7],
    [6, 7, 4, 8, 3, 1, 2, 5, 9],
    [1, 9, 8, 2, 5, 6, 7, 4, 3],
    [5, 2, 3, 7, 9, 4, 1, 8, 6],
    [4, 3, 1, 9, 6, 7, 8, 2, 5],
    [9, 8, 2, 5, 4, 3, 6, 7, 1],
    [7, 5, 6, 1, 2, 8, 9, 3, 4],
  ],
  portals: [
    [[5,3], [2,8]], // 7
    [[4,7], [6,0]], // 4
    [[8,3], [0,4], [4,0]], // 1
    [[5,4], [3,8], [2,5]], // 9
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, 9, 1, null, 6, 7, null, null],
    [null, null, null, 9, null, 7, 8, null, 6],
    [null, null, 7, 4, 8, null, null, null, 9],
    [null, null, 1, null, 4, 2, null, null, 5],
    [null, null, null, 7, 6, null, null, 8, 3],
    [null, null, null, 8, 1, 9, null, null, 7],
    [null, null, 2, null, 3, 1, null, null, 8],
    [1, 4, 6, null, 7, null, null, null, null],
    [null, null, null, null, 9, 4, null, 5, 1],
  ],
  solution: [
    [8, 3, 9, 1, 5, 6, 7, 2, 4],
    [4, 1, 5, 9, 2, 7, 8, 3, 6],
    [6, 2, 7, 4, 8, 3, 5, 1, 9],
    [7, 8, 1, 3, 4, 2, 9, 6, 5],
    [2, 9, 4, 7, 6, 5, 1, 8, 3],
    [5, 6, 3, 8, 1, 9, 2, 4, 7],
    [9, 5, 2, 6, 3, 1, 4, 7, 8],
    [1, 4, 6, 5, 7, 8, 3, 9, 2],
    [3, 7, 8, 2, 9, 4, 6, 5, 1],
  ],
  portals: [
    [[3,6], [4,1]], // 9
    [[0,4], [6,1]], // 5
    [[8,1], [6,7], [3,0]], // 7
    [[8,0], [7,6], [1,7]], // 3
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, 1, 4, null, null, 7, null, null, 8],
    [null, null, 5, null, 8, null, 7, 6, null],
    [8, 6, 7, null, 5, null, null, null, null],
    [null, null, 6, 2, null, null, 5, null, 7],
    [1, null, 8, 7, null, null, 3, null, null],
    [5, null, null, 8, null, 6, null, 2, null],
    [null, null, null, null, null, 4, 1, 3, 9],
    [7, null, 3, null, null, 8, null, 4, null],
    [9, null, null, 3, null, 2, null, 7, null],
  ],
  solution: [
    [3, 1, 4, 6, 2, 7, 9, 5, 8],
    [2, 9, 5, 1, 8, 3, 7, 6, 4],
    [8, 6, 7, 4, 5, 9, 2, 1, 3],
    [4, 3, 6, 2, 9, 1, 5, 8, 7],
    [1, 2, 8, 7, 4, 5, 3, 9, 6],
    [5, 7, 9, 8, 3, 6, 4, 2, 1],
    [6, 8, 2, 5, 7, 4, 1, 3, 9],
    [7, 5, 3, 9, 1, 8, 6, 4, 2],
    [9, 4, 1, 3, 6, 2, 8, 7, 5],
  ],
  portals: [
    [[3,0], [2,3]], // 4
    [[6,2], [0,4]], // 2
    [[5,2], [2,5], [0,6]], // 9
    [[4,8], [7,6], [0,3]], // 6
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [null, null, null, 3, 2, 7, null, null, 6],
    [null, null, 4, null, 1, 9, 2, null, null],
    [9, null, 2, null, 5, null, null, null, 3],
    [1, null, null, 9, 7, 4, null, null, null],
    [null, null, null, 1, 8, 6, null, 4, null],
    [4, null, null, 2, null, 5, 6, null, null],
    [null, null, 8, 7, 4, null, null, 6, null],
    [null, null, null, null, 6, 2, 7, 3, null],
    [6, null, 7, 5, null, null, 8, null, null],
  ],
  solution: [
    [8, 1, 5, 3, 2, 7, 4, 9, 6],
    [3, 7, 4, 6, 1, 9, 2, 8, 5],
    [9, 6, 2, 4, 5, 8, 1, 7, 3],
    [1, 2, 6, 9, 7, 4, 3, 5, 8],
    [7, 5, 3, 1, 8, 6, 9, 4, 2],
    [4, 8, 9, 2, 3, 5, 6, 1, 7],
    [2, 3, 8, 7, 4, 1, 5, 6, 9],
    [5, 9, 1, 8, 6, 2, 7, 3, 4],
    [6, 4, 7, 5, 9, 3, 8, 2, 1],
  ],
  portals: [
    [[4,6], [7,1]], // 9
    [[2,6], [8,8]], // 1
    [[7,8], [8,1], [2,3]], // 4
    [[2,1], [3,2], [1,3]], // 6
  ]
},
{
  difficulty: 'hard',
  puzzle: [
    [2, null, null, 9, null, null, null, 7, 6],
    [9, null, null, 4, null, null, null, 2, 8],
    [null, 8, null, 2, null, null, 9, null, 3],
    [null, null, null, 3, null, 4, null, 8, 7],
    [null, 7, 8, null, 2, null, 3, null, null],
    [null, 5, null, null, null, 8, 6, 1, null],
    [5, null, 1, 8, null, null, null, null, 2],
    [null, null, 7, 1, 4, 2, null, null, null],
    [8, null, null, null, 3, null, 4, null, 1],
  ],
  solution: [
    [2, 1, 4, 9, 8, 3, 5, 7, 6],
    [9, 6, 3, 4, 7, 5, 1, 2, 8],
    [7, 8, 5, 2, 1, 6, 9, 4, 3],
    [1, 9, 6, 3, 5, 4, 2, 8, 7],
    [4, 7, 8, 6, 2, 1, 3, 9, 5],
    [3, 5, 2, 7, 9, 8, 6, 1, 4],
    [5, 4, 1, 8, 6, 9, 7, 3, 2],
    [6, 3, 7, 1, 4, 2, 8, 5, 9],
    [8, 2, 9, 5, 3, 7, 4, 6, 1],
  ],
  portals: [
    [[7,1], [0,5]], // 3
    [[0,6], [8,3]], // 5
    [[3,6], [5,2], [8,1]], // 2
    [[4,0], [0,2], [2,7]], // 4
  ]
},

];

export default hardPuzzles;
