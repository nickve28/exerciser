defmodule Exercises.Repositories.Exercise do
  alias Exercises.Repo
  alias Exercises.Schemas.Exercise

  @skeleton %{
    name: nil,
    id: nil
  }

  def to_model(nil), do: nil

  def to_model(exercise) do
    @skeleton
    |> Map.merge(exercise)
    |> Map.take([:name, :id])
  end

  def get(id) do
    Repo.get(Exercise, id)
      |> to_model
  end
end
