defmodule Workout.Repositories.MockExercise do
  def list(%{ids: [0]}) do
    {:ok, []}
  end

  def list(%{ids: [1]}) do
    {:ok, [%{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"]}]}
  end
end