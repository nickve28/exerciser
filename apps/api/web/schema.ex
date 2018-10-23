defmodule Api.Schema do
  @moduledoc false
  use Absinthe.Schema
  import_types Api.Schema.Types

  query do
    field :exercises, list_of(:exercise) do
      middleware Api.Web.Middleware.CurrentUser

      arg :category, :string
      resolve &Api.Resolvers.ExerciseResolver.list/2
    end

    field :exercise, :exercise do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:integer)
      resolve &Api.Resolvers.ExerciseResolver.get/2
    end

    field :exercise_count, :integer do
      middleware Api.Web.Middleware.CurrentUser

      resolve &Api.Resolvers.ExerciseResolver.count/2
    end

    field :me, :user do
      middleware Api.Web.Middleware.CurrentUser

      resolve &Api.Resolvers.UserResolver.get/2
    end

    field :categories, list_of(:string) do
      middleware Api.Web.Middleware.CurrentUser

      resolve &Api.Resolvers.ExerciseResolver.get_categories/2
    end

    field :workout, :workout do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:id)

      resolve &Api.Resolvers.WorkoutResolver.get/2
    end
  end

  mutation do
    field :login, :login do
      arg :username, non_null(:string)
      arg :password, non_null(:string)

      resolve &Api.Resolvers.UserResolver.login/2
    end

    field :refresh_token, :login do
      arg :id, non_null(:integer)
      arg :refresh_token, non_null(:string)

      resolve &Api.Resolvers.UserResolver.refresh_token/2
    end

    field :create_exercise, :exercise do
      middleware Api.Web.Middleware.CurrentUser

      arg :name, non_null(:string)
      arg :description, non_null(:string)
      arg :categories, list_of(:string)
      arg :type, :string
      arg :metric, :string

      resolve &Api.Resolvers.ExerciseResolver.create/2
    end

    field :update_exercise, :exercise do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:integer)
      arg :description, :string
      arg :categories, list_of(:string)

      resolve &Api.Resolvers.ExerciseResolver.update/2
    end

    field :delete_exercise, :integer do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:id)

      resolve &Api.Resolvers.ExerciseResolver.delete/2
    end

    field :create_workout, :workout do
      middleware Api.Web.Middleware.CurrentUser

      arg :description, non_null(:string)
      arg :workout_date, non_null(:string)
      arg :performed_exercises, list_of(:new_performed_exercise)

      resolve &Api.Resolvers.WorkoutResolver.create/2
    end

    field :update_workout, :workout do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:integer)
      arg :description, non_null(:string)
      arg :workout_date, non_null(:string)
      arg :performed_exercises, list_of(:new_performed_exercise)

      resolve &Api.Resolvers.WorkoutResolver.update/2
    end

    field :delete_workout, :integer do
      middleware Api.Web.Middleware.CurrentUser

      arg :id, non_null(:integer)

      resolve &Api.Resolvers.WorkoutResolver.delete/2
    end
  end
end