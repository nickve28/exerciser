export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'

export const fetchCategories = () => {
  const query = `{
    categories
  }`
  return {
    query,
    type: FETCH_CATEGORIES,
    status: 'pending'
  }
}
