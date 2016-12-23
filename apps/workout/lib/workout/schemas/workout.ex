defmodule Workout.Schemas.Workout do
  use Ecto.Schema

  schema "workouts" do
    field :workout_date, Ecto.DateTime
    field :description, :string
    field :user_id, :integer
  end
end