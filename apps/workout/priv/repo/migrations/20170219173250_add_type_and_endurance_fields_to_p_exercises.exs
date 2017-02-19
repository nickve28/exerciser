defmodule Workout.Repo.Migrations.AddTypeAndEnduranceFieldsToPExercises do
  use Ecto.Migration

  def change do
    alter table(:performed_exercises) do
      modify :reps, :integer
      modify :sets, :integer
      modify :weight, :float

      add :type, :string, null: false, default: "strength" #backwards compat

      add :duration, :float
      add :metric, :string
      add :amount, :float
      add :mode, :float
    end
  end
end
