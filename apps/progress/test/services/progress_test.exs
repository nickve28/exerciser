defmodule Progress.Services.ProgressTest do
  use ExUnit.Case
  alias Progress.Services.Progress
  doctest Progress

  test "#list should return invalid if no user_id is given" do
    expected = {:invalid, "The request was deemed invalid.", [{:user_id, "must be present"}]}
    assert {:error, expected} === Progress.list(%{exercise_id: 1})
  end

  test "#list should return invalid if no exercise_id is given" do
    expected = {:invalid, "The request was deemed invalid.", [{:exercise_id, "must be present"}]}
    assert {:error, expected} === Progress.list(%{user_id: 1})
  end

  test "#list should return unprocessable if the user does not exist" do
    expected = {:unprocessable, "The request could not be processed.", [{:user_id, "The user could not be found"}]}
    assert {:error, expected} === Progress.list(%{user_id: 2, exercise_id: 1})
  end

  test "#list should return an empty list when workouts returns an empty list" do
    assert {:ok, []} === Progress.list(%{user_id: 1, exercise_id: 2})
  end
end
