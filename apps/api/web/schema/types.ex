defmodule Api.Schema.Types do
  use Absinthe.Schema.Notation

  object :user do
    field :id, :id
    field :name, :string
  end

  object :exercise do
    field :id, :id
    field :name, :string
  end
end