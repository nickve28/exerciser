defmodule Workout.Repo.Migrations.AddOnDeleteWorkout do
  use Ecto.Migration

  def change do
    alter table(:performed_exercises) do
      modify :workout_id, references(:workouts, on_delete: :delete_all)
    end
  end
end
