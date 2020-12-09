export function createActionTypes(base, actions = []) {
    return actions.reduce((acc, type) => {
      acc[type] = `${base}_${type}`
  
      return acc
    }, {})
  }
  
  export function createAction(type, data = {}) {
    return { type, payload: data }
  }
  
  const getDomain = () =>
    process.env.NODE_ENV === 'production'
      ? process.env.APP_DOMAIN || 'visible.com'
      : undefined;
  
  /**
   * @todo remove localStorage
   */
  export function getJwtToken() {
    return localStorage.getItem('mtoken')
  }
  
  /**
   * @todo remove localStorage
   */
  export function setJwtToken(token) {
    localStorage.setItem('mtoken', token)
  }
  
  /**
   * @todo remove localStorage
   */
  export function removeJwtToken() {
    localStorage.removeItem('mtoken')
  }
  
  export function setCurrentUserId(userId) {
    localStorage.setItem('currentUserId', userId)
  }
  
  export function setOppositeUserId(userId) {
    localStorage.setItem('oppositeuserId', userId)
  }
  
  export function setMethod(method) {
    localStorage.setItem('method', method)
  }
  
  export function getCurrentUserId() {
    return localStorage.getItem('currentUserId')
  }
  
  export function getOppositeUserId() {
    return localStorage.getItem('oppositeuserId')
  }
  
  export function getMethod() {
    return localStorage.getItem('method')
  }
  
  
  