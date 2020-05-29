import Cookies from 'js-cookie'

const TokenKey = 'csrftoken'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
