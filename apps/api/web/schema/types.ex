defmodule Api.Schema.Types do
  @moduledoc false
  use Absinthe.Schema.Notation

  object :user do
    field :id, :id
    field :name, :string
    field :workouts, list_of(:workout) do
      arg :limit, :integer
      arg :offset, :integer
      resolve &Api.Resolvers.WorkoutResolver.list/2
    end
    field :workout_count, :integer do
      resolve &Api.Resolvers.WorkoutResolver.count/2
    end
    field :progress, :progress do
      arg :exercise_id, non_null(:integer)
      arg :from, :string
      arg :until, :string
      resolve &Api.Resolvers.ProgressResolver.get/2
    end
  end

  object :login do
    field :id, :id
    field :token, :string
    field :refresh_token, :string
  end

  object :exercise do
    field :id, :id
    field :name, :string
    field :categories, list_of(:string)
    field :description, :string
    field :type, :string
    field :metric, :string
  end

  object :performed_exercise do
    field :exercise_id, :integer
    field :reps, :integer
    field :sets, :integer
    field :weight, :float
    field :mode, :float
    field :duration, :float
    field :amount, :float
  end

  input_object :new_performed_exercise do
    import_fields :performed_exercise
  end

  object :workout do
    field :id, :id
    field :workout_date, :string
    field :description, :string
    field :performed_exercises, list_of(:performed_exercise)
  end

  object :progression do
    field :date, :string
    field :reps, :integer
    field :sets, :integer
    field :weight, :float
    field :mode, :float
    field :duration, :float
    field :amount, :float
  end

  object :progress do
    field :exercise_id, :integer
    field :exercise_type, :string
    field :exercise_metric, :string
    field :progress, list_of(:progression)
  end
end
