import axios from 'axios'
const baseUrl = '/api/lists'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getByName = (name) => {
  console.log(name, "getbyname")
  const request = axios.get(`${baseUrl}/${name}`)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = (id, newObject) => {
  console.log("update", newObject)
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, getByName}