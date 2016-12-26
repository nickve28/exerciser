defmodule Workout.Repositories.Exercise do
  def list(payload) do
    Exercises.Services.Exercise.list(payload)
  end
end