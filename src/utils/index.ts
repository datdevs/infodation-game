// eslint-disable-next-line @typescript-eslint/no-explicit-any
function storeDataToLocalStorage(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}

function getDataFromLocalStorage(name: string): string | null {
  return localStorage.getItem(name);
}

export { storeDataToLocalStorage, getDataFromLocalStorage };
