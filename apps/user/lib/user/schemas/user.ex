defmodule User.Schemas.User do
  use Ecto.Schema

  schema "users" do
    field :name, :string
    field :password, :string
  end
end

