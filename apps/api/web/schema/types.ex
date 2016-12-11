defmodule Api.Schema.Types do
  use Absinthe.Schema.Notation

  object :login do
    field :name, :string
    field :password, :string
    field :token, :string
  end

  object :exercise do
    field :id, :id
    field :name, :string
  end
end