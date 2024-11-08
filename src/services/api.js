import axios from 'axios'

const apiClient = axios.create({
  baseURL: `/api`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4Zjc4NjY2NC0wMDg4LTRhMDMtYmFkMi0zOTQ5OGRjNTViYjMiLCJqdGkiOiI1YWRiY2JkMzFiNzQzY2NiMjI5NWQ3ZWZhYjI0ODI5ZWFiMTdiMmY3NTk4MTY1YzJmNGQ2OTk5YjAzZGYxYTVlMzI3MmE4OGRiYjFjOWUwNiIsImlhdCI6MTczMDcwMzI1MS40MTc0MDgsIm5iZiI6MTczMDcwMzI1MS40MTc0MDgsImV4cCI6MTg4ODQ2OTY1MS4zMDY3OSwic3ViIjoiOWQ2ODBkNWUtNzIyZC00YjkwLTk1YzAtNDk3NjJiNGQxMzMwIiwic2NvcGVzIjpbXSwiYnVzaW5lc3MiOiI5M2U0NTU2MC0xZTc1LTQ1YjItOWQ3Yy02NjBhYjAzN2ZhZmMiLCJyZWZlcmVuY2UiOiI2NzgzMjEifQ.Imn_IWtYaDGXu6KlkJMEd7ZkJY4naC-ey8ichOmu15hzFxrOQZDvs1SHAlExOCHAgD50qHHAKZJBpZgSyFwH4sh3j4-Kz8nRpn1h26mOFf5GYFdmsQL3h24v2EZJVrarDyyry0BN9hFEacLNqgqpnBbhDy3LV13brH9GfZ40r863UfCpgZUACFEExEkFQi05J-S4DB_JXHGLJFhAzqh4RGd6zu2t3mQaopwH2D4vz4Tk_x4J5f22IHB_8UY9Mbr1BKcZrzKVEAPdq8VtUhM9dnJYmuqLk0WihgLEyMk-cmKDpVPswTVL6tNAFPiO7P_3yoEkYqvwzHMQE4xhkLiGqe4cRbeecq4Wsd-g5NTI0WGF6zzzhs1tMU598B6UPB6mN-61iPnKSlOqZX2G2irIezEmDgnVq_xvSpc9_vlvtkTZf32WQEAc9O5Iuv4fC9_vwB0KLAbuHFNdvMKcacRdKzV6nYY3JOOEeCcXfBMmD3prXwd5mr1uIj9xYGCF3x-hAJzF8uvd_t1Wy3R8DS7dSIEIiouBLWetiPSCUq-4jA4p6kle-HEGL3Ynn5f7gaHhJHwGgbNBSGfkFSt4E-GLiKnGFftsYnehvkYKp5pyHgFiLjU7BM4A6bIwWUGdJvQkgT8zkzjWw8zZL0c96I1HKJ2tmuAbjE6rOET_OWA8_cI'
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

apiClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return error
  }
)

export default {
  apiClient,
}
