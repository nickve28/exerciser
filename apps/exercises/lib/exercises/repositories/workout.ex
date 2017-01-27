defmodule Exercises.Repositories.Workout do
  def count(%{exercise_id: ids}) do
    Workout.Services.Workout.count(%{exercise_id: ids})
  end
end