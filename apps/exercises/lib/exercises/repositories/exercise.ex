defmodule Exercises.Repositories.Exercise do
  @moduledoc false
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise
  import Ecto.Query#, only: [from: 2]
  import Exercises.Models.Exercise, only: [to_model: 1]
  import Exercises.Error, only: [handle_error: 1]

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
    |> Enum.map(fn exercise ->
      {:ok, model} = to_model(exercise)
      model
    end)
  end

  def create(changeset) do
    case Exercises.Repo.insert(changeset) do
      {:error, changeset} -> {:error, handle_error(changeset.errors)}
      {:ok, model} -> to_model(model)
    end
  end

  def update(changeset) do
    case Exercises.Repo.update(changeset) do
      {:error, changeset} -> {:error, handle_error(changeset.errors)}
      {:ok, model} -> to_model(model)
    end
  end

  def count do
    {:ok, Exercises.Repo.aggregate(Exercise, :count, :id)}
  end

  def delete(changeset) do
    Exercises.Repo.delete(changeset) |> to_model
  end

  def list_categories do
    Repo.all(from exercise in Exercise,
             select: fragment("DISTINCT unnest(categories) as categories"),
             order_by: [asc: fragment("categories")])
  end
end
