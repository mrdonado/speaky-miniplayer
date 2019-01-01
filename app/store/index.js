import { configureStore } from './configureStore';

let initialState;

// Try to recover the last state when starting up
try {
  initialState = JSON.parse(localStorage.getItem('store'));
} catch {
  console.warn("The initial state couldn't be parsed");
}

const store = initialState ? configureStore(initialState) : configureStore();

// Persist the store on every update
store.subscribe(() => {
  localStorage.setItem('store', JSON.stringify(store.getState()));
});

export default store;
