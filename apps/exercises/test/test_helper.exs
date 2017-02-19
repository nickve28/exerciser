ExUnit.start()

defmodule Exercises.RepoHelper do
  def create_exercise(%{name: name, description: description, categories: categories, type: type}) do
    data = %Exercises.Schemas.Exercise{name: name, description: description, categories: categories, type: type}
    Exercises.Repo.insert!(data)
    |> Exercises.Repositories.Exercise.to_model
  end
end
