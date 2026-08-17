import { useReducer, useEffect } from 'react';
import { calcXP, calcStars } from '../utils/scoring.js';
import { checkBadges } from '../utils/badgeEngine.js';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';
import { useLocalStorage } from './useLocalStorage.js';

const initialState = {
  phase: 'intro',
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),
  worldCorrect: Array(10).fill(0),
  hintsUsed: 0,
  attemptCount: 0,
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  audioEnabled: true,
  musicEnabled: false,
  newBadges: [],
  sessionId: '',
};

const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_NEW_BADGES: 'CLEAR_NEW_BADGES',
  RESET: 'RESET',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PHASE:
      return { ...state, phase: action.payload };

    case ACTIONS.ADVANCE_SIM_STATION:
      return { ...state, currentSimStation: Math.min(2, state.currentSimStation + 1) };

    case ACTIONS.COMPLETE_SIM_STATION: {
      const updated = [...state.simStationsComplete];
      updated[action.payload] = true;
      return { ...state, simStationsComplete: updated };
    }

    case ACTIONS.LOAD_QUESTIONS:
      return {
        ...state,
        questionSet: generateSessionQuestions(questionBank),
        currentQuestion: 0,
        currentWorld: 0,
        worldScores: Array(10).fill(null),
        worldCorrect: Array(10).fill(0),
      };

    case ACTIONS.ANSWER_CORRECT: {
      const { attemptNumber, hintsUsed } = action.payload;
      const xpGained = calcXP(attemptNumber, hintsUsed, state.streak);
      const newStreak = state.streak + 1;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      const worldIdx = state.currentWorld;
      const newWorldCorrect = [...state.worldCorrect];
      newWorldCorrect[worldIdx] = (newWorldCorrect[worldIdx] || 0) + 1;
      const newState = {
        ...state,
        xp: state.xp + xpGained,
        streak: newStreak,
        maxStreak: newMaxStreak,
        worldCorrect: newWorldCorrect,
        hintsUsed: 0,
        attemptCount: 0,
        lastXP: xpGained,
      };
      const newBadges = checkBadges(newState);
      return { ...newState, badges: [...state.badges, ...newBadges], newBadges };
    }

    case ACTIONS.ANSWER_INCORRECT:
      return {
        ...state,
        streak: 0,
        attemptCount: state.attemptCount + 1,
      };

    case ACTIONS.USE_HINT:
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case ACTIONS.NEXT_QUESTION: {
      const nextQ = state.currentQuestion + 1;
      const worldIdx = state.currentWorld;
      // End of world (every 10 questions)
      let newWorldScores = [...state.worldScores];
      let newTotalStars = state.totalStars;
      if (nextQ % 10 === 0 && nextQ > 0) {
        const correct = state.worldCorrect[worldIdx] || 0;
        const stars = calcStars(correct);
        newWorldScores[worldIdx] = correct;
        newTotalStars = newWorldScores.reduce((s, ws) => s + (ws !== null ? calcStars(ws) : 0), 0);
      }
      const newWorld = Math.floor(nextQ / 10);
      return {
        ...state,
        currentQuestion: nextQ,
        currentWorld: newWorld,
        worldScores: newWorldScores,
        totalStars: newTotalStars,
        hintsUsed: 0,
        attemptCount: 0,
      };
    }

    case ACTIONS.COMPLETE_PHASE: {
      const newPhaseComplete = { ...state.phaseComplete, [action.payload]: true };
      const newState = { ...state, phaseComplete: newPhaseComplete };
      const newBadges = checkBadges(newState);
      return { ...newState, badges: [...state.badges, ...newBadges], newBadges };
    }

    case ACTIONS.TOGGLE_AUDIO:
      return { ...state, audioEnabled: !state.audioEnabled };

    case ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        ...action.payload,
        phase: 'intro', // always start from intro on restore
        // Reset play state so play phase never auto-skips
        questionSet: [],
        currentQuestion: 0,
        currentWorld: 0,
      };

    case ACTIONS.CLEAR_NEW_BADGES:
      return { ...state, newBadges: [] };

    case ACTIONS.RESET:
      return { ...initialState, sessionId: crypto.randomUUID(), audioEnabled: state.audioEnabled };

    default:
      return state;
  }
}

export function useGameState() {
  const { save, load, clear } = useLocalStorage();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    sessionId: crypto.randomUUID(),
  });

  // Restore session on mount
  useEffect(() => {
    const saved = load();
    if (saved) {
      dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
    }
  }, []);

  // Save on state changes
  useEffect(() => {
    if (state.phase !== 'intro') {
      save({
        phase: state.phase,
        currentQuestion: state.currentQuestion,
        xp: state.xp,
        badges: state.badges,
        worldScores: state.worldScores,
        phaseComplete: state.phaseComplete,
        simStationsComplete: state.simStationsComplete,
        streak: state.streak,
        maxStreak: state.maxStreak,
        totalStars: state.totalStars,
      });
    }
  }, [state.phase, state.currentQuestion, state.xp, state.badges, state.worldScores]);

  return { state, dispatch, ACTIONS };
}
