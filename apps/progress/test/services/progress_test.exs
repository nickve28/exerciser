defmodule Progress.Services.ProgressTest do
  use ExUnit.Case
  alias Progress.Services.Progress
  doctest Progress

  test "#get should return invalid if the 'from' date format is invalid" do
    expected = {:invalid, "The request was deemed invalid.", [{:from, "Invalid date, expected YYYY-MM-DD format"}]}

    payload = %{user_id: 1, exercise_id: 1, from: "2017"}
    assert {:error, expected} === Progress.get(payload)
  end

  test "#get should return invalid if the 'until' date format is invalid" do
    expected = {:invalid, "The request was deemed invalid.", [{:until, "Invalid date, expected YYYY-MM-DD format"}]}

    payload = %{user_id: 1, exercise_id: 1, until: "2017"}
    assert {:error, expected} === Progress.get(payload)
  end

  test "#get should return invalid if no user_id is given" do
    expected = {:invalid, "The request was deemed invalid.", [{:user_id, "must be present"}]}
    assert {:error, expected} === Progress.get(%{exercise_id: 1})
  end

  test "#get should return invalid if no exercise_id is given" do
    expected = {:invalid, "The request was deemed invalid.", [{:exercise_id, "must be present"}]}
    assert {:error, expected} === Progress.get(%{user_id: 1})
  end

  test "#get should return invalid if the user does not exist" do
    expected = {:invalid, "The request was deemed invalid.", [{"user", "failed with code enotfound"}]}
    assert {:error, expected} === Progress.get(%{user_id: 2, exercise_id: 1})
  end

  test "#get should return an empty list when workouts returns an empty list" do
    expected = %{
      exercise_id: 2,
      exercise_type: "strength",
      progress: []
    }

    assert {:ok, expected} === Progress.get(%{user_id: 1, exercise_id: 2})
  end

  test "#get should return a list of progressions for the exercise" do

    expected = %{
      exercise_id: 1,
      exercise_type: "strength",
      progress: [
        %{date: "2017-01-01", weight: 10, sets: 2, reps: 2},
        %{date: "2017-01-03", weight: 20, sets: 2, reps: 2}
      ]
    }

    assert {:ok, expected} === Progress.get(%{user_id: 1, exercise_id: 1})
  end


  test "#get should return a list of progressions for the exercise filtered by from date" do
    payload = %{user_id: 1, exercise_id: 1, from: "2017-01-03"}

    expected = %{
      exercise_id: 1,
      exercise_type: "strength",
      progress: [
        %{date: "2017-01-03", weight: 20, sets: 2, reps: 2}
      ]
    }

    assert {:ok, expected} === Progress.get(payload)
  end

  test "#get should return a list of progressions for the exercise filtered by until date" do
    payload = %{user_id: 1, exercise_id: 1, until: "2017-01-01"}

    expected = %{
      exercise_id: 1,
      exercise_type: "strength",
      progress: [
        %{date: "2017-01-01", weight: 10, sets: 2, reps: 2}
      ]
    }

    assert {:ok, expected} === Progress.get(payload)
  end
end
