defmodule Workout.Repo.Migrations.AddSetsProperty do
  use Ecto.Migration

  def change do
    alter table(:performed_exercises) do
      add :sets, :integer, null: false
    end
  end
end
