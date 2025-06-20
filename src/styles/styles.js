import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth - 25; // 20px margin on each side
const cellSize = boardSize / 9;
import colors from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  grid: {
    width: boardSize,
    height: boardSize,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: colors.dark,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  relatedCell: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)', // Slightly lighter than selectedCell
    borderRadius: 6,
  },
  portalCell: {
    backgroundColor: colors.portal,
    borderRadius: 6,
  },
  cellText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.dark,
  },
  numberPad: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  numberPadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    gap: 10,
  },
  numButton: {
    width: 56,
    height: 56,
    backgroundColor: colors.highlight,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  numText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  cellBorder: (row, col) => ({
    borderTopWidth: row % 3 === 0 ? 2 : 0.5,
    borderLeftWidth: col % 3 === 0 ? 2 : 0.5,
    borderRightWidth: (col + 1) % 3 === 0 ? 2 : 0.5,
    borderBottomWidth: (row + 1) % 3 === 0 ? 2 : 0.5,
    borderColor: colors.dark,
  }),
  scorePopup: {
    position: 'absolute',
    top: -20,
    backgroundColor: colors.portal,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
    borderColor: colors.dark,
    borderWidth: 1,
  },
  scoreText: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userEntryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  upgradeDailyButton: {
    backgroundColor: colors.portal,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeDailyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  dailyChallengeButtonDisabled: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    opacity: 1,
  },
  dailyChallengeButtonTextDisabled: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});