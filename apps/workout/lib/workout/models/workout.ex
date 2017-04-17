defmodule Workout.Models.Workout do
  alias Workout.Models

  @date_format "{YYYY}-{0M}-{0D}"

  defstruct [
    id: nil,
    description: nil,
    workout_date: nil,
    performed_exercises: nil,
    user_id: nil
  ]

  def to_model(nil), do: {:ok, nil} #no result etc

  def to_model({:ok, model}), do: to_model(model)

  def to_model(model) do
    exercises = Enum.map(model.performed_exercises || [], fn exercise ->
      {:ok, exercise_model} = Models.PerformedExercise.to_model(exercise)
      exercise_model
    end)

    {:ok, %__MODULE__{
      id: model.id,
      description: model.description,
      workout_date: Timex.format!(model.workout_date, @date_format),
      performed_exercises: exercises,
      user_id: model.user_id
    } }
  end
end