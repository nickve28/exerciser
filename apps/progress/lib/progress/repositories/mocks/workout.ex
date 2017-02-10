defmodule Progress.Repositories.Mocks.Workout do
  @stub_workouts [
    %{id: 1, workout_date: "2017-01-01", performed_exercises: [
      %{exercise_id: 1, weight: 10, sets: 2, reps: 2}
    ]},
    %{id: 2, workout_date: "2017-01-03", performed_exercises: [
      %{exercise_id: 1, weight: 20, sets: 2, reps: 2}
    ]}
  ]

  def list(%{exercise_id: 2, user_id: _}) do
    {:ok, []}
  end

  def list(%{exercise_id: 3, user_id: _}) do
    {:ok, [
      %{id: 1, workout_date: "2017-01-01", performed_exercises: [
        %{exercise_id: 3, weight: 1.0, sets: 2, reps: 3}
      ]}
    ]}
  end

  def list(%{exercise_id: _, user_id: 1})do
    {:ok, @stub_workouts}
  end
end