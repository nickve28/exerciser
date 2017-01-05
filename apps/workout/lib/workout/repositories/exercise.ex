defmodule Workout.Repositories.Exercise do
  @moduledoc false
  def list(payload) do
    Exercises.Services.Exercise.list(payload)
  end
end