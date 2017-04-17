defmodule User.Models.User do
  defstruct [
    id: nil,
    name: nil,
    password: nil,
    token: nil
  ]

  def to_model(nil), do: {:ok, nil} #no result etc

  def to_model({:ok, model}), do: to_model(model)

  def to_model(model) do
    {:ok, %__MODULE__{
      id: model.id,
      name: model.name,
      password: model.password, #truncated on API level
      token: nil
    } } #no token present in DB model
  end
end