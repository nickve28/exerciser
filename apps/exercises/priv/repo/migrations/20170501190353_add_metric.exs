defmodule Exercises.Repo.Migrations.AddMetric do
  use Ecto.Migration

  def change do
    alter table(:exercises) do
      add :metric, :string
    end
  end
end
