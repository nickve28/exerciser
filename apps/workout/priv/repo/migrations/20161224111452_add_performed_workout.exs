defmodule Workout.Repo.Migrations.AddPerformedWorkout do
  use Ecto.Migration

  def change do
    create table(:performed_exercises) do
      add :workout_id, :integer, null: false
      add :exercise_id, :integer, null: false
      add :reps, :integer, null: false
      add :weight, :float, null: false
    end
  end
end
