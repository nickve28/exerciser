export const required = value =>
  value ? undefined : 'is required'

export const minimum = (length, arr) =>
  arr && arr.length >= length ? undefined : `mimimum of ${length} entries required`