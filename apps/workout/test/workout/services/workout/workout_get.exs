defmodule Workout.Services.WorkoutGetTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Workout.RepoHelper

  @date_format "{YYYY}-{0M}-{0D}"

  setup_all do
    Workout.Repositories.MockExercise.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockExercise.disable end)
    :ok
  end

  setup do
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Exercise)

    :ok
  end

  @tag :get
  test "#get should return 404 if no workout is found" do
    assert {:error, {:enotfound, _, _}} = Services.Workout.get(%{id: 1})
  end

  @tag :get
  test "#get should return the exercise if it is found" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    %{id: exercise_id2} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    workout = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: exercise_id, reps: 2, weight: 60.0},
        %{exercise_id: exercise_id2, amount: 10.0, duration: 15.0, mode: 10.0, metric: "km/h"}
      ]}
    |> RepoHelper.create

    id = workout.id
    assert {:ok, %{id: ^id}} = Services.Workout.get(%{id: workout.id})
  end

  @tag :get
  test "#get should return the correct modeled performed_exercises" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    %{id: exercise_id2} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    workout = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: exercise_id, reps: 2, weight: 60.0, type: "strength"},
        %{exercise_id: exercise_id2, amount: 10.0, duration: 15.0, mode: 10.0, type: "endurance"}
      ]}
    |> RepoHelper.create

    id = workout.id
    assert {:ok, %{performed_exercises: [
      %{exercise_id: exercise_id, reps: 2, weight: 60.0, type: "strength"},
      %{exercise_id: exercise_id2, amount: 10.0, duration: 15.0, mode: 10.0, type: "endurance"}
    ]}} = Services.Workout.get(%{id: workout.id})
  end
end