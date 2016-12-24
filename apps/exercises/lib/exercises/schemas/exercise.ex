defmodule Exercises.Schemas.Exercise do
  use Ecto.Schema
  import Ecto.Changeset

  schema "exercises" do
    field :name, :string
    field :description, :string
    field :categories, {:array, :string}
  end

  def validate_payload(params) do
    validation = %Exercises.Schemas.Exercise{}
    |> cast(params, [:name, :description, :categories])
    |> validate_required([:name, :description, :categories])

    case validation.errors do
      [] ->
        {:ok, %{params | name: String.capitalize(params[:name]),
                         categories: Enum.map(params[:categories], &String.capitalize/1)}}
      errors -> {:error, {:invalid, to_errors(errors)}}
    end
  end

  defp to_errors(errors) do
    for {prop, {value, _}} <- errors do
      val = case value do
        "can't be blank" -> :required
        _ -> value
      end
      {prop, val}
    end
  end
end

