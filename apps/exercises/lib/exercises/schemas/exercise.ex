defmodule Exercises.Schemas.Exercise do
  use Ecto.Schema

  schema "exercises" do
    field :name, :string
    field :description, :string
    field :categories, {:array, :string}
  end
end

