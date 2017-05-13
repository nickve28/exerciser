defmodule Workout.Schemas.Exercise do
  @moduledoc false
  @valid_types ["strength", "endurance"]
  @required_create_properties [:name, :description, :categories, :type, :metric]
  use Ecto.Schema
  import Ecto.Changeset

  schema "exercises" do
    has_many :performed_exercises, Workout.Schemas.PerformedExercise, on_delete: :nothing #nothing = RESTRICT

    field :name, :string
    field :description, :string
    field :categories, {:array, :string}
    field :type, :string
    field :metric, :string
  end

  def create_changeset(payload) do
    changeset = %Workout.Schemas.Exercise{}
    |> cast(payload, @required_create_properties)
    |> validate_required(@required_create_properties)
    |> validate_type
    |> cast_capitalize(:name)
    |> cast_capitalize_all(:categories)
  end

  def update_changeset(%{id: id, name: name, type: type, description: description, categories: categories, metric: metric}, payload) do
    changeset = %Workout.Schemas.Exercise{id: id, name: name, type: type, description: description, categories: categories, metric: metric}
    |> cast(payload, [:description, :categories, :metric])
    |> cast_capitalize_all(:categories)
  end

  def delete_changeset(%{id: id}) do
    %Workout.Schemas.Exercise{id: id}
    |> change
    |> no_assoc_constraint(:performed_exercises)
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

