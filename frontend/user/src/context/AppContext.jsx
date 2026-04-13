import { createContext, useContext, useReducer } from 'react'

// ─── Action Types ───
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_DEPARTMENTS: 'SET_DEPARTMENTS',
  SET_DOCTORS: 'SET_DOCTORS',
  SET_NEWS: 'SET_NEWS',
  SET_SELECTED_DOCTOR: 'SET_SELECTED_DOCTOR',
  SET_SELECTED_DEPARTMENT: 'SET_SELECTED_DEPARTMENT',
  SET_SELECTED_NEWS: 'SET_SELECTED_NEWS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU'
}

// ─── Initial State ───
const initialState = {
  loading: false,
  error: null,
  departments: [],
  doctors: [],
  news: [],
  selectedDoctor: null,
  selectedDepartment: null,
  selectedNews: null,
  searchQuery: '',
  mobileMenuOpen: false
}

// ─── Reducer ───
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    case ACTIONS.SET_DEPARTMENTS:
      return { ...state, departments: action.payload, loading: false }
    case ACTIONS.SET_DOCTORS:
      return { ...state, doctors: action.payload, loading: false }
    case ACTIONS.SET_NEWS:
      return { ...state, news: action.payload, loading: false }
    case ACTIONS.SET_SELECTED_DOCTOR:
      return { ...state, selectedDoctor: action.payload }
    case ACTIONS.SET_SELECTED_DEPARTMENT:
      return { ...state, selectedDepartment: action.payload }
    case ACTIONS.SET_SELECTED_NEWS:
      return { ...state, selectedNews: action.payload }
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    case ACTIONS.TOGGLE_MOBILE_MENU:
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen }
    default:
      return state
  }
}

// ─── Context ───
const AppContext = createContext(null)
const AppDispatchContext = createContext(null)

// ─── Provider ───
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  )
}

// ─── Custom hooks ───
export function useAppState() {
  const context = useContext(AppContext)
  if (!context && context !== initialState) {
    throw new Error('useAppState must be used within AppProvider')
  }
  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider')
  }
  return context
}
