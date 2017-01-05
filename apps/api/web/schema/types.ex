defmodule Api.Schema.Types do
  @moduledoc false
  use Absinthe.Schema.Notation

  object :user do
    field :id, :id
    field :name, :string
  end

  object :exercise do
    field :id, :id
    field :name, :string
    field :categories, list_of(:string)
    field :description, :string
  end

  object :workout do
    field :id, :id
    field :workout_date, :string
    field :description, :string
    field :performed_exercises, list_of(:performed_exercise)
  end

  object :performed_exercise do
    field :exercise_id, :integer
    field :reps, :integer
    field :sets, :integer
    field :weight, :float
  end
end