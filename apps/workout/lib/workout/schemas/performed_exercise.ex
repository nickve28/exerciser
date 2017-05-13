defmodule Workout.Schemas.PerformedExercise do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  schema "performed_exercises" do
    belongs_to :workout, Workout.Schemas.Workout
    belongs_to :exercise, Workout.Schemas.Exercise

    field :type, :string, null: false
    field :reps, :integer
    field :sets, :integer
    field :weight, :float
    field :duration, :float
    field :amount, :float
    field :mode, :float
  end
end