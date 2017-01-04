defmodule Workout.Repositories.MockExercise do
  def list(%{ids: [0]}) do
    {:ok, []}
  end

  def list(%{ids: [1]}) do
    {:ok, [%{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"]}]}
  end

  def list(%{ids: [id]}) when is_number(id) do
    {:ok, [%{id: id, name: "Squats", description: "something", categories: ["Back"]}]}
  end
end