ExUnit.start()

defmodule Exercises.RepoHelper do
  def create_exercise(%{name: name, description: description, categories: categories, type: type}) do
    {:ok, data} = %Exercises.Schemas.Exercise{name: name, description: description, categories: categories, type: type}
    |> Exercises.Repo.insert!
    |> Exercises.Models.Exercise.to_model

    data
  end
end
