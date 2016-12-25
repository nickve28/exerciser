defmodule Workout.Repositories.MockExercise do
  def list(%{ids: [0]}) do
    []
  end

  def list(%{ids: [1]}) do
    [%{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"]}]
  end
end