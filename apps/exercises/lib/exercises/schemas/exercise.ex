defmodule Exercises.Schemas.Exercise do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  schema "exercises" do
    field :name, :string
    field :description, :string
    field :categories, {:array, :string}
  end

  def create_changeset(payload) do
    changeset = %Exercises.Schemas.Exercise{}
    |> cast(payload, [:name, :description, :categories])
    |> validate_required([:name, :description, :categories])
    |> cast_capitalize(:name)
    |> cast_capitalize_all(:categories)

    case changeset.errors do
      [] -> {:ok, changeset}
      errors -> {:error, {:invalid, to_errors(errors)}}
    end
  end

  defp cast_capitalize(changeset, key) do
    with {:ok, change} <- changeset |> fetch_change(key) do

      changeset
      |> put_change(key, String.capitalize(change))
    else
      _ -> changeset
    end
  end

  defp cast_capitalize_all(changeset, key) do
    with {:ok, change} <- changeset |> fetch_change(key) do
      capitalized_changes = for value <- change, do: String.capitalize(value)

      changeset
      |> put_change(key, capitalized_changes)
    else
      _ -> changeset
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

