class Categories {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchJson(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || response.statusText);
      error.response = response;
      throw error;
    }
    return data;
  }

  async getAllCats() {
    const url = `${this.baseUrl}/api/get_all_cats`;
    const data = await this.fetchJson(url);
    return data;
  }

  async getPropertiesByCatId(catId) {
    const url = `${this.baseUrl}/api/v1/properties?cat=${catId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'allow-origin': '*',
      'private-key': '3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16',
    };
    const options = { headers };
    const data = await this.fetchJson(url, options);
    return data;
  }

  async getChildOptionsById(id) {
    const url = `${this.baseUrl}/api/v1/get-options-child/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'allow-origin': '*',
      'private-key': '3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16',
    };
    const options = { headers };
    const data = await this.fetchJson(url, options);
    return data;
  }
}

export default Categories;