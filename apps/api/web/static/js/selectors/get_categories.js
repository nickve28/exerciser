import { createSelector } from 'reselect'

const findCategories = state => state.categories.data.entities

export default createSelector(
  [findCategories],
  categories => Object.keys(categories)
)