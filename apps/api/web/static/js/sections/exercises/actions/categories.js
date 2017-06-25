export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'

export const fetchCategories = () => {
  const payload = `{
    categories
  }`
  return {
    payload,
    type: FETCH_CATEGORIES,
    status: 'pending'
  }
}
