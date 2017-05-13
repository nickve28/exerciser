defmodule Workout.Error do
  @moduledoc """
    Convenience error handlers for service endpoints
  """
  #TODO: re-do now exercise + workout codebase is merged

  def handle_error(:list, error) do
    case error do
      {:error, error} when is_list(error) ->
        {:invalid, "The request did not meet the minimal required parameters", error}
      _ ->
        {:internal, "Internal Server error", []}
    end
  end

  def handle_error({:changeset_error, %{errors: errors}}) do
    {:error,
      {:unprocessable, "The request could not be processed.", to_errors(errors)}
    }
  end

  def handle_error(:update, error) do
    case error do
      {:error, error} -> {:error, error}
        _ -> {:error, :internal}
    end
  end

  def handle_error(:create, error) do
    case error do
      {:error, {:invalid, message, details}} -> {:error, {:invalid, message, details}}
        _ -> {:error, :internal}
    end
  end

  def handle_error({:error, {code, message, details}}), do: {:error, {code, message, details}}

  def handle_error(:enotfound) do
    {:error, {:enotfound, "Exercise not found", []}}
  end

  def handle_error(error) do
    {:invalid, "The request was deemed invalid.", to_errors(error)}
  end

  def handle_error(_, _) do #catch all unknown errors
    {:error, {:internal, "Internal Server error", []}}
  end

  defp to_errors(errors) do
    for {prop, {value, _}} <- errors do
      val = case value do
        "can't be blank" -> :required
        "invalid_value" -> :invalid_value
        _ -> value
      end
      {prop, val}
    end
  end
end