defmodule Api.Schema do
  use Absinthe.Schema
  import_types Api.Schema.Types

  query do
    field :exercises, list_of(:exercise) do
      arg :category, :string
      resolve &Api.Resolvers.ExerciseResolver.list/2
    end

    field :exercise, :exercise do
      arg :id, non_null(:id)
      resolve &Api.Resolvers.ExerciseResolver.get/2
    end

    field :me, :user do
      resolve &Api.Resolvers.UserResolver.get/2
    end

    field :categories, list_of(:string) do
      resolve &Api.Resolvers.ExerciseResolver.get_categories/2
    end

    field :workouts, list_of(:workout) do
      resolve &Api.Resolvers.WorkoutResolver.list/2
    end
  end

  mutation do
    field :create_exercise, :exercise do
      arg :name, non_null(:string)
      arg :description, non_null(:string)
      arg :categories, list_of(:string)

      resolve &Api.Resolvers.ExerciseResolver.create/2
    end

    field :delete_exercise, :integer do
      arg :id, non_null(:id)

      resolve &Api.Resolvers.ExerciseResolver.delete/2
    end
  end
end