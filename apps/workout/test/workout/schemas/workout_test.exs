defmodule Workout.Schemas.WorkoutTest do
  use ExUnit.Case
  alias Workout.Schemas.Workout

  @tag :workout_schema
  describe "when validating strenght exercises" do
    test "validation should fail if no reps are given" do
      payload = %{
        description: "sample workout",
        workout_date: "2017-01-01",
        user_id: 1,
        performed_exercises: [
          %{exercise_id: "201", type: "strength", sets: 2, weight: 20}
        ]
      }
      assert {:error, {:invalid, _, [{:reps_0, "is required"}]}} = Workout.create_changeset(payload)
    end

    @tag :workout_schema
    test "validation should fail if no sets are given" do
      payload = %{
        description: "sample workout",
        workout_date: "2017-01-01",
        user_id: 1,
        performed_exercises: [
          %{exercise_id: "201", type: "strength", reps: 12, weight: 20}
        ]
      }
      assert {:error, {:invalid, _, [{:sets_0, "is required"}]}} = Workout.create_changeset(payload)
    end

    @tag :workout_schema
    test "validation should fail if no weight is given" do
      payload = %{
        description: "sample workout",
        workout_date: "2017-01-01",
        user_id: 1,
        performed_exercises: [
          %{exercise_id: "201", type: "strength", sets: 12, reps: 2}
        ]
      }
      assert {:error, {:invalid, _, [{:weight_0, "is required"}]}} = Workout.create_changeset(payload)
    end
  end
end
