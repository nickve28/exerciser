defmodule Exercises.Repositories.Exercise do
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise
  import Ecto.Query, only: [from: 2]

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

  def list(%{category: category}) do
    Repo.all(from exercise in Exercise,
             where: ^category in exercise.categories)
    |> Enum.map(&to_model/1)
  end

  def list(%{ids: ids}) do
    Repo.all(from exercise in Exercise,
             where: exercise.id in ^ids)
    |> Enum.map(&to_model/1)
  end

  def list(%{}) do
    Repo.all(Exercise)
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
    #seems hard to do in SQL, so for now the easy way will do
    Repo.all(from exercise in Exercise,
             select: exercise.categories)
    |> Enum.reduce([], fn acc, e ->
      Enum.uniq(acc ++ e)
    end)
    |> Enum.sort
  end
end
