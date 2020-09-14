export function storeLocalstorage(name, value) {
  localStorage.setItem(name, value);
}

export function getLocalstorage(name) {
  return localStorage.getItem(name);
}