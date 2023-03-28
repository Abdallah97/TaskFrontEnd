import API from '../services'

const api = new API('https://staging.mazaady.com');

export const state = () => ({
  cats: [],
  properties: [],
  childOptions: [],
  error: null,
});

export const getters = {
  getCats: state => state.cats,
  getProperties: state => state.properties,
  getChildOptions: state => state.childOptions,
  getError: state => state.error,
};

export const mutations = {
  setCats(state, payload) {
    state.cats = payload;
  },
  setProperties(state, payload) {
    state.properties = payload;
  },
  setChildOptions(state, payload) {
    state.childOptions = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
};

export const actions = {
  async fetchCats({ commit }) {
    try {
      const cats = await api.getAllCats();
      commit('setCats', cats);
    } catch (error) {
      commit('setError', error);
    }
  },
  async fetchPropertiesByCatId({ commit }, catId) {
    try {
      const properties = await api.getPropertiesByCatId(catId);
      commit('setProperties', properties);
    } catch (error) {
      commit('setError', error);
    }
  },
  async fetchChildOptionsById({ commit }, id) {
    try {
      const childOptions = await api.getChildOptionsById(id);
      commit('setChildOptions', childOptions);
    } catch (error) {
      commit('setError', error);
    }
  },
};