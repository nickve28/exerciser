defmodule Workout.Models.PerformedExercise do
  defstruct [
    exercise_id: nil,
    weight: nil,
    sets: nil,
    reps: nil,
    metric: nil,
    mode: nil,
    amount: nil,
    duration: nil,
    type: nil
  ]

  def to_model(nil), do: {:ok, nil} #no result etc

  def to_model({:ok, model}), do: to_model(model)

  def to_model(model) do
    {:ok, %__MODULE__{
      exercise_id: model.exercise_id,
      weight: model.weight,
      sets: model.sets,
      reps: model.reps,
      metric: model.metric,
      mode: model.mode,
      duration: model.duration,
      amount: model.amount,
      type: model.type
    } }
  end
end