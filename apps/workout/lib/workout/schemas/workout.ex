defmodule Workout.Schemas.Workout do
  use Ecto.Schema

  schema "workouts" do
    field :workout_date, Ecto.DateTime
    field :description, :string
    field :user_id, :integer
    has_many :performed_exercises, Workout.Schemas.PerformedExercise
  end
end