defmodule Exercises.Schemas.Exercise do
  use Ecto.Schema

  schema "exercises" do
    field :name, :string
  end
end

