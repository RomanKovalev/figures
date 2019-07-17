export default class FetchService {

    _apiBase = 'https://my-json-server.typicode.com/RomanKovalev/python-systemd-routine/figures'

    async getResource(url) {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
        }
        return await res.json()
      };
 
    async getFigures() {
        const res = await this.getResource(this._apiBase)
        return res
    }  
}