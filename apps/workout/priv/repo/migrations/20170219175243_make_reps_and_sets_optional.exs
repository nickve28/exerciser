defmodule Workout.Repo.Migrations.MakeRepsAndSetsOptional do
  use Ecto.Migration

  def change do
    alter table(:performed_exercises) do
      modify :reps, :integer, null: true
      modify :sets, :integer, null: true
      modify :weight, :float, null: true
    end
  end
end
