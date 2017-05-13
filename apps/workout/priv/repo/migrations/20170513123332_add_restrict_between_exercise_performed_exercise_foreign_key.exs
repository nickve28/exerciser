defmodule Workout.Repo.Migrations.AddRestrictBetweenExercisePerformedExerciseForeignKey do
  use Ecto.Migration

  def change do
    alter table(:performed_exercises) do
      modify :exercise_id, references(:exercises, on_delete: :nothing)
    end
  end
end
