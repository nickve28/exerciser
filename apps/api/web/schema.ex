defmodule Api.Schema do
  use Absinthe.Schema
  import_types Api.Schema.Types

  mutation do
    field :login, type: :login do
      arg :name, non_null(:string)
      arg :password, non_null(:string)

      resolve &Api.Resolvers.UserResolver.authenticate/2
    end
  end

  query do
    field :exercise, :exercise do
      arg :id, non_null(:id)
      resolve &Api.Resolvers.ExerciseResolver.get/2
    end
  end

end