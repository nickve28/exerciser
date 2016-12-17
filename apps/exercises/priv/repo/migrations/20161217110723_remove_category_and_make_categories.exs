defmodule Exercises.Repo.Migrations.RemoveCategoryAndMakeCategories do
  use Ecto.Migration

  def change do
    alter table(:exercises) do
      add :categories, {:array, :string}
      remove :category
    end
  end
end
