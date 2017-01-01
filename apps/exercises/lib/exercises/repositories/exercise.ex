defmodule Exercises.Repositories.Exercise do
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise
  import Ecto.Query#, only: [from: 2]

  @skeleton %{
    name: nil,
    id: nil,
    description: nil,
    categories: nil
  }

  def to_model(nil), do: nil

  def to_model(exercise) do
    @skeleton
    |> Map.merge(exercise)
    |> Map.take([:name, :id, :description, :categories])
  end

  def get(id) do
    Repo.get(Exercise, id)
      |> to_model
  end

  def list(payload) do
    from(exercise in Exercise)
    |> list(payload)
  end

  defp list(query, %{category: category} = payload) do
    query
    |> where([exercise], ^category in exercise.categories)
    |> list(Map.delete(payload, :category))
  end

  defp list(query, %{ids: ids} = payload) do
    query
    |> where([exercise], exercise.id in ^ids)
    |> list(Map.delete(payload, :ids))
  end

  defp list(query, %{}) do
    query
    |> Repo.all
    |> Enum.map(&to_model/1)
  end

  def create(%{name: name, description: description, categories: categories}) do
    exercise = %Exercise{name: name, description: description, categories: categories}
    Exercises.Repo.insert(exercise)
  end

  def delete(id) when is_integer(id) do
    Exercises.Repo.delete_all(from e in Exercise,
                              where: ^id == e.id)
  end

  def list_categories do
    Repo.all(from exercise in Exercise,
             select: fragment("DISTINCT unnest(categories) as categories"),
             order_by: [asc: fragment("categories")])
  end
end
