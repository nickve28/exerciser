defmodule Workout.Operations.Workout do
  @moduledoc """
    Operations are an abstraction over commonly used 'operations' in code, revolving repositories
    Logic often used in the application, but not repository logic, can be wrapped in operations

    This module contains operations for Workouts
  """

  @doc """
    Finds a workout by its id, and returns an error if no workout with the id exists
  """
  def find_workout(id) do
    case Workout.Repositories.Workout.get(id) do
      {:ok, nil} -> {:error, {:enotfound, "Workout could not be found", []}}
      result -> result
    end
  end
end