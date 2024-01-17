export default class FetchService {

  _apiBase = 'http://52.42.163.24:8003/api/'

  async getResource(url) {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    return await res.json()
  };

  async getFigures() {
    const res = await this.getResource(this._apiBase + 'list')
    return res
  }

  async accessResource(body, url, method) {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    return await res.json()
  };

  async postFigure(body, url = this._apiBase + 'list') {
    const res = await this.accessResource(body, url, 'POST')
    return res
  }

  async delFigures(url = this._apiBase + 'list') {
    const res = await this.accessResource(null, url, 'DELETE')
    return res
  }

  async updateFigure(body, id) {
    const url = this._apiBase + 'update/' + id + '/'
    const res = await this.accessResource(body, url, 'PATCH')
    return res
  }
}