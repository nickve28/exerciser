ExUnit.start()

defmodule Exercises.RepoHelper do
  def create_exercise(%{name: name, description: description, categories: categories, type: type, metric: metric}) do
    {:ok, data} = %Exercises.Schemas.Exercise{name: name, description: description, categories: categories, type: type, metric: metric}
    |> Exercises.Repo.insert!
    |> Exercises.Models.Exercise.to_model

    data
  end
end
