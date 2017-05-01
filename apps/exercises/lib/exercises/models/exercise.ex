defmodule Exercises.Models.Exercise do
  defstruct [
    id: nil,
    name: nil,
    description: nil,
    categories: nil,
    type: nil,
    metric: nil
  ]

  def to_model(nil), do: {:ok, nil} #no result etc

  def to_model({:ok, model}), do: to_model(model)

  def to_model(model) do
    {:ok, %__MODULE__{
      id: model.id,
      name: model.name,
      description: model.description,
      categories: model.categories,
      type: model.type,
      metric: model.metric
    } }
  end
end