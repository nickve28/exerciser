defmodule Workout.Repo.Migrations.CreateWorkout do
  use Ecto.Migration

  def change do
    create table(:workouts) do
      add :workout_date, :datetime, null: false
      add :description, :string
      add :user_id, :integer, null: false
    end
  end
end
