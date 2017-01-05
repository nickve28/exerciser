defmodule User.Schemas.User do
  @moduledoc false
  use Ecto.Schema

  schema "users" do
    field :name, :string
    field :password, :string
  end
end

