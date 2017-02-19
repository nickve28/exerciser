defmodule Exercises.Repo.Migrations.AddTypeToExercise do
  use Ecto.Migration

  def change do
    alter table(:exercises) do
      add :type, :string
    end
  end
end
