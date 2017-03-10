defmodule Exercises.Repositories.Exercise do
  @moduledoc false
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise
  import Ecto.Query#, only: [from: 2]

  @skeleton %{
    name: nil,
    id: nil,
    description: nil,
    categories: nil,
    type: nil
  }

  def to_model(nil), do: nil

  def to_model({:ok, model}), do: to_model(model)

  def to_model(exercise) do
    @skeleton
    |> Map.merge(exercise)
    |> Map.take([:name, :id, :description, :categories, :type])
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
    |> order_by([exercise], [asc: fragment("lower(?)", exercise.name)])
    |> Repo.all
    |> Enum.map(&to_model/1)
  end

  def create(changeset) do
    Exercises.Repo.insert(changeset)
  end

  def update(changeset) do
    Exercises.Repo.update(changeset)
    |> to_model
  end

  def count do
    {:ok, Exercises.Repo.aggregate(Exercise, :count, :id)}
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
