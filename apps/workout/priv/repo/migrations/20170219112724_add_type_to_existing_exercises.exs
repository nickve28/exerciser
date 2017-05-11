defmodule Workout.Repo.Migrations.AddTypeToExistingExercises do
  use Ecto.Migration
  alias Workout.Repo

  def change do
    Repo.update_all(Workout.Schemas.Exercise, set: [type: "strength"])
  end
end
