defmodule Workout.Services.WorkoutCreateTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Repo

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

  describe "#create" do
    setup do
      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      {:ok, %{exercise_id: exercise_id}}
    end

    @tag :create
    test "should return invalid if workout date can not be parsed to a datetime", %{exercise_id: exercise_id} do
      payload = %{
        workout_date: "2016-12",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: exercise_id,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:error, {:invalid, "The data sent was invalid", [{:workout_date, _} | _]}} =
             Workout.Services.Workout.create(payload)
    end

    @tag :create
    test "should return invalid if one of the exercise_ids can not be found" do
      payload = %{
        workout_date: "2016-12-01",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: 0,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:error, {:invalid, "The data sent was invalid", [{:exercise_id, _} | _]}} =
             Workout.Services.Workout.create(payload)
    end

    @tag :create
    test "should return the created workout if it is valid", %{exercise_id: exercise_id} do
      payload = %{
        workout_date: "2016-12-01",
        description: "Some description",
        user_id: 1,
        performed_exercises: [
          %{
            exercise_id: exercise_id,
            reps: 12,
            sets: 2,
            weight: 60.0
          }
        ]
      }

      assert {:ok, %{id: _}} = Workout.Services.Workout.create(payload)
    end
  end
end