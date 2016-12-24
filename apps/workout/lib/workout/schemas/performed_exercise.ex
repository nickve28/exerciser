defmodule Workout.Schemas.PerformedExercise do
  use Ecto.Schema

  schema "performed_exercises" do
    belongs_to :workout, Workout.Schemas.Workout
    field :exercise_id, :integer, null: false
    field :reps, :integer, null: false
    field :sets, :integer, null: false
    field :weight, :float, null: false
  end
end