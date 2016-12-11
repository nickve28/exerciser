defmodule Api.Schema do
  use Absinthe.Schema
  import_types Api.Schema.Types

  query do
    field :exercise, :exercise do
      arg :id, non_null(:id)
      resolve &Api.Resolvers.ExerciseResolver.get/2
    end

    field :me, :user do
      resolve &Api.Resolvers.ExerciseResolver.get/2
    end
  end

end