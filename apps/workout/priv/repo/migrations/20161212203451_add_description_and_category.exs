defmodule Workout.Repo.Migrations.AddDescriptionAndCategory do
  use Ecto.Migration

  def change do
    alter table(:exercises) do
      add :description, :text
      add :category, :string
    end
  end
end
