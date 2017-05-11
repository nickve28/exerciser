defmodule Exercises.Repo.Migrations.AddTypeToExistingExercises do
  use Ecto.Migration
  alias Exercises.Repo

  def change do
    Repo.update_all(Exercises.Schemas.Exercise, set: [type: "strength"])
  end
end
