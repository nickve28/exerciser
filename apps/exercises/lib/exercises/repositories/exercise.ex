defmodule Exercises.Repositories.Exercise do
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise
  import Ecto.Query, only: [from: 2]

  @skeleton %{
    name: nil,
    id: nil,
    description: nil,
    category: nil
  }

  def to_model(nil), do: nil

  def to_model(exercise) do
    @skeleton
    |> Map.merge(exercise)
    |> Map.take([:name, :id, :description, :category])
  end

  def get(id) do
    Repo.get(Exercise, id)
      |> to_model
  end

  def list(%{category: category}) do
    Repo.all(from exercise in Exercise,
             where: exercise.category == ^category)
  end

  def list(%{}) do
    Repo.all(Exercise)
  end
end
