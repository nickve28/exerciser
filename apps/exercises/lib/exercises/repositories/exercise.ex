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

  def list(%{}) do
    Repo.all(Exercise)
    |> Enum.map(&to_model/1)
  end
end
