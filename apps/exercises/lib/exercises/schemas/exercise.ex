defmodule Exercises.Schemas.Exercise do
  @moduledoc false
  @valid_types ["strength", "endurance"]
  use Ecto.Schema
  import Ecto.Changeset

  schema "exercises" do
    field :name, :string
    field :description, :string
    field :categories, {:array, :string}
    field :type, :string
  end

  def create_changeset(payload) do
    changeset = %Exercises.Schemas.Exercise{}
    |> cast(payload, [:name, :description, :categories, :type])
    |> validate_required([:name, :description, :categories, :type])
    |> validate_type
    |> cast_capitalize(:name)
    |> cast_capitalize_all(:categories)
  end

  def update_changeset(%{id: id, name: name, type: type, description: description, categories: categories}, payload) do
    changeset = %Exercises.Schemas.Exercise{id: id, name: name, type: type, description: description, categories: categories}
    |> cast(payload, [:description, :categories])
    |> cast_capitalize_all(:categories)
  end

  defp validate_type(changeset) do
    with {:ok, change} <- changeset |> fetch_change(:type) do
      type = String.downcase(change)
      if type in @valid_types do
        changeset
        |> put_change(:type, type)
      else
        changeset
        |> add_error(:type, "invalid_value")
      end
    else
      _ -> changeset
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
end

